# Phase 8: Sales & Marketing Apps

## Learning Objectives
By the end of this phase, you will be able to:
- Configure lead statuses, record types, and assignment rules
- Model the opportunity stage lifecycle with forecast categories
- Use the RoadMap's sales fields (Deal Health, Competitor, Won Reason, Next Step Owner)
- Set up campaigns and attribute revenue from campaign members
- Answer the Sales & Marketing blueprint slice (≈10% of the exam)

---

## 1. The Lead Lifecycle (Admin View)

```
New       -> Watched -> Contacted -> Qualified   (converted!)
Recycle / Nurture  (never converted)
```

Admin levers:
- **Lead Status** picklist (drives record types on Lead)
- **Assignment Rules** → owner/queue per criteria (see Phase 7 pattern)
- **Lead Convert** → Account + Contact + Opportunity, with a conversion mapping
- **Duplicate prevention** at capture (Lead duplicates handled in Phase 5)

### RoadMap Lead fields
`Lead_Status_Reason__c` (why it stalled), `Market__c`, `Import_Source__c`, `Campaign_Source__c`, `Consent_Given__c`, `Data_Entry_Complete__c`, plus the quality trio (`Data_Quality_Score__c`, `Duplicate_Flag__c`).

---

## 2. Opportunities, Stages, and the Forecast

- **Stages** (picklist) plus **Probability** per stage — the pipeline math
- **Forecast Categories** — the quarterly liability: Pipeline / Best Case / Commit / Closed
- `Forecast_Category_Closed_Mismatch` validation rule stops *closed deals without a category*

Rule 3 in your validation set (`Forecast_Category_Closed_Mismatch`) is the practical guardrail; query 2 in `scripts/soql/sales-marketing-apps.soql` shows the forecast makeup:

```sql
SELECT Forecast_Category__c, COUNT(Id) n, SUM(Weighted_Expected_Revenue__c) weighted
FROM Opportunity
WHERE IsClosed = false GROUP BY Forecast_Category__c
```

### RoadMap Opportunity fields
`Deal_Health__c` (renewal vs at-risk signals), `Competitor__c`, `Won_Reason__c` (why it closed), `Next_Step_Owner__c`, `Sensitive_Data__c`, `Approver_Comments__c` (feeds Phase 7), plus the `Weighted_Expected_Revenue__c` formula and `Import_Batch_Number__c` (lineage).

### The Analytics tie-in
`AnalyticsService.pipelineSummary(opportunities)` computes **openAmount**, **closedWon**, and **weighted** — the exact trio the Case/Revenue dashboards chart.

---

## 3. Campaigns & Marketing Attribution
- **Campaign** = a marketing initiative; **CampaignMember** = the join
- Revenue attribution: count **Responded** members, sum their Opportunity amounts
- Admin duties: campaign record types, member status values, campaign reports

Run `scripts/soql/sales-marketing-apps.soql` query 6 for the attribution query.

---

## 4. Sales User Enablement

A good admin ships ready-made UX:
- **Sales Path** — guided stage navigation (Path)
- **Quick Actions** — Log a Call, New Opportunity, Email from anywhere
- **Email Templates** — canned responses squaring with the Compliance/Task fields
- **List Views** — dashboards-light for sales reps
- **Forecasting config** — if licensed, sync to stage + category

The exam button-press: "Where do you make a *list view default for all users*? Admin → List View → **Set as Filter Default**."

---

## 5. Hands-On Exercises

### Exercise 1: Standardize the Stage Records
Setup > Object Manager > Opportunity > Picklist. Confirm the six stages (Prospecting → Qualification → Needs Analysis → Proposal → Negotiation → Closed Won/Closed Lost) and their forecast categories match this repo's `Forecast_Category__c` values.

### Exercise 2: Weighted Math
Create two open Opportunities:
- A: Amount 10,000 @ 50%
- B: Amount 20,000 @ 30%

Check `Weighted_Expected_Revenue__c`. Then close A and watch it zero out (the formula's `IF(IsClosed, 0, …)`).

### Exercise 3: Run the Pipeline Summary
Run `scripts/apex/service-invocation.apex` block 6 and compare debug output with your two records' `openAmount`/`weighted`.

### Exercise 4: Campaign Membership
Create a Campaign, add members, mark one **Responded**, and open the campaign's "Opportunities with revenue" report.

### Exercise 5: Lead Funnel Check
Run `scripts/soql/sales-marketing-apps.soql` query 5 to see the lead-status distribution an admin reviews every Monday.

---

## 6. Quiz — Test Your Knowledge

1. What does lead conversion create, and what mapping must you check first?
2. Which field on Account contributes to pipeline reporting? (Hint: it's a formula.)
3. When is a Closed Won opportunity NOT in the weighted forecast sum?
4. Which object links Contacts to Campaigns for attribution?
5. Name three Opportunity fields an admin adds to track deal health.

---

## Next Phase

**[Phase 9: Service & Support Apps](./09-service-support.md)** — Case management, queues, SLAs, escalations, and the Service Cloud blueprint slice.