import type { Lead, LeadFilters } from "../domain/lead";

/**
 * lead-filters.ts
 * Provides pure application helpers for searching, sorting, and paginating
 * lead collections. Depends only on the lead domain model and ISO timestamps.
 */

const END_OF_DAY_SUFFIX = "T23:59:59.999Z";
const START_OF_DAY_SUFFIX = "T00:00:00.000Z";

/**
 * Filters leads by free-text query, source, and inclusive date boundaries.
 *
 * @param {Lead[]} leads - Full lead collection to evaluate.
 * @param {LeadFilters} filters - Search and date criteria from the UI layer.
 * @returns {Lead[]} Filtered lead subset preserving original order.
 *
 * Returns leads matching the supplied search text, source, and date range.
 */
export function filterLeads(leads: Lead[], filters: LeadFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return leads.filter((lead) => {
    const matchesQuery =
      normalizedQuery === "" ||
      lead.name.toLowerCase().includes(normalizedQuery) ||
      lead.email.toLowerCase().includes(normalizedQuery);

    const matchesSource =
      filters.source === "all" || lead.source === filters.source;

    const createdAt = new Date(lead.createdAt).getTime();
    const startBoundary =
      filters.startDate === ""
        ? Number.NEGATIVE_INFINITY
        : new Date(`${filters.startDate}${START_OF_DAY_SUFFIX}`).getTime();
    const endBoundary =
      filters.endDate === ""
        ? Number.POSITIVE_INFINITY
        : new Date(`${filters.endDate}${END_OF_DAY_SUFFIX}`).getTime();

    // Explicit day suffixes keep date-only filters inclusive regardless of the
    // exact time stored on the lead record.
    return (
      matchesQuery &&
      matchesSource &&
      createdAt >= startBoundary &&
      createdAt <= endBoundary
    );
  });
}

/**
 * Sorts leads by newest-first creation date.
 *
 * @param {Lead[]} leads - Lead collection to sort.
 * @returns {Lead[]} New array sorted in descending chronological order.
 *
 * Sorts leads by their creation date in descending order.
 */
export function sortLeadsByNewest(leads: Lead[]) {
  return [...leads].sort((currentLead, nextLead) => {
    return (
      new Date(nextLead.createdAt).getTime() -
      new Date(currentLead.createdAt).getTime()
    );
  });
}

/**
 * Produces a single page slice and stable pagination metadata.
 *
 * @param {Lead[]} leads - Already filtered and sorted lead collection.
 * @param {number} page - One-based page index requested by the UI.
 * @param {number} pageSize - Number of records per page.
 * @returns {{ items: Lead[]; total: number; totalPages: number }} Paginated result.
 *
 * Returns a stable paginated slice of leads and pagination metadata.
 */
export function paginateLeads(leads: Lead[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize;

  return {
    items: leads.slice(startIndex, startIndex + pageSize),
    total: leads.length,
    totalPages: Math.max(1, Math.ceil(leads.length / pageSize)),
  };
}
