import { type Lead, type LeadSource, leadSources } from "../domain/lead";

/**
 * lead-stats.ts
 * Computes aggregate metrics that drive dashboard summaries and charts.
 * Assumes lead timestamps use ISO strings and source order defines tie-breaking.
 */

const DAYS_IN_WEEK_WINDOW = 7;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_TOP_SOURCE: LeadSource = "instagram";

export type LeadStats = {
  totalLeads: number;
  leadsLast7Days: number;
  averageBudget: number;
  topSource: LeadSource;
  leadsBySource: Record<LeadSource, number>;
};

/**
 * Builds all dashboard-ready metrics from a lead collection.
 *
 * @param {Lead[]} leads - Lead records included in the current analysis set.
 * @param {string} referenceDate - ISO date string used as trailing-window anchor.
 * @returns {LeadStats} Aggregate totals, averages, and source breakdowns.
 *
 * Builds the dashboard metrics derived from a list of leads.
 */
export function buildLeadStats(
  leads: Lead[],
  referenceDate: string,
): LeadStats {
  const leadsBySource = buildLeadsBySource(leads);
  const budgets = leads
    .map((lead) => lead.budget)
    .filter((budget): budget is number => budget != null);

  return {
    totalLeads: leads.length,
    leadsLast7Days: countLeadsInLastDays(
      leads,
      referenceDate,
      DAYS_IN_WEEK_WINDOW,
    ),
    averageBudget:
      budgets.length === 0
        ? 0
        : Math.round(
            budgets.reduce((total, budget) => total + budget, 0) /
              budgets.length,
          ),
    topSource: selectTopSource(leadsBySource),
    leadsBySource,
  };
}

/**
 * Counts leads created inside an inclusive trailing day window.
 *
 * @param {Lead[]} leads - Lead records to inspect.
 * @param {string} referenceDate - ISO date string for the window end.
 * @param {number} days - Window size measured in whole days.
 * @returns {number} Number of leads inside the requested period.
 *
 * Counts how many leads were created within the inclusive trailing day window.
 */
function countLeadsInLastDays(
  leads: Lead[],
  referenceDate: string,
  days: number,
) {
  const rangeEnd = new Date(`${referenceDate}T23:59:59.999Z`).getTime();
  const rangeStart = rangeEnd - (days - 1) * MILLISECONDS_PER_DAY;

  // Inclusive range boundaries match reporting expectations: any lead created
  // during start or end day still counts in the weekly window.
  return leads.filter((lead) => {
    const createdAt = new Date(lead.createdAt).getTime();
    return createdAt >= rangeStart && createdAt <= rangeEnd;
  }).length;
}

/**
 * Builds per-source totals with every known source present in the output.
 *
 * @param {Lead[]} leads - Lead records to aggregate.
 * @returns {Record<LeadSource, number>} Deterministic source totals object.
 *
 * Produces a deterministic source breakdown for charts and summaries.
 */
function buildLeadsBySource(leads: Lead[]): Record<LeadSource, number> {
  return leads.reduce<Record<LeadSource, number>>(
    (sourceTotals, lead) => {
      sourceTotals[lead.source] += 1;
      return sourceTotals;
    },
    {
      instagram: 0,
      facebook: 0,
      landing_page: 0,
      referido: 0,
      otro: 0,
    },
  );
}

/**
 * Selects top source while preserving declared source order on ties.
 *
 * @param {Record<LeadSource, number>} leadsBySource - Aggregated source totals.
 * @returns {LeadSource} Dominant source after deterministic tie-breaking.
 *
 * Selects the most frequent source, preserving deterministic fallback order.
 */
function selectTopSource(
  leadsBySource: Record<LeadSource, number>,
): LeadSource {
  let topSource = DEFAULT_TOP_SOURCE;
  let topSourceCount = leadsBySource[topSource];

  for (const source of leadSources) {
    const sourceCount = leadsBySource[source];

    if (sourceCount > topSourceCount) {
      topSource = source;
      topSourceCount = sourceCount;
    }
  }

  return topSource;
}
