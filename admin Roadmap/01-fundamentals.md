# Phase 1: Administrator Fundamentals

## Learning Objectives
By the end of this phase, you will be able to:
- Explain what a Salesforce Administrator does and why the role matters
- Navigate the Salesforce platform and the App Launcher
- Identify the standard objects that make up the core data model
- Distinguish declarative (clicks) from programmatic (code) configuration
- Run your first SOQL query from the Developer Console

---

## 1. What is a Salesforce Administrator?

A **Salesforce Administrator** configures, maintains, and optimizes a Salesforce org. You are the bridge between the business and the platform: salesops asks for a dashboard, support wants a new picklist value, legal needs an audit trail — and you deliver it.

### The Admin Toolkit
- **Setup** — the admin backend reached from the gear icon in the top right
- **Object Manager** — create and shape standard and custom objects
- **Flows** — automate business processes without code
- **Reports & Dashboards** — turn data into decisions
- **Data Tools** — Data Import Wizard, Data Loader, duplicate management
- **Security Controls** — profiles, permission sets, sharing rules, field-level security

The exam ("Salesforce Administrator" ~$200, 100 questions, 105 minutes, 65% to pass) tests exactly these skills. You can register at **webassessor.com**.

---

## 2. The Core Data Model

Every org is built on a **data model** — objects (tables), fields (columns), and records (rows). The standard objects an Administrator touches daily:

| Object | Purpose | Key Fields |
|--------|---------|------------|
| **Account** | A company you do business with | Name, Industry, Annual Revenue, Billing Address |
| **Contact** | A person associated with an Account | First/Last Name, Email, Phone, Mailing Address |
| **Lead** | An unqualified prospect | Company, Name, Status, Lead Source |
| **Opportunity** | A potential deal | Name, Stage, Amount, Close Date, Probability |
| **Case** | A support issue | Subject, Status, Priority, Contact |
| **Activity** (Task & Event) | Reminders and meetings on any record | Subject, Due Date, Status |

### Relationships
```
Account ─── 1:Many ───> Contact
Account ─── 1:Many ───> Opportunity
Account ─── 1:Many ───> Case
Opportunity ── 1:Many ──> Products (OpportunityLineItem)
User ────── 1:Many ───> Tasks / Events / Study Plans
```

### The RoadMap's Own Data Model
This repository ships five custom objects you will use as an Administrator every day:

| Object | What it tracks |
|--------|----------------|
| **Admin_Task__c** | The admin task board (due dates, priorities, owners) |
| **Security_Audit__c** | Security findings with risk level, status and recommended action |
| **Data_Migration_Batch__c** | Every import/export run (record counts, success/failure) |
| **Training_Question__c** | The certification question bank (topic, difficulty, 4 options) |
| **Study_Plan__c** | Per-learner certification pacing (target date, hours per week) |

---

## 3. Declarative vs Programmatic

Most admin work is **declarative**: you configure rather than code.

| Approach | Tooling | Used for |
|----------|---------|----------|
| **Declarative (clicks)** | Flows, Validation Rules, Reports, Permission Sets | 80%+ of everyday admin work |
| **Programmatic (code)** | Apex triggers & classes, Lightning Web Components | Complex logic, integrations, beyond-flow requirements |

The RoadMap shows *both*: 8 flows and all the validation rules in this repository are declarative; the 21 Apex classes (10 services + 11 tests) are programmatic, and the thin triggers simply delegate to them. The exam expects you to know *when to use which* — Flow Builder is almost always the right default.

---

## 4. Navigation & Setup Habits

1. **App Launcher** (waffle icon) — switch between apps (Sales, Service, Admin Academy)
2. **Setup** (gear icon) — search using the **Quick Find** box: it finds anything, metadata note: `Get-ChildItem force-app` is your offline version
3. **Object Manager** — the metadata home of every object
4. **Record pages** — the Dynamic Forms surface your fields
5. **Developer Console** — Query Editor, Anonymous Apex, debug logs

### The Release Cadence
Salesforce shipped three major releases per year (Spring, Summer, Winter). Every phase in this RoadMap assumes your org is on a recent **API version (68.0)**.

---

## 5. Hands-On Exercises

### Exercise 1: Deploy or Connect
1. If you only have this repo: open `README.md`, then read `ARCHITECTURE.md` to see the layering.
2. If you have a Scratch/DEV org: `sf project deploy start --source-dir force-app/main/default`
3. Log in, open the App Launcher, and browse Setup.

### Exercise 2: Explore the RoadMap Objects
1. Setup > Object Manager > **Admin_Task__c**
2. Open **Fields & Relationships** — note the AutoNumber `AT-{00000}` and the 8 task fields
3. Find `Data_Migration_Batch__c`, `Security_Audit__c`, `Training_Question__c`, `Study_Plan__c`
4. Check the `Admin_Configuration__mdt` custom metadata record (5 org-wide guardrails)

### Exercise 3: Run Your First SOQL
Developer Console > Query Editor:

```sql
SELECT Name, Task_Type__c, Status__c, Due_Date__c FROM Admin_Task__c LIMIT 10
```

Then open `scripts/soql/fundamentals.soql` and run queries 1–5.

---

## 6. Key Terms Glossary

| Term | Definition |
|------|-----------|
| **Org** | Your Salesforce instance and all its configuration and data |
| **Metadata** | The configuration of your org (objects, fields, flows, code) |
| **Declarative** | Clicks-not-code configuration |
| **Programmatic** | Code-based development (Apex, LWC) |
| **SObject** | Any Salesforce object — standard or custom (`__c`) |
| **CRUD** | Create, Read, Update, Delete — record access |
| **FLS** | Field-Level Security — who can see/edit a field |
| **Governor Limits** | Platform quotas (query rows, DML, CPU) |
| **SFDX** | The modern Salesforce developer toolchain |
| **API Version** | The interface your code is compiled against (this repo: 68.0) |

---

## 7. Quiz — Test Your Knowledge

1. What is the difference between declarative and programmatic configuration?
2. Name the five custom objects shipped in this RoadMap.
3. What does CRUD stand for?
4. Which object stores customer support issues?
5. What custom metadata record holds org guardrails, and which fields does it have?

---

## Next Phase

**[Phase 2: Object Manager & Data Model](./02-data-model.md)** — Build the custom-object layer, master field types, and learn how validation rules keep bad data out of your org.