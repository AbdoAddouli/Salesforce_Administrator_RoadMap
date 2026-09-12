/*
 * DATA MANAGEMENT SERVICE TEST
 *
 * LEARNING FOCUS: Phase 5, Week 10 - Duplicate normalization, flagging and
 * validation statuses - the muscle behind the Data Quality dashboard.
 */
@isTest
private class DataManagementServiceTest {
  @isTest
  static void testNormalizeAccountName() {
    System.assertEquals(
      'acme',
      DataManagementService.normalizeAccountName('ACME Corporation'),
      'Suffixes and casing collapse to one key.'
    );
    System.assertEquals('acme', DataManagementService.normalizeAccountName('Acme, Inc.'));
    System.assertEquals('', DataManagementService.normalizeAccountName('  '));
  }

  @isTest
  static void testFindNameCollisions() {
    List<Account> accounts = new List<Account>{
      new Account(Name = 'Acme Corporation'),
      new Account(Name = 'ACME Inc'),
      new Account(Name = 'Solo Ltd')
    };

    Map<String, List<Account>> collisions = DataManagementService.findNameCollisions(accounts);
    System.assertEquals(1, collisions.size(), 'Only the Acme pair collides.');
    System.assertEquals(2, collisions.get('acme').size(), 'Both Acme records are listed.');
  }

  @isTest
  static void testFlagDuplicateAccounts() {
    List<Account> accounts = new List<Account>{
      new Account(Name = 'Globex Corporation'),
      new Account(Name = 'GLOBEX Inc'),
      new Account(Name = 'Unique Co')
    };

    DataManagementService.flagDuplicateAccounts(accounts);
    System.assert(accounts[0].Duplicate_Flag__c == true, 'Colliding record is flagged.');
    System.assert(accounts[1].Duplicate_Flag__c == true, 'Second colliding record is flagged.');
    System.assert(accounts[2].Duplicate_Flag__c == null, 'Unique record stays clean.');
  }

  @isTest
  static void testApplyValidationStatus() {
    List<Account> accounts = new List<Account>{
      new Account(Name = 'A', Data_Quality_Score__c = 90),
      new Account(Name = 'B', Data_Quality_Score__c = 40),
      new Account(Name = 'C', Data_Quality_Score__c = null)
    };

    DataManagementService.applyValidationStatus(accounts);
    System.assertEquals('Valid', accounts[0].Validation_Status__c);
    System.assertEquals('Needs Review', accounts[1].Validation_Status__c);
    System.assertEquals('Needs Review', accounts[2].Validation_Status__c);
  }
}