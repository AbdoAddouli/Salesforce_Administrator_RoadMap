/*
 * DATA MODEL SERVICE TEST
 *
 * LEARNING FOCUS: Phase 2, Week 5 - Asserting on schema APIs and data-quality
 * scoring without depending on org data.
 */
@isTest
private class DataModelServiceTest {
  @isTest
  static void testComputeQualityScoreFullyPopulated() {
    Account account = new Account(Name = 'Healthy Account', Description = 'present');
    List<SObjectField> fields = new List<SObjectField>{
      Account.Name,
      Account.Description
    };

    Integer score = DataModelService.computeQualityScore(account, fields);
    System.assertEquals(100, score, 'A record with every inspected field set scores 100.');
  }

  @isTest
  static void testComputeQualityScoreHalfPopulated() {
    Account account = new Account(Name = 'Half Account');
    List<SObjectField> fields = new List<SObjectField>{
      Account.Name,
      Account.Description,
      Account.Phone,
      Account.Website
    };

    Integer score = DataModelService.computeQualityScore(account, fields);
    System.assertEquals(25, score, 'One of four populated fields scores 25.');
  }

  @isTest
  static void testMissingFieldsAreListed() {
    Account account = new Account(Name = 'Patchy Account');
    List<SObjectField> missing = DataModelService.missingFieldsFor(
      account,
      new List<SObjectField>{ Account.Name, Account.Description, Account.Phone }
    );

    System.assertEquals(2, missing.size(), 'Both missing fields must be reported.');
  }

  @isTest
  static void testDescribeObjectLabelFound() {
    System.assertEquals(
      'Account',
      DataModelService.describeObjectLabel('Account'),
      'A valid object API name resolves to its label.'
    );
    System.assertEquals(null, DataModelService.describeObjectLabel('Not_A_Real_Object__c'));
  }

  @isTest
  static void testFilterExistingObjects() {
    List<String> candidates = new List<String>{ 'Account', 'Case', 'Bogus__c' };
    List<String> existing = DataModelService.filterExistingObjects(candidates);

    System.assert(existing.contains('Account'), 'Account exists in every org.');
    System.assert(existing.contains('Case'), 'Case exists in every org.');
    System.assert(!existing.contains('Bogus__c'), 'Unknown objects are filtered out.');
  }
}