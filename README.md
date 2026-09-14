# Salesforce Administration RoadMap

A complete, hands-on learning roadmap to master **Salesforce Administration** — from zero to certification-ready — using real SFDX metadata, Apex automation, practice SOQL, and a 14-phase structured study plan.

![Salesforce CLI](https://img.shields.io/badge/Salesforce%20CLI-✓-00A1E0?logo=salesforce)
![API Version](https://img.shields.io/badge/API%20Version-68.0-00A1E0)
![Apex Classes](https://img.shields.io/badge/Apex-21%20classes-1798c1)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## 📘 Overview

This repository is a **learning lab**, not just documentation. Every concept covered in the roadmap comes with **deployable metadata** you can push to a free Developer Edition org, run in **Flow Builder / Reports / Approval**, and study line-by-line in **commented Apex classes** and **SOQL practice scripts**.

> **Who is this for?**
> - Beginners starting from zero on the Salesforce platform
> - Admins who want a structured, cert-focused study path
> - Developers who want Real Apex, triggers, flows, and event-driven patterns
> - Anyone prepping for the **Salesforce Administrator** certification

> **Scope** — The full admin lifecycle: data model → security → users → data ops → automation (Flows + Approvals) → Sales & Service apps → analytics → release management → certification prep → 5 real-world capstone projects.

> **Duration** — 14 phases, self-paced (each phase = one study + labs unit on a repeatable weekly cadence; the last two phases are the hands-on capstone).

---

## 🏗️ Architecture

Curious how it all fits together? See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the visual diagrams:

- Layered architecture (UI → Automation → Apex → Data)
- Full data model (ER diagram: standard + custom objects)
- Trigger → Service wiring
- End-to-end admin workflow flow
- Data-migration & certification-prep architectures

> **🎮 Interactive version** — explore the roadmap live at
> **[`https://abdoaddouli.github.io/Salesforce_Administrator_RoadMap/`](https://abdoaddouli.github.io/Salesforce_Administrator_RoadMap/)**
> built from `docs/` (clickable phases, lessons, quizzes, progress tracking,
> **🧪 Exercises & Mini Projects** per phase, and a **🏗️ Real-World Projects**
> capstone whose solutions are gated behind a "did you try it first?" prompt).

---

## 🧭 The 14-Phase Learning Roadmap

| Phase | Topic | Guide | Key Concepts |
|------:|-------|-------|--------------|
| 1 | **Administrator Fundamentals** | [01-fundamentals.md](./admin%20Roadmap/01-fundamentals.md) | Role, platform, core data model, declarative vs programmatic |
| 2 | **Object Manager & Data Model** | [02-data-model.md](./admin%20Roadmap/02-data-model.md) | Custom objects (`__c`), field types, lookups/relationships, validation rules |
| 3 | **Security Model** | [03-security.md](./admin%20Roadmap/03-security.md) | Profiles, permission sets, OWD, sharing rules, login-audit loop |
| 4 | **Users & Org Setup** | [04-users-org-setup.md](./admin%20Roadmap/04-users-org-setup.md) | User lifecycle, onboarding defaults, licenses, roles/queues/groups |
| 5 | **Data Management** | [05-data-management.md](./admin%20Roadmap/05-data-management.md) | Data Loader, quality scores, duplicate flagging, migration batches |
| 6 | **Automation — Flows** | [06-automation-flows.md](./admin%20Roadmap/06-automation-flows.md) | Flow Builder: record/schedule/screen/autolaunched types |
| 7 | **Approvals & Legacy Automation** | [07-approvals-legacy.md](./admin%20Roadmap/07-approvals-legacy.md) | Approval processes, assignment rules, legacy→Flow migration |
| 8 | **Sales & Marketing Apps** | [08-sales-marketing.md](./admin%20Roadmap/08-sales-marketing.md) | Lead lifecycle, opportunity stages, forecast, campaigns |
| 9 | **Service & Support Apps** | [09-service-support.md](./admin%20Roadmap/09-service-support.md) | Case management, queues, SLAs, escalation automation |
| 10 | **Analytics** | [10-analytics.md](./admin%20Roadmap/10-analytics.md) | Report formats, folders, dashboards, SOQL mirror |
| 11 | **Sandboxes & Release Management** | [11-release-mgmt.md](./admin%20Roadmap/11-release-mgmt.md) | Sandbox types, SFDX deployments, runbooks |
| 12 | **Certification Prep** | [12-certification-prep.md](./admin%20Roadmap/12-certification-prep.md) | Administrator exam blueprint, question bank, study plans |
| 13 | **Real-World Projects** | [13-real-world-projects.md](./admin%20Roadmap/13-real-world-projects.md) | 5 capstone builds: sales pipeline, service ops, data migration, campaign ROI, security + releases |
| 14 | **Project Solutions** | [14-project-solutions.md](./admin%20Roadmap/14-project-solutions.md) | Gated worked answers + verification queries for the 5 capstone builds |

Each guide follows the same structure: **core concepts → hands-on labs → practice quiz → SOQL practice** to build skills incrementally.

---

## ✨ What's Inside

### 🧠 Apex: 10 Service Classes + 11 Test Classes (100% commented for learning)

Every Apex file is documented with **learning-focused comments** explaining *why* the pattern is used (governors, bulkification, sharing, AggregateResult, EventBus, trigger-light design...).

| Service Class | Responsibility | Test Class |
|---------------|----------------|------------|
| `DataModelService` | Quality scores, missing fields, schema labels | `DataModelServiceTest` |
| `SecurityService` | Login audits, deactivation candidates, permission-set gaps | `SecurityServiceTest` |
| `UserManagementService` | Onboarding defaults, permission-set counts | `UserManagementServiceTest` |
| `DataManagementService` | Name normalization, duplicate flagging, validation status | `DataManagementServiceTest` |
| `AutomationService` | Default due dates, priorities, stale-task close | `AutomationServiceTest` |
| `EmailService` | Welcome emails, send pipeline, deliverable contacts | `EmailServiceTest` |
| `AnalyticsService` | Pipeline summary, domain coverage, response hours | `AnalyticsServiceTest` |
| `ReleaseManagementService` | Deploy order, freeze window, release gating | `ReleaseManagementServiceTest` |
| `DataMigrationService` | Batch lifecycle, progress journaling, platform events | `DataMigrationServiceTest` |
| `CertificationPrepService` | Study plans, quiz builder, question mix | `CertificationPrepServiceTest` |

Plus `AdminFundamentalsTest` covering Phase 1 core CRUD, SOQL, savepoints and DML limits.

### ⚡ Triggers (6)

`UserTrigger`, `AccountTrigger`, `AdminTaskTrigger`, `DataMigrationBatchTrigger`, `SecurityAuditTrigger`, `StudyPlanTrigger` — each delegating work to its service class (trigger-light / logic-in-service best practice).

### ⚙️ Metadata

- **5 custom objects**: `Security_Audit__c`, `Data_Migration_Batch__c`, `Training_Question__c`, `Study_Plan__c`, `Admin_Task__c`
- **100+ custom fields** — 62 on standard objects (`User`, `Account`, `Contact`, `Lead`, `Opportunity`, `Case`, `Task`) + 42 on the custom objects
- **8 Flows** (onboarding tasks, deactivation follow-up, export approval, sensitive-data review, import validation, escalation tasks, screen audit…)
- **6 validation rules** (data-quality guards, case closure, forecast integrity)
- **1 approval process** `Data_Export_Approval` (Case, security-admin sign-off)
- **Case assignment rules** (queue routing by priority)
- **1 permission set** `Salesforce_Administrator` (~104 field permissions)
- **1 platform event** `Data_Migration_Event__e`
- **1 custom metadata type** `Admin_Configuration__mdt` (org guardrails + record)
- **4 dashboards + 7 reports** (Admin_Reports / Admin_Dashboards folders)

> **Learning note**: Flows / Reports / Dashboards exist as **simplified reference metadata**. Best practice is to re-create them in the Flow Builder / Report Builder UI (the guides in `admin Roadmap/` walk through every click).

### 📜 Practice Scripts

One SOQL practice file per phase in [`scripts/soql/`](./scripts/soql): build queries progressively — from basic `SELECT` to `GROUP BY`, parent-child relationships, bucket math, and certification-question aggregations.

```bash
sf data query --query "SELECT Name, Status__c, Due_Date__c FROM Admin_Task__c LIMIT 10" --target-org myDevOrg
```

Plus [`scripts/apex/service-invocation.apex`](./scripts/apex/service-invocation.apex) walking through every service from the Developer Console.

### 🧪 Exercises & Mini Projects (43 gated tasks across all 14 phases)

Each of the 12 learning phases ships **2 exercises + 1 mini project** so you apply what you just learned — not just read about it.

- **24 exercises** — quick, focused tasks (pick field types, write validation-rule formulas, classify flow types, pick the sandbox, audit approvals in SOQL…)
- **12 mini projects** — build real things: deploy the RoadMap, run a journaled migration batch, rebuild the `Case_Escalation_Task` flow from scratch, build a Vacation-Request approval process, design a 6-week exam plan…

Every task has a **brief, numbered steps, type + difficulty badges** (Easy / Medium / Hard) and a **gated "Show solution" button** that opens a "did you try it first?" prompt before revealing the worked answer — including the exact SOQL / Apex snippets — so you can check your work after trying.

> **🔍 Where it lives**
> - Data: `exercises[]` inside each phase in [`docs/assets/curriculum.js`](./docs/assets/curriculum.js)
> - Renderer + gate: `renderExercises()` / `wireExercises()` in [`docs/assets/app.js`](./docs/assets/app.js)
> - Styling: exercise cards & solution panels in [`docs/assets/style.css`](./docs/assets/style.css)
> - **Try them live** on the interactive site: every phase page → 🧪 Exercises & Mini Projects

### 🏗️ Real-World Projects (Phase 13) — the capstone

Five end-to-end builds that **fuse every skill from Phases 1–12** — this is practice, not theory. Each project starts from a business brief and ends with acceptance criteria you prove in SOQL:

1. **Sales Pipeline from Scratch** — object model, validation rules, roles + sharing, champion-call Flow, >100k approval, pipeline dashboards
2. **Service & Support Operations** — record types, queues + assignment, 24h SLA milestones, 12-hour escalation Flow, Knowledge, close guardrails
3. **Data Migration & Dedupe** — External-ID upserts (idempotent), import validation, journaled batches, duplicate + matching rules
4. **Marketing Attribution & Lead Nurturing** — campaigns, Campaign Influence, nurture Flow, Budget FLS, campaign ROI
5. **Security Posture & Change Management** — OWD matrix, sharing rules, field-level security, login audit, sandbox → tests → promote

Each project ships a **"done when" checklist** and a query set in [`scripts/soql/real-world-projects.soql`](./scripts/soql/real-world-projects.soql). Full walkthrough: [`admin Roadmap/13-real-world-projects.md`](./admin%20Roadmap/13-real-world-projects.md).

### 📘 Project Solutions (Phase 14) — gated worked answers

The reference solutions to all five capstone projects — **deliberately gated** behind the same "did you try it first?" prompt, so the loop stays *attempt → verify → compare → fix → re-verify*. Each solution shows the exact schema, validation formulas, security decisions, Flow wiring and the post-build verification queries. See [`admin Roadmap/14-project-solutions.md`](./admin%20Roadmap/14-project-solutions.md) and [`scripts/soql/project-solutions.soql`](./scripts/soql/project-solutions.soql).

---

## 🚀 Quick Start

### 1. Prerequisites

- **Salesforce CLI** — [install guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- **VS Code + Salesforce Extension Pack** — [install guide](https://developer.salesforce.com/docs/platform/sfvscode-extensions/guide/install.html)
- A free **Developer Edition org** — [sign up](https://developer.salesforce.com/signup)

### 2. Authenticate an org

```bash
sf org login web --alias myDevOrg
```

### 3. Deploy all metadata

```bash
sf project deploy start --source-dir force-app/main/default --target-org myDevOrg --wait 15
```

Or deploy in **phases** as you study (example — Phase 3 security):

```bash
sf project deploy start \
  --metadata ApexClass:SecurityService,PermissionSet:Salesforce_Administrator \
  --target-org myDevOrg --wait 15
```

### 3b. (Optional) Scratch org workflow

```bash
sf org create scratch -f config/project-scratch-def.json --alias scratch-org --set-default
```

### 4. Run the tests

```bash
sf apex run test --target-org myDevOrg --test-level RunLocalTests --wait 15
# or a single class
sf apex run test --class-names SecurityServiceTest --target-org myDevOrg --wait 15
```

All test classes use `@TestSetup` + `@isTest` and assert real business behavior — a great model for 75% coverage requirements and quality test-writing.

---

## 📂 Project Structure

```
.
├── force-app/main/default/
│   ├── classes/            # 21 commented Apex classes (service + test)
│   ├── triggers/           # 6 triggers delegating to services
│   ├── objects/            # Custom objects + custom fields + validation rules
│   ├── flows/              # 8 flows (reference metadata)
│   ├── approvalProcesses/  # Data_Export_Approval
│   ├── assignmentRules/    # Queue-based Case routing
│   ├── permissionsets/     # Salesforce_Administrator
│   ├── reports/            # 7 reports (reference metadata)
│   ├── dashboards/         # 4 dashboards (reference metadata)
│   ├── platformEvents/     # Data_Migration_Event__e
│   └── customMetadata/     # Admin_Configuration__mdt record
├── admin Roadmap/          # 14 phase study guides (including the capstone)
├── scripts/soql/           # One practice query file per phase
├── scripts/apex/           # Anonymous Apex playgrounds
├── config/                 # Scratch org definition
├── manifest/               # package.xml (API 68.0)
├── sfdx-project.json       # Project config (API 68.0)
└── README.md
```

---

## 🎓 Certification Path

Phase 12 bundles everything into certification prep for the **Salesforce Administrator** credential:

- **100 questions · 105 minutes · ~65% passing · ~$200**, registered at **webassessor.com**
- Blueprint: Configuration & Setup ~25% · Object Manager & Lightning App Builder ~24% · Service & Support ~15% · Data & Analytics ~15% · Productivity & Collaboration ~11% · Sales & Marketing ~10%

Use `Training_Question__c` as a mini question bank and `CertificationPrepService` as a quiz engine to build your own practice exams.

Then prove it for real: **Phase 13** hands you five end-to-end business builds and **Phase 14** holds the gated reference solutions — the closest thing this RoadMap has to a job sim.

---

## 📚 Additional Resources

- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/)
- [Salesforce Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/)
- [Salesforce Flow Documentation](https://help.salesforce.com/s/articleView?id=sf.flow.htm&type=5)
- [Trailhead: Admin Beginner](https://trailhead.salesforce.com/content/learn/trails/learn-administration-basics)
- [Trailhead: Prepare for Your Salesforce Administrator Credential](https://trailhead.salesforce.com/help?article=Salesforce-Administrator-Certification)

---

## 🤝 Contributing

Found a bug, improved a comment, or added a phase exercise? PRs are welcome. Please keep the **learning-first** spirit: explain *why*, keep the metadata deployable, and add a test when you add logic.

## 📝 License

This project is for **learning and educational purposes**. Free to use, fork, and adapt.