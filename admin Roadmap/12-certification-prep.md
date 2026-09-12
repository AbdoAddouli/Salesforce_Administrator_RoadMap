# Phase 12: Certification Prep

## Learning Objectives
By the end of this phase, you will be able to:
- Explain the Administrator exam blueprint and its six domains
- Use `Training_Question__c` as a living question bank
- Drive a `Study_Plan__c` to exam day with `CertificationPrepService`
- Build and score mock quizzes the same way the service does
- Register and sit the exam with a proven prep loop

---

## 1. The Exam (Updated Facts)

| Thing | Value |
|-------|-------|
| **Name** | Salesforce Administrator Certification |
| **Questions** | 100 |
| **Time** | 105 minutes |
| **Passing score** | ~65% (varies per administration) |
| **Cost** | ~$200 |
| **Registration** | **webassessor.com** (Trailhead profile → register → schedule) |
| **Delivery** | In-person or online proctored |

### Blueprint Weights (what actually appears)
| Domain | Weight |
|--------|--------|
| Configuration & Setup | ~25% |
| Object Manager & Lightning App Builder | ~24% |
| Data & Analytics | ~15% |
| Service & Support Automation | ~15% |
| Sales & Marketing Applications | ~10% |
| Productivity & Collaboration | ~11% |

Strategy from the weights: **Configuration & Setup + Object Manager** ≈ half the exam. That is exactly where this RoadMap's phases 2–7 live.

---

## 2. The Question Bank Object

`Training_Question__c` is your bank:

| Field | Purpose |
|-------|---------|
| **Training Question Number** | AutoNumber `TRQ-{00000}` |
| **Question Text / Options A–D / Correct Answer / Explanation** | The item + rationale |
| **Topic** | Blueprint domain (aligns to `AnalyticsService.domainCoverage`) |
| **Difficulty** | Easy / Medium / Hard — feed the `questionMix` report |

Coverage check (dashboard-mirror):

```sql
SELECT Topic__c, COUNT(Id) questions
FROM Training_Question__c
GROUP BY Topic__c ORDER BY questions DESC
```

---

## 3. The Study Plan Engine

`CertificationPrepService` is the robot coach:

```apex
Study_Plan__c plan = CertificationPrepService.startStudyPlan(learnerId, targetDate, hoursPerWeek);
CertificationPrepService.recordQuizResult(plan.Id, correct, total);   // updates Completed_Domains__c + status
List<Training_Question__c> quiz = CertificationPrepService.buildQuiz(bank, 10);  // deterministic slice
Map<String, Integer> mix = CertificationPrepService.questionMix(bank);
```

The `Study_Plan__c` fields: **Learner, Certification, Target Date, Status, Hours Per Week, Completed Domains**.

On `before insert`, `StudyPlanTrigger` stamps `Completed_Domains__c = '(none)'` — the trigger-light pattern you saw everywhere.

---

## 4. The Prep Loop (Weeks 6–8 of this plan)

1. **Baseline**: take a mock quiz (`scripts/soql/certification-prep.soql` query 1 hands you the bank)
2. **Gap-map**: coverage + difficulty reports tell you the weak domains
3. **Study by domain**: revisit the phase guides with the deficit bin
4. **Mock weekly**: `recordQuizResult` tracks progress on the plan
5. **Pressure drill**: 100 questions in 90 minutes (exam is 105 for the same bank)
6. **Trailhead + Trailmix**: pair guides with official hands-on orgs
7. **Book it**: `webassessor.com`; bring two IDs; read the proctor email

The `Certification_Progress_Dashboard` turns the loop into a cadence: On Track metrics, Learners Ready, Questions by Topic.

---

## 5. What the Exam Wants vs What the RoadMap Gives You
- **Sharing design questions** → Phase 3 (profiles/PS/OWD/rules) 🧠
- **Automation-by-tool** (which tool for which job) → Phases 6–7 (Flow-first, legacy-aware)
- **Field/object vocabulary** → Phases 1–2 (`__c`, master-detail, validation)
- **Data mechanics** (upsert/external IDs, duplicate merging) → Phase 5
- **Analytics prims** (formats, folders, bucket fields) → Phase 10
- **Release mechanics** (sandboxes, deployments) → Phase 11

Every chapter in the docs SPA links straight back to the phase guide that owns the answer.

---

## 6. Hands-On Exercises

### Exercise 1: Open the Bank
Run `scripts/soql/certification-prep.soql` query 1 with `SELECT Training_Question_Number__c, Topic__c, Correct_Answer__c` — review the topic mix.

### Exercise 2: Coverage Check
Run query 2 and compare vs the blueprint table above. Which domain is thinnest in your org?

### Exercise 3: Start a Study Plan
Call `CertificationPrepService.startStudyPlan` via anonymous Apex for your user, 12 weeks out, 6 hours/week.

### Exercise 4: Log a Mock
Create 10 `Training_Question__c` records, then `CertificationPrepService.buildQuiz(bank, 10)` and `recordQuizResult(plan.Id, 8, 10)` — watch `Completed_Domains__c` and status move.

### Exercise 5: Register
Open webassessor.com, confirm your profile, pick a date ≥ 4 weeks after your next mock. Schedule. Study. Pass.

---

## 7. Quiz — The Final Self-Check

1. What are the six blueprint domains and their weights?
2. Which RoadMap service builds mock quizzes deterministically?
3. What does `recordQuizResult` do to a Study Plan record?
4. Which trigger stamps `(none)` into `Completed_Domains__c`?
5. Where do you register, and what is the passing threshold?

---

## You Did It 🎉

The RoadMap is a loop, not a line: **fundamentals → data → security → users → data ops → automation → approvals → apps → analytics → releases → exam**. Your day-one admin day looks exactly like these phases. Go run the org — `sf deploy`, open the dashboards, and ship the next change to production in the freeze window you chose.

**Before Summarizing…** — [Go back to Phase 1](./01-fundamentals.md) or start the Docs Academy (`docs/index.html`) and select Phase 12 from the curriculum sets.