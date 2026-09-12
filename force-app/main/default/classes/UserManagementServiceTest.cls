/*
 * USER MANAGEMENT SERVICE TEST
 *
 * LEARNING FOCUS: Phase 4, Week 9 - Testing user defaults, onboarding
 * checklists and permission-set aggregation.
 */
@isTest
private class UserManagementServiceTest {
  @isTest
  static void testApplyOnboardingDefaults() {
    User u = new User(); // no onboarding fields set
    UserManagementService.applyOnboardingDefaults(new List<User>{ u });

    System.assertEquals('Not Started', u.Onboarding_Status__c);
    System.assertEquals(System.today(), u.Onboarding_Date__c);
    System.assertEquals('Standard User', u.Admin_Role__c);
  }

  @isTest
  static void testApplyOnboardingDefaultsKeepsExistingValues() {
    User u = new User(Onboarding_Status__c = 'Complete', Onboarding_Date__c = Date.newInstance(2026, 1, 1));
    UserManagementService.applyOnboardingDefaults(new List<User>{ u });

    System.assertEquals('Complete', u.Onboarding_Status__c, 'Existing values survive.');
    System.assertEquals(Date.newInstance(2026, 1, 1), u.Onboarding_Date__c);
  }

  @isTest
  static void testBuildOnboardingChecklist() {
    User u = buildTestUser('OnboardMe');
    insert u;

    List<Admin_Task__c> tasks = UserManagementService.buildOnboardingChecklist(u);
    System.assertEquals(3, tasks.size(), 'The standard checklist has three checks.');
    System.assertEquals(u.Id, tasks[0].Task_Owner__c);

    insert tasks;
    System.assertEquals(3, [SELECT COUNT() FROM Admin_Task__c]);
  }

  @isTest
  static void testPermissionSetCountMapRejectsNullInput() {
    Map<Id, Integer> counts = UserManagementService.permissionSetCountMap(null);
    System.assert(counts.isEmpty(), 'Null input yields an empty map.');
  }

  private static User buildTestUser(String lastName) {
    Profile standardProfile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
    return new User(
      Alias = lastName.left(8),
      Email = lastName.toLowerCase() + '@roadmap.example.com',
      EmailEncodingKey = 'UTF-8',
      LastName = lastName,
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US',
      TimeZoneSidKey = 'America/Los_Angeles',
      ProfileId = standardProfile.Id,
      Username = lastName.toLowerCase() + System.currentTimeMillis() + '@roadmap.example.com'
    );
  }
}