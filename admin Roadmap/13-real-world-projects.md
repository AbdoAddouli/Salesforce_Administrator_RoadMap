# Phase 13: Real-World Projects

## Learning Objectives
By the end of this phase, you will be able to:
- Translate a business brief into a Salesforce configuration, not the other way round
- Combine data model, security, automation, data ops, analytics and release skills into one coherent build
- Self-verify a build against acceptance criteria before opening the reference solutions
- Practice the build → validate → demo cycle employers actually pay for

---

> **What this phase is.** Five end-to-end projects. Each one fuses skills from many
> earlier phases on purpose — a capstone, not new theory. Build each fully in your
> own org, run the acceptance queries, and only then open Phase 14 for the gated solutions.

| # | Project | Fuses phases |
|---|---------|-------------|
| 1 | Sales Pipeline from Scratch | 1–6, 8, 10 |
| 2 | Service & Support Operations | 3, 4, 6, 9, 10 |
| 3 | Data Migration & Dedupe | 5, 6, 7, 10, 11 |
| 4 | Marketing Attribution & Lead Nurturing | 3, 4, 6, 8, 10 |
| 5 | Security Posture & Change Management | 2, 3, 4, 11 |

---

## Build 1 · Sales Pipeline from Scratch

> Salt & Pine is a 40-person B2B software company that has been "managing" deals in
> spreadsheets. "Give sales one pipeline we can all trust, from first meeting to Closed Won."

### Build it
1. **App** — App Manager → edit Sales → shape navigation for Reps, Managers and the VP.
2. **Deal shape** — add to Opportunity: `Deal_Type__c` (New / Expansion / Renewal),
   `Max_Discount__c` (%), `Commission_Forecast__c`, `Lost_Reason__c`, `Champion_Name__c`.
3. **Territory** — custom object `Sales_Territory__c`: `Region__c` (EMEA / AMER / APAC) +
   Manage User lookup; Account gets a territory lookup.
4. **Validation** — `Max_Discount__c ≤ 40`; `Lost_Reason__c` required when closed lost;
   `Amount > 0` on Closed Won.
5. **Security** — Sales Rep profile hides `Commission_Forecast__c` via FLS; Sales Manager role
   above Reps; a sharing rule opens a territory's accounts to its manager's team.
6. **Automation** — record-triggered Flow creates a "Call the champion" task when Stage →
   Proposal; an approval process routes deals > 100k to the VP.
7. **Data** — load 20 accounts + 30 opportunities (Data Import Wizard); Account duplicate
   rule (Name + Phone); merge one test duplicate.
8. **Analytics** — Pipeline by Stage, Won vs Lost, Weighted Pipeline dashboards (3 widgets).

### Acceptance — done when
- A Rep sees only their own pipeline and creates a deal from a Lead in under two minutes.
- Managers see the team pipeline via the role hierarchy; the VP sees everything.
- No deal closes above 40% — the validation blocks the save.
- Every won deal's champion was called within 24h of Proposal.
- Zero duplicate Accounts in the pipeline report.

---

## Build 2 · Service & Support Operations

> Northwind Support sells a 24/5 plan. Cases arrive by phone, email and web and rot in a
> shared inbox. Route the work, enforce an SLA, escalate stuck tickets, show ops the backlog.

### Build it
1. **Case shape** — Status (New, Assigned, Working, Escalated, Closed); add
   `Resolution_Notes__c`, `First_Response_Hours__c`, `Product__c`.
2. **Record types** — Phone, Email, Web; each drives layouts and routing.
3. **Routing** — a Support queue per priority + an assignment rule that places High-priority
   cases into the right queue.
4. **SLA** — a 24-hour entitlement with a "First response" milestone, attached to plan-account entitlements.
5. **Automation** — a record-triggered Flow escalates cases stuck 12h to the on-call manager
   (task + Status = Escalated); an email alert on case creation.
6. **Knowledge** — 3 published articles (reset password, license key, billing) on the case page.
7. **Guardrails** — validation blocks closing a case with open tasks or without resolution notes.
8. **Analytics** — dashboards: volume by record type, average age, open by priority.

### Acceptance — done when
- A web case lands in the right queue within a minute.
- Every plan-account case carries the 24h first-response milestone.
- A 12-hour-old open case escalates automatically.
- A case cannot close with open tasks or missing resolution notes.
- The ops dashboard shows today's backlog at a glance.

---

## Build 3 · Data Migration & Dedupe

