import type { LeadRepositoryPort } from "../application/lead-ports";
import {
  createLeadRequest,
  deleteLeadRequest,
  fetchLeads,
  updateLeadRequest,
} from "./leads-api";

/**
 * leads-repository.ts
 * Adapts low-level HTTP request helpers to the application repository contract.
 * Assumes transport concerns stay in `leads-api.ts`, not in use cases or routes.
 */

/**
 * Creates the concrete lead repository backed by mocked HTTP requests.
 *
 * @returns {LeadRepositoryPort} Repository implementation for lead CRUD.
 *
 * Adapts mocked HTTP functions to application repository port.
 */
export function createLeadsRepository(): LeadRepositoryPort {
  return {
    list: fetchLeads,
    create: createLeadRequest,
    update: updateLeadRequest,
    remove: deleteLeadRequest,
  };
}
