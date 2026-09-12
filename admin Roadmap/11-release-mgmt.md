# Phase 11: Documentation, Sandboxes & Release Management

## Learning Objectives
By the end of this phase, you will be able to:
- Pick the right sandbox for the job (Developer, Developer Pro, Partial, Full)
- Contrast change sets with SFDX/CLI deployments
- Use `ReleaseManagementService` for deploy-readiness checks
- Run a deployment checklist: freeze, backup, validate, deploy, verify
- Keep docs that the next admin (or the exam) can actually use

---

## 1. Sandbox Types

| Type | Data | Refresh | Typical use |
|------|------|---------|-------------|
| **Developer** | Metadata + config (no data) | 1/day | Feature work |
| **Developer Pro** | Metadata | 1/day | Integration development |
| **Partial Copy** | Sample data (template) | Weekly | UAT / training |
| **Full** | Production copy | 30 days | Dress rehearsal, data-seeded testing |

Every sandbox refreshes and **recovers from production**; solutions you build must be data-agnostic — which is why `Admin_Task__c`, `Data_Migration_Batch__c`, and the security audit objects make great sandbox UAT fixtures.

---

## 2. Deployment Paths

| Delivery | Tooling | Good for | Watch out |
|----------|--------|----------|-----------|
| **Change Sets** | Setup | Small, UI-driven pushes | Non-transactional, no rollback granularity |
| **SFDX / DX (this repo)** | `sf project deploy` | Declarative + code, CI-friendly | Requires source-tracked project |
| **Metadata API / CLI** | `sf force mdapi` | Scripted, versioned | Higher learning curve |

The exam duality: **outbound change sets from a sandbox**, **inbound into another**. `git` + CLI deployments are the modern admin skill on top.

---

## 3. `ReleaseManagementService`: The Release Gate

Three pure functions keep deploy anxiety low:

```apex
ReleaseManagementService.recommendedDeployOrder();                  // metadata dependency order
ReleaseManagementService.isInFreezeWindow(freezeStart, freezeEnd);  // "are we frozen?"
ReleaseManagementService.countComponents(stagedFiles);              // deploy size estimate
```

`recommendedDeployOrder` encodes the ordering admin teams live by:

```
Custom Objects -> Fields -> Validation Rules / Custom Metadata
-> Flows & Apex (compile-time deps) -> Permission Sets -> Reports/Dashboards
```

---

## 4. The Deployment Checklist (Run It As a Pre-Release Flow)

- [ ] **Freeze**: announce the window (`isInFreezeWindow`)
- [ ] **Backup**: Data Export + a package build
- [ ] **Validate**: `sf project deploy start --check-only` against a sandbox
- [ ] **Deploy**: push to the target org
- [ ] **Verify**: run the smoke queries (`scripts/soql/release-mgmt.soql` post-launch set)
- [ ] **Document**: update `README.md` and the ARCHITECTURE docs — the next admin thanks you

Smoke Set (query 7): did the import flow populate its counters?

```sql
SELECT Id, Name, Record_Count__c, Successful_Records__c, Failed_Records__c
FROM Data_Migration_Batch__c WHERE Record_Count__c != NULL ORDER BY CreatedDate DESC LIMIT 15
```

---

## 5. Notion-Level Documentation Standards
- **Change management**: an admin journal — who, what, when (`SetupAuditTrail` prints it for you)
- **Runbooks**: recreate-any-piece instructions (this RoadMap *is* a runbook)
- **Field dictionary**: the `*.field-meta.xml` labels ARE the dictionary
- **Deploy history**: `ReleaseManagementService` + `deploy` logs

---

## 6. Hands-On Exercises

### Exercise 1: Read the Release Service
Open `ReleaseManagementService.cls` and walk `recommendedDeployOrder()` — match each entry to a folder in `force-app/main/default/`.

### Exercise 2: Freeze-Window Check
Run anonymous Apex:

```apex
Boolean frozen = ReleaseManagementService.isInFreezeWindow(
    Date.today(), Date.today().addDays(2));
System.debug('Deploy freeze in effect: ' + frozen);
```

### Exercise 3: Dry-Run a Deploy
`sf project deploy start --check-only --dry-run` against a scratch org — no metadata hits production.

### Exercise 4: Smoke the Post-Launch Queries
Run `scripts/soql/release-mgmt.soql` queries 7 and 8 — imports stamped their counters? Onboarding finished?

### Exercise 5: Version the Docs
Edit `README.md` badge counts after each release. The repo is the single source of truth.

---

## 7. Quiz — Test Your Knowledge

1. Which sandbox copies production data, and what is its refresh cadence?
2. What is the primary difference between change sets and SFDX deployments?
3. What does `ReleaseManagementService.recommendedDeployOrder()` return?
4. What does `--check-only` achieve in a deployment?
5. Name three artifacts that make up "the documentation" of an org.

---

## Next Phase

**[Phase 12: Certification Prep](./12-certification-prep.md)** — The exam blueprint, the question bank workflow, and the study-plan engine.