import type { Lead, LeadFilters } from '../domain/lead'

const END_OF_DAY_SUFFIX = 'T23:59:59.999Z'
const START_OF_DAY_SUFFIX = 'T00:00:00.000Z'

/**
 * Returns leads matching the supplied search text, source, and date range.
 */
export function filterLeads(leads: Lead[], filters: LeadFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase()

  return leads.filter((lead) => {
    const matchesQuery =
      normalizedQuery === '' ||
      lead.name.toLowerCase().includes(normalizedQuery) ||
      lead.email.toLowerCase().includes(normalizedQuery)

    const matchesSource =
      filters.source === 'all' || lead.source === filters.source

    const createdAt = new Date(lead.createdAt).getTime()
    const startBoundary =
      filters.startDate === ''
        ? Number.NEGATIVE_INFINITY
        : new Date(`${filters.startDate}${START_OF_DAY_SUFFIX}`).getTime()
    const endBoundary =
      filters.endDate === ''
        ? Number.POSITIVE_INFINITY
        : new Date(`${filters.endDate}${END_OF_DAY_SUFFIX}`).getTime()

    return matchesQuery && matchesSource && createdAt >= startBoundary && createdAt <= endBoundary
  })
}

/**
 * Sorts leads by their creation date in descending order.
 */
export function sortLeadsByNewest(leads: Lead[]) {
  return [...leads].sort((currentLead, nextLead) => {
    return (
      new Date(nextLead.createdAt).getTime() -
      new Date(currentLead.createdAt).getTime()
    )
  })
}

/**
 * Returns a stable paginated slice of leads and pagination metadata.
 */
export function paginateLeads(leads: Lead[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize

  return {
    items: leads.slice(startIndex, startIndex + pageSize),
    total: leads.length,
    totalPages: Math.max(1, Math.ceil(leads.length / pageSize)),
  }
}
