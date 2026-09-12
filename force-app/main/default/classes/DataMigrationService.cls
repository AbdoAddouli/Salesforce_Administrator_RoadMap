/*
 *  ____        _       __      ___                      _____                     _   _
 * |  _ \  __ _| |_ ___ \ \    / /__  __ _ ___  _ __    |_   _|__  __ _ _ __   __ _| | | | _ __ ___
 * | | | |/ _` | __/ _ \ \ \/\/ / _ \/ _` / __| | '_ \     | |/ _ \/ _` | '_ \ / _` | | | || '_ ` _ \
 * | |_| | (_| | ||  __/  \  /\  /  __/ (_| \__ \ | | | |    | |  __/ (_| | | | | (_| | |_| || | | | | |
 * |____/ \__,_|\__\___|   \/  \/ \___|\__,_|___/_| |_|    |_|\___|\__,_|_| |_|\__,_|\___/ |_| |_| |_|
 *
 * DATA MIGRATION SERVICE
 *
 * LEARNING FOCUS: Phase 5, Week 11 + Phase 11 - Import Wizard, Data Loader,
 * External IDs and the Data_Migration_Batch__c tracker
 *
 *  WHY IT MATTERS: bulk uploads are where clean orgs are won or lost. This
 *  service wraps the full lifecycle of a migration batch - open, progress,
 *  publish events, close - the same traceability a Data Loader run leaves behind.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - EventBus.publish is fire-and-forget: subscribers see the event but Apex
 *     triggers are not triggered for the publication itself.
 *   - Data Loader upserts need an External ID - never upsert on standard Ids.
 *
 *  🌱 BEST PRACTICE:
 *   - One batch = one object + one direction. Never mix payloads in one file.
 *   - Reuse batch numbers so re-runs overwrite prior failed attempts.
 */
public with sharing class DataMigrationService {
  // Opens a new migration batch and persists it. Returns the created record so
  // the caller can reuse its Id in follow-up journaling.
  public static Data_Migration_Batch__c openBatch(String objectName, Integer recordCount) {
    Data_Migration_Batch__c batch = new Data_Migration_Batch__c(
      Name = objectName + ' - ' + System.now().format('yyyy-MM-dd HH:mm'),
      Source_Object__c = objectName,
      Direction__c = 'Inbound',
      Record_Count__c = recordCount,
      Status__c = 'New',
      Started_At__c = System.now()
    );
    insert batch;
    return batch;
  }

  // Journals progress on a batch: keeps counts consistent and never lets the
  // counters drift into failure territory silently.
  public static void recordProgress(Data_Migration_Batch__c batch, Integer success, Integer failed) {
    if (batch == null) {
      return;
    }

    Integer succeeded = success == null ? 0 : success;
    Integer failures = failed == null ? 0 : failed;

    batch.Successful_Records__c = succeeded;
    batch.Failed_Records__c = failures;
    batch.Status__c = 'In Progress';

    if (batch.Record_Count__c != null && (succeeded + failures) >= batch.Record_Count__c) {
      batch.Status__c = 'Completed';
      batch.Completed_At__c = System.now();
    }

    update batch;
    publishBatchEvent(batch.Id, 'PROGRESS', 'success=' + succeeded + ',failed=' + failures);
  }

  // Publishes a platform event so integrations can watch the lifecycle of any
  // batch through EventBus, completely decoupled from the source object.
  public static void publishBatchEvent(Id batchId, String eventType, String payload) {
    Data_Migration_Event__e event = new Data_Migration_Event__e();
    event.Batch_Id__c = String.valueOf(batchId);
    event.Event_Type__c = eventType;
    event.Payload__c = payload;
    EventBus.publish(event);
  }

  // Closes a batch as Completed or Failed. Publishes the terminal event last.
  public static void closeBatch(Id batchId, Boolean successful) {
    Data_Migration_Batch__c batch = [
      SELECT Id, Name, Status__c, Completed_At__c
      FROM Data_Migration_Batch__c
      WHERE Id = :batchId
      LIMIT 1
    ];
    batch.Status__c = successful ? 'Completed' : 'Failed';
    batch.Completed_At__c = System.now();
    update batch;
    publishBatchEvent(batchId, 'CLOSED', 'success=' + successful);
  }
}