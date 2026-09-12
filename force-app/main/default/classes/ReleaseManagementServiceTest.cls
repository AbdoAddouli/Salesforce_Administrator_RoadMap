/*
 * RELEASE MANAGEMENT SERVICE TEST
 *
 * LEARNING FOCUS: Phase 11, Week 20 - Testing deploy order, coverage and
 * freeze-window logic that keeps releases boring.
 */
@isTest
private class ReleaseManagementServiceTest {
  @isTest
  static void testRecommendedDeployOrderIsComplete() {
    List<String> order = ReleaseManagementService.recommendedDeployOrder();
    System.assert(order.size() >= 6, 'The runbook must cover the whole metadata stack.');
    System.assert(order[0].startsWith('1.'), 'Parents (objects/fields) must deploy first.');
    System.assert(order[order.size() - 1].contains('tests'), 'Apex tests close the release.');
  }

  @isTest
  static void testUncoveredItemsFlaged() {
    Map<String, Integer> coverage = new Map<String, Integer>{
      'ApexClass' => 2,
      'Flow' => 0,
      'Report' => null,
      'ValidationRule' => 4
    };

    List<String> uncovered = ReleaseManagementService.uncoveredItems(coverage);
    System.assertEquals(2, uncovered.size(), 'Zero and null coverage both count as uncovered.');
    System.assert(uncovered.contains('Flow'));
    System.assert(uncovered.contains('Report'));
  }

  @isTest
  static void testFreezeWindowDetection() {
    Date today = System.today();
    System.assert(
      ReleaseManagementService.isInFreezeWindow(today, today.addDays(5)),
      'Today inside the window means frozen.'
    );
    System.assert(
      !ReleaseManagementService.isInFreezeWindow(today.addDays(-30), today.addDays(-20)),
      'Past windows never freeze today.'
    );
  }

  @isTest
  static void testCountComponents() {
    Map<String, List<String>> staged = new Map<String, List<String>>{
      'force-app' => new List<String>{ 'a.cls', 'b.cls' },
      'docs' => new List<String>{ 'readme.md' }
    };
    System.assertEquals(3, ReleaseManagementService.countComponents(staged));
  }
}