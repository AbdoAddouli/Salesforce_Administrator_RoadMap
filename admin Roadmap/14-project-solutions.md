# Phase 14: Project Solutions

## Learning Objectives
By the end of this phase, you will be able to:
- Compare your five Phase-13 builds against staff-level reference solutions
- Read the schema, security and automation decisions behind each project
- Re-derive the exact Flows, SOQL and dashboard specs that answer each brief
- Grade yourself against the acceptance criteria and name the gaps to fix

---

> **Why these are gated.** The capstone's value is the attempt. Every solution card sits
> behind a "have you tried it first?" prompt, so the loop stays yours:
> attempt → verify → compare → fix → re-verify.

| Project (Phase 13) | Solution |
|--------------------|----------|
| Build 1 · Sales Pipeline | Solution — Sales Pipeline |
| Build 2 · Service & Support | Solution — Service Operations |
| Build 3 · Migration & Dedupe | Solution — Migration |
| Build 4 · Campaign ROI | Solution — Attribution |
| Build 5 · Security + Releases | Solution — Security Posture |

---

## Solution — Build 1 · Sales Pipeline from Scratch

**Schema.** Opportunity: `Deal_Type__c` (New / Expansion / Renewal), `Max_Discount__c` (%),
`Commission_Forecast__c`, `Lost_Reason__c`, `Champion_Name__c`. Custom `Sales_Territory__c`
(Region, Manage User) linked from Account.

**Validation rules** — the enforcement layer. Flows cannot stop a direct save; validation rules can:
- `MaxDiscount`: `NOT(ISBLANK(Max_Discount__c)) && Max_Discount__c > 40`
- `LostReasonRequired`: `ISPICKVAL(StageName, 'Closed Lost') && ISPICKVAL(Lost_Reason__c, '')`
- `WonAmountPositive`: `ISPICKVAL(StageName, 'Closed Won') && (Amount = 0 || Amount < 0)`

**Security.** `Sales_Rep` profile: no FLS on `Commission_Forecast__c` (column-level hide).
`Sales_Manager` role above Reps → hierarchy rolls the pipeline up. Sharing rule opens a
territory's accounts to its manager's team (lateral access the hierarchy cannot give).

**Automation.** "Champion Call" Flow (record-triggered on Stage → Proposal) creates a task.
Approval "Deal > 100k" routes to the submitter's manager, final approver the VP.

**Dashboards.** Pipeline by Stage (bar), Won vs Lost (pie), Weighted pipeline by territory (donut).

**Traps:** discount cap is a validation rule, never a Flow; commission hiding is FLS, not
profile deletion; role hierarchy = roll-up, sharing rules = lateral.

---

## Solution — Build 2 · Service & Support Operations

**Routing.** One Support queue per priority; assignment rule places new cases by record type +
priority. Record types (Phone / Email / Web) drive layouts and routing.

**SLA.** 24-hour entitlement with a "First response" milestone on plan-account entitlements.

**Escalation — the 12-hour rule lives in a Flow, not a task.** A record-triggered Flow starts
on case creation; 12 hours later (waiting / scheduled path), if Status is still not Closed,
it creates the on-call manager's escalation task, sets Status = Escalated and fires the alert.
Time-based branching is Flow territory — assignment rules cannot sleep.

**Knowledge.** 3 published articles wired to the case record page.

**Guardrails (validation, not politeness).**
- `ClosedReserved`: open related Task → block close.
- `ResolutionNotesRequired`: `ISPICKVAL(Status,'Closed') && ISBLANK(Resolution_Notes__c)` → block.

**Dashboards.** Case volume by record type, average age, open by priority.

**Trap:** escalating a stale case is time-dependent logic → a Flow, not an assignment rule.

---

## Solution — Build 3 · Data Migration & Dedupe

**Schema.** External ID `Legacy_Id__c` on Account, Contact, Opportunity — the single load key.
Never record Ids: they do not survive a migration.

