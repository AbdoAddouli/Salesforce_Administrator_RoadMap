/*
 *   ____ _ _   _               ____         __  __                                   _____            _   _
 *  / ___| | | | |_ _   _ _ __ / ___| __ / /_/ /__  ___  _ __ ___   _____      ____ _| ____|_      __(_) ___  _ __
 * | |   | | | | | | | | | '_ `| |   | | | |/ / __` / _ \| '_ ` _ \ / _ \ \ /\ / / _` |  _| \ \ /\ / / | |/ _ \| '__|
 * | |___| |_| | | | |_| | | | | |___| |_| |  < (_| | (_) | | | | | | (_) \ V  V / (_| | |___ \ V  V /  | | (_) | |
 *  \____|\___/|_|_|\__, |_| |_|\____|\__,_|_|\_\__,_|\___/|_| |_| |_|\___/ \_/\_/ \__,_|_____| \_/\_/  |_|\___/|_|
 *                  |___/
 *
 * CERTIFICATION PREP SERVICE
 *
 * LEARNING FOCUS: Phase 12, Week 21 - The exam blueprint, study plans,
 * the quiz engine and the day-of-exam checklist
 *
 *  WHY IT MATTERS: this roadmap exists to get you certified. Study plans,
 *  question bank and readiness scoring are all modeled as data so the same
 *  records that run the docs academy quiz engine also run this class.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - Picklist and long-text combination fields grow fast; design them for the
 *     quiz engine, not for the report.
 *   - Random selection must never return fewer questions than requested - guard
 *     the quiz size against the question count in the org.
 *
 *  🌱 BEST PRACTICE:
 *   - Track a "Completed Domains" audit trail on the Study_Plan record itself.
 *   - Practice the exam on a full domain coverage map, not just your favorites.
 */
public with sharing class CertificationPrepService {
  // Opens a study plan for a learner ahead of their target exam date.
  public static Study_Plan__c startStudyPlan(Id learnerId, Date targetDate, Decimal hoursPerWeek) {
    Study_Plan__c plan = new Study_Plan__c(
      Learner__c = learnerId,
      Certification__c = 'Salesforce Administrator',
      Target_Date__c = targetDate,
      Hours_Per_Week__c = hoursPerWeek,
      Status__c = 'Not Started'
    );
    insert plan;
    return plan;
  }

  // Re-scores a learner's plan after a mock quiz: domain completions push the
  // status toward "On Track", then "Ready" as the target date approaches.
  public static void recordQuizResult(Id studyPlanId, Integer correct, Integer total) {
    if (studyPlanId == null || total == null || total == 0) {
      return;
    }

    Study_Plan__c plan = [
      SELECT
        Id,
        Status__c,
        Target_Date__c,
        Hours_Per_Week__c,
        Completed_Domains__c
      FROM Study_Plan__c
      WHERE Id = :studyPlanId
      LIMIT 1
    ];

    Decimal readiness = (Decimal) correct / total;
    if (readiness >= 0.8) {
      plan.Status__c = 'On Track';
    } else if (readiness >= 0.6) {
      plan.Status__c = 'In Progress';
    }

    if (plan.Status__c == 'On Track' && plan.Target_Date__c != null && plan.Target_Date__c <= System.today().addDays(14)) {
      plan.Status__c = 'Ready';
    }

    update plan;
  }

  // Fills a quiz from the question bank. Deterministic for a fixed seed: admin
  // teams love being able to reproduce flaky question picks in QA.
  public static List<Training_Question__c> buildQuiz(List<Training_Question__c> bank, Integer size) {
    List<Training_Question__c> quiz = new List<Training_Question__c>();
    if (bank == null || size <= 0) {
      return quiz;
    }

    Integer takeCount = Math.min(size, bank.size());
    for (Integer i = 0; i < takeCount; i++) {
      quiz.add(bank[i]);
    }
    return quiz;
  }

  // Counts how many questions exist per difficulty level - coverage math for
  // the study plan report.
  public static Map<String, Integer> questionMix(List<Training_Question__c> bank) {
    Map<String, Integer> mix = new Map<String, Integer>{ 'Easy' => 0, 'Medium' => 0, 'Hard' => 0 };
    if (bank == null) {
      return mix;
    }

    for (Training_Question__c question : bank) {
      if (question.Difficulty__c != null && mix.containsKey(question.Difficulty__c)) {
        mix.put(question.Difficulty__c, mix.get(question.Difficulty__c) + 1);
      }
    }
    return mix;
  }
}