> Globex moves from an old CRM. "Move us over, don't lose a row, don't create 400 duplicates."

### Build it
1. **Schema** — External ID `Legacy_Id__c` on Account, Contact and Opportunity.
2. **Prepare** — normalize the source file (strip spaces from the ID, trim names) — the
   `DataManagementService` pattern from Phase 5.
3. **Spot-check** — run sample SOQL before loading.
4. **Load** — Data Loader upsert keyed on `Legacy_Id__c`: 100 accounts → 150 contacts → 120 opps.
5. **Validate** — a Flow flags records missing Owner/Phone/Website → `Validation_Status__c = Needs Attention`.
6. **Journal** — `Data_Migration_Batch__c` records source count, target count, status (journaled batch).
7. **Dedupe** — duplicate + matching rules (Name + Phone, then Website); merge flagged set.
8. **Prove** — Data Migration Summary report + a data-quality scorecard.

### Acceptance — done when
- Source count = target count, duplicates = 0.
- Field history shows no overwritten External IDs.
- Duplicates merged; matching rules block new ones.
- The batch journal logged progress for audit.
- The whole load replays from scratch in under an hour.

---

## Build 4 · Marketing Attribution & Lead Nurturing

> Aforma runs webinars and Google Ads. Which one actually makes money — and stop buying
> leads that go cold.

### Build it
1. **Campaigns** — 2026 Spring Webinar, Google Search — Competitor Terms; member statuses
   Sent, Responded, Converted, Accepted.
2. **Lead lifecycle** — Lead Sources + Status; conversion mapping to Account/Contact/Opportunity.
3. **Influence** — enable Campaign Influence (primary-campaign model); add influenced-opportunity fields.
4. **Nurture** — Flow: Responded webinar leads join "Nurture — Product Updates", get a
   scheduled email alert, escalate a level on re-engagement.
5. **Security** — hide Campaign `Budget__c` from reps via FLS.
6. **Prove** — Campaign ROI report (cost vs influenced revenue) + conversion funnel dashboard.

### Acceptance — done when
- Every converted opportunity names its influencing campaign.
- The webinar campaign shows positive ROI; the ads campaign is justified or killed.
- Nurtured leads re-engage without human hand-holding.
- Reps cannot see budgets; marketers can — via the right profiles.

---

## Build 5 · Security Posture & Change Management

> "Our auditor wants proof nobody saw revenue they shouldn't, and changes ship with
> tests, not surprises."

### Build it
1. **OWD** — Accounts and Cases Private; document the sharing matrix.
2. **Sharing** — role hierarchy + one sharing rule opening EMEA to its manager; export
   approval reusing the `Data_Export_Approval` pattern.
3. **FLS** — hide Revenue, `Bank_Account__c`, Commission from agents; prove via Field Accessibility.
4. **Users** — login hours + IP ranges for support; delegated admin for the helpdesk.
5. **Audit** — login history + `SecurityService` inactive-user candidates (90 days).
6. **Releases** — Developer sandbox → change set / SFDX package → full tests → promote in a
   freeze window.
7. **Prove** — security-posture report + release runbook entry.

### Acceptance — done when
- An agent's Account query returns null for Revenue and `Bank_Account__c`.
- The EMEA manager sees only their team via the sharing rule — the matrix proves it.
- Login history shows exactly who signed in, when, from where; inactive users are flagged.
- A change promoted UI → sandbox → tests → production with zero failures and a runbook note.

---

## The Acceptance Audit (do this before Phase 14)

Run these in Developer Console → Query Editor and do not open Phase 14 until they return
what your build promised. Any unexpected row is a fix-queue item.

```sql
SELECT StageName, COUNT(Id) FROM Opportunity GROUP BY StageName

SELECT Id, Subject, Status, CreatedDate
FROM Case
WHERE Status != 'Closed' AND CreatedDate < LAST_N_DAYS:2
  AND Id NOT IN (SELECT WhatId FROM Task WHERE Status != 'Completed')

SELECT COUNT(Id) FROM Account
SELECT Name, COUNT(Id) n FROM Account GROUP BY Name HAVING COUNT(Id) > 1

SELECT UserName, UserRole.Name, IsActive, LastLoginDate
FROM User WHERE IsActive = true AND LastLoginDate < LAST_N_DAYS:90
```

Also do the traceability sweep: for each deliverable, name the phase (1–12) that taught it.
Any gap is your next study topic.

```sql
-- scripts/soql/real-world-projects.soql holds the full set
```