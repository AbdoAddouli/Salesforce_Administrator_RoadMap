# 🏗️ Salesforce Administration RoadMap — Architecture

This document is a visual walkthrough of the system built across the 12 phases. All diagrams are [Mermaid](https://mermaid.js.org) and render natively on GitHub.

---

## 1. High-Level Architecture (Layered)

The project follows a **layered architecture**: Lightning Experience on top, automation in the middle, an Apex service layer doing the business logic, and clean, normalized data underneath.

```mermaid
flowchart TB
    subgraph UI["PRESENTATION"]
        UX["Lightning Experience — Admin App"]
        DSB["Reports (7) & Dashboards (4)"]
        QUIZ["Certification Prep — Question Bank UI"]
    end

    subgraph AUTOMATION["AUTOMATION LAYER"]
        F[Flows (8)<br/>onboarding, deactivation follow-up, export approval,<br/>sensitive-data review, import validation, escals]
        VR[Validation Rules (6)<br/>data-quality guards, closed-deal locks, future-due guards]
        AR[Assignment Rules<br/>priority → queue routing]
        AP[Approval Process<br/>Case data-export approval]
    end

    subgraph APEX["APEX LAYER (business logic)"]
        TRIGGERS["6 Triggers<br/>User, Account, Admin_Task, Data_Migration_Batch,<br/>Security_Audit, Study_Plan"]
        SERVICES["10 Service Classes<br/>DataModel, Security, UserManagement, DataManagement,<br/>Automation, Email, Analytics, ReleaseManagement,<br/>DataMigration, CertificationPrep"]
        PE["Data_Migration_Event__e<br/>Platform Event"]
        CMT["Admin_Configuration__mdt<br/>Custom Metadata"]
    end

    subgraph DATA["DATA LAYER"]
        STD["Standard Objects<br/>User, Account, Contact, Lead, Opportunity,<br/>Case, Task (+62 custom fields)"]
        CUSTOM["Custom Objects<br/>Security_Audit__c, Data_Migration_Batch__c,<br/>Training_Question__c, Study_Plan__c, Admin_Task__c"]
    end

    UX --> F
    UX --> VR
    UX --> AR
    UX --> AP

    F --> SERVICES
    VR --> DATA
    AR --> DATA
    AP --> SERVICES

    UX --> TRIGGERS
    TRIGGERS --> SERVICES
    SERVICES --> DATA

    SERVICES --> PE
    PE --> CMT

    DSB --> SERVICES
    QUIZ --> SERVICES
    QUIZ --> CUSTOM

    DATA --> DSB
    DATA --> QUIZ
```

> **Architecture principles used throughout:**
> - **Trigger-light / Service-heavy**: triggers only detect events; all logic lives in testable service classes.
> - **Bulk-safe**: every trigger iterates `Trigger.new` lists, never `for` loops with per-record DML.
> - **`with sharing`**: services enforce the security model.
> - **Test-isolated**: every service has a `@isTest` companion using `@TestSetup`.

---

## 2. Data Model

Salesforce standard objects + the 5 custom objects and their relationships. Custom fields extend each standard object (e.g. `Data_Quality_Score__c` on Account, `Onboarding_Status__c` on User).

```mermaid
erDiagram
    USER ||--o{ SECURITY_AUDIT__C : "User_Assessed__c"
    USER ||--o{ STUDY_PLAN__C : "Learner__c"
    USER ||--o{ ADMIN_TASK__C : "Task_Owner__c"
    USER ||--o{ DATA_MIGRATION_BATCH__C : "Batch_Owner__c"

    ACCOUNT ||--o{ CONTACT : "has"
    ACCOUNT ||--o{ OPPORTUNITY : "has"
    ACCOUNT ||--o{ ADMIN_TASK__C : "Relates_To__c"
    ACCOUNT ||--o{ SECURITY_AUDIT__C : "Referenced_Record__c"

    LEAD }o--|| ACCOUNT : "converts to (ConvertedAccountId)"
    LEAD }o--|| CONTACT : "converts to (ConvertedContactId)"
    LEAD }o--o{ OPPORTUNITY : "converts to (ConvertedOpportunityId)"

    CONTACT ||--o{ TASK : "WhoId"
    OPPORTUNITY ||--o{ TASK : "WhatId"
    ACCOUNT ||--o{ TASK : "WhatId"
    CASE ||--o{ TASK : "WhatId"

    TRAINING_QUESTION__C {
        string Question_Text__c
        string Topic__c
        string Difficulty__c
        string Correct_Answer__c
    }
    STUDY_PLAN__C {
        string Certification__c
        string Status__c
        string Completed_Domains__c
        number Hours_Per_Week__c
    }
    SECURITY_AUDIT__C {
        string Audit_Type__c
        string Risk_Level__c
        string Finding__c
        string Status__c
    }
    DATA_MIGRATION_BATCH__C {
        string Source_Object__c
        string Direction__c
        number Record_Count__c
        string Status__c
    }
```

**Custom objects & their purpose:**

| Custom Object | Purpose | Used By |
|---------------|---------|---------|
| `Security_Audit__c` | Login/automation audit trail with risk findings | `SecurityService` |
| `Data_Migration_Batch__c` | Migration lifecycle + progress journaling | `DataMigrationService` |
| `Training_Question__c` | Mini certification question bank | `CertificationPrepService` |
| `Study_Plan__c` | Personalized exam-prep study plans | `CertificationPrepService`, `StudyPlanTrigger` |
| `Admin_Task__c` | Cross-object admin chores (onboarding, escalation, review) | `AutomationService`, flows |
| `Data_Migration_Event__e` (platform event) | Async batch-progress notifications | `DataMigrationService` |
| `Admin_Configuration__mdt` (custom metadata) | Read-only org guardrail configuration | flows + services |

---

## 3. Trigger → Service Wiring

Every trigger delegates to exactly one service (or applies an inline default) — no business logic lives inside a trigger.

```mermaid
flowchart LR
    subgraph T["TRIGGERS (6)"]
        UT["UserTrigger"] --> UMS["UserManagementService"]
        AT["AccountTrigger"] --> DMS["DataManagementService"]
        TT["AdminTaskTrigger"] --> AS["AutomationService"]
        MBT["DataMigrationBatchTrigger"] --> MIG["DataMigrationService"]
        SAT["SecurityAuditTrigger"] --> SVC["SecurityService"]
        SPT["StudyPlanTrigger"] --> CPS["CertificationPrepService"]
    end

    subgraph SUPPORT["ORCHESTRATED (tests, flows, scheduled)"]
        DMSVC["DataModelService"]
        ES["EmailService"]
        ANS["AnalyticsService"]
        RMS["ReleaseManagementService"]
    end

    UMS --> DB
    DMS --> DB
    AS --> DB
    MIG --> DB
    SVC --> DB
    CPS --> DB
    DMSVC --> DB
    ES --> DB
    ANS --> DB
    RMS --> DB

    DB[("f(x) Salesforce Org Data")]
```

> **Note:** `DataModelService`, `EmailService`, `AnalyticsService` and `ReleaseManagementService` are orchestrated services — invoked from Flows, scheduled automation, or Apex tests rather than object triggers.

---

## 4. End-to-End Admin Workflow (data → quality → security → migrate)

How a messy, under-governed org becomes a clean, secure, migration-ready org — with each step instrumented as metadata.

```mermaid
flowchart TD
    A[Raw data lands in org] --> B[AccountTrigger flags duplicates<br/>+ stamps Data_Quality_Score__c<br/>DataManagementService]
    B --> C[Validation Rules block<br/>negative scores, missing contact info]
    C --> D[Admin logging in triggers<br/>Security_Audit__c rows<br/>SecurityService]
    D --> E{Is the user at risk?}
    E -->|deactivation candidate| F[UserTrigger + User_Deactivation_FollowUp flow<br/>create Admin_Task__c review]
    E -->|normal ops| G[New_User_Onboarding_Tasks flow<br/>onboard + entitle users]
    F --> H[Data_Export_Approval_Request flow<br/>posts Case → Data_Export_Approval]
    H -->|approved| I[Data Migrations open<br/>Data_Migration_Batch__c + platform event<br/>DataMigrationService journaling]
    I --> J[AnalyticsService / ReportingService<br/>pipeline summary, domain coverage, CSAT]
    J --> K[Reports + Dashboards<br/>Admin_Reports / Admin_Dashboards]
```

---

## 5. Data-Migration Architecture (Phase 5)

```mermaid
flowchart LR
    EXT["External System<br/>(Data Loader, CSV, REST)"] -->|upsert| B["Data_Migration_Batch__c<br/>opened via DeploymentService"]
    B --> EV["platform event<br/>Data_Migration_Event__e"]
    EV -->|subscriber flow| PROC["Handle_Data_Migration_Progress<br/>autolaunched flow"]
    B --> PROG["recordProgress<br/>success/failure counts"]
    PROC --> EMAIL["EmailService<br/>batch completion digest"]
    B --> CMT["Admin_Configuration__mdt<br/>dir / size guardrails"]
    PROG --> CLOSE["closeBatch<br/>marks batch complete"]
```

---

## 6. Certification Prep Architecture (Phase 12)

```mermaid
flowchart LR
    QB[Training_Question__c<br/>question bank] --> SVC[CertificationPrepService]
    SVC --> PLAN[createStudyPlan<br/>Study_Plan__c + defaults]
    SVC --> QUIZ[buildQuiz<br/>filter by topic + difficulty]
    SVC --> STATS[stats by topic & difficulty]
    SVC --> SEED[seedQuestionBank<br/>starter questions]
    QUIZ --> UI[Practice quiz UI]
    PLAN --> UI2["Study dashboard (self-check)"]
    SVC --> VT[validateEvent<br/>exam-readiness validation]
```

---

## 7. Folder → Architectural Layer Mapping

| Roadmap folder | Layer |
|----------------|-------|
| `force-app/main/default/classes/` | Apex service + test classes |
| `force-app/main/default/triggers/` | Event detection (thin) |
| `force-app/main/default/flows/` | Declarative automation |
| `force-app/main/default/objects/` | Data model (fields, validation rules) |
| `force-app/main/default/customMetadata/` | Org guardrail configuration |
| `force-app/main/default/platformEvents/` | Event-driven substrate |
| `force-app/main/default/approvalProcesses/` | Human-in-the-loop approvals |
| `force-app/main/default/assignmentRules/` | Routing (queues) |
| `force-app/main/default/reports/` + `dashboards/` | Analytics |
| `force-app/main/default/permissionsets/` | Security / FLS |
| `admin Roadmap/` | Curriculum (12 phase guides) |
| `scripts/soql/` + `scripts/apex/` | Practice queries + playgrounds |