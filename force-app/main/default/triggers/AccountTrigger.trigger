/*
 * Account-level data-quality flagging and validation statuses run in the
 * DataManagementService, wired here so every account write stays consistent.
 */
trigger AccountTrigger on Account (before insert, before update) {
  DataManagementService.flagDuplicateAccounts(Trigger.new);
  DataManagementService.applyValidationStatus(Trigger.new);
}