/*
 * Security-audit bookkeeping: keeps the audit date field populated on first
 * creation.
 */
trigger SecurityAuditTrigger on Security_Audit__c (before insert) {
  for (Security_Audit__c audit : Trigger.new) {
    if (audit.Audit_Date__c == null) {
      audit.Audit_Date__c = System.today();
    }
  }
}