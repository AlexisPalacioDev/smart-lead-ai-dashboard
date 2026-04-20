import type { LeadInput } from "../application/lead-ports";
import type { Lead } from "../domain/lead";

/**
 * Parses a successful JSON response or throws a stable domain-facing error.
 *
 * @template T
 * @param {Response} response - Fetch response to inspect.
 * @param {string} message - Error message surfaced on non-OK responses.
 * @returns {Promise<T>} Parsed JSON payload.
 */
async function readJson<T>(response: Response, message: string): Promise<T> {
  if (!response.ok) {
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches full lead collection from mocked API.
 *
 * @returns {Promise<Lead[]>} Promise resolving to all persisted leads.
 */
export function fetchLeadsHttp() {
  return fetch("/api/leads").then((response) =>
    readJson<Lead[]>(response, "Lead request failed"),
  );
}

/**
 * Creates lead through mocked API.
 *
 * @param {LeadInput} input - New lead payload without generated fields.
 * @returns {Promise<Lead>} Promise resolving to the created lead.
 */
export function createLeadHttp(input: LeadInput) {
  return fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  }).then((response) => readJson<Lead>(response, "Lead create failed"));
}

/**
 * Updates lead through mocked API.
 *
 * @param {string} id - Unique lead identifier.
 * @param {LeadInput} input - Replacement lead payload.
 * @returns {Promise<Lead>} Promise resolving to the updated lead.
 */
export function updateLeadHttp(id: string, input: LeadInput) {
  return fetch(`/api/leads/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  }).then((response) => readJson<Lead>(response, "Lead update failed"));
}

/**
 * Deletes lead through mocked API.
 *
 * @param {string} id - Unique lead identifier.
 * @returns {Promise<void>} Promise resolving when deletion succeeds.
 */
export function deleteLeadHttp(id: string) {
  return fetch(`/api/leads/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Lead delete failed");
    }
  });
}
