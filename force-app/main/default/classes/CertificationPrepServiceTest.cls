/*
 * CERTIFICATION PREP SERVICE TEST
 *
 * LEARNING FOCUS: Phase 12, Week 21 - Testing study-plan lifecycle, quiz
 * builds and difficulty coverage.
 */
@isTest
private class CertificationPrepServiceTest {
  @testSetup
  static void setup() {
    List<Training_Question__c> bank = new List<Training_Question__c>();
    for (Integer i = 0; i < 6; i++) {
      bank.add(
        new Training_Question__c(
          Name = 'Question ' + i,
          Question_Text__c = 'Sample question ' + i + '?',
          Option_A__c = 'A answer',
          Option_B__c = 'B answer',
          Option_C__c = 'C answer',
          Option_D__c = 'D answer',
          Correct_Answer__c = 'A',
          Topic__c = 'Configuration and Setup',
          Difficulty__c = i < 2 ? 'Easy' : 'Medium'
        )
      );
    }
    insert bank;
  }

  @isTest
  static void testStartStudyPlanPersists() {
    Study_Plan__c plan = CertificationPrepService.startStudyPlan(UserInfo.getUserId(), System.today().addDays(60), 5);

    System.assertNotEquals(null, plan.Id);
    System.assertEquals('Salesforce Administrator', plan.Certification__c);
    System.assertEquals('Not Started', plan.Status__c);
    System.assertEquals(1, [SELECT COUNT() FROM Study_Plan__c]);
  }

  @isTest
  static void testRecordQuizResultMovesToOnTrack() {
    Study_Plan__c plan = CertificationPrepService.startStudyPlan(
      UserInfo.getUserId(),
      System.today().addDays(90),
      6
    );

    CertificationPrepService.recordQuizResult(plan.Id, 9, 10);

    System.assertEquals(
      'On Track',
      [SELECT Status__c FROM Study_Plan__c WHERE Id = :plan.Id].Status__c,
      '90% readiness moves the plan to On Track.'
    );
  }

  @isTest
  static void testBuildQuizSizesToBank() {
    List<Training_Question__c> bank = [SELECT Id FROM Training_Question__c];

    List<Training_Question__c> five = CertificationPrepService.buildQuiz(bank, 5);
    System.assertEquals(5, five.size(), 'Quiz honors the requested size.');

    List<Training_Question__c> overRequest = CertificationPrepService.buildQuiz(bank, 999);
    System.assertEquals(bank.size(), overRequest.size(), 'Quiz never exceeds the bank size.');
  }

  @isTest
  static void testQuestionMixCountsDifficulties() {
    List<Training_Question__c> bank = [SELECT Difficulty__c FROM Training_Question__c];

    Map<String, Integer> mix = CertificationPrepService.questionMix(bank);
    System.assertEquals(2, mix.get('Easy'));
    System.assertEquals(4, mix.get('Medium'));
    System.assertEquals(0, mix.get('Hard'), 'No hard questions registered yet.');
  }
}