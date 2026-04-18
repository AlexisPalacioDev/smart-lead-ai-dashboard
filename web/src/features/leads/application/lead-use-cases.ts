import type { LeadRepositoryPort } from "./lead-ports";

/**
 * lead-use-cases.ts
 * Exposes application-facing orchestration helpers over the lead repository contract.
 * Assumes callers already enforce validation before mutations.
 */

/**
 * Creates a small use-case facade over the lead repository port.
 * Exposes the application-level lead operations used by UI adapters.
 */
export function createLeadUseCases(repository: LeadRepositoryPort) {
  return {
    listLeads: () => repository.list(),
    createLead: (input: Parameters<LeadRepositoryPort["create"]>[0]) =>
      repository.create(input),
    updateLead: (
      id: string,
      input: Parameters<LeadRepositoryPort["update"]>[1],
    ) => repository.update(id, input),
    deleteLead: (id: string) => repository.remove(id),
  };
}
