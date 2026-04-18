import type { LeadRepositoryPort } from '../application/lead-ports'
import {
  createLeadRequest,
  deleteLeadRequest,
  fetchLeads,
  updateLeadRequest,
} from './leads-api'

/**
 * Adapts mocked HTTP functions to application repository port.
 */
export function createLeadsRepository(): LeadRepositoryPort {
  return {
    list: fetchLeads,
    create: createLeadRequest,
    update: updateLeadRequest,
    remove: deleteLeadRequest,
  }
}
