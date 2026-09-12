/*
 *     _       _                       _   _         __  __      _   _             _
 *    / \   __| |_   ___  _ __        | |_| |__  ___ \ \/ /_ __ | \ | | ___ _ __  (_)_ _   _ _ __
 *   / _ \ / _` | | | \ \/ /\ \ /     | __| '_ \/ _ \\  /| '_ \|  \| |/ _ \ '__|  | | | | | | '_ \
 *  / ___ \ (_| | |_| |>  <  \ V / _   | |_| | | |  __//  \| |_) | |\  |  __/ |    | | |_| | | | | |
 * /_/   \_\__,_|\__,_/_/\_\  \_/ (_)   \__|_| |_|\___/_/\_\ .__/|_| \_|\___|_|   |_|\__,_|_| |_|
 *                                                         |_|
 *
 * AUTOMATION SERVICE
 *
 * LEARNING FOCUS: Phase 6, Weeks 12-14 - Flow Builder, Scheduled Flows,
 * Approval Processes and Declarative Automation mastery
 *
 *  WHY IT MATTERS: Everything in the modern admin toolkit is automation. Flows
 *  are the star, but the quiz is unforgiving about when NOT to use them: use
 *  Apex for bulk rollups, use flows for point-and-click business logic.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - Record-triggered flows run per batch, not per record - never loop on the
 *     full DML set inside a flow for large updates.
 *   - Apex limits still apply to invocable flow calls; stay under the governor.
 *
 *  🌱 BEST PRACTICE:
 *   - Keep automation idempotent: re-running an automation must not double
 *     create tasks or assessments.
 */
public with sharing class AutomationService {
  // Auto-fills a default due date when a task is created without one. This is
  // the kind of "tiny" admin rule that hides in flow screen components.
  public static void applyDefaultDueDates(List<Admin_Task__c> tasks) {
    if (tasks == null || tasks.isEmpty()) {
      return;
    }

    Date defaultDue = System.today().addDays(7);
    for (Admin_Task__c task : tasks) {
      if (task.Due_Date__c == null) {
        task.Due_Date__c = defaultDue;
      }
    }
  }

  // Routes tasks by type to the right priority when none was supplied.
  public static void inferPriorities(List<Admin_Task__c> tasks) {
    if (tasks == null || tasks.isEmpty()) {
      return;
    }

    for (Admin_Task__c task : tasks) {
      if (String.isNotBlank(task.Priority__c)) {
        continue;
      }

      switch on task.Task_Type__c {
        when 'Security Review' {
          task.Priority__c = 'High';
        }
        when 'Deployment' {
          task.Priority__c = 'High';
        }
        when else {
          task.Priority__c = 'Medium';
        }
      }
    }
  }

  // Auto-closes tasks that went stale for the configured number of days.
  // Pure predicate builder - the caller runs the DML.
  public static List<Admin_Task__c> staleTasksToClose(List<Admin_Task__c> tasks, Integer staleDays) {
    List<Admin_Task__c> stale = new List<Admin_Task__c>();
    if (tasks == null) {
      return stale;
    }

    Date cutoff = System.today().addDays(-staleDays);
    for (Admin_Task__c task : tasks) {
      if (task.Status__c == 'Not Started' && task.Due_Date__c != null && task.Due_Date__c < cutoff) {
        stale.add(task);
      }
    }
    return stale;
  }

  // Counts open automation records per type - feeds the "Automation Build
  // Backlog" report without a single extra query in the caller.
  public static Map<String, Integer> openTaskCountByType(Set<String> types) {
    Map<String, Integer> counts = new Map<String, Integer>();
    if (types == null || types.isEmpty()) {
      return counts;
    }

    for (AggregateResult ar : [
      SELECT Task_Type__c type, COUNT(Id) cnt
      FROM Admin_Task__c
      WHERE Task_Type__c IN :types AND Status__c != 'Completed'
      GROUP BY Task_Type__c
    ]) {
      String type = (String) ar.get('type');
      Integer cnt = (Integer) ar.get('cnt');
      counts.put(type, cnt);
    }
    return counts;
  }
}