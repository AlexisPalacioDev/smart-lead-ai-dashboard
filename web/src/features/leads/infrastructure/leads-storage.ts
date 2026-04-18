import type { Lead } from "../domain/lead";
import { leadFixtures } from "./lead-fixtures";

/**
 * leads-storage.ts
 * Centralizes browser `localStorage` access for lead persistence and test setup.
 * Assumes storage is only used through infrastructure adapters, never directly by UI.
 */

const STORAGE_KEY = "smart-lead-ai-dashboard/leads";

/**
 * Reads persisted leads, falling back to deterministic fixtures when empty.
 *
 * @returns {Lead[]} Persisted leads or initial fixture set when storage is empty.
 *
 * Reads current lead collection from localStorage.
 */
export function readStoredLeads(): Lead[] {
  const rawLeads = window.localStorage.getItem(STORAGE_KEY);

  if (!rawLeads) {
    return [...leadFixtures];
  }

  return JSON.parse(rawLeads) as Lead[];
}

/**
 * Writes the full lead collection to localStorage.
 *
 * @param {Lead[]} leads - Lead collection to persist.
 * @returns {void} No return value; updates browser storage.
 *
 * Persists lead collection into localStorage.
 */
export function writeStoredLeads(leads: Lead[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

/**
 * Seeds localStorage with a supplied collection.
 *
 * @param {Lead[]} leads - Fixture or runtime lead records to persist.
 * @returns {void} No return value; delegates to storage writer.
 *
 * Seeds browser storage for tests and local demos.
 */
export function seedStoredLeads(leads: Lead[]) {
  writeStoredLeads(leads);
}

/**
 * Removes the persisted lead collection from localStorage.
 *
 * @returns {void} No return value; clears the storage key.
 *
 * Clears persisted lead collection.
 */
export function clearStoredLeads() {
  window.localStorage.removeItem(STORAGE_KEY);
}
