import type { LeadRepositoryPort } from './lead-ports'

/**
 * Exposes the application-level lead operations used by UI adapters.
 */
export function createLeadUseCases(repository: LeadRepositoryPort) {
  return {
    listLeads: () => repository.list(),
    createLead: (input: Parameters<LeadRepositoryPort['create']>[0]) =>
      repository.create(input),
    updateLead: (
      id: string,
      input: Parameters<LeadRepositoryPort['update']>[1],
    ) => repository.update(id, input),
    deleteLead: (id: string) => repository.remove(id),
  }
}
