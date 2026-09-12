# Phase 2: Object Manager & Data Model

## Learning Objectives
By the end of this phase, you will be able to:
- Create custom objects and understand the `__c` naming convention
- Choose the right field type for the right job
- Set up lookups (child) and master-detail (subordinate) relationships
- Write validation rules and know when to skip them
- Read relationship data with SOQL parent and child queries

---

## 1. Custom Objects: The `__c` Convention

Custom objects end in `__c` (e.g. `Admin_Task__c`). Custom fields do too. Standard objects (`Account`, `Case`, `User`, `Task`) never carry the suffix. The exam loves this distinction.

### The RoadMap Object Design Patterns

**Admin_Task__c** — the task board backend:

| Field | Type | Purpose |
|-------|------|---------|
| Admin Task Number | AutoNumber `AT-{00000}` | Human-readable key |
| Task Type | Picklist | Onboarding, Security Review, Automation Build, Deployment… |
| Status | Picklist | Not Started / In Progress / Completed |
| Due Date | Date | Deadline (auto-applied by `AutomationService.applyDefaultDueDates`) |
| Priority | Picklist | Drive sequencing (inferred by `AutomationService.inferPriorities`) |
| Task Owner | Lookup (User) | Who owns the work |
| Related Object | Text | Which object the task touches |
| Completed Date | Date/Time | Set when Status becomes Completed |

**Security_Audit__c** — findings ledger (AutoNumber `SA-{00000}`, Audit Type, Risk Level, Finding, Recommended Action, Status, User Assessed, Audit Date).

**Data_Migration_Batch__c** — import/export journal (Source Object, Direction, Record Count, Successful/Failed Records, Status, Started/Completed At, Batch Owner, Notes) driven by `DataMigrationService`.

**Training_Question__c** — quiz bank (AutoNumber `TRQ-{00000}`, Question Text, Options A–D, Correct Answer, Explanation, Topic, Difficulty) served by `CertificationPrepService`.

**Study_Plan__c** — certification pacing (Learner, Certification, Target Date, Status, Hours Per Week, Completed Domains).

> You also ship a **custom metadata type** `Admin_Configuration__mdt` (Max Login Attempts, Alert Email, Auto Close Stale Days, Enable Login Audit, Default Report Folder) and a **platform event** `Data_Migration_Event__e` — more on both in later phases.

---

## 2. Choosing Field Types

| Type | Use it for | Exam trap |
|------|-----------|-----------|
| **Text** | Short values | Max 255 chars — use Long Text for more |
| **Long Text Area** | Paragraphs, notes | Not available in SOQL `GROUP BY`/sort |
| **Number** | Quantities, scores | Precision matters (Data Quality Score) |
| **Currency** | Money | Amount on Opportunity |
| **Formula** | Derived values | e.g. `IF(IsClosed, 0, ROUND(Amount*Probability, 2))` |
| **Date / Date/Time** | Points in time | Dates have no timezone; Date/Times do |
| **Picklist** | Enumerated values | Adds API value — use it over free-text |
| **Checkbox** | Yes/No flags | e.g. `Duplicate_Flag__c`, `Consent_Given__c` |
| **AutoNumber** | Sequence keys | Format strings like `AT-{00000}` |
| **Lookup / Master-Detail** | Relationships | Master-detail cascades delete + sharing |

### The Weighted Revenue Formula
In this repo, `Opportunity.Weighted_Expected_Revenue__c` is a formula field:

```
IF(IsClosed, 0, ROUND(Amount * Probability, 2))
```

Think like an admin: closes drop out of forecast, open deals show the expected value. The Field Definition `DataType` is `Formula`.

---

## 3. Relationships in SOQL

Relating data is the heart of the data model. SOQL has two directions:

### Parent-to-Child (inner query)
```sql
SELECT Name, (SELECT Name, Amount, StageName FROM Opportunities)
FROM Account
WHERE Id IN (SELECT AccountId FROM Opportunity)
```

### Child-to-Parent (dot notation)
```sql
SELECT Name, Account.Name, Account.Industry
FROM Contact
WHERE AccountId != NULL
```

Open `scripts/soql/data-model.soql` for ten graduated queries — including the "missing critical fields" query admins run weekly:

```sql
SELECT Name, Account.Name, Email, Phone
FROM Contact
WHERE Email = NULL AND Phone = NULL
```

---

## 4. Validation Rules

Validation rules are formulas that reject bad saves. This repo ships six — read each on disk under `objects/<Obj>/validationRules/`:

| Rule | Object | What it blocks |
|------|--------|----------------|
| `Negative_Data_Quality_Score` | Account | Scores below zero |
| `Require_Email_Or_Phone` | Contact | Contacts with neither email nor phone |
| `Forecast_Category_Closed_Mismatch` | Opportunity | Closed deals without a forecast category |
| `Require_Resolution_For_Closed` | Case | "Closed" with no resolution comment |
| `High_Priority_Requires_Subject` | Case | High priority cases with a blank subject |
| `Prevent_Future_Due_On_Completion` | Task | A completed task still dated in the future |

### When to Skip a Validation Rule
- Data loads where the rule doesn't apply yet (use Data Loader **bulk API** and fix upstream)
- Sandbox seeding — validation rules can block demo data creation

---

## 5. Hands-On Exercises

### Exercise 1: Read a Validation Rule
Open `objects/Account/validationRules/Negative_Data_Quality_Score.validationRule-meta.xml`. Note the `errorConditionFormula` and the `errorDisplayField` pointing at the guarded field.

### Exercise 2: Formula Walk
1. Open `Opportunity.Weighted_Expected_Revenue__c` in Object Manager
2. Change the formula to `IF(IsClosed, 0, Amount * Probability)` and save
3. Revert it — admin version control is a skill

### Exercise 3: Describe API Output
Run `scripts/apex/service-invocation.apex` block 1:

```apex
System.debug(DataModelService.describeObjectLabel('Account'));
```

### Exercise 4: Data Model Quiz
Run `scripts/soql/certification-prep.soql` query 1 to see the question bank theme, then open `Admin_Task__c` and trace its 8 fields back to this guide's table.

---

## 6. Quiz — Test Your Knowledge

1. What does the `__c` suffix mean, and where does it never appear?
2. Which object would you pick: AutoNumber key, 8 fields, task board — and why?
3. What happens to child records when a master-detail parent is deleted?
4. Write a parent-child SOQL query using `Admin_Task__c.Task_Owner__c`.
5. Which of the six validation rules blocks closing a case without a resolution?

---

## Next Phase

**[Phase 3: Security Model](./03-security.md)** — Profiles, permission sets, org-wide defaults and the `Salesforce_Administrator` access recipe your org ships with.