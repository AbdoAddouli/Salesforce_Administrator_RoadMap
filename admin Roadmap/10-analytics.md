# Phase 10: Analytics

## Learning Objectives
By the end of this phase, you will be able to:
- Choose a report type and format (summary vs matrix vs tabular)
- Folders, sharing, and the classics (bucket fields, charts, filters)
- Read the seven shipped reports as XML on disk
- Build the four shipped dashboards and their filter languages
- Mirror analytics in SOQL with aggregation + `AnalyticsService`

---

## 1. The Report Stack

**Report Type** → defines the objects (report type = primary + related objects)

| Format | Use it for | Shows |
|--------|-----------|-------|
| **Tabular** | Raw listing | Columns only, no grouping |
| **Summary** | Grouping + subtotals | Group by + chart-friendly |
| **Matrix** | Two dimensions | Row/column groupings |

### The Seven RoadMap Reports (`reports/`)

| Report | Format | Primary object | Ask it answers |
|--------|--------|----------------|----------------|
| `Data_Quality_Score_Report` | Summary | Account | Who scored below 80? |
| `Case_Volume_by_Priority` | Summary | Case | Volume by priority |
| `Security_Audit_Status` | Summary | Security_Audit__c | Open findings by risk |
| `User_Security_Review_Report` | Tabular | User | Login/review posture |
| `Open_Migration_Batches` | Summary | Data_Migration_Batch__c | Stuck loads |
| `Admin_Task_Completion` | Summary | Admin_Task__c | Board health by type |
| `Training_Question_Coverage` | Summary | Training_Question__c | Quiz bank gaps by topic/difficulty |

Every XML follows the same skeleton — `<columns>` with `function` (grouping/`sum`/`avg`) and a `<folder>` (`Admin_Reports`):

```xml
<columns>
    <field>ACCOUNT.NAME</field>
    <aggregate>Grouping</aggregate>
</columns>
```

---

## 2. Folders & Sharing
- **Report folders** control who runs reports; **dashboard folders** control who views.
- Folders: Private / Public (view-all) / Hidden (view only, in needs)
- The `Admin_Reports` and `Admin_Dashboards` folders ship **public** so the Academy demo works out of the box.

---

## 3. Dashboard Patterns

The four dashboards live in `dashboards/`:

| Dashboard | Ask | Components |
|-----------|-----|-----------|
| **Security_Posture_Dashboard** | Am I secure? | High Risk Findings metric, Users Needing Review metric, Audits by Type bar |
| **Data_Quality_Dashboard** | Is my data clean? | Duplicates Flagged metric, Accounts by Validation Status bar, Needs Review metric |
| **Case_Operations_Dashboard** | Is support healthy? | Open High Priority metric, Cases by Priority donut, Pending Data Exports metric |
| **Certification_Progress_Dashboard** | Are learners ready? | Study Plans On Track metric, Learners Ready metric, Questions by Topic bar |

Component XML is filter-first:

```xml
<components>
    <chartType>metric</chartType>
    <filter>Risk_Level__c = 'High' AND Status__c != 'Resolved'</filter>
</components>
```

`runningUserId` 005000000000001 and `status` draft keep the shipped dashboards deployable in any DEV/scratch org.

---

## 4. The SOQL Mirror

Every dashboard question has a query — the discipline of `scripts/soql/analytics.soql`:

```sql
SELECT Status__c, COUNT(Id) plans, SUM(Hours_Per_Week__c) plannedHours
FROM Study_Plan__c GROUP BY Status__c

SELECT CALENDAR_YEAR(CreatedDate) yr, CALENDAR_MONTH(CreatedDate) mon, COUNT(Id) n
FROM Case
WHERE CreatedDate = LAST_N_MONTHS:6
GROUP BY CALENDAR_YEAR(CreatedDate), CALENDAR_MONTH(CreatedDate)
ORDER BY yr, mon
```

And the Apex twin — `AnalyticsService.pipelineSummary`, `domainCoverage`, `averageFirstResponseHours`.

---

## 5. Exam Favorites
- **Bucket fields** ≤ 20 custom buckets per report, in summary/matrix only
- **Chart types** bar/line/donut/metric; a "metric" shows one number
- **Report filters** vs report *formulas* difference
- **Dashboard component filter** syntax mirrors report filters
- **Join reports** only across standard objects

---

## 6. Hands-On Exercises

### Exercise 1: Deploy and Open
`sf project deploy start --source-dir force-app/main/default` then open the **Admin_Reports** and **Admin_Dashboards** folders in your org.

### Exercise 2: Rebuild a Report in Setup
Recreate `Data_Quality_Score_Report` by hand — group by `Validation_Status__c`, metric `Data_Quality_Score__c` AVG, in folder `Admin_Reports`.

### Exercise 3: Filter Language Check
Open `Security_Posture_Dashboard.dashboard-meta.xml` and translate each `<filter>` back into a report filter you would type in the UI.

### Exercise 4: SOQL-to-Dashboard
Create the "Questions by Topic" aggregation in the query editor, then compare the output to the `Training_Question_Coverage` report.

### Exercise 5: Apex Snapshot
Run `scripts/apex/service-invocation.apex` block 6 — the `pipelineSummary` map is exactly what a dashboard component would chart.

---

## 7. Quiz — Test Your Knowledge

1. Which report format supports grouping *and* subtotals?
2. What is the report-type definition?
3. Which dashboard raises "Pending Data Exports", and on which object?
4. In what report formats can you add bucket fields?
5. What does `AnalyticsService.domainCoverage` return?

---

## Next Phase

**[Phase 11: Documentation, Sandboxes & Release Management](./11-release-mgmt.md)** — Sandbox types, change sets vs SFDX, deploy checks, and the release freeze hour.