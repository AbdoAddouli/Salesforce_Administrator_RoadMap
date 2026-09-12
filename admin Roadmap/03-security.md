# Phase 3: Security Model

## Learning Objectives
By the end of this phase, you will be able to:
- Explain the security layers in order: Org → Object → Field → Record
- Configure profiles, permission sets, and org-wide defaults
- Layer sharing rules and understand the role hierarchy's limits
- Field-level security (FLS) and when it beats sharing
- Use the `Salesforce_Administrator` permission set and `SecurityService` in practice

---

## 1. The Security Stack

Security is layered, and each layer refines the one below it:

```
1. Org    -> who can log in (login policies, IP ranges, MFA)
2. Object -> CRUD per object (profiles + permission sets)
3. Field  -> FLS: which fields are visible/editable
4. Record -> OWD + sharing rules + manual sharing + role hierarchy
```

An unusual login, an active stale account, a missing permission set — each is scored by the **Security Audit** process in this RoadMap.

---

## 2. Profiles vs Permission Sets

| | Profile | Permission Set |
|--|---------|----------------|
| Count per user | Exactly **1** | 0..many |
| Concept | Baseline access | Add-on permissions |
| Exam answer | Always exactly one | "Layered onto the profile" |
| Example | System Administrator | `Salesforce_Administrator` |

### The `Salesforce_Administrator` Permission Set
This repo ships one: `force-app/main/default/permissionsets/Salesforce_Administrator.permissionset-meta.xml`. Read it on disk. Notice:
- `license` is **Salesforce**
- Object permissions for the 5 custom objects + 7 standard ones
- **~104 field permissions** — field-level visibility for every custom field in the org
- Tab settings so the custom tabs appear

Administrators receive *longitudinal* access like this — CRUD everywhere, FLS on everything, tabs front and center — while the Support profile stays narrow and tall in the middle.

---

## 3. Record-Level Security

### Org-Wide Defaults (OWD)
The most restrictive access level — the baseline nobody can dip below:
- **Private** — only record owner (+ role hierarchy above)
- **Public Read Only** — everyone reads, owner writes
- **Public Read/Write** — everyone reads and writes
- **Public Read/Write/Transfer** — Ownership can be transferred

### Sharing Rules (extend OWD, never restrict it)
- **Based on record criteria** — e.g. "Case where Priority = High → share with Case Queue"
- **Based on owner** — "Owned by members of Role X → share with Role Y"
- Sharing rules **elevate** access; you cannot make things more private than OWD

### The Role Hierarchy influences sharing only when OWD is Private
The classic exam question: "OWD is Private on Account. User B reports to User A. Can B see A's accounts?" — **yes**, role hierarchy grants it. But if B is *below* A in the hierarchy, B cannot see A's records.

---

## 4. Field-Level Security & The Audit Lifecycle

### FLS in Action
The `Salesforce_Administrator` permission set marks `Requires_Login_Review__c`, `Is_Deactivation_Candidate__c`, and `Feature_License_Missing__c` visible — admins see these; a Standard User profile shouldn't.

### SecurityService (Apex)
Three methods power the login-audit loop:

```apex
SecurityService.flagDeactivationCandidates(activeUsers);      // marks stale users
List<Security_Audit__c> findings =
    SecurityService.buildLoginAuditFindings(usersNeedingReview);  // open findings
SecurityService.flagMissingPermissionSets(users, assignedSets);   // license gaps
```

Run block 3 of `scripts/apex/service-invocation.apex` to flag a stale user live.

### The Audit Objects
- **Security_Audit__c** — the findings ledger (Risk Level: High/Medium/Low, Status, Recommended Action)
- **User.Last_Security_Review__c / Requires_Login_Review__c** — review dates straight on the user
- Chrome of the daily OCD-friendly menu: `scripts/soql/security.soql` (login history, `AuthSession`, `LoginHistory`, permission set assignments, `SetupAuditTrail`)

```sql
SELECT Name, LastLoginDate, Is_Deactivation_Candidate__c
FROM User
WHERE Is_Deactivation_Candidate__c = true
```

---

## 5. Login Security Essentials

- **Login Hours & IP Ranges** — restrict who can log in, and from where, on the Profile
- **Password Policies** — complexity, expiration, lockout
- **Session Settings** — timeout, caching, MFA
- **Network Access** — trusted IP ranges; the exam red-flags any "any IP, no MFA" setup
- **Auth Config** — single sign-on (SSO) as the enterprise pattern

Enable MFA: it is the single most requested fix any admin implements first.

---

## 6. Hands-On Exercises

### Exercise 1: Read the Permission Set
Open `permissionsets/Salesforce_Administrator.permissionset-meta.xml`. Find the `FieldPermissions` blocks for `Admin_Task__c.Due_Date__c` and `User.Requires_Login_Review__c`.

### Exercise 2: Assign It to Yourself
1. Setup > Users > Permission Sets > `Salesforce_Administrator` > Manage Assignments
2. Assign your user, then confirm your tab set changes.

### Exercise 3: Flag a Candidate Without DML
Run anonymous Apex (block 3 of `service-invocation.apex`) and inspect the debug output for `Is_Deactivation_Candidate__c = true`.

### Exercise 4: Audit a User for Real
1. Open a User record you created
2. Set `LastLoginDate` behavior aside and instead check `LastLoginDate` via the Login History report
3. Run `SecurityService.buildLoginAuditFindings` on your own user and review the finding it builds

### Exercise 5: Query the Trail
Run `scripts/soql/security.soql` query 9 — `SELECT Id, Section, Action FROM SetupAuditTrail ORDER BY CreatedDate DESC LIMIT 20`.

---

## 7. Quiz — Test Your Knowledge

1. How many profiles can a user have? How many permission sets?
2. Can a sharing rule be *more* restrictive than OWD? Why or why not?
3. In a Private-OWD Account org, who can see a record that no one shares?
4. What metadata file ships the admin access recipe, and what license does it use?
5. Which of these blocks an "any IP, no MFA" login setup, and why?

---

## Next Phase

**[Phase 4: User Management & Org Setup](./04-users-org-setup.md)** — Provision users, apply onboarding defaults, and manage licenses, roles, and queues at org scale.