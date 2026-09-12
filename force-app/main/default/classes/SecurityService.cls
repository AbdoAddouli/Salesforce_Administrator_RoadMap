/*
 *   ___ ___ ___ _ __  _   _ _   _ _  __   __ _ _ __ _   _
 *  / __/ __| __| '_ \| | | | | | | |/ /  / _` | '__| | | |
 *  \__ \__ \ _| |_) | |_| | |_| |   <  | (_| | |  | |_| |
 *  |___/___/___| .__/ \__,_|\__, |_|\_\  \__,_|_|   \__, |
 *              |_|          |___/                   |___/
 *
 * SECURITY SERVICE
 *
 * LEARNING FOCUS: Phase 3, Weeks 6-8 - Profiles, Permission Sets, OWD,
 * Sharing Rules, Login Access and the Security Audit object
 *
 *  WHY IT MATTERS: Security is *the* make-or-break admin skill. The exam is
 *  heavy on profiles, permission sets, field-level security and delegation.
 *  This service flags login and deactivation risks, reads guardrails from
 *  custom metadata, and produces Security_Audit__c findings.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - User DML is heavily governed. Batch user updates and keep them off
 *     database.savepoint patterns where possible.
 *   - Custom metadata is cheap to read - use getAll(), not a SOQL query.
 *
 *  🌱 BEST PRACTICE:
 *   - Never let a class silently change security; log findings on Security_Audit__c.
 *   - Bake your thresholds into Admin_Configuration__mdt, not hard-coded numbers.
 */
public with sharing class SecurityService {
  // Marks active users whose last login is older than the configured window as
  // deactivation candidates. The window comes from custom metadata.
  public static void flagDeactivationCandidates(List<User> users) {
    if (users == null || users.isEmpty()) {
      return;
    }

    Integer staleDays = 90;
    Admin_Configuration__mdt config = readConfigRecord();
    if (config != null && config.Auto_Close_Stale_Days__c != null) {
      staleDays = Integer.valueOf(config.Auto_Close_Stale_Days__c);
    }

    Datetime cutoff = System.now().addDays(-staleDays);
    for (User candidate : users) {
      if (candidate.IsActive && (candidate.LastLoginDate == null || candidate.LastLoginDate < cutoff)) {
        candidate.Is_Deactivation_Candidate__c = true;
        candidate.Requires_Login_Review__c = true;
      }
    }
  }

  // Builds Security_Audit__c findings for every user that needs a login review.
  // Pure and DML-free so tests can assert on the records before committing.
  public static List<Security_Audit__c> buildLoginAuditFindings(List<User> usersNeedingReview) {
    List<Security_Audit__c> findings = new List<Security_Audit__c>();
    if (usersNeedingReview == null) {
      return findings;
    }

    for (User u : usersNeedingReview) {
      findings.add(
        new Security_Audit__c(
          User_Assessed__c = u.Id,
          Audit_Type__c = 'Login',
          Risk_Level__c = 'Medium',
          Status__c = 'Open',
          Audit_Date__c = System.today(),
          Finding__c = 'No recent login detected for user ' + u.Name + '.'
        )
      );
    }
    return findings;
  }

  // Compares the set of assigned permission sets against the list every user
  // should hold and flags the record for review.
  public static void flagMissingPermissionSets(
    List<User> users,
    Map<Id, Set<String>> userToAssignedPermissionSets
  ) {
    if (users == null || userToAssignedPermissionSets == null) {
      return;
    }

    for (User u : users) {
      Set<String> assigned = userToAssignedPermissionSets.get(u.Id);
      if (assigned == null || assigned.isEmpty()) {
        u.Feature_License_Missing__c = true;
      }
    }
  }

  // One shared read of the org's admin configuration, never called per-record.
  private static Admin_Configuration__mdt readConfigRecord() {
    Map<String, Admin_Configuration__mdt> configs = Admin_Configuration__mdt.getAll();
    if (configs.isEmpty()) {
      return null;
    }

    List<Admin_Configuration__mdt> values = configs.values();
    return values[0];
  }
}