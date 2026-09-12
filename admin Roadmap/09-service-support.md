# Phase 9: Service & Support Apps

## Learning Objectives
By the end of this phase, you will be able to:
- Configure case management: statuses, queues, assignment rules
- Set up entitlements/SLA basics and read the SLA math this repo ships
- Drive escalations by severity (`Escalation_Level__c`, `SLA_Severity__c`)
- Track first-response performance with a formula field
- Use `Case_Escalation_Task` and the Data Export approval pair in practice

---

## 1. The Case Lifecycle

```
New -> Working -> Escalated -> (On Hold) -> Closed
```

Admin levers: case **status picklist**, **record types**, **entitlement milestones**, **queues**, **assignment rules** (Phase 7's Case duo), **support processes**, and **escalation rules**.

### RoadMap Case fields
| Field | Purpose |
|-------|---------|
| **SLA Severity** | P1/P2/P3 picklist head of the SLA watch |
| **First Response Hours** | Formula `ROUND((FirstRespondedDate - CreatedDate) * 24, 1)` |
| **Escalation Level** | Integer — the `Case_Escalation_Task` trigger lever |
| **Root Cause Category** | Why it really happened (reportable) |
| **CSAT Score** | Survey outcome for the Service dashboard |
| **Approval Status / Data Export Requested / Export Reason / Data Export Approved At** | The Phase 7 approval process fields |
| **Queue Assignment Checked** | Guardrail for queued ownership |

---

## 2. Queues and Assignment Rules

From the Phase 7 rules: High Priority Cases land in `High Priority Case Queue`, everything else in `Standard Case Queue`. The `Case_Volume_by_Priority` report and Owner-composition queries (`scripts/soql/service-support-apps.soql` query 4) prove routing health:

```sql
SELECT Owner.Name, Priority, COUNT(Id) n
FROM Case GROUP BY Owner.Name, Priority ORDER BY n DESC
```

### Escalation Automation
`Case_Escalation_Task` (Record-Triggered): when `Escalation_Level__c > 1`, create an **escalation task**. In SOQL:

```sql
SELECT CaseNumber, Subject, Escalation_Level__c, Priority, Status
FROM Case WHERE Escalation_Level__c > 1 ORDER BY Escalation_Level__c DESC
```

---

## 3. SLAs, Entitlements, and Milestones

Two flavors admins must contrast:
- **Entitlements** (record-level SLA + milestones) — per-case, reactive
- **Entitlement Processes** — the milestone machine (First Response, Resolution)

A *time-dependent* automation (milestone breach = email alert) is the classic "which tool" exam question — historically **Workflow Time Triggers**; today, **Scheduled Flow** should be your default answer.

### This repo's math
`First_Response_Hours__c` lets the `Case_Operations_Dashboard` watchdog spot breaches:

```sql
SELECT CaseNumber, First_Response_Hours__c, Status
FROM Case
WHERE First_Response_Hours__c != NULL AND First_Response_Hours__c > 4
ORDER BY First_Response_Hours__c DESC LIMIT 20
```

---

## 4. The Service Dashboard Stack
- **Case_Operations_Dashboard** — Open High Priority metric, Cases by Priority donut, Pending Data Exports metric
- **Case_Volume_by_Priority** report
- **User_Security_Review_Report** — service reps' login posture (Phase 3)

Service admins live on these three views; the closure KPI is `Root_Cause_Category__c` and CSAT.

---

## 5. Hands-On Exercises

### Exercise 1: Route a Case
1. `High Priority Case Queue` must exist (Phase 4)
2. Create a High Priority Case → assignment rule puts it in the queue
3. Create a Standard Case → verify `Standard Case Queue`

### Exercise 2: Escalate On Purpose
Open a Case, set `Escalation_Level__c = 2`, save → `Case_Escalation_Task` creates an escalation task. Grep the flow to confirm the decision condition.

### Exercise 3: SLA Math
Create a Case, respond as its owner (set `FirstRespondedDate` via Update Case), then inspect `First_Response_Hours__c`. Drag hours > 4 into the breach query.

### Exercise 4: Export Approval Loop
1. High Priority Case + `Data_Export_Requested__c=true`
2. Flow sets `Approval_Status__c=Pending`
3. Approve the `Data_Export_Approval` (Phase 7) — verify `Approval_Status__c=Approved`

### Exercise 5: Service SOQL Run
Run `scripts/soql/service-support-apps.soql` queries 3, 5, and 7 — escalation levels, root causes, and the Standard queue's open cases.

---

## 6. Quiz — Test Your Knowledge

1. Which object holds the two queues referenced by this repo's assignment rules?
2. What is the formula behind `First_Response_Hours__c`?
3. Which flow reacts to `Escalation_Level__c > 1`?
4. What two approval process actions stamp a Case Approved vs Rejected?
5. What is the milestone/entitlement distinction in Service Cloud?

---

## Next Phase

**[Phase 10: Analytics](./10-analytics.md)** — Reports, dashboards, folders, and the SOQL-to-dashboard pipeline this RoadMap ships.