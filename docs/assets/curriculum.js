/* =============================================================================
 * Admin Academy — Curriculum data
 * 14 phases mirroring the 'admin Roadmap/' guides in full: objectives, lessons,
 * exercises, projects and quizzes are embedded inline — the GitHub link is only
 * a reference to the same source chapters, never a requirement.
 * ============================================================================= */

const GUIDE = 'https://github.com/AbdoAddouli/Salesforce_Administrator_RoadMap/blob/main/admin%20Roadmap/';

const ACADEMY = [

/* ─────────────────────────── PHASE 1 ─────────────────────────── */
{
  id: 'fund', n: 1, title: 'Administrator Fundamentals', icon: '☁️', color: '#00A1E0',
  tagline: 'Role, platform & the admin toolkit',
  guide: '01-fundamentals.md',
  art: [
    { label: 'AdminFundamentalsTest.cls', href: 'force-app/main/default/classes/AdminFundamentalsTest.cls' },
    { label: '5 custom objects', href: 'force-app/main/default/objects' },
    { label: 'Admin future SOQL set', href: 'scripts/soql/fundamentals.soql' },
  ],
  objectives: [
    'Explain what a Salesforce Administrator does',
    'Navigate Setup, Object Manager & the Developer Console',
    'Describe objects, fields, records & relationships',
    'Distinguish declarative vs programmatic configuration',
  ],
lessons: [
    {
      title: 'What is a Salesforce Administrator?', mins: 8,
      blocks: [
        { t: 'p', x: `A Salesforce Administrator configures, maintains, and optimizes an org. You are the bridge between the business and the platform: salesops asks for a dashboard, support wants a new picklist value, legal needs an audit trail — and you deliver it.` },
        { t: 'h', x: 'The Admin Toolkit' },
        { t: 'list', items: [
          `Setup — the admin backend reached from the gear icon in the top right`,
          `Object Manager — create and shape standard and custom objects`,
          `Flows — automate business processes without code`,
          `Reports & Dashboards — turn data into decisions`,
          `Data Tools — Data Import Wizard, Data Loader, duplicate management`,
          `Security Controls — profiles, permission sets, sharing rules, field-level security`,
        ]},
        { t: 'callout', kind: 'tip', x: `The Salesforce Administrator exam (~$200, 100 questions, 105 minutes, 65% to pass) tests exactly these skills. Register at webassessor.com and book 4+ weeks out.` },
        { t: 'selfcheck', q: `Which is nearly always the right automation default: a Flow or custom Apex?`, a: `The Flow. Flow Builder is the default automation tool; Apex is for requirements flows cannot meet.` },
      ]
    },
    {
      title: 'The Core Data Model', mins: 12,
      blocks: [
        { t: 'p', x: `Everything in Salesforce is built on a data model. Think of objects as database tables, fields as columns, and records as rows. Custom objects and custom fields end in __c.` },
        { t: 'table', head: ['Object', 'Purpose', 'Key Fields'], rows: [
          [ 'Account', 'A company you do business with', 'Name, Industry, Annual Revenue, Billing Address' ],
          [ 'Contact', 'A person associated with an Account', 'First/Last Name, Email, Phone, Mailing Address' ],
          [ 'Lead', 'An unqualified prospect', 'Company, Name, Status, Lead Source' ],
          [ 'Opportunity', 'A potential deal', 'Name, Stage, Amount, Close Date, Probability' ],
          [ 'Case', 'A support issue', 'Subject, Status, Priority, Contact' ],
          [ 'Activity (Task & Event)', 'Reminders and meetings on any record', 'Subject, Due Date, Status' ],
        ]},
        { t: 'h', x: 'Relationships' },
        { t: 'code', lang: 'text', x: `Account ── 1:N ──▶ Contact
Account ── 1:N ──▶ Opportunity
Account ── 1:N ──▶ Case
Opportunity ── 1:N ──▶ OpportunityLineItem (Products)
User   ── 1:N ──▶ Tasks / Events / Study_Plans` },
        { t: 'h', x: "The RoadMap's Own Data Model" },
        { t: 'table', head: ['Object', 'What it tracks'], rows: [
          [ 'Admin_Task__c', 'The admin task board (due dates, priorities, owners)' ],
          [ 'Security_Audit__c', 'Security findings with risk level, status and recommended action' ],
          [ 'Data_Migration_Batch__c', 'Every import/export run (record counts, success/failure)' ],
          [ 'Training_Question__c', 'The certification question bank (topic, difficulty, 4 options)' ],
          [ 'Study_Plan__c', 'Per-learner certification pacing (target date, hours per week)' ],
        ]},
        { t: 'callout', kind: 'tip', x: `The repository ships exactly these five custom objects — you'll use them daily as a roadmapping Administrator.` },
      ]
    },
    {
      title: 'Declarative vs Programmatic', mins: 10,
      blocks: [
        { t: 'p', x: `Most admin work is declarative: you configure rather than code.` },
        { t: 'table', head: ['', 'Declarative', 'Programmatic'], rows: [
          ['Tooling', 'Flows, Validation Rules, Reports, Permission Sets', 'Apex triggers & classes, Lightning Web Components'],
          ['Skills', 'Click-not-code configuration', 'Code + governor limits'],
          ['Share of admin work', '80%+ of everyday tasks', 'Complex logic & integrations'],
        ]},
        { t: 'p', x: `The RoadMap shows both: the 8 flows and all the validation rules in this repository are declarative; the 21 Apex classes (10 services + 11 tests) are programmatic, and the thin triggers simply delegate to them.` },
        { t: 'callout', kind: 'warn', x: `The exam expects you to know when to use which — Flow Builder is almost always the right default; use Apex only for what flows cannot express.` },
        { t: 'selfcheck', q: `Which approach fits "call an external REST service and parse JSON inside a transaction"?`, a: `Programmatic (Apex). Flows can call invocable Apex, but the parsing itself lives in code.` },
      ]
    },
    {
      title: 'Navigation & Setup Habits', mins: 10,
      blocks: [
        { t: 'num', items: [
          `App Launcher (waffle icon) — switch between apps (Sales, Service, Admin Academy)`,
          `Setup (gear icon) — search with the Quick Find box: it finds anything. Get-ChildItem force-app is your offline version of the metadata.`,
          `Object Manager — the metadata home of every object`,
          `Record pages — the Dynamic Forms surface your fields`,
          `Developer Console — Query Editor, Anonymous Apex, debug logs`,
        ]},
        { t: 'p', x: `Salesforce ships three major releases per year (Spring, Summer, Winter). Every phase in this RoadMap assumes your org is on a recent API version (68.0) — set in sfdx-project.json, class & trigger metas, flows and the manifest.` },
        { t: 'selfcheck', q: `Where do you go to create a new custom field on Account?`, a: `Setup → Object Manager → Account → Fields & Relationships → New.` },
      ]
    },
    {
      title: 'Hands-On Labs: Deploy, Explore, Query', mins: 20,
      blocks: [
        { t: 'h', x: 'Lab 1 — Deploy or connect' },
        { t: 'num', items: [
          `If you only have this repo: open README.md, then ARCHITECTURE.md to see the layering`,
          `If you have a scratch/DEV org: sf project deploy start --source-dir force-app/main/default`,
          `Log in, open the App Launcher and browse Setup`,
        ]},
        { t: 'h', x: 'Lab 2 — Explore the RoadMap objects' },
        { t: 'num', items: [
          `Object Manager → Admin_Task__c → Fields & Relationships`,
          `Note the AutoNumber AT-{00000} and the 8 task fields`,
          `Find Data_Migration_Batch__c, Security_Audit__c, Training_Question__c, Study_Plan__c`,
          `Check the Admin_Configuration__mdt custom metadata record (5 org-wide guardrails)`,
        ]},
        { t: 'h', x: 'Lab 3 — Run your first SOQL' },
        { t: 'code', lang: 'sql', x: `SELECT Name, Task_Type__c, Status__c, Due_Date__c FROM Admin_Task__c LIMIT 10` },
        { t: 'p', x: `Then open scripts/soql/fundamentals.soql and run queries 1–5.` },
      ]
    },
    {
      title: 'Key Terms Glossary', mins: 6,
      blocks: [
        { t: 'table', head: ['Term', 'Definition'], rows: [
          [ 'Org', 'Your Salesforce instance and all its configuration and data' ],
          [ 'Metadata', 'The configuration of your org (objects, fields, flows, code)' ],
          [ 'Declarative', 'Clicks-not-code configuration' ],
          [ 'Programmatic', 'Code-based development (Apex, LWC)' ],
          [ 'SObject', 'Any Salesforce object — standard or custom (__c)' ],
          [ 'CRUD', 'Create, Read, Update, Delete — record access' ],
          [ 'FLS', 'Field-Level Security — who can see/edit a field' ],
          [ 'Governor Limits', 'Platform quotas (query rows, DML, CPU)' ],
          [ 'SFDX', 'The modern Salesforce developer toolchain' ],
          [ 'API Version', 'The interface your code is compiled against (this repo: 68.0)' ],
        ]},
        { t: 'selfcheck', q: `What's the difference between CRUD and FLS?`, a: `CRUD is record access — who can create/read/update/delete a record. FLS is field access — who can see or edit a specific field. The two are enforced independently.` },
      ]
    },
    {
      title: 'SOQL Practice', mins: 10,
      blocks: [
        { t: 'p', x: `SOQL is the query language for Salesforce. Run these in Developer Console → Query Editor.` },
        { t: 'code', lang: 'sql', x: `SELECT Name, Data_Quality_Score__c, Validation_Status__c FROM Account LIMIT 10
SELECT COUNT(Id) n FROM Security_Audit__c WHERE Audit_Date__c = THIS_MONTH
SELECT Name, Email, Phone, Account.Name FROM Contact WHERE AccountId != NULL LIMIT 20` },
        { t: 'callout', kind: 'tip', x: `scripts/soql/fundamentals.soql holds ten graduated queries — including a cross-object query on Users → Study_Plans__r.` },
        { t: 'selfcheck', q: `Which clause limits the number of rows returned by a query?`, a: `LIMIT — e.g. SELECT Name FROM Account LIMIT 10.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Map the admin toolkit in Setup', level: 'Easy', mins: 10,
      brief: `A new sales admin joins the team. Point them at the exact Setup locations for the five declarative tools an admin uses daily.`,
      steps: [
        `Log in to your Developer Edition org and open Setup from the gear icon (top right).`,
        `Use Quick Find to open Object Manager, then the three automation tools: Flows, Validation Rules and Approval Processes.`,
        `Find the two data tools: Data Import Wizard and Data Loader.`,
        `Find where Field-Level Security lives (Object Manager → any object → Field Accessibility).`,
      ],
      solution: `Object Manager → Setup → Object Manager.
Flows → Setup → Flows (under Automation).
Validation Rules → Setup → Object Manager → <object> → Validation Rules.
Approval Processes → Setup → Approval Processes.
Data Import Wizard → Setup → Data Import Wizard.
Data Loader → a desktop app installed separately (Setup → Data Loader links out to it).
Field-Level Security → Setup → Object Manager → Account → Fields & Relationships → Field Accessibility.
The Administrator exam tests exactly these paths — nail them from week one.`,
    },
    {
      n: 2, type: 'exercise', title: 'Declarative vs programmatic — draw the line', level: 'Easy', mins: 10,
      brief: `For each scenario, pick declarative (Flow / Validation Rule / Permission Set) or programmatic (Apex), plus a one-line justification.`,
      steps: [
        `Create three onboarding tasks when a new user is created.`,
        `Roll up the total of won opportunities on an Account.`,
        `Call an external REST service and parse JSON inside a transaction.`,
        `Let the accounts team approve a data export.`,
      ],
      solution: `Three onboarding tasks → declarative. The shipped New_User_Onboarding_Tasks flow does exactly this.
Roll-up on Account → declarative if the relationship is Master-Detail (roll-up summary field); otherwise Apex.
External REST + JSON parsing → programmatic (Apex). Flows can call invocable Apex, but the parsing lives in code.
Data export approval → declarative. The Data_Export_Approval_Request flow + Data_Export_Approval process do it end to end.
Rule of thumb: Flow Builder is the default; Apex is for what flows cannot express.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Deploy the RoadMap to your own org', level: 'Medium', mins: 25,
      brief: `Actually run the learning lab: authenticate an org, deploy all metadata, and prove the five custom objects exist with a SOQL query.`,
      steps: [
        `Install Salesforce CLI and run: sf org login web --alias myDevOrg`,
        `Deploy everything: sf project deploy start --source-dir force-app/main/default --target-org myDevOrg --wait 15`,
        `Open the org → Object Manager and confirm the five custom objects: Admin_Task__c, Security_Audit__c, Data_Migration_Batch__c, Training_Question__c, Study_Plan__c.`,
        `In Developer Console → Query Editor, run the fundamentals query and confirm it returns without error.`,
      ],
      solution: `The two commands:
sf org login web --alias myDevOrg
sf project deploy start --source-dir force-app/main/default --target-org myDevOrg --wait 15

Then, in Developer Console → Query Editor:

SELECT Name, Task_Type__c, Status__c, Due_Date__c FROM Admin_Task__c LIMIT 10

Zero rows is the correct starting state — the objects exist, and the triggers and flows start producing data as you insert records. Confirm the alias is alive anytime with: sf org list`,
    },
  ],
  quiz: {
    title: 'Phase 1 Quiz · Fundamentals', mins: 5,
    questions: [
      { q: `Which three standard objects make up the "core data model" set an admin configures daily?`,
        opts: [`Account, Contact, Opportunity`, `Account, Contact, Case`, `Campaign, Quote, Order`, `User, Role, Queue`], a: 0, why: `Account (company), Contact (person), Opportunity (deal) — plus Lead and Case.` },
      { q: `What is a "record" in Salesforce?`,
        opts: [`A column in a table`, `A single row of data in an object`, `A type of object`, `A field definition`], a: 1, why: `Objects = tables, fields = columns, records = rows.` },
      { q: `Custom objects and custom fields end in…`,
        opts: [`_c`, `__c`, `_x`, `__t`], a: 1, why: `The __c suffix marks custom metadata; a missing suffix means a standard API name.` },
      { q: `Which skill set describes "clicks-not-code" configuration?`,
        opts: [`Programmatic`, `Declarative`, `Analytical`, `Administrative`], a: 1, why: `Flow Builder, validation rules and permission sets are the declarative stack.` },
      { q: `This repository targets which API version?`,
        opts: [`59.0`, `62.0`, `68.0`, `58.0`], a: 2, why: `API 68.0 across sfdx-project.json, metas, flows and the manifest.` },
      { q: `What does CRUD stand for?`,
        opts: [`Create, Read, Update, Delete`, `Copy, Retrieve, Upload, Download`, `Create, Review, Update, Discard`, `Connect, Refresh, Update, Delete`], a: 0, why: `CRUD = Create, Read, Update, Delete — the four record-level access operations.` },
      { q: `Which object stores customer support issues?`,
        opts: [`Account`, `Lead`, `Case`, `Campaign`], a: 2, why: `Case is the standard object for a support issue; Leads are prospects and Accounts are companies.` },
      { q: `Which of these is one of the five custom objects shipped in this RoadMap?`,
        opts: [`Campaign_Member__c`, `Security_Audit__c`, `Product__c`, `Case_Event__c`], a: 1, why: `The five RoadMap objects are Admin_Task__c, Security_Audit__c, Data_Migration_Batch__c, Training_Question__c and Study_Plan__c.` },
    ]
  }
},

/* ─────────────────────────── PHASE 2 ─────────────────────────── */
{
  id: 'model', n: 2, title: 'Object Manager & Data Model', icon: '🗂️', color: '#7C3AED',
  tagline: 'Custom objects, fields & validation',
  guide: '02-data-model.md',
  art: [
    { label: 'DataModelService', href: 'force-app/main/default/classes/DataModelService.cls' },
    { label: '6 validation rules', href: 'force-app/main/default/objects' },
    { label: 'Custom fields on standard objects', href: 'force-app/main/default/objects' },
    { label: 'Data-model SOQL', href: 'scripts/soql/data-model.soql' },
  ],
  objectives: [
    'Create custom objects with the __c convention',
    'Pick the right field type for the right job',
    'Design lookups vs master-detail relationships',
    'Write and know when to skip validation rules',
  ],
  lessons: [
    {
      title: 'The __c Convention', mins: 8,
      blocks: [
        { t: 'p', x: `Custom objects end in __c (e.g. Admin_Task__c) and so do custom fields. Standard objects (Account, Case, User, Task) never carry the suffix. The exam loves this distinction.` },
        { t: 'table', head: ['Object', 'Key design'], rows: [
          ['Admin_Task__c', 'AutoNumber AT-{00000} + Task Type/Status/Due Date/Priority'],
          ['Security_Audit__c', 'AutoNumber SA-{00000} + Risk Level/Finding/Audit Date'],
          ['Data_Migration_Batch__c', 'Counters + Status + Started/Completed At'],
          ['Training_Question__c', 'AutoNumber TRQ-{00000} + 4 options + Correct Answer'],
          ['Study_Plan__c', 'Learner + Certification + Target Date + Hours Per Week'],
        ]},
        { t: 'callout', kind: 'tip', x: `You also ship a custom metadata type Admin_Configuration__mdt (Max Login Attempts, Alert Email, Auto Close Stale Days, Enable Login Audit, Default Report Folder) and a platform event Data_Migration_Event__e — more on both in later phases.` },
        { t: 'selfcheck', q: `A user asks for a "task number". Which field type do you choose?`, a: `AutoNumber with a format like AT-{00000} — human-readable, stable, read-only.` },
      ]
    },
    {
      title: 'Choosing Field Types', mins: 12,
      blocks: [
        { t: 'table', head: ['Type', 'Use it for', 'Trap'], rows: [
          ['Text', 'Short values', 'Max 255 chars — use Long Text for more'],
          ['Long Text Area', 'Paragraphs, notes', 'Not available in SOQL GROUP BY / sort'],
          ['Number', 'Quantities, scores', 'Precision matters (Data Quality Score)'],
          ['Currency', 'Money', 'Amount vs formula currency fields'],
          ['Formula', 'Derived values', 'IF(IsClosed, 0, ROUND(Amount*Probability, 2))'],
          ['Date / Date-Time', 'Points in time', 'Dates have no timezone; Date-Times do'],
          ['Picklist', 'Enumerated values', 'Adds API value — use over free text'],
          ['Checkbox', 'Yes/No flags', 'Like Duplicate_Flag__c, Consent_Given__c'],
          ['AutoNumber', 'Sequence keys', 'Format strings like AT-{00000}'],
          ['Lookup / Master-Detail', 'Relationships', 'Master-detail cascades delete + sharing'],
        ]},
        { t: 'code', lang: 'text', x: `// The Weighted Expected Revenue formula shipped in this repo
IF(IsClosed, 0, ROUND(Amount * Probability, 2))` },
        { t: 'selfcheck', q: `Which field type would you use so closing deals exit the forecast automatically?`, a: `A formula field — no DML needed, recomputes on save.` },
      ]
    },
    {
      title: 'Relationships in SOQL', mins: 12,
      blocks: [
        { t: 'p', x: `Relating data is the heart of the model. SOQL has two directions: child-to-parent (dot notation) and parent-to-child (inner query).` },
        { t: 'code', lang: 'sql', x: `-- Parent → Child (inner query)
SELECT Name, (SELECT Name, Amount, StageName FROM Opportunities)
FROM Account WHERE Id IN (SELECT AccountId FROM Opportunity)

-- Child → Parent (dot notation)
SELECT Name, Account.Name, Account.Industry FROM Contact WHERE AccountId != NULL` },
        { t: 'callout', kind: 'warn', x: `Roll-up summary fields only work on Master-Detail relationships — never Lookups.` },
        { t: 'p', x: `Admins also run the "missing critical fields" query weekly — catch Contacts with neither email nor phone before you call a data set clean.` },
        { t: 'code', lang: 'sql', x: `SELECT Name, Account.Name, Email, Phone
FROM Contact WHERE Email = NULL AND Phone = NULL` },
        { t: 'selfcheck', q: `Get each Account with its Contacts using one query.`, a: `SELECT Name, (SELECT Name FROM Contacts) FROM Account.` },
      ]
    },
    {
      title: 'Validation Rules', mins: 14,
      blocks: [
        { t: 'p', x: `Validation rules are formulas that reject bad saves. This repo ships six — read them under objects/<Object>/validationRules/.` },
        { t: 'table', head: ['Rule', 'Object', 'Blocks'], rows: [
          ['Negative_Data_Quality_Score', 'Account', 'Scores below zero'],
          ['Require_Email_Or_Phone', 'Contact', 'No email or phone'],
          ['Forecast_Category_Closed_Mismatch', 'Opportunity', 'Closed without forecast category'],
          ['Require_Resolution_For_Closed', 'Case', 'Closed with no resolution'],
          ['High_Priority_Requires_Subject', 'Case', 'High priority + blank subject'],
          ['Prevent_Future_Due_On_Completion', 'Task', 'Completed task still dated in the future'],
        ]},
        { t: 'callout', kind: 'warn', x: `Skip (don't delete) validation rules during bulk data loads where the rule doesn't apply yet — fix the data upstream instead. The other classic case is sandbox seeding: validation rules can block demo data, so suspend the rule for the seed run.` },
        { t: 'selfcheck', q: `A team closes Cases without any resolution notes. Which rule do you add?`, a: `Require_Resolution_For_Closed — blocks the save when Status = Closed and the resolution is blank.` },
      ]
    },
    {
      title: 'Schema Best Practices', mins: 10,
      blocks: [
        { t: 'list', items: [
          `Start from the standard model — only create custom objects/fields when the standard ones genuinely miss`,
          `Standardize naming: objects CamelCase, fields Title_Case, always carrying the __c suffix`,
          `Prefer picklists over free-text — they keep reporting clean and enforce values`,
          `Add External ID fields for Data Loader matches (Record_Source__c, Import_Batch_Number__c)`,
        ]},
        { t: 'callout', kind: 'tip', x: `The repo's objects carry status/audit fields (Status__c, Started_At__c, Completed_At__c) everywhere — a deliberate, reportable schema pattern.` },
        { t: 'p', x: `When the UI and the metadata disagree, Describe returns the ground truth in one call:` },
        { t: 'code', lang: 'apex', x: `System.debug(DataModelService.describeObjectLabel('Account'));` },
        { t: 'selfcheck', q: `Which field type best enforces a fixed set of values?`, a: `Picklist — controlled vocabulary beats free text for clean reports and dependencies.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Pick the right field type', level: 'Easy', mins: 10,
      brief: `For each requirement choose the correct field type and justify it in one line.`,
      steps: [
        `A task number that auto-increments and is read-only.`,
        `A "Market" value drawn from a fixed list (NAM, EMEA, APAC, …).`,
        `A number sales derives from Amount × Probability.`,
        `A point in time that must be timezone-aware.`,
        `Child records (order lines) that must be deleted when the parent is.`,
      ],
      solution: `Task number → AutoNumber with a format like AT-{00000}: stable, human-readable, read-only.
Market → Picklist: a controlled vocabulary keeps reports clean and enforces values.
Amount × Probability → Formula: IF(IsClosed, 0, ROUND(Amount * Probability, 2)) — derived, recomputes on save, no DML.
Timezone-aware point in time → Date/Time (a plain Date has no timezone).
Child records deleted with parent → Master-Detail: cascading delete plus roll-up summaries for free (a Lookup would block or orphan the children).`,
    },
    {
      n: 2, type: 'exercise', title: 'Write a validation rule from a spec', level: 'Medium', mins: 15,
      brief: `Support wants a rule: a Closed Case must carry a resolution, and a High-priority Case must have a Subject. You already ship the second — write the first.`,
      steps: [
        `Open Setup → Object Manager → Case → Validation Rules.`,
        `Create Require_Resolution_For_Closed with error text shown to users.`,
        `Test it: try to save a Closed Case with a blank resolution and confirm the save is blocked.`,
        `Compare with the shipped rule under force-app/main/default/objects/Case/validationRules/.`,
      ],
      solution: `The shipped rule mirrors this formula:

AND( ISCHANGED(Status), TEXT(Status) = "Closed", ISBLANK(Resolution__c) )

or the ISBLANK(TEXT(Resolution__c)) guard. Error message on the record: "Enter a resolution before closing this Case."
Tip: disable the rule only during bulk loads where the data is fixed upstream — never delete it.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Build a Feedback__c schema', level: 'Medium', mins: 25,
      brief: `Design and create a tiny custom schema the repo does NOT ship: learner feedback records tied to Study_Plan__c.`,
      steps: [
        `Create the object Feedback__c as a Master-Detail child of Study_Plan__c.`,
        `Add fields: Rating__c (Number 1–5), Topic__c (Picklist), Comments__c (Long Text).`,
        `Add a validation rule blocking a rating below 1 or above 5.`,
        `Add a roll-up summary on Study_Plan__c that counts feedback records.`,
      ],
      solution: `Object Manager → New Custom Object Feedback__c, relationship type Master-Detail, master = Study_Plan__c.
Fields: Rating__c = Number (2,0), Topic__c = Picklist, Comments__c = Long Text (32768).
Validation rule on Feedback__c:

OR( Rating__c < 1, Rating__c > 5 )

Error: "Rating must be between 1 and 5.".
Roll-up summary on Study_Plan__c: Feedback_Count__c = COUNT(Feedback__r).
You just exercised the whole Phase 2 stack in one object: object → fields → relationship → rule → summary.`,
    },
  ],
  quiz: {
    title: 'Phase 2 Quiz · Object Manager & Data Model', mins: 5,
    questions: [
      { q: `Custom fields on standard objects end in…`,
        opts: [`_c`, `__c`, `_f`, `__f`], a: 1, why: `All custom fields, on any object, use the __c suffix.` },
      { q: `Which field type supports a roll-up summary on the parent?`,
        opts: [`Lookup`, `Master-Detail`, `Formula`, `AutoNumber`], a: 1, why: `Roll-up summaries aggregate child records and require a Master-Detail relationship.` },
      { q: `How would you sum only won opportunity amounts on an Account?`,
        opts: [`A formula from the parent`, `A roll-up summary with SUM + filter Stage = Closed Won`, `A validation rule`, `A lookup field`], a: 1, why: `Roll-up summaries let you filter the rows they aggregate.` },
      { q: `Which of the shipped rules blocks closing a Case without a resolution?`,
        opts: [`High_Priority_Requires_Subject`, `Require_Resolution_For_Closed`, `Prevent_Future_Due_On_Completion`, `Negative_Data_Quality_Score`], a: 1, why: `Require_Resolution_For_Closed guards the Closed transition.` },
      { q: `A Date field vs a Date/Time field: which has no timezone?`,
        opts: [`Date`, `Date/Time`, `Both`, `Neither`], a: 0, why: `Date fields store a plain calendar date; Date/Time values are timezone-aware.` },
    ]
  }
},

/* ─────────────────────────── PHASE 3 ─────────────────────────── */
{
  id: 'sec', n: 3, title: 'Security Model', icon: '🔐', color: '#F59E0B',
  tagline: 'Profiles, permission sets, OWD & the audit',
  guide: '03-security.md',
  art: [
    { label: 'SecurityService', href: 'force-app/main/default/classes/SecurityService.cls' },
    { label: 'Salesforce_Administrator Permission Set', href: 'force-app/main/default/permissionsets/Salesforce_Administrator.permissionset-meta.xml' },
    { label: 'Security_Audit__c object', href: 'force-app/main/default/objects/Security_Audit__c' },
    { label: 'Security SOQL set', href: 'scripts/soql/security.soql' },
  ],
  objectives: [
    'Explain the four security layers in order',
    'Configure profiles + permission sets',
    'Layer sharing rules on top of OWD',
    'Run a login-audit loop with SecurityService',
  ],
  lessons: [
    {
      title: 'The Security Stack', mins: 8,
      blocks: [
        { t: 'code', lang: 'text', x: `1. Org    -> who can log in (login policies, IP ranges, MFA)
2. Object -> CRUD per object (profiles + permission sets)
3. Field  -> FLS: which fields are visible / editable
4. Record -> OWD + sharing rules + manual sharing + role hierarchy` },
        { t: 'p', x: `Each layer refines the one below it. An unusual login, a stale active account, a missing permission set — each is scored by the Security Audit process in this roadmap.` },
        { t: 'selfcheck', q: `A rep can't edit a field even though it's on their layout. First thing to check?`, a: `Field-Level Security — the FLS flag for that field on their profile or permission set.` },
      ]
    },
    {
      title: 'Profiles vs Permission Sets', mins: 10,
      blocks: [
        { t: 'table', head: ['', 'Profile', 'Permission Set'], rows: [
          ['Per user', 'Exactly 1', '0..many'],
          ['Concept', 'Baseline access', 'Add-on permissions'],
          ['Exam answer', 'Always exactly one', 'Layered onto the profile'],
        ]},
        { t: 'code', lang: 'text', x: `Profile (baseline)  +  Permission Set (extras)  =  User's total access` },
        { t: 'callout', kind: 'tip', x: `This repo ships Salesforce_Administrator — a 656-line permission set with object CRUD for the 5 custom objects + 7 standard ones, ~104 field permissions and tab settings.` },
        { t: 'p', x: `Read the FieldPermissions blocks on disk — e.g. Admin_Task__c.Due_Date__c and User.Requires_Login_Review__c. That last one matters: the admin set marks Requires_Login_Review__c, Is_Deactivation_Candidate__c and Feature_License_Missing__c visible — admins see them, a Standard User profile shouldn't.` },
        { t: 'selfcheck', q: `When do you use a permission set instead of editing a profile?`, a: `Whenever you want to grant extra access to a subset of users without changing the shared baseline.` },
      ]
    },
    {
      title: 'OWD & Sharing Rules', mins: 12,
      blocks: [
        { t: 'p', x: `Org-Wide Defaults (OWD) is the most restrictive record-level access. Sharing rules only ever ELEVATE access.` },
        { t: 'table', head: ['OWD', 'Meaning'], rows: [
          ['Private', 'Owner + role hierarchy above'],
          ['Public Read Only', 'Everyone reads; owner writes'],
          ['Public Read/Write', 'Everyone reads and writes'],
          ['Public Read/Write/Transfer', 'Everyone reads/writes; ownership can transfer'],
        ]},
        { t: 'callout', kind: 'warn', x: `Sharing rules cannot be more restrictive than OWD — they only elevate. Two flavors: criteria-based ("Priority = High → share with Case Queue") and owner-based ("Owned by Role X → share with Role Y"). Classic exam question: OWD Private on Account + user below the owner's role — they cannot see the record.` },
        { t: 'selfcheck', q: `Heavy-volume high-priority Cases need a whole queue to view them. For criteria-based access you'd use…`, a: `A sharing rule based on record criteria (e.g. Priority = High → share with the Case Queue).` },
      ]
    },
    {
      title: 'The Login-Audit Loop', mins: 12,
      blocks: [
        { t: 'p', x: `SecurityService codifies the audit loop — pure, DML-free methods you can call from a trigger or anonymous Apex.` },
        { t: 'code', lang: 'apex', x: `SecurityService.flagDeactivationCandidates(activeUsers);
List<Security_Audit__c> findings =
    SecurityService.buildLoginAuditFindings(usersNeedingReview);
SecurityService.flagMissingPermissionSets(users, assignedSets);` },
        { t: 'code', lang: 'sql', x: `SELECT Name, LastLoginDate, Is_Deactivation_Candidate__c
FROM User WHERE Is_Deactivation_Candidate__c = true` },
        { t: 'code', lang: 'sql', x: `SELECT Id, Section, Action, CreatedBy.Name, CreatedDate
FROM SetupAuditTrail ORDER BY CreatedDate DESC LIMIT 20` },
        { t: 'p', x: `The audit objects: Security_Audit__c is the findings ledger (Risk Level: High / Medium / Low, Status, Recommended Action), and User carries Last_Security_Review__c plus Requires_Login_Review__c so a review is stamped, dated and never forgotten. The bundle lives at scripts/soql/security.soql — login history, AuthSession, LoginHistory, permission set assignments and SetupAuditTrail in one file.` },
        { t: 'selfcheck', q: `Which user fields does the audit loop use as its "flag once inside the window"?`, a: `Is_Deactivation_Candidate__c and Requires_Login_Review__c — plus Last_Security_Review__c for dating.` },
      ]
    },
    {
      title: 'Login Security Essentials', mins: 10,
      blocks: [
        { t: 'list', items: [
          `Login hours & IP ranges — restrict who logs in, and from where`,
          `Password policies — complexity, expiration, lockout`,
          `Session settings — timeout, caching, MFA`,
          `Network access — trusted IP ranges; "any IP + no MFA" is a red flag`,
          `Auth Config — single sign-on (SSO) as the enterprise login pattern`,
          `MFA — the single most requested fix any admin implements first`,
        ]},
        { t: 'selfcheck', q: `A compliance call "only accesses Salesforce from our office". Which two profile settings enforce this?`, a: `Login Hours (allowed times) and Login IP Ranges (trusted addresses).` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Diagnose a security break-fix', level: 'Easy', mins: 10,
      brief: `A rep can log in but only sees their own records — not the Sales records other reps work on together. Walk the four security layers to isolate the cause.`,
      steps: [
        `Start at layer 4 (record access): is OWD Private with no sharing rule or role-hierarchy path?`,
        `Move up: is the object or a field hidden by FLS or object CRUD on the profile / permission set?`,
        `Check layer 1: login hours, IP ranges, MFA.`,
        `Decide the least-privilege fix — what single change grants the minimal extra access?`,
      ],
      solution: `OWD Private is the usual suspect. Sharing rules can only ELEVATE access, so a colleague below the owner's role sees nothing until you intervene.
The least-privilege fix: a criteria-based sharing rule (e.g. share the team's Accounts/Opportunities with the rep's role through the role hierarchy, or with a public group containing the rep) — NOT loosening OWD to Public Read/Write.
If only one field is missing, fix the FLS flag on the profile/permission set instead of touching record sharing.
Order of attack: record (4) → field (3) → object (2) → org (1).`,
    },
    {
      n: 2, type: 'exercise', title: 'Design a permission set for a role', level: 'Medium', mins: 15,
      brief: `Support managers need to read ALL Cases and export them monthly — nothing else beyond their profile.`,
      steps: [
        `Define the object-level access: what CRUD do you grant on Case, and what stays Read?`,
        `Define minimum field-level security that still lets them see resolution comments.`,
        `Pick the sharing mechanism so they see every Case regardless of owner.`,
        `Implement it as a permission set named Support_Manager, not an edited profile.`,
      ],
      solution: `Permission set Support_Manager: Case = Read (no Create/Edit/Delete), keeps the export for the approval process.
FLS: expose Subject, Status, Priority, Resolution__c, Data_Export_Requested__c; keep internal fields hidden.
Sharing: a criteria-based sharing rule (all Cases → Support Managers public group) layered on top of OWD — normal record access stays owner-based.
Why a permission set: they are add-on and removable per user without changing the shared baseline profile.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Run the login-audit loop', level: 'Medium', mins: 20,
      brief: `Act as the audit SecurityService automates: find stale users, record findings, and flag deactivation candidates.`,
      steps: [
        `Query users who have never logged in: SELECT Name, LastLoginDate, IsActive FROM User WHERE IsActive = true AND LastLoginDate = NULL`,
        `From the results, identify which ones are deactivation candidates.`,
        `Reproduce the audit in anonymous Apex using SecurityService.flagDeactivationCandidates and buildLoginAuditFindings.`,
        `Insert one Security_Audit__c finding per candidate with Risk_Level__c = 'High'.`,
      ],
      solution: `SOQL:
SELECT Name, LastLoginDate, IsActive FROM User WHERE IsActive = true AND LastLoginDate = NULL

Anonymous Apex to mirror the service:
SecurityService.flagDeactivationCandidates(staleUsers);
List<Security_Audit__c> findings = SecurityService.buildLoginAuditFindings(staleUsers);
insert findings;

And for access gaps:
SecurityService.flagMissingPermissionSets(users, assignedSets);

Each finding carries Audit_Type__c, Risk_Level__c, Finding__c and Status__c — exactly the fields Security_Audit_Status report groups on.`,
    },
  ],
  quiz: {
    title: 'Phase 3 Quiz · Security Model', mins: 5,
    questions: [
      { q: `How many profiles can a single user have?`,
        opts: [`One`, `Two`, `Unlimited`, `Depends on the license`], a: 0, why: `Exactly one profile per user; permission sets provide the extras.` },
      { q: `Can a sharing rule be more restrictive than OWD?`,
        opts: [`Yes, always`, `No — rules only grant more access`, `Only for records owned by queues`, `Only on Cases`], a: 1, why: `Sharing rules elevate access above OWD; they never restrict further.` },
      { q: `With OWD Private on Account, who can see a record by default?`,
        opts: [`Everyone`, `Only the owner and those above them in the role hierarchy`, `Only System Administrators`, `No one`], a: 1, why: `Private OWD = owner + role hierarchy above, unless sharing grants more.` },
      { q: `The Salesforce_Administrator permission set in this repo uses which license?`,
        opts: [`Sales Cloud`, `Service Cloud`, `Salesforce`, `Marketing Cloud`], a: 2, why: `Its <license> is the Salesforce base license — right for admin-style full access.` },
      { q: `Which Apex method flags stale, never-logged-in users for deactivation?`,
        opts: [`flagDeactivationCandidates`, `buildLoginAuditFindings`, `flagMissingPermissionSets`, `applyOnboardingDefaults`], a: 0, why: `flagDeactivationCandidates uses the custom-metadata staleness window.` },
    ]
  }
},

/* ─────────────────────────── PHASE 4 ─────────────────────────── */
{
  id: 'users', n: 4, title: 'Users & Org Setup', icon: '🧑‍💼', color: '#10B981',
  tagline: 'Provisioning, onboarding & org config',
  guide: '04-users-org-setup.md',
  art: [
    { label: 'UserManagementService', href: 'force-app/main/default/classes/UserManagementService.cls' },
    { label: 'UserTrigger', href: 'force-app/main/default/triggers/UserTrigger.trigger-meta.xml' },
    { label: 'New_User_Onboarding_Tasks flow', href: 'force-app/main/default/flows/New_User_Onboarding_Tasks.flow-meta.xml' },
    { label: 'User_Deactivation_FollowUp flow', href: 'force-app/main/default/flows/User_Deactivation_FollowUp.flow-meta.xml' },
  ],
  objectives: [
    'Create users and assign profiles & licenses',
    'Apply onboarding defaults via trigger + service',
    'Manage roles, queues, groups and feature licenses',
    'Automate onboarding and deactivation follow-ups',
  ],
  lessons: [
    {
      title: 'The User Record', mins: 8,
      blocks: [
        { t: 'p', x: `A User is a licensed human (or integration) login. The roadmap adds admin-relevant fields straight on the User object.` },
        { t: 'table', head: ['Field', 'Purpose'], rows: [
          ['Admin Role', 'What this person administers'],
          ['Onboarding Status', 'Not Started / In Progress / Complete'],
          ['Onboarding Date', 'When onboarding began'],
          ['Training Progress', 'The academy progress-bar target'],
          ['Last Security Review', 'Last security audit date'],
          ['Is Deactivation Candidate', 'Stale-account flag'],
          ['Login Source Category', 'Where they log in — Office / Remote / Unknown'],
          ['Requires Login Review', 'Flag popped by SecurityService'],
          ['Feature License Missing', 'License gap marker for the license audit'],
        ]},
        { t: 'selfcheck', q: `Where would a newcomer's onboarding status live?`, a: `On the User record itself — Onboarding_Status__c, stamped by the UserTrigger.` },
      ]
    },
    {
      title: 'The UserTrigger → Service Pattern', mins: 12,
      blocks: [
        { t: 'p', x: `Thin triggers delegate everything. The UserTrigger fires before insert / before update and calls one service method.` },
        { t: 'code', lang: 'apex', x: `trigger UserTrigger on User (before insert, before update) {
    if (Trigger.isBefore) {
        UserManagementService.applyOnboardingDefaults(Trigger.new);
    }
}` },
        { t: 'callout', kind: 'tip', x: `Run block 2 of scripts/apex/service-invocation.apex to insert a demo user and watch Onboarding_Status__c fill itself in live.` },
        { t: 'selfcheck', q: `Why keep triggers one method call and logic inside a service class?`, a: `Testability + reuse: the service unit-tests cleanly and other callers (flows, invocable Apex) share it.` },
      ]
    },
    {
      title: 'Licenses & Feature Licenses', mins: 8,
      blocks: [
        { t: 'table', head: ['License', 'What it enables'], rows: [
          ['User license', "The org's billing basis (Salesforce, Sales Cloud, Service Cloud…)"],
          ['Feature license', 'Features within a tier (Marketing User, Knowledge, Forecasting)'],
          ['Permission set license', 'Grants features across license types to a subset'],
        ]},
        { t: 'code', lang: 'sql', x: `SELECT Name, TotalLicenses, UsedLicenses
FROM UserLicense ORDER BY TotalLicenses DESC` },
        { t: 'selfcheck', q: `A user can log in but the Marketing app is missing. First check?`, a: `Whether they hold the Marketing User feature license — not the app's tab visibility.` },
      ]
    },
    {
      title: 'Roles, Queues & Groups', mins: 10,
      blocks: [
        { t: 'table', head: ['Component', 'Owns records?', 'Used for'], rows: [
          ['Role', 'No — always a person', 'Record visibility hierarchy'],
          ['Queue', 'Yes', 'Unassigned Cases, Leads, Tasks for teams'],
          ['Public Group', 'No', 'Named set for sharing precedence'],
        ]},
        { t: 'p', x: `This repo's Case assignment rules route to High Priority Case Queue and Standard Case Queue — create both before exercising Case.assignmentRules!` },
        { t: 'p', x: `The Admin Task board works the same way: each Admin_Task__c carries a Task_Owner__c lookup instead of a hard-tied owner, so a queue or the whole board can adopt records without reassigning ownership.` },
        { t: 'selfcheck', q: `Queue or role: which can OWN an unassigned Case?`, a: `The Queue — records sit owner-less in a queue until a member claims them.` },
      ]
    },
    {
      title: 'The Onboarding Flows', mins: 12,
      blocks: [
        { t: 'p', x: `Two record-triggered flows complete the story. New_User_Onboarding_Tasks (User after save) creates three tasks.` },
        { t: 'code', lang: 'text', x: `New active user
  ├── Profile Review task
  ├── Permission Set task    (attach Salesforce_Administrator where due)
  └── Ownership task` },
        { t: 'p', x: `Each task has a purpose: Profile Review — the admin verifies the right profile (and its FLS subset); Permission Set Assignment — attach Salesforce_Administrator where due; Ownership Task — confirm record-ownership defaults before the user starts creating data.` },
        { t: 'p', x: `User_Deactivation_FollowUp reacts when IsActive flips to false and raises a Deactivation Cleanup Task so nobody forgets orphaned records.` },
        { t: 'selfcheck', q: `How many tasks does onboarding automation create, and who triggers it?`, a: `Three tasks — Profile Review, Permission Set, Ownership — created on new active users by the New User Onboarding Tasks flow.` },
      ]
    },
    {
      title: 'Org Setup Checklist', mins: 12,
      blocks: [
        { t: 'p', x: `Before the first user logs in, the org itself needs configuration. This is the second most common interview "walk me through it" — and the fields below are nearly all standard setup screens.` },
        { t: 'list', items: [
          `Company Information — org name, address, fiscal year start, timezone & currency`,
          `Business Hours and Holiday & Operating Hours — the calendars escalation and SLA logic reads`,
          `Locales & language — default locale, timezone and currency for new users`,
          `Notification templates — the branded emails users and admins actually receive`,
          `Data protection & consent — records consent, EU/UK data permissions, sensitive-data marking`,
        ]},
        { t: 'callout', kind: 'tip', x: `Set fiscal-year start before any Opportunity is created — changing it mid-year skews forecast periods and reporting.` },
        { t: 'selfcheck', q: `Which config MUST exist before escalation/SLA logic can calculate time?`, a: `Business Hours (with Holidays if holiday calc matters) — escalation and SLA both run on working time.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Provision a new support agent', level: 'Easy', mins: 10,
      brief: `Alex starts Monday as a support agent. Create their user record and the minimum access to get them productive.`,
      steps: [
        `Setup → Users → New User and fill in the contact + login details.`,
        `Assign the right license and a standard profile for support work.`,
        `Add Alex as a member of the Standard Case Queue.`,
        `Leave Onboarding_Status__c as Not Started and let the automation take over.`,
      ],
      solution: `New User with the Service Cloud user license and a Standard support profile (never the System Administrator profile for day-one humans).
Setup → Queues → Standard Case Queue → Add Members → Alex. Queues hold owner-less Cases until a member claims them.
Because Onboarding_Status__c starts Not Started, the UserTrigger + New_User_Onboarding_Tasks flow stamp the record and create the three onboarding tasks — Profile Review, Permission Set, Ownership. Verify they appear on Alex's Tasks tab.`,
    },
    {
      n: 2, type: 'exercise', title: 'Roles, queues and groups — sort the toolbox', level: 'Easy', mins: 8,
      brief: `Match each need to a component: Role, Queue or Public Group.`,
      steps: [
        `A records pool the whole support team can grab Cases from.`,
        `A visibility stack where managers see their reportees' records.`,
        `A named set of users you reuse in sharing rules and permission sets.`,
        `A place to park unassigned Leads before assignment.`,
      ],
      solution: `Team Cases pool → Queue (owner-less holding area; assignment rules route into it).
Manager visibility → Role (the hierarchy elevates record access, never ownership).
Reusable set in sharing rules → Public Group (contains users, queues, and other groups).
Unassigned Leads → Queue again (assignment rules evaluate once at creation).`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Automate an onboarding checklist', level: 'Medium', mins: 25,
      brief: `Reproduce the shipped onboarding automation: stamp defaults on user creation, then trigger the deactivation follow-up.`,
      steps: [
        `Review New_User_Onboarding_Tasks in Setup → Flows and note its three task branches.`,
        `Insert a test user from anonymous Apex so the UserTrigger fires.`,
        `Confirm Onboarding_Status__c was stamped by UserManagementService.applyOnboardingDefaults.`,
        `Deactivate the test user and confirm the User_Deactivation_FollowUp flow raises a cleanup task.`,
      ],
      solution: `Anonymous Apex (run as a System Administrator):
User u = new User(
  FirstName='Demo', LastName='Learner',
  Username='demo' + System.now().getTime() + '@example.com',
  Email='demo@example.com', Alias='demolearner',
  TimeZoneSidKey='America/Los_Angeles', LocaleSidKey='en_US',
  EmailEncodingKey='UTF-8', LanguageLocaleKey='en_US',
  ProfileId = [SELECT Id FROM Profile WHERE Name='Standard User'].Id
);
insert u;
System.debug('Onboarding_Status__c => ' + u.Onboarding_Status__c);

The trigger stays thin — one call to applyOnboardingDefaults — and all logic lives in the testable service. When you flip IsActive = false, User_Deactivation_FollowUp reacts and creates the cleanup task so orphaned records are not forgotten.`,
    },
  ],
  quiz: {
    title: 'Phase 4 Quiz · Users & Org Setup', mins: 5,
    questions: [
      { q: `Which component can own an unassigned record?`,
        opts: [`A Profile`, `A Queue`, `A Role`, `A Public Group`], a: 1, why: `Queues hold unassigned records; roles and groups never own.` },
      { q: `What does the UserTrigger delegate to on insert and update?`,
        opts: [`applyOnboardingDefaults`, `buildLoginAuditFindings`, `permissionSetCountMap`, `buildOnboardingChecklist`], a: 0, why: `UserTrigger → UserManagementService.applyOnboardingDefaults.` },
      { q: `Which flow creates three onboarding tasks for a new active user?`,
        opts: [`User_Deactivation_FollowUp`, `New_User_Onboarding_Tasks`, `Sensitive_Data_Review_Task`, `Case_Escalation_Task`], a: 1, why: `New User Onboarding Tasks creates Profile Review, Permission Set and Ownership tasks.` },
      { q: `A user can log in but cannot see Marketing features. Most likely missing:`,
        opts: [`A Profile`, `A Feature license`, `A Role`, `A Queue`], a: 1, why: `Feature licenses gate features inside the license tier — e.g. Marketing User.` },
      { q: `When does User_Deactivation_FollowUp fire?`,
        opts: [`When a user is created`, `When IsActive flips to false`, `Weekly on a schedule`, `When a password resets`], a: 1, why: `It reacts to deactivation and raises a cleanup task.` },
    ]
  }
},

/* ─────────────────────────── PHASE 5 ─────────────────────────── */
{
  id: 'data', n: 5, title: 'Data Management', icon: '🧹', color: '#EC4899',
  tagline: 'Quality scores, duplicates & migration batches',
  guide: '05-data-management.md',
  art: [
    { label: 'DataManagementService', href: 'force-app/main/default/classes/DataManagementService.cls' },
    { label: 'DataMigrationService', href: 'force-app/main/default/classes/DataMigrationService.cls' },
    { label: 'Data_Migration_Batch__c object', href: 'force-app/main/default/objects/Data_Migration_Batch__c' },
    { label: 'Data_Migration_Event__e platform event', href: 'force-app/main/default/platformEvents/Data_Migration_Event__e.platformEvent-meta.xml' },
  ],
  objectives: [
    'Pick the right data-loading tool per job',
    'Normalize, score and flag duplicates like the service does',
    'Journal every migration on Data_Migration_Batch__c',
    'Publish lifecycle events for decoupled integrations',
  ],
  lessons: [
    {
      title: 'The Data Toolkit', mins: 8,
      blocks: [
        { t: 'table', head: ['Tool', 'Best for'], rows: [
          ['Data Import Wizard', 'One-offs, UI-driven, up to 50k records'],
          ['Data Loader', 'Batches, scheduled loads, upserts with External IDs, API bulk calls'],
          ['Data Export', 'Monthly backups to your own archive'],
          ['Backup/Recovery vendors', 'Failsafe restores beyond the Recycle Bin window'],
          ['Duplicate Management', 'Native matching rules + merge'],
        ]},
        { t: 'callout', kind: 'warn', x: `Use an External ID for upserts. Standard record Ids are not upsert keys — a classic exam trap.` },
        { t: 'selfcheck', q: `You need to upsert 40k records on a schedule. Which tool?`, a: `Data Loader — with an External ID key for the upsert.` },
      ]
    },
    {
      title: 'Normalize → Score → Flag', mins: 12,
      blocks: [
        { t: 'p', x: `DataManagementService codifies the three-step dance every admin does by hand.` },
        { t: 'code', lang: 'apex', x: `String normalized = DataManagementService.normalizeAccountName('ACME Corp ');
Map<String, List<Account>> collisions =
    DataManagementService.findNameCollisions(accountList);
DataManagementService.flagDuplicateAccounts(accountList);
DataManagementService.applyValidationStatus(accountList);` },
        { t: 'p', x: `The AccountTrigger runs the flaggers on insert/update — two "ACME Corp" accounts created back-to-back set Duplicate_Flag__c on the second. Dashboards group accounts by Validation Status.` },
        { t: 'table', head: ['Field', 'What makes it measurable'], rows: [
          ['Data Quality Score', 'A 0–100 completeness number'],
          ['Validation Status', 'Valid / Needs Review / Invalid'],
          ['Duplicate Flag + Import Batch Number', 'Which run flagged it, and which load'],
          ['Sensitive Data + Data Processed in EU', 'Account-level privacy markers'],
          ['Consent To Process / Consent Date', 'Contact-level consent + timestamp'],
        ]},
        { t: 'p', x: `The Data Quality dashboard (Data_Quality_Dashboard) turns all of it into metrics — duplicates flagged, accounts by validation status, needs-review count.` },
        { t: 'selfcheck', q: `Query for duplicate account names in one shot.`, a: `SELECT LOWER(TRIM(Name)) norm, COUNT(Id) FROM Account GROUP BY LOWER(TRIM(Name)) HAVING COUNT(Id) > 1.` },
      ]
    },
    {
      title: 'The Migration Batch Lifecycle', mins: 14,
      blocks: [
        { t: 'code', lang: 'text', x: `New → In Progress → Completed / Failed` },
        { t: 'code', lang: 'apex', x: `Data_Migration_Batch__c batch =
    DataMigrationService.openBatch('Account', 100);
DataMigrationService.recordProgress(batch, 95, 5);
DataMigrationService.closeBatch(batch.Id, true);` },
        { t: 'callout', kind: 'tip', x: `Each step publishes Data_Migration_Event__e (CREATED / PROGRESS / CLOSED) through EventBus.publish — integrations subscribe without touching the batch object. That decoupling is the exam-approved architecture.` },
        { t: 'selfcheck', q: `Why journal every import on Data_Migration_Batch__c even when it succeeds?`, a: `Auditable counters (success/failure), lineage, and a platform-event trail for downstream systems.` },
      ]
    },
    {
      title: 'Privacy by Design', mins: 10,
      blocks: [
        { t: 'table', head: ['Object', 'Privacy fields'], rows: [
          ['Contact', 'Consent To Process + Consent Date'],
          ['Account', 'Sensitive Data + Data Processed in EU'],
          ['Lead', 'Consent Given'],
        ]},
        { t: 'code', lang: 'sql', x: `SELECT Name, Consent_To_Process__c, Consent_Date__c
FROM Contact ORDER BY Consent_Date__c DESC NULLS LAST` },
        { t: 'selfcheck', q: `Legal needs a per-record "when did this person consent" value. Where does it live?`, a: `Contact.Consent_Date__c, set at the moment Consent_To_Process__c is checked.` },
      ]
    },
    {
      title: 'Data Hygiene Runs', mins: 8,
      blocks: [
        { t: 'list', items: [
          `Weekly: Data Quality Score < 80 review (Data_Quality_Score_Report)`,
          `Monthly: recycle-bin sweep — restore or archive 30+ day bins`,
          `Each load: batch journal updated + event to the alert email`,
          `Quarterly: Last_Data_Audit__c refreshed on every Account`,
        ]},
        { t: 'selfcheck', q: `What does Data_Import_Validation do when a fresh batch has records?`, a: `It marks the batch In Progress — handing the Journal to DataMigrationService.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Find & merge duplicates', level: 'Easy', mins: 10,
      brief: `Your Account list has "ACME Corp" twice. Find it, resolve it, and stop it from happening again.`,
      steps: [
        `Run a query that lists every Account name that occurs more than once.`,
        `Flag or merge the duplicate pairs.`,
        `Prevent recurrence with duplicate management (or the shipped name-normalization flagger).`,
      ],
      solution: `The one-shot duplicate query:
SELECT LOWER(TRIM(Name)) nameNorm, COUNT(Id) n
FROM Account GROUP BY LOWER(TRIM(Name)) HAVING COUNT(Id) > 1

TRIM + LOWER normalize trailing spaces and casing so "ACME Corp " and "acme corp" collide.
Then merge from the Account list view (or Data Loader), and enable Duplicate Management → Matching Rules → Account → Name → Duplicate Rule with a merge action.
In this repo the same effect is DataManagementService.flagDuplicateAccounts, fired by the AccountTrigger: two consecutive "ACME Corp" inserts stamp Duplicate_Flag__c on the second.`,
    },
    {
      n: 2, type: 'exercise', title: 'Choose the data-loading tool', level: 'Easy', mins: 8,
      brief: `Pick a tool for each job and note the key skill that makes it work.`,
      steps: [
        `A one-off import of 500 Accounts, UI-driven, today.`,
        `A scheduled 40k-row upsert every night.`,
        `A monthly full backup of your data.`,
        `Matching 2,000 Contact rows to existing records by email.`,
      ],
      solution: `500 Accounts one-off → Data Import Wizard (up to ~50k records, point and click).
Scheduled 40k upsert → Data Loader with a CSV and an External ID as the upsert key (standard record Ids are NOT upsert keys — classic exam trap).
Monthly backup → Data Export (weekly export service still offered; archive the CSV/ZIP).
Match by email → Data Loader upsert mapping Contact.Email to a Contact External ID field, or Duplicate Management.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Run a journaled migration batch', level: 'Medium', mins: 25,
      brief: `Import Contacts for real and prove every step was journaled on Data_Migration_Batch__c with a platform-event trail.`,
      steps: [
        `Open a batch with DataMigrationService.openBatch('Contact', 100).`,
        `Insert the rows; count successes and failures.`,
        `Journal the run with DataMigrationService.recordProgress(batch, successes, failures).`,
        `Close it, then query the batch and inspect the Data_Migration_Event__e trail.`,
      ],
      solution: `Anonymous Apex using the published service:
Data_Migration_Batch__c batch = DataMigrationService.openBatch('Contact', 100);
// insert Contacts here; keep success/failure counters
DataMigrationService.recordProgress(batch, 100, 0);
DataMigrationService.closeBatch(batch.Id, true);

Then prove it:
SELECT Name, Source_Object__c, Record_Count__c, Successful_Records__c,
       Failed_Records__c, Status__c
FROM Data_Migration_Batch__c ORDER BY CreatedDate DESC LIMIT 5

Each step publishes Data_Migration_Event__e (CREATED / PROGRESS / CLOSED) through EventBus.publish — the Handle_Data_Migration_Progress flow or any subscriber reacts without coupling to the batch object. Status__c should read 'Completed'.`,
    },
  ],
  quiz: {
    title: 'Phase 5 Quiz · Data Management', mins: 5,
    questions: [
      { q: `Which tool is built for scheduled bulk loads and upserts?`,
        opts: [`Data Import Wizard`, `Data Loader`, `Data Export`, `Web-to-Lead`], a: 1, why: `Data Loader handles batches and upserts with External IDs.` },
      { q: `Why choose a CSV upsert key instead of the record Id?`,
        opts: [`Ids are longer`, `Standard Ids are not upsert keys`, `CSV can't store Ids`, `Ids can't be imported`], a: 1, why: `Upserts require an External ID so the loader can match source records.` },
      { q: `What is the standard lifecycle of a Data_Migration_Batch__c?`,
        opts: [`New → In Progress → Completed/Failed`, `Open → Closed`, `Draft → Sent → Approved`, `Staged → Deployed`], a: 0, why: `DataMigrationService.openBatch / recordProgress / closeBatch own it.` },
      { q: `What channel does DataMigrationService use to announce progress?`,
        opts: [`A Chatter post`, `A platform event (Data_Migration_Event__e)`, `An email alert`, `A task`], a: 1, why: `EventBus.publish decouples the journal from any downstream consumer.` },
      { q: `Which Contact fields protect personal data?`,
        opts: [`Consent To Process + Consent Date`, `Data Source + Email Verified`, `Last Data Audit + Duplicate Flag`, `Role Importance`], a: 0, why: `Those two drive the consent audit alongside Account.Data_Processed_EU__c.` },
    ]
  }
},

/* ─────────────────────────── PHASE 6 ─────────────────────────── */
{
  id: 'flows', n: 6, title: 'Automation — Flows', icon: '⚙️', color: '#F97316',
  tagline: 'Flow Builder: record, schedule, screen',
  guide: '06-automation-flows.md',
  art: [
    { label: '8 flows', href: 'force-app/main/default/flows' },
    { label: 'AutomationService', href: 'force-app/main/default/classes/AutomationService.cls' },
    { label: 'New_User_Onboarding_Tasks flow', href: 'force-app/main/default/flows/New_User_Onboarding_Tasks.flow-meta.xml' },
    { label: 'Stray_Field_Audit screen flow', href: 'force-app/main/default/flows/Stray_Field_Audit.flow-meta.xml' },
  ],
  objectives: [
    'Classify flows: record-triggered, schedule-triggered, screen, autolaunched',
    'Read a flow’s XML on disk and identify its elements',
    'Use decisions, record operations and screen elements',
    'Know what the eight RoadMap flows do',
  ],
  lessons: [
    {
      title: 'The Flow Menu', mins: 8,
      blocks: [
        { t: 'table', head: ['Type', 'Runs when', 'Exam bias'], rows: [
          ['Record-Triggered', 'A record is created/updated/deleted', 'The most-examined type'],
          ['Schedule-Triggered', 'A fixed schedule', '"Which type runs nightly?"'],
          ['Screen', 'A user interacts', 'Wizards, approvals UX'],
          ['Autolaunched', 'Called by Apex / API / another flow', 'Reusable event-style logic'],
          ['Platform Event-Triggered', 'An event publishes', 'Decoupled automations'],
        ]},
        { t: 'callout', kind: 'tip', x: `Flow Builder is the default automation tool. "Which automation?" on the exam almost always answers "Flow" — unless the scenario is a legacy migration story.` },
        { t: 'selfcheck', q: `A flow that shows a data-entry screen to the user is a…`, a: `Screen flow. It pauses for user interaction, unlike record-triggered flows.` },
      ]
    },
    {
      title: 'Flow Anatomy', mins: 10,
      blocks: [
        { t: 'list', items: [
          `Start element — defines trigger, schedule or inputs`,
          `Decision or Record Lookup — branch the logic`,
          `Record Create / Update / Delete — the DML moments`,
          `Screen — collect user input (screen flows)`,
          `Fault path — correct flows handle failures, never just end`,
        ]},
        { t: 'p', x: `Every RoadMap flow lives under force-app/main/default/flows/*.flow-meta.xml. Open any one to see start → decision → action elements in XML.` },
        { t: 'selfcheck', q: `A flow that fails silently and just stops is missing what?`, a: `A fault path — the branch that runs when an element throws an error.` },
      ]
    },
    {
      title: 'The Eight RoadMap Flows', mins: 14,
      blocks: [
        { t: 'table', head: ['Flow', 'Type / trigger', 'Job'], rows: [
          ['New_User_Onboarding_Tasks', 'User after save', '3 onboarding tasks'],
          ['User_Deactivation_FollowUp', 'User after save', 'Cleanup task on IsActive=false'],
          ['Data_Export_Approval_Request', 'Case after save', 'Approval_Status__c = Pending'],
          ['Sensitive_Data_Review_Task', 'Account after save', 'Security review task on sensitive data'],
          ['Data_Import_Validation', 'Batch after save', 'Mark batch In Progress'],
          ['Handle_Data_Migration_Progress', 'Autolaunched (batchId)', 'Migration follow-up task'],
          ['Stray_Field_Audit', 'Screen', 'Pick object → preview audit'],
          ['Case_Escalation_Task', 'Case after save', 'Task when Escalation_Level__c > 1'],
        ]},
        { t: 'callout', kind: 'tip', x: `Flows do the clicking; AutomationService does the calculation — applyDefaultDueDates and inferPriorities keep task boards sane. Keep math in Apex, orchestration in Flow.` },
        { t: 'selfcheck', q: `Which flow is autolaunched?`, a: `Handle_Data_Migration_Progress — triggered by an input batchId rather than a record event.` },
      ]
    },
    {
      title: 'Reading Flow XML', mins: 10,
      blocks: [
        { t: 'p', x: `New_User_Onboarding_Tasks.flow-meta.xml shows the shape: a <start> with an object-triggered event, then three <recordCreates> — Profile Review, Permission Set, Ownership.` },
        { t: 'code', lang: 'text', x: `<start>  Event: User (after save)
  ├── RecordCreate: Profile Review task
  ├── RecordCreate: Permission Set task
  └── RecordCreate: Ownership task` },
        { t: 'callout', kind: 'tip', x: `Rebuild Stray_Field_Audit from scratch in Flow Builder (picklist → assignment → display screen) and compare to the shipped XML — the best XML-reading exercise in the roadmap.` },
        { t: 'selfcheck', q: `How would you verify a record-triggered flow actually ran?`, a: `The evidence is in the data: run the automation-flows SOQL set and inspect the created tasks.` },
      ]
    },
    {
      title: 'Flow vs Apex — Picking the Tool', mins: 10,
      blocks: [
        { t: 'table', head: ['Situation', 'Choose', 'Why'], rows: [
          ['Create 3 tasks on user creation', 'Flow', 'Declarative, visible in Debug, no code'],
          ['Compute due dates, priorities, math', 'Flow + service', 'Apex does the math, flow calls it (in the repo)'],
          ['Deep loops, combos, exceptions', 'Apex', 'Flows iterate but get unwieldy'],
          ['Logic reused by tests & flows', 'Apex service', 'One home, testable once'],
        ]},
        { t: 'callout', kind: 'warn', x: `Flow Governor limit to respect: SOQL queries/DML in a flow count toward per-transaction limits; batch huge operations in Apex.` },
        { t: 'selfcheck', q: `The repo's flows call AutomationService for dates and priorities. Why split it that way?`, a: `Testability and reuse — service logic unit-tests cleanly and every flow caller shares the same math.` },
      ]
    },
    {
      title: 'The Scheduled Flow Pattern', mins: 10,
      blocks: [
        { t: 'p', x: `A Schedule-Triggered flow runs on a cadence — Daily, Weekly, or custom — and pairs perfectly with a service call. The repo's classic: a weekly "Stale Task Closer" that sweeps dusty Admin_Task__c records.` },
        { t: 'code', lang: 'apex', x: `List<Admin_Task__c> staleTasks =
    AutomationService.staleTasksToClose(openTasks, staleDays);
// the scheduled flow then closes each one and notifies the queue owner` },
        { t: 'callout', kind: 'tip', x: `The threshold lives in custom metadata — Admin_Configuration__mdt.Auto_Close_Stale_Days__c — so the config changes without touching flow or Apex. SecurityService already reads it when deciding stale-account sweeps.` },
        { t: 'p', x: `Time-dependent automation is the classic "which tool" exam question. Historically the answer was Workflow Time Triggers; today a Scheduled Flow is the default answer.` },
        { t: 'selfcheck', q: `A weekly digest job that emails a workload summary — which flow type?`, a: `Schedule-Triggered, and prefer it over Workflow Time Triggers for time-based automation.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Classify the automation scenario', level: 'Easy', mins: 10,
      brief: `For each scenario, name the flow type: Record-Triggered, Schedule-Triggered, Screen, or Autolaunched.`,
      steps: [
        `React the moment a Case becomes High Priority.`,
        `Email a workload digest every Monday at 8 a.m.`,
        `A wizard that guides a user through data entry.`,
        `Logic invoked from Apex or an API call, with inputs, no UI.`,
      ],
      solution: `High-Priority Case → Record-Triggered (fires after save on Case).
Monday digest → Schedule-Triggered (fixed cadence, e.g. Daily/Fixed from "8:00 AM Monday").
Data-entry wizard → Screen (pauses for user interaction).
Logic called by Apex/API → Autolaunched (event-style, reusable, no trigger record).
The most-examined wiring: a record-triggered flow sets the stage; a screen flow collects input; an autolaunched flow is the reusable engine.`,
    },
    {
      n: 2, type: 'exercise', title: 'Read flow XML — find the elements', level: 'Medium', mins: 15,
      brief: `Open New_User_Onboarding_Tasks.flow-meta.xml in the repo and map its elements by hand before reading on.`,
      steps: [
        `Find the <start> block and note the trigger object + event (after save?).`,
        `Count the <recordCreates> elements — how many tasks does it build?`,
        `Find any <assignment> or <decisions> that shape the task names or owners.`,
        `Check whether a fault path (<faultConnector>) exists.`,
      ],
      solution: `The flow is a record-triggered flow on User set to run After Save.
It contains exactly three <recordCreates>: Profile Review task, Permission Set task, Ownership task — the three onboarding chores.
The task names are stamped via assignments/record-create field values rather than hard-coded text where possible.
Fault paths: professional flows include one so a failing element is reported, not swallowed. Compare your findings to the tools that surface these as Run/Flow Builder's debug run.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Rebuild the Case_Escalation_Task flow', level: 'Medium', mins: 25,
      brief: `Recreate a shipped flow from scratch in Flow Builder, then diff your structure against the shipped XML.`,
      steps: [
        `Create a Record-Triggered flow on Case (After Save) in Flow Builder.`,
        `Add an entry condition: only proceed when Escalation_Level__c > 1.`,
        `Record-Create one Task: Subject includes the case number, Priority High, linked to the Case.`,
        `Activate, then open force-app/main/default/flows/Case_Escalation_Task.flow-meta.xml and compare element by element.`,
      ],
      solution: `Flow Builder structure:
- Start element → object: Case, trigger: A record is created (After Save).
- Entry condition → formula: {!$Record.Escalation_Level__c} > 1.
- Record Create → Task: Subject = 'Escalate Case ' & {!$Record.CaseNumber}, Priority = High, WhatId = {!$Record.Id}.
- Save + Activate.

The shipped XML follows the identical skeleton — start → condition → recordCreate. Rebuild it from memory, then diff: you will notice the fault path and the field naming conventions. That diff is the learning.`,
    },
  ],
  quiz: {
    title: 'Phase 6 Quiz · Automation — Flows', mins: 5,
    questions: [
      { q: `Which flow sets Approval_Status__c = 'Pending' on Cases?`,
        opts: [`Case_Escalation_Task`, `Data_Export_Approval_Request`, `Data_Import_Validation`, `Handle_Data_Migration_Progress`], a: 1, why: `Data Export Approval Request reacts to Data_Export_Requested__c and stages the approval.` },
      { q: `Who computes task due dates — Flow or Apex?`,
        opts: [`Flow`, `Apex (AutomationService)`, `Validation rules`, `Reports`], a: 1, why: `AutomationService.applyDefaultDueDates does the math; flows orchestrate.` },
      { q: `Which RoadMap flow type is Screen?`,
        opts: [`Stray_Field_Audit`, `Sensitive_Data_Review_Task`, `Data_Import_Validation`, `User_Deactivation_FollowUp`], a: 0, why: `Stray Field Audit asks the user to pick the object to audit.` },
      { q: `A flow triggered by Data_Migration_Batch__c after save is…`,
        opts: [`Record-Triggered`, `Schedule-Triggered`, `Screen`, `Autolaunched`], a: 0, why: `It fires when a batch record is created — the Data_Import_Validation flow.` },
      { q: `What does a fault path do?`,
        opts: [`Prevents the flow from starting`, `Handles element errors gracefully`, `Compiles the flow`, `Deletes test records`], a: 1, why: `Fault paths catch failures instead of letting automation die silently.` },
    ]
  }
},

/* ─────────────────────────── PHASE 7 ─────────────────────────── */
{
  id: 'appr', n: 7, title: 'Approvals & Legacy Automation', icon: '✅', color: '#DB2777',
  tagline: 'Approval processes, assignment rules, migration',
  guide: '07-approvals-legacy.md',
  art: [
    { label: 'Data_Export_Approval', href: 'force-app/main/default/approvalProcesses/Data_Export_Approval.approvalProcess-meta.xml' },
    { label: 'Case assignment rules', href: 'force-app/main/default/assignmentRules/Case.assignmentRules-meta.xml' },
    { label: 'Data_Export_Approval_Request flow', href: 'force-app/main/default/flows/Data_Export_Approval_Request.flow-meta.xml' },
    { label: 'Approval SOQL set', href: 'scripts/soql/approvals-legacy.soql' },
  ],
  objectives: [
    'Configure an approval process end-to-end',
    'Read Data_Export_Approval XML node by node',
    'Route records with assignment rules to queues',
    'Audit approvals via ProcessInstance SOQL',
  ],
  lessons: [
    {
      title: 'Approval Process Anatomy', mins: 12,
      blocks: [
        { t: 'table', head: ['Setting', 'This repo (Case)'], rows: [
          ['Entry criteria', 'Data_Export_Requested__c = TRUE AND Priority = High'],
          ['Step 1', 'Step_1_Security_Admin'],
          ['Approver', 'Manager of the record owner + hierarchy'],
          ['Approved action', 'Approval_Status__c = Approved'],
          ['Rejected action', 'Approval_Status__c = Rejected'],
          ['Recall', 'Approval_Status__c = Draft'],
        ]},
        { t: 'code', lang: 'text', x: `<entryCriteria> booleanFilter 1 AND 2
<approvalStep>   Step_1_Security_Admin (ManagerOfRecordOwner + HierarchyToRecordOwner)
<finalApprovalActions> -> Mark_Approved  (Approval_Status__c = Approved)
<finalRejectionActions> -> Mark_Rejected (Approval_Status__c = Rejected)
<recallActions>        -> Mark_Draft     (Approval_Status__c = Draft)
allowDelegate: true   -> approvers can hand off their step` },
        { t: 'selfcheck', q: `Who receives the initial submission for the Data Export Approval?`, a: `The record owner's manager, via ManagerOfRecordOwner + hierarchy approver.` },
      ]
    },
    {
      title: 'Assignment Rules', mins: 8,
      blocks: [
        { t: 'p', x: `Assignment rules route records to users or queues at creation, evaluated once. This repo ships Case rules with a 1 OR 2 boolean filter.` },
        { t: 'code', lang: 'text', x: `Rule "Case Queue Routing"
  entry 1: High Priority Cases  -> High Priority Case Queue (Queue)
  entry 2: Standard Cases       -> Standard Case Queue   (Queue)` },
        { t: 'callout', kind: 'tip', x: `In Case.assignmentRules-meta.xml, entry 2 uses operation equalsNeither on Priority = High — i.e. every Case that is NOT High lands in Standard Case Queue. Both entries set assignedToType = Queue (owner-less until a member claims them).` },
        { t: 'callout', kind: 'warn', x: `Create the two queues before the rules run — an assignment rule pointing at a missing queue throws at creation time.` },
        { t: 'selfcheck', q: `How is a Queue different from a Role in assignment-rule routing?`, a: `Rules can assign to Queues (owner-less holding areas) — never to Roles.` },
      ]
    },
    {
      title: 'Auditing Approvals in SOQL', mins: 10,
      blocks: [
        { t: 'code', lang: 'sql', x: `SELECT ProcessInstanceId, TargetObjectId, ActorId,
       CompletedDate, StepStatus, Comments
FROM ProcessInstanceStep
ORDER BY ProcessInstanceId DESC LIMIT 20

SELECT Approval_Status__c, COUNT(Id) n FROM Case GROUP BY Approval_Status__c` },
        { t: 'p', x: `ProcessInstance = a submission lifecycle; ProcessInstanceStep = each step. The approvals-legacy SOQL file bundles a full audit kit: approval states by Approval_Status__c, pending submissions, who-approves-what (users with a ManagerId), and workflow-rule leftovers.` },
        { t: 'code', lang: 'sql', x: `SELECT Name, Manager.Name FROM User WHERE ManagerId != NULL` },
        { t: 'selfcheck', q: `Which object stores each individual approval decision?`, a: `ProcessInstanceStep (StepStatus, ActorId, Comments, CompletedDate).` },
      ]
    },
    {
      title: 'Legacy → Flow', mins: 10,
      blocks: [
        { t: 'table', head: ['Legacy', 'Status', 'Posture'], rows: [
          ['Workflow Rules', 'Read-only support', 'Prefer Flow; know email alerts & time triggers'],
          ['Process Builder', 'Grandfathered, deprecated', 'Migrate to Flow'],
          ['Approval Processes', 'Very much alive', 'Flow sets Pending, process finalizes'],
          ['Action on Tasks/Emails', 'Some patterns remain', 'Flow is the default'],
        ]},
        { t: 'callout', kind: 'tip', x: `The composition pattern in this repo: Data_Export_Approval_Request (flow) sets Pending → the Data_Export_Approval process finalizes to Approved/Rejected.` },
        { t: 'selfcheck', q: `Which automation category is being retired, and what's its modern replacement?`, a: `Process Builder is grandfathered/deprecated — migrate to Flow Builder.` },
      ]
    },
    {
      title: 'Roles, Queues & Public Groups', mins: 8,
      blocks: [
        { t: 'table', head: ['Concept', 'What it does', 'Trap'], rows: [
          ['Role', 'Positions access + hierarchy in records', 'Role ≠ title — it drives visibility'],
          ['Queue', 'Owner-less holding area for records & tasks', 'Rule-routing works only with queues'],
          ['Public Group', 'Collection of users/queues/other groups', 'Sharing-rule target, not a records owner'],
        ]},
        { t: 'list', items: [
          `High Priority Case Queue and Standard Case Queue — the two queues the Case assignment rules need`,
          `Group queues into support groups for sharing rules, and reference the group in your standard OWD review`,
        ]},
        { t: 'selfcheck', q: `You want a records pool everyone in a team can grab from. Which construct?`, a: `A Queue — it owns the records without a single owner, and assignment rules route into it.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Trace the Data_Export_Approval decision map', level: 'Easy', mins: 10,
      brief: `Walk a Case through the shipped approval process and predict every field transition.`,
      steps: [
        `What two conditions start the process?`,
        `Who receives the first submission?`,
        `What values do approval, rejection and recall write to Approval_Status__c?`,
        `Verify your answers against the XML, then audit real submissions in SOQL.`,
      ],
      solution: `Entry criteria: Data_Export_Requested__c = TRUE AND Priority = High (the booleanFilter is 1 AND 2).
Step-1 approver: the record owner's manager — ManagerOfRecordOwner + HierarchyToRecordOwner.
Transitions: Approve → Approval_Status__c = 'Approved', Reject → 'Rejected', Recall → 'Draft'.
Audit with:
SELECT Approval_Status__c, COUNT(Id) n FROM Case GROUP BY Approval_Status__c
SELECT ProcessInstanceId, TargetObjectId, ActorId, CompletedDate, StepStatus, Comments
FROM ProcessInstanceStep ORDER BY CreatedDate DESC LIMIT 20`,
    },
    {
      n: 2, type: 'exercise', title: 'Wire queues + assignment rules', level: 'Medium', mins: 15,
      brief: `Route new Cases to the right queue: High-priority work to one pool, everything else to another.`,
      steps: [
        `Create the two queues: High Priority Case Queue and Standard Case Queue.`,
        `Create an assignment rule on Case with a 1 OR 2 boolean filter.`,
        `Point entry 1 at High Priority Cases and entry 2 at the rest.`,
        `Create a test Case and confirm the Owner lands in the right queue.`,
      ],
      solution: `Setup → Queues → New Queues (High Priority Case Queue, Standard Case Queue) — queues must exist BEFORE the assignment rule references them, or creation throws.
Setup → Case → Assignment Rules: New Rule "Case Queue Routing", booleanFilter 1 OR 2; entry 1 = Priority = High → High Priority Case Queue; entry 2 = Standard → Standard Case Queue.
Assignment rules evaluate once at record creation and can assign to Queues — never to Roles. Make sure "Enable active assignment rules" is on, then insert a High-priority Case and read its Owner: it should be the High Priority Case Queue.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Build a Vacation Request approval', level: 'Medium', mins: 25,
      brief: `Reuse the shipped pattern to build your own time-off approval process end to end.`,
      steps: [
        `Create Leave_Request__c with Start_Date__c, End_Date__c and Status__c picklists.`,
        `Build an approval process: entry = blank Status, step 1 = manager of the requester.`,
        `Final approval actions → Status__c = 'Approved'; rejection → 'Rejected'.`,
        `Submit a request for approval and audit the decisions in SOQL.`,
      ],
      solution: `The structure mirrors Data_Export_Approval: entry criteria, one approval step, then final actions.
- Entry: ISBLANK(TEXT(Status__c)).
- Step: approver = ManagerOfRecordOwner.
- FinalApprovalActions: Status__c = 'Approved'. FinalRejectionActions: Status__c = 'Rejected'.
- Submit via the Submit for Approval button, then audit:
SELECT ProcessInstanceId, TargetObjectId, ActorId, CompletedDate, StepStatus, Comments
FROM ProcessInstanceStep ORDER BY CreatedDate DESC LIMIT 10

Compose declaratively: an optional flow sets Status__c = 'Pending' before submission; the approval process finalizes it. Flow sets the stage, the process delivers the verdict.`,
    },
  ],
  quiz: {
    title: 'Phase 7 Quiz · Approvals & Legacy', mins: 5,
    questions: [
      { q: `What two conditions make a Case eligible for the Data Export Approval?`,
        opts: [`Priority = High only`, `Data_Export_Requested__c = TRUE AND Priority = High`, `Status = New AND Owner = Queue`, `Any Case with a subject`], a: 1, why: `The entry criteria booleanFilter is 1 AND 2.` },
      { q: `Who is the approver in Step_1_Security_Admin?`,
        opts: [`A named user`, `The record owner`, `The owner's manager (hierarchy)`, `The System Administrator`], a: 2, why: `ManagerOfRecordOwner + HierarchyToRecordOwner — the hierarchy approver.` },
      { q: `Final rejection actions write which value?`,
        opts: [`Approved`, `Pending`, `Rejected`, `Draft`], a: 2, why: `Mark_Rejected sets Approval_Status__c = Rejected.` },
      { q: `Which object stores every approval step decision?`,
        opts: [`ProcessInstance`, `ProcessInstanceStep`, `ApprovalProcess`, `CaseHistory`], a: 1, why: `ProcessInstanceStep holds actor, step status, comments, date.` },
      { q: `Current Salesforce guidance on Process Builder?`,
        opts: [`Keep using it`, `It's grandfathered — migrate to Flow`, `Replaced by Workflow Rules`, `Only for Case routing`], a: 1, why: `Process Builder is deprecated-style; Flow Builder is the migration target.` },
    ]
  }
},

/* ─────────────────────────── PHASE 8 ─────────────────────────── */
{
  id: 'sales', n: 8, title: 'Sales & Marketing Apps', icon: '🎯', color: '#8B5CF6',
  tagline: 'Leads, pipeline, forecast & campaigns',
  guide: '08-sales-marketing.md',
  art: [
    { label: 'Opportunity fields (10 incl. formula)', href: 'force-app/main/default/objects/Opportunity' },
    { label: 'Forecast_Category_Closed_Mismatch rule', href: 'force-app/main/default/objects/Opportunity/validationRules' },
    { label: 'Sales & marketing SOQL set', href: 'scripts/soql/sales-marketing-apps.soql' },
    { label: 'AnalyticsService', href: 'force-app/main/default/classes/AnalyticsService.cls' },
  ],
  objectives: [
    'Configure lead statuses, record types and assignment rules',
    'Model the opportunity stage life cycle',
    'Use the RoadMap sales fields correctly',
    'Set up campaigns and attribute revenue',
  ],
  lessons: [
    {
      title: 'The Lead Lifecycle', mins: 8,
      blocks: [
        { t: 'code', lang: 'text', x: `New -> Watched -> Contacted -> Qualified (converted!)
                                 \\-> Recycle / Nurture` },
        { t: 'list', items: [
          `Lead Status picklist drives record types on Lead`,
          `Assignment rules route to owner/queue per criteria`,
          `Lead Convert → Account + Contact + Opportunity, with a mapping`,
          `Duplicate prevention at capture`,
        ]},
        { t: 'p', x: `RoadMap Lead fields: Lead_Status_Reason__c, Market__c, Import_Source__c, Campaign_Source__c, Consent_Given__c, Data_Entry_Complete__c plus the quality trio.` },
        { t: 'selfcheck', q: `What three records does lead conversion create?`, a: `An Account (company), a Contact (person) and an Opportunity (deal).` },
      ]
    },
    {
      title: 'Opportunity Stages & Forecast', mins: 12,
      blocks: [
        { t: 'table', head: ['Stage', 'Probability', 'Forecast'], rows: [
          ['Prospecting / Qualification', '10–20%', 'Pipeline'],
          ['Needs Analysis / Proposal', '50–70%', 'Best Case'],
          ['Negotiation', '80%', 'Commit'],
          ['Closed Won', '100%', 'Closed'],
          ['Closed Lost', '0%', 'Omitted'],
        ]},
        { t: 'code', lang: 'sql', x: `SELECT Forecast_Category__c,
       SUM(Weighted_Expected_Revenue__c) weighted
FROM Opportunity WHERE IsClosed = false
GROUP BY Forecast_Category__c` },
        { t: 'p', x: `The Forecast_Category_Closed_Mismatch validation rule stops closed deals without a category — the exact type of guardrail the exam loves.` },
        { t: 'selfcheck', q: `A feedback word: weighted forecast = ?`, a: `Amount × Probability — Weighted_Expected_Revenue__c, which zeroes out for closed records via IF(IsClosed, 0, …).` },
      ]
    },
    {
      title: 'The RoadMap Sales Fields', mins: 10,
      blocks: [
        { t: 'table', head: ['Field', 'Purpose'], rows: [
          ['Deal Health', 'Renewal vs at-risk signals'],
          ['Competitor', 'Which vendor we’re fighting'],
          ['Won Reason', 'Why the deal actually closed'],
          ['Next Step Owner', 'Who pushes it forward'],
          ['Sensitive Data', 'Compliance marker — trips the Sensitive Data Review Task flow'],
          ['Import Batch Number', 'Lineage back to the Phase 5 migration batch'],
          ['Approver Comments', 'Feeds the Phase 7 approval'],
        ]},
        { t: 'callout', kind: 'tip', x: `AnalyticsService.pipelineSummary(opportunities) computes openAmount, closedWon and weighted — the exact trio the Case/Revenue dashboards chart. Run block 6 of scripts/apex/service-invocation.apex and compare the debug map to the report numbers.` },
        { t: 'selfcheck', q: `Which field type drives "why did we win"?`, a: `A picklist — Won_Reason__c on Opportunity, reportable and consistent.` },
      ]
    },
    {
      title: 'Campaigns & Attribution', mins: 10,
      blocks: [
        { t: 'p', x: `A Campaign is a marketing initiative; CampaignMember is the many-to-many join to Contacts/Leads.` },
        { t: 'code', lang: 'sql', x: `SELECT cm.Campaign.Name, COUNT(cm.Id) members,
       SUM(cm.Opportunity.Amount) attributedRevenue
FROM CampaignMember cm
WHERE cm.Status = 'Responded'
GROUP BY cm.CampaignId, cm.Campaign.Name` },
        { t: 'callout', kind: 'tip', x: `Attribution models: First Touch / Last Touch / Even Distribution / Time-Decay — pick by where the credit belongs.` },
        { t: 'selfcheck', q: `Two campaigns touched a win; credit splits 50/50. Which model?`, a: `Even Distribution — equal credit across all touching campaigns.` },
      ]
    },
    {
      title: 'Sales User Enablement', mins: 8,
      blocks: [
        { t: 'list', items: [
          `Sales Path — guided stage navigation`,
          `Quick Actions — Log a Call, New Opportunity, Email from anywhere`,
          `Email Templates — canned, compliant responses`,
          `List Views — "Set as Filter Default" for the team`,
          `Forecasting config — sync to stage + category`,
        ]},
        { t: 'selfcheck', q: `Where do you make a list view the default filter for all users?`, a: `Admin → List View → Set as Filter Default.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Weighted-revenue game', level: 'Easy', mins: 10,
      brief: `Check your forecast math before you touch the reports.`,
      steps: [
        `A $50,000 deal at 40% probability — weighted revenue?`,
        `A $90,000 Closed Won deal — weighted revenue, and where does it land in the forecast?`,
        `Total weighted pipeline: $20,000 at 60% plus $30,000 at 80%.`,
      ],
      solution: `$50,000 × 0.40 = $20,000.
Closed Won → $0 in the weighted formula (IF(IsClosed, 0, …)) — it leaves Weighted Pipeline and moves to the Closed (won) forecast bucket. This is the forecast-category shift the exam loves.
Total weighted = (20,000 × 0.60) + (30,000 × 0.80) = 12,000 + 24,000 = $36,000.
Cross-check with:
SELECT Forecast_Category__c, SUM(Weighted_Expected_Revenue__c) weighted
FROM Opportunity WHERE IsClosed = false GROUP BY Forecast_Category__c`,
    },
    {
      n: 2, type: 'exercise', title: 'Stage the lead lifecycle', level: 'Medium', mins: 15,
      brief: `Leads enter as New and must convert into Accounts, Contacts and Opportunities — your org has no record types on Lead yet.`,
      steps: [
        `Design the lead-status picklist with a "Qualified = convertible" value.`,
        `Decide the lead assignment rule: geographic route by Region.`,
        `Set up Lead Convert with the Account-Contact-Opportunity mapping.`,
        `Prevent duplicates at capture with a matching rule on email/company name.`,
      ],
      solution: `Status picklist: New → Watched → Contacted → Qualified (convert) with Recycle / Nurture on a separate path. The Qualified value maps to the Converted status.
Assignment rule on Lead: Region (or Market__c) → routes to the EMEA/NAM/APAC queue or owner.
Lead Convert: mapping Account = Company + Contact = Lead name + Opportunity = auto-convert options. Conversion creates all three records.
Duplicate prevention: matching rule on Email + Company on Lead, activated as a Duplicate Rule with block/matching behavior — the same mechanics you used on Account in Phase 5.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Campaign attribution report', level: 'Medium', mins: 20,
      brief: `Prove which campaign drives revenue by building the CampaignMember → attributed revenue pipeline.`,
      steps: [
        `Create a Campaign (e.g. "Winter Webinar 2026") with an active record type.`,
        `Add Contacts as members and mark their status Responded.`,
        `Create an Opportunity and attribute revenue back to the campaign.`,
        `Write the SOQL that totals members and attributed revenue per campaign, then mirror it as a Campaign report.`,
      ],
      solution: `Attributed revenue per campaign:
SELECT cm.Campaign.Name, COUNT(cm.Id) members,
       SUM(cm.Opportunity.Amount) attributedRevenue
FROM CampaignMember cm
WHERE cm.Status = 'Responded'
GROUP BY cm.CampaignId, cm.Campaign.Name

In Report Builder: report type Campaigns with Campaign Members, add the related Opportunity object for Amount. If multiple campaigns touch a win, choose the attribution model (First Touch / Last Touch / Even Distribution / Time-Decay) — for a single-touch demo, Even Distribution keeps the credit fair. The repo's Campaign_Source__c field on Lead/Contact helps attribute inbound records too.`,
    },
  ],
  quiz: {
    title: 'Phase 8 Quiz · Sales & Marketing', mins: 5,
    questions: [
      { q: `What does lead conversion create?`,
        opts: [`A Contact and a Task`, `An Account, a Contact and an Opportunity`, `Two Contacts`, `An Account and a Case`], a: 1, why: `Conversion = Account + Contact + Opportunity via the mapping you configure.` },
      { q: `A $50k deal at 40% probability has weighted revenue of…`,
        opts: [`$50k`, `$20k`, `$10k`, `$5k`], a: 1, why: `Weighted = Amount × Probability = 50,000 × 0.40 = 20,000.` },
      { q: `When is a Closed Won opportunity NOT in the weighted forecast?`,
        opts: [`Never`, `When the formula's IF(IsClosed, 0, …) zeroes it`, `After a quarter ends`, `When the owner changes`], a: 1, why: `Weighted_Expected_Revenue__c returns 0 for closed records.` },
      { q: `Which object links Contacts to Campaigns for attribution?`,
        opts: [`CampaignMember`, `CampaignInfluence`, `Volunteers`, `OpportunityContactRole`], a: 0, why: `CampaignMember is the many-to-many junction.` },
      { q: `Which validation rule keeps forecast categories honest?`,
        opts: [`High_Priority_Requires_Subject`, `Forecast_Category_Closed_Mismatch`, `Require_Resolution_For_Closed`, `Negative_Data_Quality_Score`], a: 1, why: `It blocks closing a deal that lacks a forecast category.` },
    ]
  }
},

/* ─────────────────────────── PHASE 9 ─────────────────────────── */
{
  id: 'svc', n: 9, title: 'Service & Support Apps', icon: '🛟', color: '#06B6D4',
  tagline: 'Cases, queues, SLAs & escalations',
  guide: '09-service-support.md',
  art: [
    { label: 'Case fields (10 incl. formulas)', href: 'force-app/main/default/objects/Case' },
    { label: 'Case assignment rules', href: 'force-app/main/default/assignmentRules/Case.assignmentRules-meta.xml' },
    { label: 'Case_Escalation_Task flow', href: 'force-app/main/default/flows/Case_Escalation_Task.flow-meta.xml' },
    { label: 'Service SOQL set', href: 'scripts/soql/service-support-apps.soql' },
  ],
  objectives: [
    'Configure case statuses, queues and assignment rules',
    'Track SLAs with milestones and the first-response formula',
    'Drive escalations by severity and level',
    'Use the case automation in practice',
  ],
  lessons: [
    {
      title: 'The Case Lifecycle', mins: 8,
      blocks: [
        { t: 'code', lang: 'text', x: `New -> Working -> Escalated -> (On Hold) -> Closed` },
        { t: 'table', head: ['RoadMap Case field', 'Purpose'], rows: [
          ['SLA Severity', 'P1/P2/P3 — head of the SLA watch'],
          ['First Response Hours', 'Formula: ROUND((FirstRespondedDate - CreatedDate) * 24, 1)'],
          ['Escalation Level', 'The trigger lever for Case_Escalation_Task'],
          ['Root Cause Category', 'Why it really happened — reportable'],
          ['CSAT Score', 'Survey outcome for dashboards'],
          ['Approval Status', 'Pending → Approved / Rejected via the Phase 7 process'],
          ['Data Export Requested / Export Reason / Approved At', 'The Phase 7 approval-process fields'],
          ['Queue Assignment Checked', 'Guardrail for queued ownership'],
        ]},
        { t: 'p', x: `The Service Dashboard Stack pairs the operational view with posture and hygiene: Case_Operations_Dashboard (Open High Priority metric, Cases by Priority donut, Pending Data Exports metric), the Case_Volume_by_Priority report, and User_Security_Review_Report for reps' login posture (Phase 3).` },
        { t: 'selfcheck', q: `Which Case field tells an admin how fast the team first responded?`, a: `First_Response_Hours__c — the formula off FirstRespondedDate − CreatedDate.` },
      ]
    },
    {
      title: 'Queues & Assignment Rules', mins: 8,
      blocks: [
        { t: 'code', lang: 'sql', x: `SELECT Owner.Name, Priority, COUNT(Id) n
FROM Case GROUP BY Owner.Name, Priority ORDER BY n DESC` },
        { t: 'p', x: `High Priority Cases land in High Priority Case Queue; everything else in Standard Case Queue — the Phase 7 rules at work.` },
        { t: 'selfcheck', q: `Where would an admin verify a fresh Case's ownership?`, a: `On the Case's Owner field — the assignment rule evaluated at creation.` },
      ]
    },
    {
      title: 'SLAs, Entitlements & Milestones', mins: 10,
      blocks: [
        { t: 'table', head: ['', 'Entitlement', 'Entitlement Process'], rows: [
          ['What', 'Record-level SLA + milestones', 'The milestone machine'],
          ['Example', 'First Response, Resolution', 'Breach = email alert'],
        ]},
        { t: 'code', lang: 'sql', x: `SELECT CaseNumber, First_Response_Hours__c, Status
FROM Case WHERE First_Response_Hours__c > 4 ORDER BY First_Response_Hours__c DESC` },
        { t: 'callout', kind: 'warn', x: `A time-dependent milestone breach is the classic "which tool" question. Historically Workflow Time Triggers; today the safest default answer is a Scheduled Flow.` },
        { t: 'selfcheck', q: `What is the difference between an Entitlement and an Entitlement Process?`, a: `An entitlement defines the SLA on the record; the process defines the milestones that enforce it.` },
      ]
    },
    {
      title: 'Escalation Automation', mins: 10,
      blocks: [
        { t: 'p', x: `Case_Escalation_Task reacts when Escalation_Level__c > 1 and creates an escalation task — a faithful record-triggered flow.` },
        { t: 'code', lang: 'sql', x: `SELECT CaseNumber, Subject, Escalation_Level__c, Priority, Status
FROM Case WHERE Escalation_Level__c > 1 ORDER BY Escalation_Level__c DESC` },
        { t: 'selfcheck', q: `Which flow creates a task when a Case escalates past level one?`, a: `Case_Escalation_Task — the record-triggered flow on Case.` },
      ]
    },
    {
      title: 'The Export Approval Pair', mins: 10,
      blocks: [
        { t: 'num', items: [
          `Create a High Priority Case with Data_Export_Requested__c = TRUE`,
          `Data_Export_Approval_Request sets Approval_Status__c = Pending`,
          `Submit for approval (Data_Export_Approval)`,
          `Manager approves → Approval_Status__c = Approved`,
        ]},
        { t: 'callout', kind: 'tip', x: `This is the declarative composition pattern: a flow sets the stage, an approval process finalizes it.` },
        { t: 'selfcheck', q: `After the manager rejects, what does the recall/final action leave on the record?`, a: `Approval_Status__c = Rejected (or Draft after a recall).` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Read the case queue', level: 'Easy', mins: 10,
      brief: `Support health check in three queries.`,
      steps: [
        `Show Case volume by priority, largest first.`,
        `Show which Cases breached a 4-hour first response.`,
        `Show open High-priority Cases still sitting in a queue.`,
      ],
      solution: `Volume by priority:
SELECT Priority, COUNT(Id) n FROM Case GROUP BY Priority ORDER BY n DESC

Breach list:
SELECT CaseNumber, First_Response_Hours__c, Status
FROM Case WHERE First_Response_Hours__c > 4 ORDER BY First_Response_Hours__c DESC

Open high-priority work in a queue:
SELECT CaseNumber, Subject, Priority, Owner.Name
FROM Case
WHERE Priority = 'High' AND Status != 'Closed' AND Owner.Name LIKE '%Queue%'

First_Response_Hours__c is the formula off FirstRespondedDate − CreatedDate — your canary field for SLA behavior.`,
    },
    {
      n: 2, type: 'exercise', title: 'Design the escalation ladder', level: 'Medium', mins: 15,
      brief: `A P1 Case must escalate automatically. Which construct handles each rung of the ladder?`,
      steps: [
        `Case enters the team pool when it is created — which routing tool?`,
        `An SLA assigns "respond within 4h" — which objects?`,
        `Escalation_Level__c > 1 must create a follow-up task — which automation?`,
        `A 24-hour no-response must fire a reminder — which modern tool?`,
      ],
      solution: `Team pool → Assignment rule (evaluated once at creation) into the High Priority Case Queue.
SLA → Entitlement (record-level SLA) + Entitlement Process (milestones First Response / Resolution that enforce it).
Escalation task → Record-Triggered Flow (the shipped Case_Escalation_Task fires on Escalation_Level__c > 1).
24-hour reminder → Scheduled Flow — the modern replacement for the legacy Workflow time trigger.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Build an entitlement SLA', level: 'Medium', mins: 25,
      brief: `Give every premium customer Case a first-response SLA with a breach notification.`,
      steps: [
        `Create an Entitlement Process "Premium SLA" with a 4-hour First Response milestone and email action on breach.`,
        `Create the Entitlement record and attach it to the premium Account/Contact.`,
        `Set the Case's Service Contract / Entitlement association so milestones compute.`,
        `Create a test Case, confirm the milestone behavior, and note how the modern time action differs from legacy triggers.`,
      ],
      solution: `Setup → Entitlement Processes → New "Premium SLA": milestone First Response (target 4 hours) with an email alert action condition that fires when breached.
Setup → Entitlements → create a Premium SLA entitlement tied to the Account (with a start/end and + counts if wanted).
On the Case, the Entitlement association starts the milestone clock for First_Response_Hours__c.
The 4-hour breach action historically needed a Workflow time trigger; today the right tool is a Scheduled Flow with a time filter. Verify outcomes with:
SELECT CaseNumber, First_Response_Hours__c, Status
FROM Case WHERE First_Response_Hours__c > 4`,
    },
  ],
  quiz: {
    title: 'Phase 9 Quiz · Service & Support', mins: 5,
    questions: [
      { q: `Which object holds the two queues referenced by this repo's rules?`,
        opts: [`Group`, `Queue`, `Role`, `User`], a: 0, why: `Queues are a type of Group record — owner-less records wait there until claimed.` },
      { q: `What is the formula behind First_Response_Hours__c?`,
        opts: [`ROUND((FirstRespondedDate - CreatedDate) * 24, 1)`, `CreatedDate + 24`, `DaysSinceCreated * 2`, `Priority × Severity`], a: 0, why: `It converts the response delta into hours with one decimal.` },
      { q: `Which flow reacts to Escalation_Level__c > 1?`,
        opts: [`Case_Escalation_Task`, `Data_Import_Validation`, `Sensitive_Data_Review_Task`, `Handle_Data_Migration_Progress`], a: 0, why: `Case Escalation Task creates an escalation task on that condition.` },
      { q: `What is a milestone in Service Cloud?`,
        opts: [`A report filter`, `A point in the entitlement SLA life cycle`, `A picklist value`, `A price book entry`], a: 1, why: `Entitlement processes define milestones like First Response and Resolution.` },
      { q: `The equivalent of a Workflow Time Trigger today is…`,
        opts: [`A Scheduled Flow`, `A Validation Rule`, `A Queue`, `An Approval Step`], a: 0, why: `Time-dependent actions now map to scheduled flows.` },
    ]
  }
},

/* ─────────────────────────── PHASE 10 ─────────────────────────── */
{
  id: 'an', n: 10, title: 'Analytics', icon: '📊', color: '#14B8A6',
  tagline: 'Reports, folders, dashboards & SOQL',
  guide: '10-analytics.md',
  art: [
    { label: '7 reports', href: 'force-app/main/default/reports' },
    { label: '4 dashboards', href: 'force-app/main/default/dashboards' },
    { label: 'AnalyticsService', href: 'force-app/main/default/classes/AnalyticsService.cls' },
    { label: 'Analytics SOQL set', href: 'scripts/soql/analytics.soql' },
  ],
  objectives: [
    'Choose a report format: tabular, summary, matrix',
    'Read the seven shipped reports as XML',
    'Build the four shipped dashboards',
    'Mirror dashboards in SOQL + AnalyticsService',
  ],
  lessons: [
    {
      title: 'Report Formats', mins: 8,
      blocks: [
        { t: 'table', head: ['Format', 'Use it for', 'Shows'], rows: [
          ['Tabular', 'Raw listing', 'Columns only, no grouping'],
          ['Summary', 'Grouping + subtotals', 'Group by + chart friendly'],
          ['Matrix', 'Two dimensions', 'Row & column groupings'],
        ]},
        { t: 'callout', kind: 'warn', x: `Bucket fields only work in Summary and Matrix reports — not Tabular.` },
        { t: 'selfcheck', q: `You want to pivot by stage across quarters. Which format?`, a: `Matrix — groups by both rows and columns.` },
      ]
    },
    {
      title: 'The Seven RoadMap Reports', mins: 12,
      blocks: [
        { t: 'table', head: ['Report', 'Format', 'Primary object', 'Ask it answers'], rows: [
          ['Data_Quality_Score_Report', 'Summary', 'Account', 'Who scored below 80?'],
          ['Case_Volume_by_Priority', 'Summary', 'Case', 'Volume by priority'],
          ['Security_Audit_Status', 'Summary', 'Security_Audit__c', 'Open findings by risk'],
          ['User_Security_Review_Report', 'Tabular', 'User', 'Login posture'],
          ['Open_Migration_Batches', 'Summary', 'Data_Migration_Batch__c', 'Stuck loads'],
          ['Admin_Task_Completion', 'Summary', 'Admin_Task__c', 'Board health by type'],
          ['Training_Question_Coverage', 'Summary', 'Training_Question__c', 'Bank gaps by topic/difficulty'],
        ]},
        { t: 'code', lang: 'xml', x: `<!-- every report shares this skeleton -->
<columns><field>ACCOUNT.NAME</field><aggregate>Grouping</aggregate></columns>
<folder>Admin_Reports</folder>` },
        { t: 'selfcheck', q: `Which folder do the shipped reports live in, and why public?`, a: `Admin_Reports — public so the academy demo works out of the box.` },
      ]
    },
    {
      title: 'The Four Dashboards', mins: 12,
      blocks: [
        { t: 'table', head: ['Dashboard', 'Ask', 'Notable components'], rows: [
          ['Security_Posture', 'Am I secure?', 'High Risk Findings metric, Users Needing Review metric, Audits by Type bar'],
          ['Data_Quality', 'Is my data clean?', 'Duplicates Flagged metric, Accounts by Validation Status bar, Needs Review metric'],
          ['Case_Operations', 'Is support healthy?', 'Open High Priority metric, Cases by Priority donut, Pending Data Exports metric'],
          ['Certification_Progress', 'Are learners ready?', 'Study Plans On Track metric, Learners Ready metric, Questions by Topic bar'],
        ]},
        { t: 'code', lang: 'xml', x: `<components>
  <chartType>metric</chartType>
  <filter>Risk_Level__c = 'High' AND Status__c != 'Resolved'</filter>
</components>` },
        { t: 'callout', kind: 'tip', x: `Dashboards ship with runningUserId 005000000000001 and status draft — deployable in any DEV or scratch org.` },
        { t: 'selfcheck', q: `Which component shows a single number?`, a: `The metric component — e.g. "High Risk Findings".` },
      ]
    },
    {
      title: 'The SOQL Mirror', mins: 10,
      blocks: [
        { t: 'p', x: `Every dashboard question has a query. The analytics.soql set mirrors each dashboard 1:1.` },
        { t: 'code', lang: 'sql', x: `SELECT Status__c, COUNT(Id) plans, SUM(Hours_Per_Week__c) h
FROM Study_Plan__c GROUP BY Status__c

SELECT CALENDAR_YEAR(CreatedDate) yr, CALENDAR_MONTH(CreatedDate) mon, COUNT(Id) n
FROM Case WHERE CreatedDate = LAST_N_MONTHS:6
GROUP BY CALENDAR_YEAR(CreatedDate), CALENDAR_MONTH(CreatedDate)
ORDER BY yr, mon` },
        { t: 'selfcheck', q: `What does AnalyticsService.pipelineSummary return?`, a: `A Map of openAmount / closedWon / weighted — the exact trio dashboards chart.` },
      ]
    },
    {
      title: 'Exam Favorites', mins: 8,
      blocks: [
        { t: 'list', items: [
          `Bucket fields: ≤ 20 buckets, Summary/Matrix only`,
          `Chart types: bar / line / donut / metric`,
          `Dashboard filters slice without building 10 dashboards`,
          `Join reports only across standard objects`,
        ]},
        { t: 'selfcheck', q: `CRM dashboard that lets each viewer be the running user is…`, a: `A dynamic dashboard — each user sees the dashboard as themselves.` },
      ]
    },
    {
      title: 'Folders & Sharing', mins: 8,
      blocks: [
        { t: 'p', x: `Folders gate who can run reports and who can view dashboards — two separate access models.` },
        { t: 'table', head: ['Folder type', 'What it controls', 'Trap'], rows: [
          ['Report folder', 'Who can run/schedule reports', 'Does not control the dashboard view'],
          ['Dashboard folder', 'Who can view shared dashboards', 'A visible dashboard still needs report access'],
          ['Hidden', 'View-only via link/needs', 'Not browsable in the folder list'],
        ]},
        { t: 'list', items: [
          `Report folders control who runs reports; dashboard folders control who views.`,
          `Private / Public (view-all) / Hidden (view only, for the org in need) — the three visibility flavors.`,
          `Admin_Reports and Admin_Dashboards ship public so the Academy demo works out of the box.`,
        ]},
        { t: 'selfcheck', q: `A dashboard shows up but the report behind it is blank to a user. Why?`, a: `Folder access is two-staged — dashboard folder allows the view, but report-folder access still gates what the components render.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Pick the report format', level: 'Easy', mins: 8,
      brief: `Choose the format — Tabular, Summary or Matrix — for each ask.`,
      steps: [
        `A raw dump of every Account, no grouping.`,
        `Grouped Cases by Priority with counts and a chart.`,
        `A cross-tab of StageName across quarters.`,
        `You want to add a bucket field to break the data into bands.`,
      ],
      solution: `Raw dump → Tabular (columns only, no grouping).
Grouped + counts → Summary (group by + subtotals + chart friendly).
Stage across quarters → Matrix (two dimensions — row AND column groupings).
Bucket field → only Summary and Matrix support buckets — never Tabular.
If a report needs buckets AND rows/columns of a join, remember joins only work across standard objects and buckets cap at ~20.`,
    },
    {
      n: 2, type: 'exercise', title: 'Mirror a dashboard in SOQL', level: 'Medium', mins: 15,
      brief: `The Certification_Progress dashboard shows study-plan status and hours. Reproduce its numbers with one query.`,
      steps: [
        `Find how many plans are On Track vs Behind.`,
        `Total planned hours per status.`,
        `Then check Training_Question_Coverage — are Easy/Medium/Hard balanced per topic?`,
      ],
      solution: `Plans by status with summed hours:
SELECT Status__c, COUNT(Id) plans, SUM(Hours_Per_Week__c) hours
FROM Study_Plan__c GROUP BY Status__c

Bank balance by topic and difficulty:
SELECT Topic__c, Difficulty__c, COUNT(Id) n
FROM Training_Question__c GROUP BY Topic__c, Difficulty__c ORDER BY n DESC

The four shipped dashboards are each just one or two of these aggregation patterns (metric + bar) with dashboard filters — slice, don't build ten dashboards.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Build the admin command center', level: 'Medium', mins: 25,
      brief: `Compose a single dashboard from the shipped reports and their SOQL mirrors.`,
      steps: [
        `Create the Admin_Dashboards folder and mark it public, or reuse the shipped one.`,
        `Add three metric components: High-risk security findings, Duplicates flagged, Open High-priority Cases.`,
        `Add a bar chart of Cases by Priority and a donut of Security Audits by Type.`,
        `Make the dashboard dynamic so each viewer sees the org through their own permissions.`,
      ],
      solution: `Reference skeleton (every shipped report shares it):
<columns><field>ACCOUNT.NAME</field><aggregate>Grouping</aggregate></columns>
<folder>Admin_Reports</folder>

Components: the metric component is the single-number tile (e.g. "High Risk Findings" filtered by Risk_Level__c = 'High' AND Status__c != 'Resolved').
Bar/donut options come from the summary groups in Phase 9 and Phase 10 queries.
Dynamic dashboard = each viewer becomes the running user, so record-level security applies per viewer — perfect for an academy with mixed licenses. Compare your design to the shipped Case_Operations / Security_Posture dashboards.`,
    },
  ],
  quiz: {
    title: 'Phase 10 Quiz · Analytics', mins: 5,
    questions: [
      { q: `Which report format supports grouping AND subtotals?`,
        opts: [`Tabular`, `Summary`, `Joined`, `Trending`], a: 1, why: `Summary reports group and subtotal — the workhorse format.` },
      { q: `What is the report type?`,
        opts: [`The report format`, `The objects the report can include`, `The dashboard folder`, `The sharing rule`], a: 1, why: `Report types define primary + related objects.` },
      { q: `Which dashboard surfaces "Pending Data Exports"?`,
        opts: [`Data_Quality_Dashboard`, `Case_Operations_Dashboard`, `Security_Posture_Dashboard`, `Certification_Progress_Dashboard`], a: 1, why: `Case Operations tracks Approval_Status__c = Pending metrics.` },
      { q: `In which report formats can you add bucket fields?`,
        opts: [`Tabular and Joined`, `Summary and Matrix`, `Matrix and Joined`, `All formats`], a: 1, why: `Buckets require grouping — hence Summary/Matrix only.` },
      { q: `What does AnalyticsService.domainCoverage return?`,
        opts: [`Question counts per Training_Question__c topic`, `Opportunity amounts`, `Case response hours`, `User logins`], a: 0, why: `It tallies quiz-bank coverage by blueprint domain.` },
    ]
  }
},

/* ─────────────────────────── PHASE 11 ─────────────────────────── */
{
  id: 'rel', n: 11, title: 'Sandboxes & Release Management', icon: '🚀', color: '#6366F1',
  tagline: 'Sandbox types, deployments & runbooks',
  guide: '11-release-mgmt.md',
  art: [
    { label: 'ReleaseManagementService', href: 'force-app/main/default/classes/ReleaseManagementService.cls' },
    { label: 'Admin_Task__c object', href: 'force-app/main/default/objects/Admin_Task__c' },
    { label: 'sfdx-project.json', href: 'sfdx-project.json' },
    { label: 'Release SOQL set', href: 'scripts/soql/release-mgmt.soql' },
  ],
  objectives: [
    'Pick the right sandbox for the job',
    'Contrast change sets with SFDX/CLI deployments',
    'Use ReleaseManagementService for deploy readiness',
    'Run a deployment checklist: freeze → backup → validate → verify',
  ],
  lessons: [
    {
      title: 'Sandbox Types', mins: 8,
      blocks: [
        { t: 'table', head: ['Sandbox', 'Data', 'Refresh', 'Typical use'], rows: [
          ['Developer', 'Metadata only', 'Daily', 'Feature work'],
          ['Developer Pro', 'Metadata', 'Daily', 'Integration development'],
          ['Partial Copy', 'Sample data', 'Weekly', 'UAT / training'],
          ['Full', 'Production copy', '30 days', 'Dress rehearsal'],
        ]},
        { t: 'callout', kind: 'warn', x: `Never develop directly in Production. Metadata-first workflows + scratch orgs keep the release train honest.` },
        { t: 'p', x: `Every sandbox refreshes and recovers from production — no data clone forward. Solutions you build must be data-agnostic, which is why Admin_Task__c, Data_Migration_Batch__c and the security audit objects make great sandbox UAT fixtures.` },
        { t: 'selfcheck', q: `Which sandbox type copies production data?`, a: `Full — a complete production copy, refreshed up to every 30 days.` },
      ]
    },
    {
      title: 'Deployment Paths', mins: 10,
      blocks: [
        { t: 'table', head: ['Delivery', 'Tooling', 'Good for', 'Watch out'], rows: [
          ['Change Sets', 'Setup', 'Small UI-driven pushes', 'Non-transactional, no rollback granularity'],
          ['SFDX / DX', 'sf project deploy', 'Declarative + code, CI-friendly', 'Requires source-tracked project'],
          ['Metadata API', 'sf force mdapi', 'Scripted, versioned', 'Higher learning curve'],
        ]},
        { t: 'callout', kind: 'tip', x: `The exam duality: outbound change sets from a sandbox, inbound into another. Git + CLI deployments are the modern admin skill layered on top.` },
        { t: 'selfcheck', q: `In this repo, how would you dry-run a deployment?`, a: `sf project deploy start --check-only against a scratch org — no metadata hits production.` },
      ]
    },
    {
      title: 'ReleaseManagementService', mins: 10,
      blocks: [
        { t: 'code', lang: 'apex', x: `ReleaseManagementService.recommendedDeployOrder();  // dependency order
ReleaseManagementService.isInFreezeWindow(start, end); // "are we frozen?"
ReleaseManagementService.countComponents(files);      // deploy size estimate` },
        { t: 'code', lang: 'text', x: `Custom Objects → Fields → Validation Rules / Custom Metadata
→ Flows & Apex → Permission Sets → Reports / Dashboards` },
        { t: 'selfcheck', q: `Why deploy custom objects before the flows that touch them?`, a: `Because flows compile against the object metadata — the dependency order is compile-order.` },
      ]
    },
    {
      title: 'The Deployment Checklist', mins: 10,
      blocks: [
        { t: 'list', items: [
          `Freeze — announce the window (isInFreezeWindow)`,
          `Backup — Data Export + a package build`,
          `Validate — sf project deploy start --check-only`,
          `Deploy — push to the target org`,
          `Verify — smoke the post-launch queries`,
          `Document — update README.md + ARCHITECTURE.md`,
        ]},
        { t: 'code', lang: 'sql', x: `SELECT Id, Name, Record_Count__c, Successful_Records__c,
       Failed_Records__c
FROM Data_Migration_Batch__c ORDER BY CreatedDate DESC LIMIT 15` },
        { t: 'selfcheck', q: `After a release, how do you prove the import flow ran?`, a: `The smoke query — batches with populated counters and timestamps.` },
      ]
    },
    {
      title: 'Runbooks & the Admin Journal', mins: 8,
      blocks: [
        { t: 'list', items: [
          `Change management — who, what, when (SetupAuditTrail prints it)`,
          `Runbooks — recreate-any-piece instructions (this roadmap IS one)`,
          `Field dictionary — the *.field-meta.xml labels ARE the dictionary`,
          `Deploy history — ReleaseManagementService + deploy logs`,
        ]},
        { t: 'selfcheck', q: `Where does Salesforce itself record who changed what in Setup?`, a: `The Setup Audit Trail — Section, Action, CreatedBy, CreatedDate.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Pick the sandbox', level: 'Easy', mins: 8,
      brief: `Match each job to a sandbox type.`,
      steps: [
        `A developer needs metadata only, refreshed up to daily.`,
        `UAT with a slice of production data, refreshed weekly.`,
        `A full dress rehearsal including production data and volumes.`,
        `Integration development against metadata plus a bigger sandbox footprint.`,
      ],
      solution: `Metadata only, daily → Developer.
UAT with sample data, weekly → Partial Copy.
Full production copy, up to 30-day refresh → Full.
Integration development → Developer Pro (larger footprint than Developer).
Never develop directly in Production — metadata-first workflows and scratch orgs keep the release train honest.`,
    },
    {
      n: 2, type: 'exercise', title: 'Order-of-deployment logic', level: 'Medium', mins: 12,
      brief: `You are pushing a new object + fields + a flow + a permission set. Get the order right and say why.`,
      steps: [
        `What has to deploy before the flow that references it?`,
        `What has to exist before the permission set grants CRUD on it?`,
        `When do reports/dashboards deploy relative to the object?`,
        `Where does --check-only fit, and how do you verify post-deploy?`,
      ],
      solution: `The repo's own dependency order (ReleaseManagementService.recommendedDeployOrder):
Custom Objects → Fields → Validation Rules / Custom Metadata → Flows & Apex → Permission Sets → Reports / Dashboards.

- The object must exist before the flow compiles against it (compile-order requirement).
- The permission set references object CRUD, so the object deploys first.
- Reports/dashboards reference fields, so they are last.
Dry run first: sf project deploy start --check-only --source-dir force-app/main/default --target-org myDevOrg --wait 15
Verify post-deploy with smoke queries — batches with populated counters and timestamps: SELECT Id, Record_Count__c, Successful_Records__c, Failed_Records__c FROM Data_Migration_Batch__c ORDER BY CreatedDate DESC LIMIT 15`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Prep and dry-run a release', level: 'Medium', mins: 20,
      brief: `Plan a real release window: freeze check, validate, then document the run.`,
      steps: [
        `Announce the freeze and confirm the window via ReleaseManagementService.isInFreezeWindow.`,
        `Backup: run Data Export and capture the package version.`,
        `Dry-run the whole metadata with --check-only against a scratch org and fix any errors.`,
        `Deploy to the target, run the smoke queries, and update the README + ARCHITECTURE runbook entry.`,
      ],
      solution: `Freeze check in anonymous Apex:
ReleaseManagementService.isInFreezeWindow(Date.newInstance(2026,12,18), Date.newInstance(2026,12,25));
// returns true when today falls inside the window

Backup: Setup → Data Export → Export Now; store the ZIP and record the sfdx-project.json sourceApiVersion.
Dry run:
sf project deploy start --check-only --source-dir force-app/main/default --target-org scratch-org --wait 15

Deploy + verify: rerun without --check-only, then the smoke query above. Close the loop by documenting who/what/when — the Setup Audit Trail records every click, and README.md + ARCHITECTURE.md become the recreate-any-piece runbook.`,
    },
  ],
  quiz: {
    title: 'Phase 11 Quiz · Sandboxes & Release Mgmt', mins: 5,
    questions: [
      { q: `Which sandbox copies production data?`,
        opts: [`Developer`, `Developer Pro`, `Partial Copy`, `Full`], a: 3, why: `Full sandboxes provide a complete production copy for dress rehearsal.` },
      { q: `What is the primary difference between change sets and SFDX deployments?`,
        opts: [`Cost`, `Change sets are UI-driven; SFDX is source-driven and scriptable`, `Speed only`, `There is no difference`], a: 1, why: `SFDX pushes source from Git with CI/CD; change sets travel setup-to-setup.` },
      { q: `What does ReleaseManagementService.recommendedDeployOrder() return?`,
        opts: [`A list of metadata dependency order`, `A random order`, `The QA sign-off`, `The user's role`], a: 0, why: `It encodes Custom Objects → Fields → Rules/MDT → Flows/Apex → Permission Sets → Reports/Dashboards.` },
      { q: `What does --check-only achieve?`,
        opts: [`Deletes the org`, `Validates the deployment without committing to it`, `Refreshes a sandbox`, `Creates a change set`], a: 1, why: `It's the dry-run: compile against the target, change nothing.` },
      { q: `Which artifact serves as the org's runbook?`,
        opts: [`The Admin_Task__c journal`, `This RoadMap + README/ARCHITECTURE docs`, `The Recycle Bin`, `The login history`], a: 1, why: `Documentation that lets the next admin recreate any piece is the runbook.` },
    ]
  }
},

/* ─────────────────────────── PHASE 12 ─────────────────────────── */
{
  id: 'cert', n: 12, title: 'Certification Prep', icon: '🎓', color: '#D946EF',
  tagline: 'Exam blueprint, bank & study plans',
  guide: '12-certification-prep.md',
  art: [
    { label: 'CertificationPrepService', href: 'force-app/main/default/classes/CertificationPrepService.cls' },
    { label: 'Training_Question__c object', href: 'force-app/main/default/objects/Training_Question__c' },
    { label: 'Study_Plan__c object', href: 'force-app/main/default/objects/Study_Plan__c' },
    { label: 'Cert-prep SOQL set', href: 'scripts/soql/certification-prep.soql' },
  ],
  objectives: [
    'Know the Administrator exam blueprint & logistics',
    'Use Training_Question__c as a living bank',
    'Drive Study_Plan__c to exam day',
    'Build and score mock quizzes via the service',
  ],
  lessons: [
    {
      title: 'The Exam At a Glance', mins: 8,
      blocks: [
        { t: 'table', head: ['', 'Administrator'], rows: [
          ['Questions', '100'],
          ['Time', '105 minutes'],
          ['Passing', '~65%'],
          ['Cost', '~$200'],
          ['Registration', 'webassessor.com'],
          ['Delivery', 'In-person or online proctored'],
        ]},
        { t: 'callout', kind: 'tip', x: `Registration flow: create your Trailhead profile → register on webassessor.com → schedule a proctored slot.` },
        { t: 'selfcheck', q: `Where do you register for the Administrator exam?`, a: `webassessor.com — using your Trailhead profile credentials.` },
      ]
    },
    {
      title: 'The Blueprint Weights', mins: 8,
      blocks: [
        { t: 'table', head: ['Domain', 'Weight'], rows: [
          ['Configuration & Setup', '~25%'],
          ['Object Manager & Lightning App Builder', '~24%'],
          ['Service & Support Automation', '~15%'],
          ['Data & Analytics', '~15%'],
          ['Productivity & Collaboration', '~11%'],
          ['Sales & Marketing Applications', '~10%'],
        ]},
        { t: 'p', x: `Strategy from the weights: Configuration & Setup + Object Manager ≈ half the exam. That is exactly where Phases 2–7 of this RoadMap live.` },
        { t: 'selfcheck', q: `Which two domains together make up roughly half the exam?`, a: `Configuration & Setup (~25%) plus Object Manager & Lightning App Builder (~24%).` },
      ]
    },
    {
      title: 'Training_Question__c & the Bank', mins: 10,
      blocks: [
        { t: 'code', lang: 'sql', x: `SELECT Topic__c, COUNT(Id) questions
FROM Training_Question__c GROUP BY Topic__c ORDER BY questions DESC` },
        { t: 'table', head: ['Field', 'Purpose'], rows: [
          ['Training Question Number', 'AutoNumber TRQ-{00000}'],
          ['Question Text / Options A–D', 'The item'],
          ['Correct Answer / Explanation', 'Rationale'],
          ['Topic', 'Blueprint domain'],
          ['Difficulty', 'Easy / Medium / Hard'],
        ]},
        { t: 'selfcheck', q: `Which report answers "is my bank balanced across domains?"`, a: `Training_Question_Coverage — grouped by Topic and Difficulty.` },
      ]
    },
    {
      title: 'The Study Plan Engine', mins: 12,
      blocks: [
        { t: 'code', lang: 'apex', x: `Study_Plan__c plan =
    CertificationPrepService.startStudyPlan(learnerId, targetDate, hoursPerWeek);
CertificationPrepService.recordQuizResult(plan.Id, correct, total);
List<Training_Question__c> quiz =
    CertificationPrepService.buildQuiz(bank, 10);   // deterministic slice
Map<String, Integer> mix = CertificationPrepService.questionMix(bank);` },
        { t: 'p', x: `StudyPlanTrigger stamps Completed_Domains__c = '(none)' on insert — the trigger-light pattern you've now seen everywhere.` },
        { t: 'selfcheck', q: `What does recordQuizResult do to a Study Plan?`, a: `It logs the mock score and updates the plan's Completed_Domains__c and Status.` },
      ]
    },
    {
      title: 'The Prep Loop', mins: 10,
      blocks: [
        { t: 'num', items: [
          `Baseline — take a mock quiz`,
          `Gap-map — coverage + difficulty reports`,
          `Study by domain — revisit the weak phases`,
          `Mock weekly — recordQuizResult tracks it`,
          `Pressure drill — 100 questions in 90 minutes`,
          `Trailhead + Trailmix — pair every guide with the official hands-on orgs`,
          `Book it — webassessor.com; bring two IDs; read the proctor email`,
        ]},
        { t: 'code', lang: 'apex', x: `CertificationPrepService.buildQuiz(
    [SELECT Id FROM Training_Question__c], 10)` },
        { t: 'selfcheck', q: `What is the deterministic advantage of buildQuiz?`, a: `Same bank + same size → same quiz — reproducible flaky-pick debugging in QA.` },
      ]
    },
    {
      title: 'What the Exam Wants vs What the RoadMap Gives You', mins: 10,
      blocks: [
        { t: 'table', head: ['Exam wants', 'Where the RoadMap owns the answer'], rows: [
          ['Sharing design questions (profiles/PS/OWD/rules)', 'Phase 3 — Security Model'],
          ['Automation-by-tool (which tool for which job)', 'Phases 6–7 — Flow-first, legacy-aware'],
          ['Field/object vocabulary (__c, master-detail, validation)', 'Phases 1–2 — Fundamentals + Data Model'],
          ['Data mechanics (upsert/external IDs, duplicate merging)', 'Phase 5 — Data Management'],
          ['Analytics prims (formats, folders, bucket fields)', 'Phase 10 — Analytics'],
          ['Release mechanics (sandboxes, deployments)', 'Phase 11 — Sandboxes & Release Mgmt'],
        ]},
        { t: 'callout', kind: 'tip', x: `Every chapter in the docs SPA links straight back to the phase guide that owns the answer — weak phase, revisit the phase, re-quiz, move on.` },
        { t: 'selfcheck', q: `A scenario about sharing rules and OWD maps to which phase?`, a: `Phase 3 — Security Model — profiles, permission sets, OWD and sharing rules all live there.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Quiz yourself with a mock drive', level: 'Easy', mins: 10,
      brief: `Use the shipped question bank as your practice engine — no excuses.`,
      steps: [
        `Run the bank coverage query to find thin domains and missing difficulty levels.`,
        `Build a 10-question quiz with CertificationPrepService.buildQuiz.`,
        `Score it with recordQuizResult and write down your result against your Study Plan.`,
      ],
      solution: `Bank coverage:
SELECT Topic__c, Difficulty__c, COUNT(Id) n
FROM Training_Question__c
GROUP BY Topic__c, Difficulty__c ORDER BY n DESC

Build a quiz (deterministic: same bank + same size = same quiz):
List<Training_Question__c> quiz =
    CertificationPrepService.buildQuiz([SELECT Id FROM Training_Question__c], 10);
CertificationPrepService.recordQuizResult(planId, 7, 10);

Aim: every blueprint domain (Configuration & Setup, Object Manager, etc.) has Easy + Medium + Hard coverage. Fill gaps by adding Training_Question__c rows directly, then re-quiz to prove coverage.`,
    },
    {
      n: 2, type: 'exercise', title: 'Map your blueprint to a weekly plan', level: 'Easy', mins: 10,
      brief: `Design the six weeks leading to the exam using the blueprint weights as a calendar.`,
      steps: [
        `Which two domains together cover ≈50% of the exam? Give them weeks 1–2.`,
        `Weeks 3–4: cover the remaining domains in order of weight.`,
        `Week 5: mock quizzes + gap fixes, tracked on Study_Plan__c.`,
        `Week 6: pressure drills (100 questions in 90 min) plus review of every selfcheck block you missed.`,
      ],
      solution: `Configuration & Setup (~25%) + Object Manager & Lightning App Builder (~24%) = ≈50%. Give them weeks 1–2 (Phases 2–4).
Week 3: Service & Support + Data & Analytics (~30%).
Week 4: Productivity & Collaboration + Sales & Marketing (~21%).
Week 5: weekly mocks logged on Study_Plan__c — track Completed_Domains__c and fire recordQuizResult after every pass.
Week 6: pressure drills, 100 questions in 90 minutes, re-read every selfcheck block in the roadmap. Register at webassessor.com, book the slot, and walk in with the confidence the labs gave you.`,
    },
    {
      n: 3, type: 'project', title: 'Mini Project — Your 6-week exam plan', level: 'Medium', mins: 20,
      brief: `Build a Study_Plan__c, seed questions, and model your first two mock exams.`,
      steps: [
        `Create a Study_Plan__c: Certification = 'Salesforce Administrator', Hours_Per_Week = 10, target date six weeks out.`,
        `Start it with CertificationPrepService.startStudyPlan so Completed_Domains__c is stamped.`,
        `Add Training_Question__c rows until every blueprint domain has Easy + Medium + Hard representation.`,
        `Log your first two mocks with recordQuizResult and confirm the trajectory toward 65%.`,
      ],
      solution: `Anonymous Apex:
Study_Plan__c plan = CertificationPrepService.startStudyPlan(
    UserInfo.getUserId(), Date.today().addDays(42), 10);

Build and log mock results:
List<Training_Question__c> quiz =
    CertificationPrepService.buildQuiz([SELECT Id FROM Training_Question__c], 10);
// answer the questions offline
CertificationPrepService.recordQuizResult(plan.Id, correctCount, quiz.size());

The exam facts live here too: 100 questions, 105 minutes, ~65% passing, ~$200, register at webassessor.com. Study_Plan__c is your dashboard; the question bank is your mirror — both track whether you're ready, not just whether you "feel" ready.`,
    },
  ],
  quiz: {
    title: 'Phase 12 Quiz · Certification Prep', mins: 5,
    questions: [
      { q: `Which single answer reflects the Administrator exam facts?`,
        opts: [`60 questions, 90 min, 60%`, `100 questions, 105 min, ~65%`, `80 questions, 120 min, 70%`, `100 questions, 75 min, 50%`], a: 1, why: `100 questions · 105 minutes · ~65% passing · ~$200.` },
      { q: `Which domain carries the largest blueprint weight?`,
        opts: [`Data & Analytics`, `Sales & Marketing`, `Configuration & Setup`, `Productivity`], a: 2, why: `Configuration & Setup ~25% — the top of the blueprint.` },
      { q: `Which object stores the practice question bank?`,
        opts: [`Study_Plan__c`, `Training_Question__c`, `Security_Audit__c`, `Admin_Task__c`], a: 1, why: `Training_Question__c = question text, options, answer, topic, difficulty.` },
      { q: `What does CertificationPrepService.buildQuiz return?`,
        opts: [`A study plan`, `A list of questions`, `A report`, `A workflow rule`], a: 1, why: `It slices the bank into a deterministic quiz of the requested size.` },
      { q: `Which trigger stamps Completed_Domains__c on a new Study Plan?`,
        opts: [`UserTrigger`, `StudyPlanTrigger`, `AdminTaskTrigger`, `SecurityAuditTrigger`], a: 1, why: `StudyPlanTrigger writes '(none)' before the record is inserted.` },
    ]
  }
},

/* ─────────────────────────── PHASE 13 ─────────────────────────── */
{
  id: 'proj', n: 13, title: 'Real-World Projects', icon: '🏗️', color: '#EF4444',
  tagline: 'Five end-to-end builds that fuse every skill',
  guide: '13-real-world-projects.md',
  art: [
    { label: 'Full deployable metadata', href: 'force-app/main/default' },
    { label: 'Objects + fields reference', href: 'force-app/main/default/objects' },
    { label: 'Flows reference', href: 'force-app/main/default/flows' },
    { label: 'Projects SOQL set', href: 'scripts/soql/real-world-projects.soql' },
  ],
  objectives: [
    'Translate a business brief into a Salesforce configuration, not the other way round',
    'Combine data model, security, automation, data ops, analytics and releases in one build',
    'Self-verify each project against its acceptance criteria before peeking at solutions',
    'Practice the build → validate → demo cycle employers actually pay for',
  ],
  lessons: [
    {
      title: 'Build 1 · Sales Pipeline from Scratch', mins: 45,
      blocks: [
        { t: 'h', x: 'The business story' },
        { t: 'p', x: `Salt & Pine is a 40-person B2B software company that has been "managing" deals in spreadsheets. They hand you a blank Developer Edition org and one sentence: "give sales one pipeline we can all trust, from the first meeting to Closed Won." Everything you built in Phases 1–6, 8 and 10 goes into this.` },
        { t: 'callout', kind: 'tip', x: `What this fuses: Phase 1 (app + navigation), Phase 2 (object model + validation), Phases 3–4 (security), Phases 6–7 (Flow + approvals), Phase 5 (data hygiene), Phase 8 (stages / sales process), Phase 10 (pipeline analytics).` },
        { t: 'h', x: 'Build it' },
        { t: 'num', items: [
          `Configure the Sales app: App Manager → edit Sales → shape navigation for Reps, Managers and the VP.`,
          `Shape the deal: add Opportunity fields Deal_Type__c (picklist New / Expansion / Renewal), Max_Discount__c (%), Commission_Forecast__c, Lost_Reason__c, Champion_Name__c.`,
          `Create a custom object Sales_Territory__c with Region (picklist EMEA / AMER / APAC) and a Manage User lookup; link it from Account.`,
          `Validate (Object Manager → Opportunity → Validation Rules): Max_Discount__c ≤ 40; Lost_Reason__c required when closed lost; Amount > 0 on Closed Won.`,
          `Secure it: a Sales Rep profile with no FLS on Commission_Forecast__c, a Sales Manager role above Reps, and a sharing rule that opens a territory's accounts to its manager's team.`,
          `Automate it: a record-triggered Flow that stamps a "Call the champion" task when Stage becomes Proposal; an approval process that routes deals over 100k to the VP.`,
          `Load data: 20 accounts + 30 opportunities via Data Import Wizard; add a duplicate rule on Account (Name + Phone) and merge one test duplicate.`,
          `Prove it: Pipeline by Stage, Won vs Lost and Weighted Pipeline dashboards with three widgets (reuse the AnalyticsService logic from Phase 10).`,
        ]},
        { t: 'h', x: 'Acceptance — done when' },
        { t: 'list', items: [
          `A Rep logs in, sees only their own pipeline, and creates a deal from a Lead in under two minutes.`,
          `A Manager sees the team pipeline through the role hierarchy; the VP sees everything.`,
          `No deal closes above 40% discount — the validation rule blocks it at save time.`,
          `Every won deal got its champion called within 24 hours of the Proposal stage.`,
          `A double-click on Account names in the pipeline report shows zero duplicates.`,
        ]},
        { t: 'selfcheck', q: `Where do you hide one field from one profile without touching the object?`, a: `Field-Level Security — Object Manager → the object → Fields & Relationships → Field Accessibility, or Profile → Field Permissions.` },
      ]
    },
    {
      title: 'Build 2 · Service & Support Operations', mins: 40,
      blocks: [
        { t: 'h', x: 'The business story' },
        { t: 'p', x: `Northwind Support sells a 24/5 support plan. Cases arrive by phone, email and web and currently rot in a shared inbox. Build a service org: route work, enforce an SLA, escalate stuck tickets, and show ops where the backlog lives. Fuses Phases 3, 4, 6, 9 and 10.` },
        { t: 'h', x: 'Build it' },
        { t: 'num', items: [
          `Cases: set Status values (New, Assigned, Working, Escalated, Closed) and add Resolution_Notes__c, First_Response_Hours__c and Product__c.`,
          `Record types + picklists: Phone, Email and Web record types that drive routing and page layouts.`,
          `Queues + assignment: a Support queue per priority; an assignment rule that drops High-priority cases into the right queue.`,
          `Entitlement + SLA: a 24-hour entitlement with a "First response" milestone linked to accounts on the plan.`,
          `Automate: a record-triggered Flow that creates an escalation task for the on-call manager when a case passes 12 hours without resolution; an email alert when a case is created.`,
          `Knowledge: publish three articles (reset password, license key, billing query) and add the Knowledge component to the case layout.`,
          `Guardrails: a validation rule that prevents closing a case that still has open tasks; require Resolution_Notes__c on closed cases.`,
          `Prove it: dashboards for case volume by record type, average age and open-by-priority; export a Case_Operations-style report from Phase 9.`,
        ]},
        { t: 'h', x: 'Acceptance — done when' },
        { t: 'list', items: [
          `A web case lands in the right queue within a minute, not in an inbox.`,
          `Every plan account's case carries the 24-hour first-response milestone.`,
          `A 12-hour-old open case automatically escalates to the on-call manager.`,
          `Agents can close a case only with resolution notes and zero open tasks.`,
          `The ops dashboard shows today's backlog by priority in one glance.`,
        ]},
        { t: 'selfcheck', q: `Which two Setup tools route cases to queues based on record values?`, a: `Queues (to hold the work) + Assignment Rules (to put records into them by priority/record type).` },
      ]
    },
    {
      title: 'Build 3 · Data Migration & Dedupe', mins: 45,
      blocks: [
        { t: 'h', x: 'The business story' },
        { t: 'p', x: `Globex moves from an old CRM. The CEO says: "Move us over, don't lose a row, and don't create 400 duplicate accounts." You own the migration. Fuses Phases 5, 6, 7, 10 and 11.` },
        { t: 'h', x: 'Build it' },
        { t: 'num', items: [
          `Plan: add an External ID field Legacy_Id__c to Account, Contact and Opportunity.`,
          `Prepare: a normalization pass on the source file — strip spaces from Legacy_Id__c, trim names (the DataManagementService from Phase 5 does exactly this).`,
          `Spot-check the target schema: run the sample SOQL from Phase 5 before loading a single row.`,
          `Load: Data Loader upsert keyed on Legacy_Id__c — 100 accounts, then 150 contacts, then 120 opportunities.`,
          `Validate the import: after insert, a Flow flags records missing Owner, Phone or Website by stamping Validation_Status__c = Needs Attention.`,
          `Journal it: create a Data_Migration_Batch__c record logging source count, target count and status — the journaled-batch pattern from Phase 5.`,
          `Dedupe: duplicate rules with matching rules (Account: Name + Phone, then Website); merge the flagged set; re-run a duplicate-count report.`,
          `Prove it: a Data Migration Summary report (records in, flagged, merged, % clean) plus a data-quality dashboard.`,
        ]},
        { t: 'h', x: 'Acceptance — done when' },
        { t: 'list', items: [
          `Every legacy row exists exactly once: source count = target count and duplicate count = 0.`,
          `Nothing lost its history: field history shows no overwritten External IDs.`,
          `Duplicate accounts are merged and the new matching rules block repeats.`,
          `The migration batch journaled its progress for the audit trail.`,
          `You can replay the whole load from scratch in under an hour (the proof of an idempotent design).`,
        ]},
        { t: 'selfcheck', q: `Why upsert by External ID instead of by record Id during a migration?`, a: `Record Ids are per-org and never match the source system. An External ID is a stable, idempotent upsert key — the classic exam trap.` },
      ]
    },
    {
      title: 'Build 4 · Marketing Attribution & Lead Nurturing', mins: 40,
      blocks: [
        { t: 'h', x: 'The business story' },
        { t: 'p', x: `Aforma runs webinars and Google Ads and wants to finally know which one actually makes money — and to stop buying leads that go cold. Fuses Phases 3, 4, 6, 8 and 10.` },
        { t: 'h', x: 'Build it' },
        { t: 'num', items: [
          `Campaign structure: create campaigns (2026 Spring Webinar, Google Search — Competitor Terms) with member statuses Sent, Responded, Converted, Accepted.`,
          `Lead lifecycle: configure Lead Sources and Status values; set the conversion mapping to create Account / Contact / Opportunity.`,
          `Influence: enable Campaign Influence, set the primary-campaign model, and add the influenced-opportunity fields.`,
          `Nurture: a Flow that takes Responded webinar leads into a "Nurture — Product Updates" campaign, schedules an email alert, and bumps them up a level when they engage again.`,
          `Security: hide Budget__c on Campaign from reps via field-level security.`,
          `Prove it: a Campaign ROI report (cost vs influenced revenue by campaign) and a lead-conversion funnel dashboard.`,
        ]},
        { t: 'h', x: 'Acceptance — done when' },
        { t: 'list', items: [
          `Every converted opportunity shows which campaign influenced it.`,
          `The webinar campaign reports positive ROI; the ads campaign is visibly justified or killed.`,
          `Nurtured leads re-engage without human hand-holding.`,
          `Reps cannot see campaign budgets; marketers can — through the right profiles only.`,
        ]},
        { t: 'selfcheck', q: `Which Setup toggle lets one campaign claim credit for an opportunity's revenue?`, a: `Campaign Influence (Setup → Campaign Influence). The primary-campaign model caps attribution to a single campaign.` },
      ]
    },
    {
      title: 'Build 5 · Security Posture & Change Management', mins: 45,
      blocks: [
        { t: 'h', x: 'The business story' },
        { t: 'p', x: `A serious org: "Our auditor wants proof nobody saw revenue they shouldn't, and your boss wants changes shipped with tests, not surprises." You own security and release discipline. Fuses Phases 2, 3, 4 and 11.` },
        { t: 'h', x: 'Build it' },
        { t: 'num', items: [
          `OWD baseline: Accounts and Cases Private; document the sharing matrix (object × org-wide default × role × sharing rule).`,
          `Sharing: role hierarchy plus one sharing rule that opens the EMEA territory to its manager; build your own export-approval by reusing the Data_Export_Approval pattern from Phase 7.`,
          `Field-level security: hide Revenue, Bank_Account__c and Commission from agents; prove it via Profile → Field Accessibility.`,
          `User controls: login hours + IP ranges for the support team; delegated admin for the helpdesk (Phase 4).`,
          `Audit loop: enable login history and run the SecurityService candidate check — flag users inactive 90 days and review login frequency.`,
          `Change management: create a Developer sandbox, deploy a candidate change set / SFDX package, run the full test suite, then promote within a release-freeze window (Phase 11).`,
          `Prove it: a security-posture report (OWD map, FLS gaps, inactive users) plus the release runbook entry.`,
        ]},
        { t: 'h', x: 'Acceptance — done when' },
        { t: 'list', items: [
          `A support agent querying Account sees Revenue and Bank_Account__c disappear completely.`,
          `The EMEA manager sees their team's accounts only through the sharing rule — the matrix proves it.`,
          `Login history shows exactly who signed in, when and from where — and inactive users are flagged.`,
          `A change moved UI → sandbox → full tests → production with zero failed deployments and a runbook note.`,
        ]},
        { t: 'selfcheck', q: `A record is Private and a sharing rule grants access. What can still hide a field from that user?`, a: `Field-level security. Sharing controls row access; FLS controls column access — and FLS applies on top.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'exercise', title: 'Acceptance audit — run the five checklists', level: 'Medium', mins: 20,
      brief: `Before you open Phase 14, prove each project with SOQL. If anything fails, that query is your next task.`,
      steps: [
        `Open Developer Console → Query Editor and run the pipeline check from Build 1.`,
        `Run the service-backlog check: cases older than 12 hours with no active task.`,
        `Run the migration-integrity check: source count vs target count, then the duplicate count.`,
        `Run the security check: inactive-user candidates and their last login dates.`,
      ],
      solution: `Your acceptance queries:
\`\`\`
SELECT StageName, COUNT(Id) FROM Opportunity GROUP BY StageName

SELECT Id, Subject, Status, CreatedDate
FROM Case
WHERE Status != 'Closed' AND CreatedDate < LAST_N_DAYS:2
  AND Id NOT IN (SELECT WhatId FROM Task WHERE Status != 'Completed')

SELECT COUNT(Id) FROM Account
SELECT Name, COUNT(Id) n FROM Account GROUP BY Name HAVING COUNT(Id) > 1

SELECT UserName, UserRole.Name, IsActive, LastLoginDate
FROM User WHERE IsActive = true AND LastLoginDate < LAST_N_DAYS:90
\`\`\`
Any unexpected row is a fix-queue item. Do not open Phase 14 until every query returns what your build promised.`,
    },
    {
      n: 2, type: 'exercise', title: 'Traceability — map every deliverable to the phase that taught it', level: 'Easy', mins: 10,
      brief: `Prove the capstone really fuses the roadmap. For each Phase-13 deliverable below, name the phase (1–12) and the exact skill you used.`,
      steps: [
        `A validation rule that blocks a bad amount.`,
        `A sharing rule that opens a territory.`,
        `A record-triggered Flow creating a task.`,
        `An upsert keyed on an External ID.`,
        `A ratio of campaign cost to influenced revenue.`,
      ],
      solution: `Any defensible mapping is fine; the canonical one:
\`\`\`
Validation rule ........... Phase 2  (Object Manager & Data Model)
Sharing rule .............. Phase 3  (Security Model) + Phase 4 (roles/queues)
Record-triggered Flow ..... Phase 6  (Automation — Flows)
Upsert by External ID ..... Phase 5  (Data Management)
Campaign ROI .............. Phase 8  (Sales & Marketing) + Phase 10 (Analytics)
\`\`\`
If your traceability matrix has a blind spot — a deliverable you chose but never formally learned — you just found your next study topic.`,
    },
  ],
  quiz: {
    title: 'Phase 13 Quiz · Real-World Projects', mins: 5,
    questions: [
      { q: `Which combination of tools turns "can't close above a 40% discount" into enforcement?`,
        opts: [`A flow`, `A validation rule`, `An approval process`, `A report`], a: 1, why: `Validation rules reject bad data at save time — that is enforcement at the data layer.` },
      { q: `In Build 2, what routes an inbound Case into the right work queue?`,
        opts: [`Campaign influence`, `Queues + assignment rules`, `A validation rule`, `A role hierarchy`], a: 1, why: `Assignment rules place records into queues based on their values (record type, priority).` },
      { q: `Which key makes a Data Loader upsert idempotent in Build 3?`,
        opts: [`Record Id`, `External ID`, `Owner Id`, `AutoNumber`], a: 1, why: `External IDs are stable across systems; record Ids are per-org and never the source key.` },
      { q: `Which feature answers "which campaign produced this deal's revenue"?`,
        opts: [`Campaign Influence`, `Assignment rules`, `Dashboards`, `Field history`], a: 0, why: `Campaign Influence (with the primary model) attributes an opportunity to one campaign.` },
      { q: `In Build 5, what proves a change was safe to promote?`,
        opts: [`A dashboard`, `Full tests in a sandbox before deploying`, `Login history`, `A sharing rule`], a: 1, why: `Release discipline = sandbox, run the test suite, then promote inside a freeze window.` },
    ]
  }
},

/* ─────────────────────────── PHASE 14 ─────────────────────────── */
{
  id: 'sol', n: 14, title: 'Project Solutions', icon: '📘', color: '#22C55E',
  tagline: 'Gated worked answers for the five builds',
  guide: '14-project-solutions.md',
  art: [
    { label: 'Service classes reference', href: 'force-app/main/default/classes' },
    { label: 'Certification prep service', href: 'force-app/main/default/classes/CertificationPrepService.cls' },
    { label: 'Solutions SOQL set', href: 'scripts/soql/project-solutions.soql' },
    { label: 'Reports + dashboards', href: 'force-app/main/default/reports' },
  ],
  objectives: [
    'Compare your five builds against staff-level reference solutions',
    'Read the schema, security and automation decisions behind each project',
    'Re-derive the exact Flows, SOQL and dashboard specs that answer each brief',
    'Grade yourself against the acceptance criteria and name the gaps to fix',
  ],
  lessons: [
    {
      title: 'How to Use This Phase', mins: 8,
      blocks: [
        { t: 'p', x: `Phase 13 asked you to build five projects. This phase holds the reference solutions — deliberately gated behind a "have you tried it?" prompt so the learning loop stays yours: attempt → verify → compare → fix.` },
        { t: 'table', head: ['Project', 'Solution card'], rows: [
          ['Build 1 · Sales Pipeline', 'Solution — Sales Pipeline'],
          ['Build 2 · Service & Support', 'Solution — Service Operations'],
          ['Build 3 · Migration & Dedupe', 'Solution — Migration'],
          ['Build 4 · Campaign ROI', 'Solution — Attribution'],
          ['Build 5 · Security + Releases', 'Solution — Security Posture'],
        ]},
        { t: 'callout', kind: 'tip', x: `Rule of the loop: (1) attempt the build, (2) run the acceptance queries, (3) only then open the matching card below, (4) score yourself 1–5 per acceptance criterion and fix anything ≤ 3, (5) re-verify with the same query.` },
        { t: 'selfcheck', q: `Why are these solutions gated instead of one-button reveals?`, a: `The capstone's value is the attempt. The gate keeps the try-first, verify, compare, fix loop intact — the pattern you designed in Phase 13.` },
      ]
    },
  ],
  exercises: [
    {
      n: 1, type: 'project', title: 'Solution — Build 1 · Sales Pipeline from Scratch', level: 'Hard', mins: 30,
      brief: `The Salt & Pine sales org: compare your object model, security and automation against a staff-level reference build, then fix the gaps.`,
      steps: [
        `Run the five acceptance queries from Phase 13 in Developer Console.`,
        `Compare each component below with your own: validation rules, roles + sharing, champion-call Flow, >100k approval, dashboards.`,
        `Score yourself 1–5 per component, rebuild anything ≤ 3, and re-run the queries.`,
      ],
      solution: `Acceptance queries:
\`\`\`
SELECT StageName, COUNT(Id) FROM Opportunity GROUP BY StageName
SELECT Id, Name, Max_Discount__c FROM Opportunity WHERE Max_Discount__c > 40
\`\`\`

Objects & fields — what "clean" looks like:
- Opportunity: Deal_Type__c (New / Expansion / Renewal), Max_Discount__c (%), Commission_Forecast__c, Lost_Reason__c, Champion_Name__c.
- Sales_Territory__c: Region (EMEA / AMER / APAC), Manage User lookup; Account gets a territory lookup.

Validation rules (the enforcement layer — never flows, flows cannot stop a direct save):
- MaxDiscount: NOT(ISBLANK(Max_Discount__c)) && Max_Discount__c > 40
- LostReasonRequired: ISPICKVAL(StageName, 'Closed Lost') && ISPICKVAL(Lost_Reason__c, '')
- WonAmountPositive: ISPICKVAL(StageName, 'Closed Won') && (Amount = 0 || Amount < 0)

Security:
- Sales_Rep profile: no FLS on Commission_Forecast__c (column-level hide).
- Sales_Manager role above Reps → the role hierarchy rolls the pipeline up.
- Sharing rule: Accounts where Territory.Manage = the EMEA Manager → grant Read/Write to the EMEA team (lateral access the hierarchy cannot do).

Automation:
- Flow "Champion Call": record-triggered, fired when StageName changes to Proposal → Create Task (Subject = 'Call the champion', Due = today).
- Approval "Deal > 100k": entry criteria Amount > 100000 on a pending close → assignee = submitter's manager, final = VP.

Dashboards (3 widgets is the ask): Pipeline by Stage (bar), Won vs Lost (pie), Weighted pipeline by territory (donut).

The traps that matter: discount cap is a validation rule; commission hiding is FLS not profile deletion; role hierarchy = roll-up; sharing rules = lateral.`,
    },
    {
      n: 2, type: 'project', title: 'Solution — Build 2 · Service & Support Operations', level: 'Hard', mins: 30,
      brief: `The Northwind service org: check routing, entitlements, escalation and guardrails against the reference, then close your gaps.`,
      steps: [
        `Run the service-backlog acceptance query from Phase 13.`,
        `Compare queues/assignment, the 24h milestone, the 12-hour escalation Flow, Knowledge and the close guardrails.`,
        `Score 1–5 per component, fix anything ≤ 3, and re-verify with the query.`,
      ],
      solution: `Backlog check:
\`\`\`
SELECT Id, Subject, Status, CreatedDate
FROM Case WHERE Status != 'Closed' AND CreatedDate < LAST_N_DAYS:2
  AND Id NOT IN (SELECT WhatId FROM Task WHERE Status != 'Completed')
\`\`\`

Routing: one Support queue per priority; an assignment rule places new cases by Record Type + Priority into the correct queue. Record types (Phone / Email / Web) drive both the layouts and the routing.

Entitlement & SLA: a 24-hour entitlement with a "First response" milestone, attached to account Entitlements so only plan accounts carry the SLA.

Escalation (the 12-hour rule lives in a Flow, not a task):
- Record-triggered Flow on Case → gets Status. On creation start a paused check; 12 hours later (Scheduled path / waiting), if Status is still not Closed → Create Task for the on-call manager (escalation), Status = Escalated, email alert. Time-based branching is Flow territory — assignment rules cannot sleep.

Knowledge: 3 published articles (reset password, license key, billing) + the Knowledge component on the case record page. Agents resolve without re-asking.

Guardrails (validation, not politeness):
- ClosedReserved: an open Task still related → block close.
- ResolutionNotesRequired: ISPICKVAL(Status,'Closed') && ISBLANK(Resolution_Notes__c) → block.

Dashboards: Case volume by record type (bar), Average age (line), Open by priority (pie).

The trap: the escalation is a time-dependent Flow, not an assignment rule or an approval — time-bound logic belongs to Flow.`,
    },
    {
      n: 3, type: 'project', title: 'Solution — Build 3 · Data Migration & Dedupe', level: 'Hard', mins: 30,
      brief: `The Globex migration: compare your idempotent load, journaling and dedupe against the reference, then fix the gaps.`,
      steps: [
        `Run the integrity + duplicate acceptance queries from Phase 13.`,
        `Compare the External-ID schema, Data Loader mappings, batch journal, and duplicate/matching rules.`,
        `Score 1–5 per component and re-verify.`,
      ],
      solution: `Integrity checks:
\`\`\`
SELECT COUNT(Id) FROM Account
SELECT Name, COUNT(Id) n FROM Account GROUP BY Name HAVING COUNT(Id) > 1
\`\`\`

Schema: External ID Legacy_Id__c on Account, Contact and Opportunity — the single source of truth for loading (never record Ids, they do not survive migrations).

Data Loader maps (two passes to prove idempotency):
- Accounts: Upsert keyed on Legacy_Id__c → then Contacts, then Opportunities (child after parent — None for owner-based lookups first, reparent later).
- Re-run the same file: nothing changes (that is the idempotency proof).

Import validation: after upload, a Flow stamps Validation_Status__c = Needs Attention for records missing Owner, Phone or Website; a report lists them for the fix pass.

Journaling: Data_Migration_Batch__c holds Source_Count__c, Target_Count__c, Status__c and Start/End timestamps — same pattern the DataMigrationService uses to script a replayable batch (Phase 5).

Dedupe: duplicate rules with matching rules (Name + Phone, then Website) on Account. Merge the flagged set via the standard merge flow so history survives; then confirm HAVING COUNT(Id) > 1 returns nothing.

The trap: the merge must keep the master record's External ID — otherwise replaying the load resurrects the duplicate.`,
    },
    {
      n: 4, type: 'project', title: 'Solution — Build 4 · Marketing Attribution & Lead Nurturing', level: 'Hard', mins: 30,
      brief: `The Aforma attribution build: compare campaigns, influence, the nurture Flow and ROI reporting against the reference, then fix.`,
      steps: [
        `Run the campaign-influence + ROI checks (which opportunity names its campaign, what do the reports say).`,
        `Compare campaign structure, member statuses, the nurture Flow and the Budget FLS.`,
        `Score 1–5 per component and re-verify.`,
      ],
      solution: `Attribution checks:
\`\`\`
SELECT CampaignId, Campaign.Name, COUNT(Id)
FROM OpportunityContactRole WHERE IsPrimary = true GROUP BY CampaignId, Campaign.Name
SELECT Name, Influenced_Revenue__c, Campaign_Cost__c FROM Campaign
\`\`\`

Campaign structure: 2026 Spring Webinar + Google Search — Competitor Terms, with member statuses Sent → Responded → Converted → Accepted that mirror the real funnel.

Influence: enable Campaign Influence with the primary-campaign model — one campaign per opportunity. Add Influenced_Revenue__c + Campaign_Cost__c to Campaign for the ROI math.

Nurture Flow: record-triggered on CampaignMember when Status = Responded → add the member to "Nurture — Product Updates", schedule a follow-up email alert, and escalate a level when they re-engage (open or click). Cold leads are not written off — they are warmed.

Security: Budget__c hidden from the sales profiles with field-level security only; the marketing profile retains access.

Reporting: Campaign ROI = influenced revenue vs cost, one row per campaign — the data that ends or funds the ads spend. Conversion funnel dashboard shows Lead → MQL → Opportunity → Closed Won.

The trap: without the primary model enabled, multiple campaigns can claim one opportunity and the ROI math double-counts revenue.`,
    },
    {
      n: 5, type: 'project', title: 'Solution — Build 5 · Security Posture & Change Management', level: 'Hard', mins: 30,
      brief: `The auditor-ready org: compare your OWD matrix, FLS, audit loop and release discipline against the reference, then fix.`,
      steps: [
        `Run the FLS + inactive-user acceptance queries from Phase 13.`,
        `Compare the OWD matrix, sharing rules, delegated admin, login controls and the promotion runbook.`,
        `Score 1–5 per component and re-verify.`,
      ],
      solution: `Security checks:
\`\`\`
SELECT UserName, UserRole.Name, IsActive, LastLoginDate
FROM User WHERE IsActive = true AND LastLoginDate < LAST_N_DAYS:90
\`\`\`
(FLS is proven by logging in as an agent and running SELECT on Account — sensitive fields return null.)

OWD baseline: Accounts and Cases Private. Documented matrix: object × OWD × role hierarchy × sharing rules, signed off by the auditor.

Rows: role hierarchy rolls up within a territory; one sharing rule opens EMEA accounts to the EMEA manager's team. Reuse the Data_Export_Approval pattern for any sensitive export.

Columns: FLS hides Revenue, Bank_Account__c and Commission from agent profiles. Proof = Profile → Field Accessibility shows X (deny).

Users: login hours + IP ranges on the support team; delegated admin hands off user management to the helpdesk. The audit loop (Phase 3) flags 90-day-inactive users for deactivation.

Release discipline (Phase 11): Developer sandbox → candidate change set / SFDX package → run the full test suite → promote inside a documented freeze window → post-deploy verification queries in the runbook.

The traps: sharing governs rows, FLS governs columns (always check both); a release is not done until the post-promotion verification query passes.`,
    },
  ],
  quiz: {
    title: 'Phase 14 Quiz · Project Solutions', mins: 5,
    questions: [
      { q: `Which single pattern enforces a 40% max discount at save time?`,
        opts: [`A permission set`, `A validation rule`, `A role hierarchy`, `Campaign Influence`], a: 1, why: `Validation rules reject the save; nothing else coerces data at the database layer.` },
      { q: `In the Service Operations solution, why a Flow for the 12-hour escalation?`,
        opts: [`Flows own time-based thresholds`, `Flows replace approvals`, `Assignment rules handle timeouts`, `Tasks cannot be automated`], a: 0, why: `The escalation fires on elapsed time — time-based branching is Flow territory.` },
      { q: `Which detail guarantees a replay of the migration never double-loads a row?`,
        opts: [`AutoNumber`, `Upsert keyed on the External ID`, `Duplicate rules`, `Field history`], a: 1, why: `Idempotent upserts keyed on Legacy_Id__c make re-runs safe by construction.` },
      { q: `What made the ROI verdict ("webinar wins, ads dies") trustworthy in Build 4?`,
        opts: [`Login history`, `Primary-campaign influence + cost vs influenced revenue`, `Approval processes`, `A role hierarchy`], a: 1, why: `One-campaign attribution prevents double-counting revenue in the cost comparison.` },
      { q: `What proves a promoted change was safe, per the Security Posture solution?`,
        opts: [`A sharing rule`, `Full tests in a sandbox + post-promotion verification`, `A duplicate report`, `Field history`], a: 1, why: `Release discipline = sandbox tests → promote → verify with the runbook query.` },
    ]
  }
},

];

/* Value sub-question for aggregate purpose? no-op */
ACADEMY.forEach(m => {
  m.total = m.lessons.length;
  m.quizTotal = m.quiz.questions.length;
});