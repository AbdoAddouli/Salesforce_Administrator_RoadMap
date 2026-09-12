/*
*  ____      _       _____                                    __  __   _                 _   _
 * |  _ \ ___ | | ___ | ___|_ __ __ _ _ __ ___   ___  _ __ ___|  \/  | | |_ _ __ __ _  | | | | __ _ _ __   __ _
 * | |_) / _ \| |/ _ \|  _| | '_ ` _ \| '_ ` _ \ / _ \| '_ \ _ \ |\/| | | __| '__/ _` | |_| | |/ _` | '_ \ / _` |
 * |  _ < (_) | | (_) | |___| | | | | | | | | | (_) | | | | __> |  | | | |_| | | (_| | |_| | | (_| | | | | (_| |
 * |_| \_\___/|_|\___/|_____|_| |_| |_|_| |_| |_|\___/|_| |_|  |_|  |_|  \__|_|  \__,_|  |_| |_|\__,_|_| |_|\__, |
 *                                                                                                            |___/
 *
 * RELEASE MANAGEMENT SERVICE
 *
 * LEARNING FOCUS: Phase 11, Week 20 - Sandboxes, Change Sets,
 * Metadata Deployments and Documentation culture
 *
 *  WHY IT MATTERS: careers are made on the deploy night that goes smoothly.
 *  This service computes impact lists and dry-runs release checklists so the
 *  checklist culture is as strong as the clicks. The exam loves order-of-
 *  operations questions for validation rules vs. triggers vs. flows.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - Deploy order matters: metadata parents before children, permission sets
 *     after the objects they reference.
 *   - Never deploy from production; always lift from a scratch org or sandbox.
 *
 *  🌱 BEST PRACTICE:
 *   - A release is not done until the rollback plan and the docs exist.
 *   - Prefer a pipeline (sf project deploy start) over unversioned change sets.
 */
public with sharing class ReleaseManagementService {
  // Returns the recommended deploy order for the metadata in this repository as
  // a numbered checklist the release runbook can render.
  public static List<String> recommendedDeployOrder() {
    return new List<String>{
      '1. Custom objects and fields (parents first)',
      '2. Validation rules and field updates',
      '3. Custom metadata and platform events',
      '4. Apex classes (then triggers that call them)',
      '5. Permission sets and profiles',
      '6. Flows, approval processes, assignment rules',
      '7. Reports, dashboards and email templates',
      '8. Run Apex tests before the final commit'
    };
  }

  // Flags configuration items that still lack coverage in a release plan.
  // Expects component -> planned item count, where 0 means "uncovered".
  public static List<String> uncoveredItems(Map<String, Integer> coverage) {
    List<String> uncovered = new List<String>();
    if (coverage == null) {
      return uncovered;
    }

    for (String component : coverage.keySet()) {
      if (coverage.get(component) == null || coverage.get(component) == 0) {
        uncovered.add(component);
      }
    }
    uncovered.sort();
    return uncovered;
  }

  // Safety window check for change sets: this org must never ship metadata
  // during a freeze window (e.g., month-end or audit week).
  public static Boolean isInFreezeWindow(Date freezeStart, Date freezeEnd) {
    Date today = System.today();
    return freezeStart != null && freezeEnd != null && today >= freezeStart && today <= freezeEnd;
  }

  // Predicts how many components a release touches by summing the files a
  // developer staged. Kept pure on purpose: the runbook owns the git call.
  public static Integer countComponents(Map<String, List<String>> stagedFiles) {
    Integer total = 0;
    if (stagedFiles == null) {
      return total;
    }
    for (List<String> files : stagedFiles.values()) {
      total += files == null ? 0 : files.size();
    }
    return total;
  }
}