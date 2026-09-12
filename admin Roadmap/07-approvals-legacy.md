# Phase 7: Automation II — Approvals & Legacy

## Learning Objectives
By the end of this phase, you will be able to:
- Configure an approval process end-to-end (entry criteria → steps → actions)
- Read `Data_Export_Approval` on disk and explain each XML node
- Set up assignment rules for queue routing
- Audit running and historical approvals via `ProcessInstance` objects
- Explain legacy automations (Workflow Rules, Process Builder) and their migration to Flow

---

## 1. Approval Processes: The Anatomy

An approval process automates a **submit → approve/reject** cycle on records.

```
Entry criteria        -> who/what can be submitted
Approval steps        -> ordered approvers, one at a time
Initial submission    -> who to (this example: the record owner's manager)
Approval actions      -> on approve / reject / recall
                                                                                       
Data_Export_Approval  (in this repo, on Case):
  entry:  Data_Export_Requested__c = TRUE  AND  Priority = High
  step:   Step_1_Security_Admin
          approver = record owner's manager (ManagerOfRecordOwner) + HierarchyToRecordOwner
  final approve  -> Approval_Status__c = 'Approved'
  final reject   -> Approval_Status__c = 'Rejected'
  recall         -> Approval_Status__c = 'Draft'
```

### Read the XML
`approvalProcesses/Data_Export_Approval.approvalProcess-meta.xml` — every node maps to a Setup click:
- `<entryCriteria>` with `booleanFilter` (`1 AND 2`)
- `<approvalStep>` with `allowDelegate` and approver assignment
- `<finalApprovalActions>` / `<finalRejectionActions>` / `<recallActions>` field updates

---

## 2. Assignment Rules

Assignment rules route records to queues or users based on criteria, evaluated **one time at creation** (usually).

### The Case Duo in this repo
`objects/Case/assignmentRules/Case.assignmentRules-meta.xml` defines rule **Case Queue Routing**:

```
booleanFilter 1 OR 2
entry 1: High Priority Cases -> High Priority Case Queue (Queue)
entry 2: Standard Cases      -> Standard Case Queue   (Queue)
```

Create the queues first (Phase 4 exercise), then create a High Priority Case and watch the owner become the queue. Note `assignedToType` Queue and `operation` `equalsNeither`.

---

## 3. Auditing Approvals with SOQL

`ProcessInstance` (a submission lifecycle) and `ProcessInstanceStep` (each step) answer any auditor:

```sql
SELECT ProcessInstanceId, TargetObjectId, ActorId,
       CompletedDate, StepStatus, Comments
FROM ProcessInstanceStep
ORDER BY ProcessInstanceId DESC LIMIT 20
```

`scripts/soql/approvals-legacy.soql` bundles the whole audit kit: approval states by `Approval_Status__c`, pending submissions, who-approves-what (users with `ManagerId`), and workflow-rule leftovers.

---

## 4. Legacy Automation → Flow

| Legacy | Still valid? | Exam posture |
|--------|--------------|--------------|
| **Workflow Rules** | Read-only support | Prefer Flow; know workflow fields (time triggers, email alerts) |
| **Process Builder** | Grandfathered, deprecated | Migrate to Flow |
| **Action on Tasks/Emails** | Some patterns remain | Flow is the default |
| **Approval Processes** | Very much alive | Combine with flows: Flow sets `Pending`, approval finalizes |

Your mental model: **Approvals stay, workflows migrate.** The `Data_Export_Approval_Request` flow and `Data_Export_Approval` process *compose* — flow sets `Approval_Status__c=Pending` and the process finalizes to Approved/Rejected.

---

## 5. Hands-On Exercises

### Exercise 1: Read the Approval Process
Open `Data_Export_Approval.approvalProcess-meta.xml`. Label the `entryCriteria`, `step`, `finalApprovalActions`, `finalRejectionActions`, and `recallActions` nodes.

### Exercise 2: Rebuild in Setup
Recreate the same process in Setup (Setup > Process Automation > Approval Processes). It should look identical once deployed.

### Exercise 3: Exercise the Pair
1. Create a High Priority Case with `Data_Export_Requested__c=true`
2. Watch the flow set `Approval_Status__c` to Pending
3. Submit for approval and complete Step_1 as the manager
4. Confirm the final action stamped **Approved**

### Exercise 4: Audit the Result
Run `scripts/soql/approvals-legacy.soql` query 1 to see your approval-state distribution.

### Exercise 5: Route a Case Declaratively
Create `High Priority Case Queue` (if missing) and a High Priority Case; confirm queue ownership from the assignment rule.

---

## 6. Quiz — Test Your Knowledge

1. What two conditions trigger `Data_Export_Approval` entry criteria?
2. Who receives the initial submission for Step_1_Security_Admin?
3. What do the final approval/rejection actions write on the Case?
4. How is a Queue different from a Role in assignment-rule routing?
5. What is the current Salesforce position on Process Builder?

---

## Next Phase

**[Phase 8: Sales & Marketing Apps](./08-sales-marketing.md)** — Lead funnels, opportunity stages, forecast categories, campaigns, and the admin's Applied-CRM field kit.