# Phase 6: Automation Essentials — Flows

## Learning Objectives
By the end of this phase, you will be able to:
- Classify flows: record-triggered, schedule-triggered, screen, autolaunched
- Read a flow's XML on disk and explain its elements
- Use decisions, record-creates/updates, and screen elements
- Walk the eight flows shipped in this RoadMap
- Design for debugging (fault paths, debug detail, versioning)

---

## 1. The Flow Menu

| Type | Runs when | Exam bias |
|------|-----------|-----------|
| **Record-Triggered** | A record is created/updated/deleted | The most-examined type |
| **Schedule-Triggered** | A fixed schedule | "Which flow type runs nightly?" |
| **Screen** | A user interacts | Data entry wizards, approvals UX |
| **Autolaunched (no trigger)** | Called by Apex / other flows / API | Reusable, event-style logic |
| **Platform Event-Triggered** | An event publishes | Decoupled automations |

**Flow Builder is the default automation tool.** The exam expects "Which automation?" — answer Flow unless a specific legacy scenario forces otherwise.

---

## 2. Flow Anatomy (Whatever the type)
- **Start** element — defines trigger/schedule/inputs
- **Decision** or **Record Lookup** — branch the logic
- **Record Create/Update/Delete** — the DML moments
- **Screen** — collect user input (screen flows)
- **Fault path** — a correct flow handles failures, never just ends

Every RoadMap flow lives under `force-app/main/default/flows/*.flow-meta.xml` — open any one to see `start` → decision → action elements.

---

## 3. The Eight RoadMap Flows

| Flow | Type | Trigger | What it does |
|------|------|---------|--------------|
| **New_User_Onboarding_Tasks** | Record-Triggered | User after save | Creates 3 onboarding tasks (Profile Review, Permission Set, Ownership) |
| **User_Deactivation_FollowUp** | Record-Triggered | User after save | Creates a Deactivation Cleanup Task when `IsActive=false` |
| **Data_Export_Approval_Request** | Record-Triggered | Case after save | For `Data_Export_Requested__c=true`, sets `Approval_Status__c=Pending` |
| **Sensitive_Data_Review_Task** | Record-Triggered | Account after save | Flags `Sensitive_Data__c=true` and creates a Security Review Task |
| **Data_Import_Validation** | Record-Triggered | Data_Migration_Batch__c after save | Marks batch In Progress when records are present |
| **Handle_Data_Migration_Progress** | Autolaunched | Input `batchId` | Creates a migration follow-up task, guardrail for `recordProgress` |
| **Stray_Field_Audit** | Screen | User-interactive | Picks Account/Contact/Lead/Case and previews the field audit |
| **Case_Escalation_Task** | Record-Triggered | Case after save | `Escalation_Level__c > 1` → creates an escalation task |

### Declarative / Apex contract
Flows do the *clicking*; `AutomationService` does the *calculation*. Its two stars:

```apex
AutomationService.applyDefaultDueDates(taskList);   // if blank, compute from type
AutomationService.inferPriorities(taskList);        // critical vs standard
```

Flow authors call the same methods (`Handle_Data_Migration_Progress` uses them via Apex) — the exam-friendly pattern is "keep math in Apex, keep orchestration in Flow."

---

## 4. Reading Flow XML on Disk
`New_User_Onboarding_Tasks.flow-meta.xml` shows the shape:
1. `<start>` with an object-triggered event
2. Three `<recordCreates>` (Profile Review / Permission Set / Ownership)
3. `intervalType`, `schedule`, and fault paths where present

When you deploy this repo, every flow compiles in Developer Edition — a quick way to sanity-check your Flow Builder skills is to *rebuild* `Stray_Field_Audit` from the XML by hand.

---

## 5. Scheduled Flow Pattern (into your toolkit)
A weekly **"Stale Task Closer"** would run `AutomationService.staleTasksToClose` to close dusty `Admin_Task__c` records older than `Auto_Close_Stale_Days__c` (custom metadata!). You can add it later — the service call is ready.

---

## 6. Hands-On Exercises

### Exercise 1: Trigger Both User Flows
1. Create a new active User → `New_User_Onboarding_Tasks` creates 3 tasks
2. Deactivate them → `User_Deactivation_FollowUp` creates the cleanup task

### Exercise 2: Watch a Decision Element
Create an Account with `Sensitive_Data__c = TRUE` and confirm `Sensitive_Data_Review_Task` raises a Security Review Task.

### Exercise 3: Read the Autolaunched Flow
Open `Handle_Data_Migration_Progress.flow-meta.xml` — identify the input variable and the single record-create.

### Exercise 4: Escalation Drive
Open a Case, set `Escalation_Level__c` over 1, and confirm `Case_Escalation_Task` ran.

### Exercise 5: Rebuild a Screen Flow
Recreate `Stray_Field_Audit` from scratch in Flow Builder (picklist → assignment → display). Compare to the shipped XML.

### Exercise 6: SOQL the Evidence
Run `scripts/soql/automation-flows.soql` — queries 2, 3, and 4 prove the flows ran (task footprints and escalation levels).

---

## 7. Quiz — Test Your Knowledge

1. Name the four flow trigger types, and one use for each.
2. Which flow sets `Approval_Status__c = 'Pending'` on Cases?
3. In this repo, who computes due dates — Flow or Apex?
4. Which RoadMap flow is autolaunched, and what input does it take?
5. What does a fault path do, and why is it non-optional?

---

## Next Phase

**[Phase 7: Automations II — Approvals & Legacy](./07-approvals-legacy.md)** — Approval processes, assignment rules, workflow rules, and the migration story to Flow.