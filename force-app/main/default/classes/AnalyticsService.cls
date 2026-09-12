/*
 *     _   _       _     _       ____          _        _
 *    / \ | |_ __ | |__ | | __  / ___|  __ _ _| |_ _ __(_) ___  __ _ _ __
 *   / _ \| | '_ \| '_ \| |/ /  \___ \ / _` | | __| '__| |/ _ \/ _` | '_ \
 *  / ___ \ | | | | | | |   <    ___) | (_| | | |_| |  | |  __/ (_| | | | |
 * /_/   \_\_|_| |_|_| |_|_|\_\ |____/ \__, |_|\__|_|  |_|\___|\__,_|_| |_|
 *                                     |___/
 *
 * ANALYTICS SERVICE
 *
 * LEARNING FOCUS: Phase 10, Weeks 18-19 - Reports, Dashboards, REPORT() /
 * AggregateResult, and turning questions into KPI numbers
 *
 *  WHY IT MATTERS: every admin demo ends at a dashboard. This service turns
 *  pipeline, SLA and training questions into numbers the dashboards and the
 *  quiz engine can render - the "analyst" half of the admin role.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - AggregateResult is read-only; group in the query, never in the loop.
 *   - Formula roll-ups must respect decimal scale - round once, near the user.
 *
 *  🌱 BEST PRACTICE:
 *   - Compounds with nulls make finance sad: coalesce Amount and Probability.
 *   - Name your Aggregates with a stable alias you reuse across this service.
 */
public with sharing class AnalyticsService {
  public static final String OPEN_AMOUNT = 'openAmount';
  public static final String CLOSED_WON = 'closedWon';
  public static final String WEIGHTED = 'weighted';

  // Summarizes a list of opportunities into pipeline KPIs. Delegates to a
  // single query so dashboards never pay the "query per record" tax.
  public static Map<String, Decimal> pipelineSummary(List<Opportunity> opportunities) {
    Map<String, Decimal> summary = new Map<String, Decimal>{
      OPEN_AMOUNT => 0,
      CLOSED_WON => 0,
      WEIGHTED => 0
    };

    if (opportunities == null) {
      return summary;
    }

    Set<Id> oppIds = new Set<Id>();
    for (Opportunity opportunity : opportunities) {
      oppIds.add(opportunity.Id);
    }

    for (AggregateResult rollup : [
      SELECT
        SUM(Amount) totalAmount,
        SUM(Weighted_Expected_Revenue__c) totalWeighted
      FROM Opportunity
      WHERE Id IN :oppIds AND IsClosed = false
    ]) {
      Decimal openTotal = (Decimal) rollup.get('totalAmount');
      Decimal weightedTotal = (Decimal) rollup.get('totalWeighted');
      summary.put(OPEN_AMOUNT, openTotal == null ? 0 : openTotal);
      summary.put(WEIGHTED, weightedTotal == null ? 0 : weightedTotal);
    }

    for (AggregateResult won : [
      SELECT COUNT(Id) cnt
      FROM Opportunity
      WHERE Id IN :oppIds AND IsWon = true
    ]) {
      summary.put(CLOSED_WON, (Decimal) (Integer) won.get('cnt'));
    }

    return summary;
  }

  // Counts coverage per exam blueprint domain for the quiz engine. Feeds the
  // "Training Question Coverage" report so you never walk into the exam blind.
  public static Map<String, Integer> domainCoverage(List<Training_Question__c> questions) {
    Map<String, Integer> coverage = new Map<String, Integer>();
    if (questions == null || questions.isEmpty()) {
      return coverage;
    }

    for (Training_Question__c question : questions) {
      String topic = question.Topic__c;
      if (topic == null) {
        continue;
      }
      if (!coverage.containsKey(topic)) {
        coverage.put(topic, 0);
      }
      coverage.put(topic, coverage.get(topic) + 1);
    }
    return coverage;
  }

  // Averages the case SLA KPI from formula fields already stored on the record.
  // Pure arithmetic - the caller owns the query that provided the cases.
  public static Decimal averageFirstResponseHours(List<Case> cases) {
    if (cases == null || cases.isEmpty()) {
      return 0;
    }

    Decimal total = 0;
    Integer counted = 0;
    for (Case caseRecord : cases) {
      if (caseRecord.First_Response_Hours__c != null) {
        total += caseRecord.First_Response_Hours__c;
        counted++;
      }
    }
    return counted == 0 ? 0 : total / counted;
  }
}