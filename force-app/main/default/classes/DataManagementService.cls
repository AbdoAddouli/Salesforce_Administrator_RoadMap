/*
 *  ____        _   _    __  __                                             _   _
 * | __ )   __ _| |_| |__|  \/  | __ _ _ __   __ _  __ _  ___ _ __ ___  __| | | |    _ __ _   _
 * |  _ \  / _` | __| '_ \ |\/| |/ _` | '_ \ / _` |/ _` |/ _ \ '__/ _ \ / _` | | |   | '_ \ | | |
 * | |_) | (_| | |_| | | | |  | | (_| | |_) | (_| | (_| |  __/ | | (_) | (_| | | |___| | | | |_| |
 * |____/ \__,_|\__|_| |_|_|  |_|\__,_| .__/ \__,_|\__, |\___|_|  \___/ \__,_| |_____|_| |_|\__, |
 *                                    |_|          |___/                                    |___/
 *
 * DATA MANAGEMENT SERVICE
 *
 * LEARNING FOCUS: Phase 5, Week 10 - Duplicate Detection, Data Quality,
 * Validation Status and the Data Export approval flow
 *
 *  WHY IT MATTERS: "Garbage in, garbage out." Admins spend a huge slice of every
 *  sprint chasing duplicates and incomplete records. This service shows the three
 *  classic moves - normalize, score, flag - backing the Data Quality dashboard.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - DML in a loop is the classic bulkification killer. Batch your updates.
 *   - Be careful with stripHtmlTags / normalizeSpace on huge strings.
 *
 *  🌱 BEST PRACTICE:
 *   - Purge the "import batch" number before re-imports so re-runs are idempotent.
 *   - Write one normalization function and reuse it; two copies decay fast.
 */
public with sharing class DataManagementService {
  // Normalizes an account name: lower-case, trimmed, no company suffixes, so
  // "Acme Corp" and "ACME Corporation" match as the same customer.
  public static String normalizeAccountName(String rawName) {
    if (String.isBlank(rawName)) {
      return '';
    }

    String normalized = rawName.toLowerCase().trim();
    normalized = normalized.replace(' corporation', '').replace(' inc', '').replace(' ltd', '').replace('.', '');
    return normalized;
  }

  // Returns the map of normalized name -> accounts that collide on that name.
  // Pure function: the caller decides what to do with the collision set.
  public static Map<String, List<Account>> findNameCollisions(List<Account> accounts) {
    Map<String, List<Account>> collisions = new Map<String, List<Account>>();
    if (accounts == null) {
      return collisions;
    }

    for (Account account : accounts) {
      String key = normalizeAccountName(account.Name);
      if (String.isBlank(key)) {
        continue;
      }

      if (!collisions.containsKey(key)) {
        collisions.put(key, new List<Account>());
      }
      collisions.get(key).add(account);
    }

    collisions.keySet().removeAll(uniqueKeys(collisions));
    return collisions;
  }

  private static Set<String> uniqueKeys(Map<String, List<Account>> grouped) {
    Set<String> keys = grouped.keySet();
    Set<String> unique = new Set<String>();
    for (String key : keys) {
      if (grouped.get(key).size() == 1) {
        unique.add(key);
      }
    }
    return unique;
  }

  // Flags every account involved in a name collision. Inline map update so a
  // single DML.update() at the end keeps the same transaction safe.
  public static void flagDuplicateAccounts(List<Account> accounts) {
    Map<String, List<Account>> collisions = findNameCollisions(accounts);
    for (List<Account> collided : collisions.values()) {
      for (Account account : collided) {
        account.Duplicate_Flag__c = true;
        account.Validation_Status__c = 'Needs Review';
      }
    }
  }

  // Sets the validation status from the collated data-quality score.
  public static void applyValidationStatus(List<Account> accounts) {
    if (accounts == null) {
      return;
    }

    for (Account account : accounts) {
      if (account.Data_Quality_Score__c == null) {
        account.Validation_Status__c = 'Needs Review';
      } else if (account.Data_Quality_Score__c >= 80) {
        account.Validation_Status__c = 'Valid';
      } else {
        account.Validation_Status__c = 'Needs Review';
      }
    }
  }
}