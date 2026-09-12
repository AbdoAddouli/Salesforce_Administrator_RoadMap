// ============================================
// Service Invocation Playground - Administrator RoadMap
// ============================================
// Execute in Developer Console > Anonymous Apex, or highlight + run selected
// text in VS Code (SFDX: Execute Anonymous Apex with Currently Selected Text).
//
// The RoadMap's Apex lives in thin triggers that delegate to services.
// Run each block below to see the services behave in a real org.

// 1. Schema discovery: DataModelService answers admin questions about org
System.debug(DataModelService.describeObjectLabel('Account'));

// 2. Trigger wiring: UserTrigger -> UserManagementService.applyOnboardingDefaults
User u = new User(
    FirstName = 'Demo', LastName = 'Learner',
    Email = 'demo.learner@example.com',
    Username = 'demo.learner' + Datetime.now().getTime() + '@example.com',
    Alias = 'dlrnr', CommunityNickname = 'demo' + Datetime.now().getTime(),
    TimeZoneSidKey = 'America/New_York', LocaleSidKey = 'en_US',
    EmailEncodingKey = 'UTF-8', LanguageLocaleKey = 'en_US',
    ProfileId = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1].Id
);
insert u;
System.debug('Onboarding_Status__c after insert: ' + u.Onboarding_Status__c);

// 3. Security lens: flag stale login candidates without any DML
User stale = new User(Name = 'Test Stale User', IsActive = true, LastLoginDate = null);
List<User> candidates = new List<User>{ stale };
SecurityService.flagDeactivationCandidates(candidates);
System.debug('Is_Deactivation_Candidate__c: ' + stale.Is_Deactivation_Candidate__c);

// 4. Data management: normalized names + collision map for a Data Loader run
List<Account> seed = new List<Account>{
    new Account(Name = 'ACME Corp'),
    new Account(Name = 'acme corp')
};
System.debug(DataManagementService.findNameCollisions(seed));

// 5. Certification prep: build a 2-question mock out of an empty bank
System.debug(
    'Mock quiz size from empty bank: ' +
    CertificationPrepService.buildQuiz(new List<Training_Question__c>(), 2).size()
);

// 6. Analytics: the pipeline math used by the dashboard reports
List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Opp A', Amount = 10000, Probability = 50),
    new Opportunity(Name = 'Opp B', Amount = 20000, IsClosed = true, IsWon = true)
};
System.debug(AnalyticsService.pipelineSummary(opps));

// 7. Migration choreography: open -> progress -> close (real DML on the object)
Data_Migration_Batch__c batch = DataMigrationService.openBatch('Account', 100);
DataMigrationService.recordProgress(batch, 95, 5);
DataMigrationService.closeBatch(batch.Id, true);
System.debug('Batch status after close: ' + [SELECT Status__c FROM Data_Migration_Batch__c WHERE Id = :batch.Id].Status__c);