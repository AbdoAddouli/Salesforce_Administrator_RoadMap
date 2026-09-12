/*
 * AUTOMATION SERVICE TEST
 *
 * LEARNING FOCUS: Phase 6, Weeks 12-14 - Testing task defaults, priority
 * inference and stale-task automation in isolation from flows.
 */
@isTest
private class AutomationServiceTest {
  @isTest
  static void testApplyDefaultDueDates() {
    Admin_Task__c blank = new Admin_Task__c();
    Admin_Task__c dated = new Admin_Task__c(Due_Date__c = Date.newInstance(2030, 1, 1));

    AutomationService.applyDefaultDueDates(new List<Admin_Task__c>{ blank, dated });
    System.assertEquals(System.today().addDays(7), blank.Due_Date__c, 'Blank due date gets the default window.');
    System.assertNotEquals(blank.Due_Date__c, dated.Due_Date__c, 'Supplied due dates are untouched.');
  }

  @isTest
  static void testInferPriorities() {
    Admin_Task__c security = new Admin_Task__c(Task_Type__c = 'Security Review');
    Admin_Task__c dashboard = new Admin_Task__c(Task_Type__c = 'Dashboard');
    Admin_Task__c pinned = new Admin_Task__c(Task_Type__c = 'Dashboard', Priority__c = 'Low');

    AutomationService.inferPriorities(new List<Admin_Task__c>{ security, dashboard, pinned });
    System.assertEquals('High', security.Priority__c);
    System.assertEquals('Medium', dashboard.Priority__c);
    System.assertEquals('Low', pinned.Priority__c, 'Manually-set priority wins.');
  }

  @isTest
  static void testStaleTasksToClose() {
    Admin_Task__c stale = new Admin_Task__c(
      Status__c = 'Not Started',
      Due_Date__c = System.today().addDays(-100)
    );
    Admin_Task__c fresh = new Admin_Task__c(
      Status__c = 'Not Started',
      Due_Date__c = System.today().addDays(5)
    );
    Admin_Task__c done = new Admin_Task__c(
      Status__c = 'Completed',
      Due_Date__c = System.today().addDays(-100)
    );

    List<Admin_Task__c> staleOnes = AutomationService.staleTasksToClose(
      new List<Admin_Task__c>{ stale, fresh, done },
      30
    );

    System.assertEquals(1, staleOnes.size(), 'Only the stale open task qualifies.');
  }

  @isTest
  static void testOpenTaskCountByTypeUsesOnlyOpenTasks() {
    List<Admin_Task__c> tasks = new List<Admin_Task__c>{
      new Admin_Task__c(Name = 'T1', Task_Type__c = 'Deployment', Status__c = 'Not Started'),
      new Admin_Task__c(Name = 'T2', Task_Type__c = 'Deployment', Status__c = 'Completed'),
      new Admin_Task__c(Name = 'T3', Task_Type__c = 'Security Review', Status__c = 'In Progress')
    };
    insert tasks;

    Map<String, Integer> counts = AutomationService.openTaskCountByType(
      new Set<String>{ 'Deployment', 'Security Review' }
    );

    System.assertEquals(1, counts.get('Deployment'), 'Completed tasks are excluded from the backlog.');
    System.assertEquals(1, counts.get('Security Review'));
  }
}