/*
 *  _       _           _                                        _                _
 * | |   __| | ___  ___| |_   _ __   __ _ _ __   __ _ _ __ ___  | |    ___   __ _(_)_ __
 * | |  / _` |/ _ \/ _ \ __| | '_ \ / _` | '_ \ / _` | '_ ` _ \ | |   / _ \ / _` | | '_ \
 * | |__| (_| |  __/  __/ |_  | |_) | (_| | | | | | (_| | | | | || |__| (_) | (_| | | | | |
 * |_____\__,_|\___|\___|\__| | .__/ \__, |_| |_|\__,_|_| |_| |_||_____\___/ \__, |_|_| |_|
 *                            |_|    |___/                                    |___/
 *
 * DATA MODEL SERVICE
 *
 * LEARNING FOCUS: Phase 2, Week 5 - Object Manager, the Schema API and Data Quality
 *
 *  WHY IT MATTERS: An admin's daily life is spent looking at objects and fields.
 *  This service teaches you to interrogate the schema at runtime through the
 *  Schema API (SObjectType, SObjectField) and to score how "clean" your records are.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - Schema.getGlobalDescribe() can burn SOQL queries on huge orgs. Cache it.
 *   - Generic SObject work means you must guard against null SObjectType lookups.
 *
 *  🌱 BEST PRACTICE:
 *   - Always score fields from a shared list, never a per-record query.
 *   - Reuse one global describe instead of calling it inside a loop.
 */
public with sharing class DataModelService {
  // A "0-100" score for a single record based on how many of the inspected
  // fields are populated. Higher is cleaner.
  public static Integer computeQualityScore(SObject record, List<SObjectField> inspectedFields) {
    if (record == null || inspectedFields == null || inspectedFields.isEmpty()) {
      return 0;
    }

    Integer populated = 0;
    for (SObjectField field : inspectedFields) {
      if (record.get(field) != null) {
        populated++;
      }
    }

    return Math.round((populated * 100) / inspectedFields.size());
  }

  // Returns the fields that are missing on a record, useful to build a "fix
  // these fields" checklist in a screen flow.
  public static List<SObjectField> missingFieldsFor(SObject record, List<SObjectField> inspectedFields) {
    List<SObjectField> missing = new List<SObjectField>();
    if (record == null || inspectedFields == null) {
      return missing;
    }

    for (SObjectField field : inspectedFields) {
      if (record.get(field) == null) {
        missing.add(field);
      }
    }
    return missing;
  }

  // Looks up an SObjectType by API name and returns its label, or null when the
  // name does not exist in the org. This is the exact lookup Object Manager does.
  public static String describeObjectLabel(String sObjectName) {
    if (String.isBlank(sObjectName)) {
      return null;
    }

    Schema.SObjectType type = Schema.getGlobalDescribe().get(sObjectName);
    return type == null ? null : type.getDescribe().getLabel();
  }

  // Validates that the requested objects actually exist. Used before flows let
  // a user pick an object to inspect.
  public static List<String> filterExistingObjects(List<String> candidateNames) {
    List<String> existing = new List<String>();
    if (candidateNames == null) {
      return existing;
    }

    Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
    for (String candidate : candidateNames) {
      if (globalDescribe.containsKey(candidate)) {
        existing.add(candidate);
      }
    }
    return existing;
  }
}