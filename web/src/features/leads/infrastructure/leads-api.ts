import type { LeadInput } from "../application/lead-ports";
import { createLeadHttp, deleteLeadHttp, fetchLeadsHttp, updateLeadHttp } from "./leads-http-api";
import {
  createLeadLocalStorage,
  deleteLeadLocalStorage,
  fetchLeadsLocalStorage,
  updateLeadLocalStorage,
} from "./leads-local-storage-api";

const isDevelopment = import.meta.env.DEV;

/**
 * Requests the full lead collection from the API.
 *
 * @returns {Promise<Lead[]>} Promise resolving to all persisted leads.
 *
 * Fetches full lead collection from mocked API.
 */
export function fetchLeads() {
  if (isDevelopment) {
    return fetchLeadsHttp();
  }

  return fetchLeadsLocalStorage();
}

/**
 * Sends a create request for a new lead.
 *
 * @param {LeadInput} input - New lead payload without generated fields.
 * @returns {Promise<Lead>} Promise resolving to the created lead.
 *
 * Creates lead through mocked API.
 */
export function createLeadRequest(input: LeadInput) {
  if (isDevelopment) {
    return createLeadHttp(input);
  }

  return createLeadLocalStorage(input);
}

/**
 * Sends an update request for an existing lead.
 *
 * @param {string} id - Unique lead identifier.
 * @param {LeadInput} input - Replacement lead payload.
 * @returns {Promise<Lead>} Promise resolving to the updated lead.
 *
 * Updates lead through mocked API.
 */
export function updateLeadRequest(id: string, input: LeadInput) {
  if (isDevelopment) {
    return updateLeadHttp(id, input);
  }

  return updateLeadLocalStorage(id, input);
}

/**
 * Sends a delete request for an existing lead.
 *
 * @param {string} id - Unique lead identifier.
 * @returns {Promise<void>} Promise resolving when deletion succeeds.
 *
 * Deletes lead through mocked API.
 */
export function deleteLeadRequest(id: string) {
  if (isDevelopment) {
    return deleteLeadHttp(id);
  }

  return deleteLeadLocalStorage(id);
}
