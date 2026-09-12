/*
 * Study-plan defaults: keeps a clean string list ready for quiz-rollup reports.
 */
trigger StudyPlanTrigger on Study_Plan__c (before insert) {
  for (Study_Plan__c plan : Trigger.new) {
    if (String.isBlank(plan.Completed_Domains__c)) {
      plan.Completed_Domains__c = '(none)';
    }
  }
}