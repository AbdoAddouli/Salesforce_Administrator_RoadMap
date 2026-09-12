/*
 * Admin-task defaults are filled in by the AutomationService.
 */
trigger AdminTaskTrigger on Admin_Task__c (before insert) {
  AutomationService.applyDefaultDueDates(Trigger.new);
  AutomationService.inferPriorities(Trigger.new);
}