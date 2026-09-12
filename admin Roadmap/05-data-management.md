# Phase 5: Data Management

## Learning Objectives
By the end of this phase, you will be able to:
- Imports vs exports: pick the right loading tool for the job
- Normalize, score, and flag duplicates like `DataManagementService` does
- Journal every migration on `Data_Migration_Batch__c`
- Publish lifecycle events to `Data_Migration_Event__e` for integrations
- Protect personal data with consent fields and the EU processing flag

---

## 1. The Data Toolkit

| Tool | Best for |
|------|----------|
| **Data Import Wizard** | One-offs, up to 50k records, UI-driven |
| **Data Loader** | Batches, scheduled loads, upserts with External IDs, API `bulk` calls |
| **Data Export** | Monthly backups — export to your own archive |
| **Duplicate Management** | Native matching rules + merge |
| **Backup/Recovery vendors** | Failsafe restores beyond the Recycle Bin window |

### The classic exam split
Use the **External ID** field for upserts; standard record **Ids are not upsert keys**.

---

## 2. Normalize -> Score -> Flag

`DataManagementService` codifies the three-step dance every admin DB does by hand:

```apex
String normalized = DataManagementService.normalizeAccountName('ACME Corp '); // 'acme corp'
Map<String, List<Account>> collisions = DataManagementService.findNameCollisions(accountList);
DataManagementService.flagDuplicateAccounts(accountList);
DataManagementService.applyValidationStatus(accountList);
```

The **AccountTrigger** runs the flaggers on insert/update — two `ACME Corp` accounts created back-to-back set `Duplicate_Flag__c = true` on the second. Try block 4 of `scripts/apex/service-invocation.apex`.

### Fields that make it measurable
- Account/Contact/Lead **Data Quality Score** — a 0–100 completeness number
- **Validation Status** — Valid / Needs Review / Invalid
- **Duplicate Flag** + **Import Batch Number**
- **Sensitive Data**, **Data Processed in EU** (Account) + **Consent To Process / Consent Date** (Contact)

The **Data Quality dashboard** (`Data_Quality_Dashboard`) turns these into metrics — duplicates flagged, accounts by validation status, needs-review count.

---

## 3. The Migration Batch Lifecycle

Every load registers on `Data_Migration_Batch__c`:

```
New  ->  In Progress  ->  Completed / Failed
```

`DataMigrationService` owns the lifecycle:

```apex
Data_Migration_Batch__c batch = DataMigrationService.openBatch('Account', 100);
DataMigrationService.recordProgress(batch, 95, 5);
DataMigrationService.closeBatch(batch.Id, true);
```

### Platform Events: the decoupled journal
Each step publishes `Data_Migration_Event__e` (`CREATED`, `PROGRESS`, `CLOSED`) through `EventBus.publish`. A Flow (`Handle_Data_Migration_Progress`) or a downstream integration can subscribe without touching the batch object — **decoupling** is the exam-approved architecture.

### The Data Import Validation flow
`Data_Import_Validation` reacts to new batches (`Data_Migration_Batch__c` AfterSave): it fetches the batch, decides whether records are present, and marks it **In Progress** for the service to complete.

---

## 4. The EU / Consent Angle
- Contact: **Consent To Process** checkbox + **Consent Date**
- Account: **Data Processed in EU** — the "where does this data live" signal
- Lead: **Consent Given** before conversion
- Report: `scripts/soql/data-management.soql` query 8 lists consent tracking for audit

Run the exact "duplicates in one shot" query admins keep on the clipboard:

```sql
SELECT LOWER(TRIM(Name)) normalizedName, COUNT(Id) occur
FROM Account
GROUP BY LOWER(TRIM(Name))
HAVING COUNT(Id) > 1
```

---

## 5. Data Hygiene Runs
- [ ] Weekly: `DATA_QUALITY_SCORE < 80` review (`Data_Quality_Score_Report`)
- [ ] Monthly: recycle-bin sweep — restore or archive 30+ day bins
- [ ] Each load: batch journal updated, event email to `Alert_Email__c` config
- [ ] Quarterly: `Last_Data_Audit__c` stamp refreshed on every account

---

## 6. Hands-On Exercises

### Exercise 1: Navigate the DuaL-Load Journal
1. Run `scripts/apex/service-invocation.apex` block 7 (open → progress → close)
2. Open the created `Data_Migration_Batch__c` record and read its counters
3. Watch the `PROGRESS`/`CLOSED` platform events in Setup > Events Log File or your Apex logs

### Exercise 2: Flag a Duplicate Declaratively
1. Create Account "Acme Corp"
2. Create Account "acme corp" with the same country
3. Confirm the second record flipped `Duplicate_Flag__c`

### Exercise 3: Duplicate SOQL Sweep
Run `scripts/soql/data-management.soql` queries 1–3 to catch collisions before you merge.

### Exercise 4: Consent Policy Audit
Set `Consent_To_Process__c` on three Contacts with different `Consent_Date__c` values, then run query 8.

### Exercise 5: Build the Quality Report
Open `Data_Quality_Score_Report.report-meta.xml` from `reports/` and re-create it in the **Admin_Reports** folder.

---

## 7. Quiz — Test Your Knowledge

1. When would you choose Data Loader over the Data Import Wizard?
2. Why do upserts need an External ID?
3. What is the standard lifecycle of a `Data_Migration_Batch__c` record?
4. Which trigger flags duplicate Accounts, and which service does the work?
5. Which three contact-level fields protect EU personal data?

---

## Next Phase

**[Phase 6: Automation Essentials — Flows](./06-automation-flows.md)** — Build the eight flows that run this org, and learn Flow Builder's decision, record, and screen elements cold.