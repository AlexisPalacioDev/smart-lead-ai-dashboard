import { nanoid } from "nanoid";

import type { LeadInput } from "../application/lead-ports";
import type { Lead } from "../domain/lead";
import { readStoredLeads, writeStoredLeads } from "./leads-storage";

/**
 * Reads current lead collection from localStorage.
 *
 * @returns {Promise<Lead[]>} Promise resolving to stored leads.
 */
export function fetchLeadsLocalStorage() {
  return Promise.resolve(readStoredLeads());
}

/**
 * Creates lead in localStorage.
 *
 * @param {LeadInput} input - New lead payload without generated fields.
 * @returns {Promise<Lead>} Promise resolving to the created lead.
 */
export function createLeadLocalStorage(input: LeadInput) {
  const lead: Lead = {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  writeStoredLeads([lead, ...readStoredLeads()]);
  return Promise.resolve(lead);
}

/**
 * Updates lead in localStorage.
 *
 * @param {string} id - Unique lead identifier.
 * @param {LeadInput} input - Replacement lead payload.
 * @returns {Promise<Lead>} Promise resolving to the updated lead.
 */
export function updateLeadLocalStorage(id: string, input: LeadInput) {
  let updatedLead: Lead | null = null;
  const nextLeads = readStoredLeads().map((lead) => {
    if (lead.id !== id) {
      return lead;
    }

    updatedLead = { ...lead, ...input };
    return updatedLead;
  });

  if (!updatedLead) {
    return Promise.reject(new Error("Lead update failed"));
  }

  writeStoredLeads(nextLeads);
  return Promise.resolve(updatedLead);
}

/**
 * Deletes lead in localStorage.
 *
 * @param {string} id - Unique lead identifier.
 * @returns {Promise<void>} Promise resolving when deletion succeeds.
 */
export function deleteLeadLocalStorage(id: string) {
  const nextLeads = readStoredLeads().filter((lead) => lead.id !== id);
  writeStoredLeads(nextLeads);
  return Promise.resolve();
}
