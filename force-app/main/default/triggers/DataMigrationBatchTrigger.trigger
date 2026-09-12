/*
 * When a batch record is created, publish a Data_Migration_Event__e so
 * integration subscribers can react immediately.
 */
trigger DataMigrationBatchTrigger on Data_Migration_Batch__c (after insert) {
  for (Data_Migration_Batch__c batch : Trigger.new) {
    DataMigrationService.publishBatchEvent(batch.Id, 'CREATED', 'batch opened');
  }
}