**Load order.** Accounts → Contacts → Opportunities (parents before children), upsert keyed on
`Legacy_Id__c`. Re-running the same file changes nothing — that idempotency is the proof.

**Import validation.** A Flow stamps `Validation_Status__c = Needs Attention` for records
missing Owner, Phone or Website; a report lists the fix queue.

**Journaling.** `Data_Migration_Batch__c` stores source count, target count, status and
timestamps — the journaled-batch pattern from Phase 5.

**Dedupe.** Duplicate rules with matching rules (Name + Phone, then Website). Merge via the
standard merge flow so history survives; confirm `HAVING COUNT(Id) > 1` returns nothing.

**Trap:** the merged master must keep its External ID — otherwise replaying the load
resurrects the duplicate.

---

## Solution — Build 4 · Marketing Attribution & Lead Nurturing

**Campaigns.** 2026 Spring Webinar + Google Search — Competitor Terms; member statuses
Sent → Responded → Converted → Accepted mirror the real funnel.

**Influence.** Campaign Influence enabled with the primary-campaign model — one campaign per
opportunity, so revenue is never double-counted. `Influenced_Revenue__c` + `Campaign_Cost__c`
feed the ROI math.

**Nurture Flow.** Record-triggered on CampaignMember = Responded: join "Nurture — Product
Updates", scheduled follow-up email alert, level-up on re-engagement. Cold leads get warmed,
not dropped.

**Security.** `Budget__c` hidden from sales profiles via FLS only; the marketing profile keeps access.

**Reporting.** Campaign ROI = cost vs influenced revenue, one row per campaign — the data that
funds or kills the ads spend. Conversion funnel shows Lead → MQL → Opportunity → Closed Won.

**Trap:** without the primary model, multiple campaigns claim one opportunity and ROI double-counts.

---

## Solution — Build 5 · Security Posture & Change Management

**OWD.** Accounts and Cases Private; documented, auditor-signed matrix:
object × OWD × role hierarchy × sharing rules.

**Rows vs columns.** The role hierarchy rolls up within a territory; one sharing rule opens
EMEA to the territory manager (rows). FLS hides Revenue, `Bank_Account__c`, Commission from
agent profiles (columns). Sharing governs rows; FLS governs columns — always check both.

**Users.** Login hours + IP ranges on support; delegated admin for the helpdesk. Audit loop
flags 90-day-inactive users for deactivation.

**Release discipline.** Developer sandbox → candidate change set / SFDX package → full test
suite → promote inside a documented freeze window → post-promotion verification queries in
the runbook.

**Trap:** a release is not done until the post-promotion verification query passes.

---

## The Post-Build Queries

```sql
-- The audit queries for the whole capstone (also in scripts/soql/project-solutions.soql)

SELECT StageName, COUNT(Id) FROM Opportunity GROUP BY StageName

SELECT Id, Subject, Status, CreatedDate
FROM Case
WHERE Status != 'Closed' AND CreatedDate < LAST_N_DAYS:2
  AND Id NOT IN (SELECT WhatId FROM Task WHERE Status != 'Completed')

SELECT COUNT(Id) FROM Account
SELECT Name, COUNT(Id) n FROM Account GROUP BY Name HAVING COUNT(Id) > 1

SELECT CampaignId, Campaign.Name, COUNT(Id)
FROM OpportunityContactRole WHERE IsPrimary = true GROUP BY CampaignId, Campaign.Name

SELECT UserName, UserRole.Name, IsActive, LastLoginDate
FROM User WHERE IsActive = true AND LastLoginDate < LAST_N_DAYS:90
```

Scoring rubric: 1–5 per acceptance criterion. Anything ≤ 3 → rebuild → re-verify.
When every query passes and every criterion scores ≥ 4, the capstone is done — and so is a
very large slice of what a Salesforce Administrator does on the job.
```