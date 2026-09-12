/*
 *  _   _ _ __  _   _ _ __ _ __       _ _ __  _   _ _   _ _   _     _
 * | | | | '_ \| | | | '__| '_ \   _| | '_ \| | | | | | | | | |   (_)
 * | |_| | | | | |_| | |  | | | | | | | | | | |_| | |_| | |_| |    _
 *  \___/|_| |_|\__,_|_|  |_| |_| \__/ |_| |_|\__,_|\___/ \___/   (_)
 *
 * USER MANAGEMENT SERVICE
 *
 * LEARNING FOCUS: Phase 4, Week 9 - Users, Roles, Profiles,
 * Permission Sets and Org Setup best practices
 *
 *  WHY IT MATTERS: You are the gatekeeper who turns a free trial into a secure
 *  org: profiles, roles, permission sets, login policies - this service
 *  automates the grunt work of the org-setup exam domain.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - You cannot insert or update a Profile or a Role in Apex (Metadata API only).
 *   - Bulkify your user DML and respect the 10 000-row platform limit.
 *
 *  🌱 BEST PRACTICE:
 *   - Set ownership metadata (Onboarding_Status, Access_Level) at creation time
 *     so dashboards, reports and validation rules have something to filter on.
 */
public with sharing class UserManagementService {
  // Enriches newly created or imported users with the org's onboarding defaults.
  // Safe in a before-insert trigger or in anonymous Apex bulk-ups.
  public static void applyOnboardingDefaults(List<User> users) {
    if (users == null || users.isEmpty()) {
      return;
    }

    for (User u : users) {
      if (u.Onboarding_Status__c == null) {
        u.Onboarding_Status__c = 'Not Started';
      }
      if (u.Onboarding_Date__c == null) {
        u.Onboarding_Date__c = System.today();
      }
      if (u.Admin_Role__c == null) {
        u.Admin_Role__c = 'Standard User';
      }
    }
  }

  // Automatically creates the onboarding checklist as a list of
  // Admin_Task__c records. The caller is responsible for DML.
  public static List<Admin_Task__c> buildOnboardingChecklist(User u) {
    if (u == null) {
      return new List<Admin_Task__c>();
    }

    Datetime dueBase = System.now().addDays(14);

    List<Admin_Task__c> tasks = new List<Admin_Task__c>{
      new Admin_Task__c(
        Name = 'Profile and License Review',
        Task_Type__c = 'Security Review',
        Priority__c = 'High',
        Status__c = 'Not Started',
        Due_Date__c = dueBase.date(),
        Task_Owner__c = u.Id,
        Related_Object__c = 'User'
      ),
      new Admin_Task__c(
        Name = 'Verify Permission Sets',
        Task_Type__c = 'Onboarding',
        Priority__c = 'Medium',
        Status__c = 'Not Started',
        Due_Date__c = dueBase.date().addDays(7),
        Task_Owner__c = u.Id,
        Related_Object__c = 'User'
      ),
      new Admin_Task__c(
        Name = 'Record Ownership Handoff',
        Task_Type__c = 'Onboarding',
        Priority__c = 'Medium',
        Status__c = 'Not Started',
        Due_Date__c = dueBase.date().addDays(10),
        Task_Owner__c = u.Id,
        Related_Object__c = 'Account'
      )
    };
    return tasks;
  }

  // Returns a map of UserId -> the number of permission sets assigned.
  // An empty map is a yellow flag for the security service to investigate.
  public static Map<Id, Integer> permissionSetCountMap(List<User> users) {
    Map<Id, Integer> counts = new Map<Id, Integer>();
    if (users == null || users.isEmpty()) {
      return counts;
    }

    Set<Id> userIds = new Set<Id>();
    for (User u : users) {
      userIds.add(u.Id);
      counts.put(u.Id, 0);
    }

    List<AggregateResult> results = [
      SELECT AssigneeId userId, COUNT(Id) cnt
      FROM PermissionSetAssignment
      WHERE AssigneeId IN :userIds
      GROUP BY AssigneeId
    ];
    for (AggregateResult ar : results) {
      Id uid = (Id) ar.get('userId');
      Integer c = (Integer) ar.get('cnt');
      counts.put(uid, c);
    }
    return counts;
  }
}