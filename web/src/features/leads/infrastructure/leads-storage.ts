import type { Lead } from '../domain/lead'
import { leadFixtures } from './lead-fixtures'

const STORAGE_KEY = 'smart-lead-ai-dashboard/leads'

/**
 * Reads current lead collection from localStorage.
 */
export function readStoredLeads(): Lead[] {
  const rawLeads = window.localStorage.getItem(STORAGE_KEY)

  if (!rawLeads) {
    return [...leadFixtures]
  }

  return JSON.parse(rawLeads) as Lead[]
}

/**
 * Persists lead collection into localStorage.
 */
export function writeStoredLeads(leads: Lead[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

/**
 * Seeds browser storage for tests and local demos.
 */
export function seedStoredLeads(leads: Lead[]) {
  writeStoredLeads(leads)
}

/**
 * Clears persisted lead collection.
 */
export function clearStoredLeads() {
  window.localStorage.removeItem(STORAGE_KEY)
}
