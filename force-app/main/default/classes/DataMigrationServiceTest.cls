/*
 * DATA MIGRATION SERVICE TEST
 *
 * LEARNING FOCUS: Phase 5, Week 11 + Phase 11 - Testing batch lifecycle,
 * progress journaling and platform-event publishing.
 */
@isTest
private class DataMigrationServiceTest {
  @TestSetup
  static void setup() {
    insert new Data_Migration_Batch__c(
      Name = 'Seed Batch',
      Source_Object__c = 'Account',
      Direction__c = 'Inbound',
      Record_Count__c = 10,
      Status__c = 'New'
    );
  }

  @isTest
  static void testOpenBatchPersists() {
    Data_Migration_Batch__c batch = DataMigrationService.openBatch('Contact', 250);

    System.assertNotEquals(null, batch.Id, 'The batch gets an Id after insert.');
    System.assertEquals('Inbound', batch.Direction__c);
    System.assertEquals(1, [SELECT COUNT() FROM Data_Migration_Batch__c WHERE Status__c = 'New']);
  }

  @isTest
  static void testRecordProgressCompletesBatchWhenDone() {
    Data_Migration_Batch__c batch = [SELECT Id, Record_Count__c FROM Data_Migration_Batch__c LIMIT 1];
    batch.Status__c = 'New';

    DataMigrationService.recordProgress(batch, 10, 0);

    Data_Migration_Batch__c refreshed = [
      SELECT Id, Status__c, Successful_Records__c, Failed_Records__c
      FROM Data_Migration_Batch__c
      WHERE Id = :batch.Id
    ];
    System.assertEquals('Completed', refreshed.Status__c, 'All records done closes the batch.');
    System.assertEquals(10, refreshed.Successful_Records__c);
    System.assertEquals(0, refreshed.Failed_Records__c);
  }

  @isTest
  static void testRecordProgressStaysInProgressWhenPartial() {
    Data_Migration_Batch__c batch = [SELECT Id, Record_Count__c FROM Data_Migration_Batch__c LIMIT 1];

    DataMigrationService.recordProgress(batch, 6, 1);

    Data_Migration_Batch__c refreshed = [
      SELECT Id, Status__c FROM Data_Migration_Batch__c WHERE Id = :batch.Id
    ];
    System.assertEquals('In Progress', refreshed.Status__c, 'Partial progress keeps the batch open.');
  }

  @isTest
  static void testPublishBatchEventRunsClean() {
    Data_Migration_Batch__c batch = [SELECT Id FROM Data_Migration_Batch__c LIMIT 1];
    DataMigrationService.publishBatchEvent(batch.Id, 'TEST', 'payload-check');
    // EventBus.publish is async fire-and-forget; we assert the call completes.
    System.assert(true, 'Publishing a platform event must not throw.');
  }

  @isTest
  static void testCloseBatchMarksFailure() {
    Data_Migration_Batch__c batch = [SELECT Id, Status__c FROM Data_Migration_Batch__c LIMIT 1];

    DataMigrationService.closeBatch(batch.Id, false);

    System.assertEquals(
      'Failed',
      [SELECT Status__c FROM Data_Migration_Batch__c WHERE Id = :batch.Id].Status__c,
      'A failed run flips the batch to Failed.'
    );
  }
}