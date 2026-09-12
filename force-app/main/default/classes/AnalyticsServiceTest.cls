/*
 * ANALYTICS SERVICE TEST
 *
 * LEARNING FOCUS: Phase 10, Weeks 18-19 - Asserting on KPI rollups, quiz
 * domain coverage and SLA averages.
 */
@isTest
private class AnalyticsServiceTest {
  @isTest
  static void testPipelineSummary() {
    List<Opportunity> opps = new List<Opportunity>{
      new Opportunity(
        Name = 'Open One',
        StageName = 'Prospecting',
        CloseDate = System.today().addDays(30),
        Amount = 10000,
        Probability = 50
      ),
      new Opportunity(
        Name = 'Won One',
        StageName = 'Closed Won',
        CloseDate = System.today().addDays(30),
        Amount = 5000
      ),
      new Opportunity(
        Name = 'Open Two',
        StageName = 'Qualification',
        CloseDate = System.today().addDays(60),
        Amount = 2000,
        Probability = 10
      )
    };
    insert opps;

    Map<String, Decimal> summary = AnalyticsService.pipelineSummary(opps);
    System.assertNotEquals(0, summary.get(AnalyticsService.OPEN_AMOUNT), 'Open amounts must roll up.');
    System.assertTrue(summary.get(AnalyticsService.WEIGHTED) > 0, 'Weighted revenue must be computed.');
  }

  @isTest
  static void testDomainCoverage() {
    List<Training_Question__c> questions = new List<Training_Question__c>{
      new Training_Question__c(Topic__c = 'Configuration and Setup', Difficulty__c = 'Easy'),
      new Training_Question__c(Topic__c = 'Configuration and Setup', Difficulty__c = 'Easy'),
      new Training_Question__c(Topic__c = 'Service and Support Applications', Difficulty__c = 'Hard')
    };

    Map<String, Integer> coverage = AnalyticsService.domainCoverage(questions);
    System.assertEquals(2, coverage.get('Configuration and Setup'));
    System.assertEquals(1, coverage.get('Service and Support Applications'));
  }

  @isTest
  static void testDomainCoverageIgnoresNullTopic() {
    List<Training_Question__c> questions = new List<Training_Question__c>{
      new Training_Question__c(Topic__c = null)
    };
    System.assert(AnalyticsService.domainCoverage(questions).isEmpty());
  }

  @isTest
  static void testAverageFirstResponseHoursFromFormula() {
    List<Case> cases = new List<Case>{
      new Case(Origin = 'Phone', Status = 'New'),
      new Case(Origin = 'Web', Status = 'New')
    };
    insert cases;

    // Simulate a reply: populate the formula input field.
    cases[0].FirstRespondedDate = System.now().addHours(2);
    cases[1].FirstRespondedDate = System.now().addHours(4);
    update cases;

    List<Case> replied = [
      SELECT Id, First_Response_Hours__c
      FROM Case
      WHERE Id IN :cases
    ];
    Decimal average = AnalyticsService.averageFirstResponseHours(replied);
    System.assert(average > 0, 'The formula must have populated response hours.');
    System.assert(average < 24, 'Sanity: reply windows measured in hours.');
  }
}