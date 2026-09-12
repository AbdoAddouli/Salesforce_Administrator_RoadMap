# Phase 4: User Management & Org Setup

## Learning Objectives
By the end of this phase, you will be able to:
- Create users, assign profiles/licenses, and understand the DML realities
- Apply onboarding defaults via `UserManagementService` and the `UserTrigger`
- Walk the lifecycle from **Not Started → In Progress → Complete**
- Manage roles, queues, public groups, and feature licenses
- Automate the welcome flow with `New_User_Onboarding_Tasks`

---

## 1. The User Record

A **User** is a licensed human (or integration) login. RoadMap field highlights:

| Field | Purpose |
|-------|---------|
| **Admin Role** | What this person administers (Sales Ops, Service Ops, Security…) |
| **Onboarding Status** | Not Started / In Progress / Complete |
| **Onboarding Date** | When onboarding began |
| **Training Progress** | Percent complete — the academy progress bar target |
| **Last Security Review** | Last security audit date (Phase 3) |
| **Login Source Category** | Where they log in (Office / Remote / Unknown) |
| **Requires Login Review** | Flag popped by `SecurityService` |
| **Is Deactivation Candidate** | Stale-account flag for deactivation sweeps |
| **Feature License Missing** | License gap marker for the license audit |

### The UserTrigger
`UserTrigger` fires `before insert` and `before update`, delegating to `UserManagementService.applyOnboardingDefaults`:

```apex
if (Trigger.isBefore && (Trigger.isInsert || Trigger.isUpdate)) {
    UserManagementService.applyOnboardingDefaults(Trigger.new);
}
```

Run block 2 of `scripts/apex/service-invocation.apex` to insert a user and watch `Onboarding_Status__c` fill itself in.

---

## 2. Users, Licenses, and Feature Licenses

- **User licenses** bill the org (Salesforce, Sales Cloud, Service Cloud…)
- **Feature licenses** enable features *within* a license tier (Marketing User, Forecasting, Knowledge)
- **Permission set licenses** let you grant features across license types

### The License Audit
`scripts/soql/users-org-setup.soql` query 3:

```sql
SELECT Name, TotalLicenses, UsedLicenses FROM UserLicense ORDER BY TotalLicenses DESC
```

And the gap detector — users with `Feature_License_Missing__c = true` flagged by `SecurityService.flagMissingPermissionSets`.

---

## 3. Roles, Queues, and Groups

| Component | Purpose | Owner-less work |
|-----------|---------|-----------------|
| **Role** | Grants record visibility in a hierarchy | No — always a person |
| **Queue** | Holds unassigned records for teams (Cases, Leads, Tasks) | **Yes** — records sit in a queue |
| **Public Group** | A named set of users/roles/queues for sharing | No |

### Queues in This Repo
The Case assignment rules reference two queues — `High Priority Case Queue` and `Standard Case Queue` (create them in your org before exercising `Case.assignmentRules-meta.xml`).

### RoadMap Board Roles
Admin_Task__c has a **Task Owner** lookup (User) — automation sets it, dashboards group by it:
- Queue work → an admin sees *their* queue's open tasks
- Reports group by `Task_Owner__r.Name` in `Admin_Task_Completion`

---

## 4. Onboarding: The Declarative Half

Two record-triggered flows complete the onboarding story:

### New_User_Onboarding_Tasks (User AfterSave)
When a **new active user** is created, the flow creates three admin tasks:
1. **Profile Review** — the admin verifies the right profile/FLC subset
2. **Permission Set Assignment** — attach `Salesforce_Administrator` where due
3. **Ownership Task** — confirm record ownership defaults

### User_Deactivation_FollowUp (User AfterSave)
When `IsActive` flips to **false**, the flow raises a **Deactivation Cleanup Task** so nobody forgets the orphaned records and open approvals.

Learn the flow anatomy on disk: `flows/New_User_Onboarding_Tasks.flow-meta.xml` (start element → decision → 3 record-creates).

---

## 5. Org Setup Checklist
- [ ] Company Information (fiscal year, locale)
- [ ] Business Hours + Holiday (used by Case SLA math)
- [ ] Fiscal year for forecast windows
- [ ] Locale/Timezone/Currency per-region user defaults
- [ ] Notification templates (Case assignment, task due)
- [ ] Data Protection: Consent tracking fields (Contact level, Phase 5)

---

## 6. Hands-On Exercises

### Exercise 1: Create a User
Setup > Users > New User. Give them `Onboarding_Status__c = 'Not Started'`, then watch the **New User Onboarding Tasks** flow fire three tasks.

### Exercise 2: Run the Trigger Logic Manually
Run `scripts/apex/service-invocation.apex` block 2 — note the `applyOnboardingDefaults` behavior on the inserted user.

### Exercise 3: Deactivate and Watch
Set that user `IsActive = false` and confirm `User_Deactivation_FollowUp` created a cleanup task.

### Exercise 4: Queue Setup
1. Create the `High Priority Case Queue`
2. Reload `Case.assignmentRules-meta.xml` (Phase 7 covers the rules) 
3. Open a High Priority Case owned by the queue and verify

### Exercise 5: Onboarding Status Reporting
Run `scripts/soql/users-org-setup.soql` query 2 — who is still onboarding?

---

## 7. Quiz — Test Your Knowledge

1. What is the difference between a user license and a feature license?
2. Which component can *own* a record without being a person?
3. Which flow creates three onboarding tasks on a new active user?
4. What does the `UserTrigger` delegate to on insert?
5. When a user is deactivated, what follow-up task does the org expect?

---

## Next Phase

**[Phase 5: Data Management](./05-data-management.md)** — Quality scores, duplicate flagging, and the migration batch lifecycle with platform events.