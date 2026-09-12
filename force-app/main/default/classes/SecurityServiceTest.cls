/*
 * SECURITY SERVICE TEST
 *
 * LEARNING FOCUS: Phase 3, Weeks 6-8 - Testing login reviews, deactivation
 * flags and permission-set audits with in-memory users.
 */
@isTest
private class SecurityServiceTest {
  @isTest
  static void testFlagDeactivationCandidatesFlagsStaleLogins() {
    User stale = new User(LastLoginDate = System.now().addDays(-200), IsActive = true);
    User fresh = new User(LastLoginDate = System.now(), IsActive = true);

    List<User> users = new List<User>{ stale, fresh };
    SecurityService.flagDeactivationCandidates(users);

    System.assert(stale.Is_Deactivation_Candidate__c == true, 'Stale login must flag the user.');
    System.assert(stale.Requires_Login_Review__c == true, 'Stale login triggers a login review.');
    System.assert(fresh.Is_Deactivation_Candidate__c == null, 'Recent login must not flag the user.');
  }

  @isTest
  static void testFlagDeactivationCandidatesFlagsNeverLoggedIn() {
    User neverLogged = new User(LastLoginDate = null, IsActive = true);
    SecurityService.flagDeactivationCandidates(new List<User>{ neverLogged });

    System.assert(neverLogged.Is_Deactivation_Candidate__c == true, 'Never logged in still risks deactivation.');
  }

  @isTest
  static void testBuildLoginAuditFindings() {
    User u = buildTestUser('AuditMe');
    insert u;

    List<Security_Audit__c> findings = SecurityService.buildLoginAuditFindings(new List<User>{ u });
    System.assertEquals(1, findings.size(), 'One user in, one finding out.');
    System.assertEquals('Login', findings[0].Audit_Type__c);
    System.assertEquals(u.Id, findings[0].User_Assessed__c);

    insert findings;
    System.assertEquals(1, [SELECT COUNT() FROM Security_Audit__c]);
  }

  @isTest
  static void testFlagMissingPermissionSets() {
    User u = buildTestUser('PermLess');
    insert u;

    Map<Id, Set<String>> assignments = new Map<Id, Set<String>>{ u.Id => new Set<String>() };

    List<User> users = new List<User>{ u };
    SecurityService.flagMissingPermissionSets(users, assignments);
    System.assert(u.Feature_License_Missing__c == true, 'No permission sets means a missing-feature flag.');

    u.Feature_License_Missing__c = false;
    Map<Id, Set<String>> granted = new Map<Id, Set<String>>{ u.Id => new Set<String>{ 'Standard' } };
    SecurityService.flagMissingPermissionSets(users, granted);
    System.assert(u.Feature_License_Missing__c == false, 'A granted set clears the flag.');
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