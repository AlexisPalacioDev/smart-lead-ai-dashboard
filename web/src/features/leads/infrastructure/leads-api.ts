import type { Lead } from "../domain/lead";

/**
 * leads-api.ts
 * Wraps browser `fetch` calls for lead CRUD operations against mocked endpoints.
 * Assumes the MSW layer or a compatible backend exposes `/api/leads` routes.
 */

type LeadInput = Omit<Lead, "id" | "createdAt">;

/**
 * Parses a successful JSON response or throws a stable domain-facing error.
 *
 * @template T
 * @param {Response} response - Fetch response to inspect.
 * @param {string} message - Error message surfaced on non-OK responses.
 * @returns {Promise<T>} Parsed JSON payload.
 *
 * Reads JSON response or throws stable request error.
 */
async function readJson<T>(response: Response, message: string): Promise<T> {
  if (!response.ok) {
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Requests the full lead collection from the API.
 *
 * @returns {Promise<Lead[]>} Promise resolving to all persisted leads.
 *
 * Fetches full lead collection from mocked API.
 */
export function fetchLeads() {
  return fetch("/api/leads").then((response) =>
    readJson<Lead[]>(response, "Lead request failed"),
  );
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
  return fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  }).then((response) => readJson<Lead>(response, "Lead create failed"));
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
  return fetch(`/api/leads/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  }).then((response) => readJson<Lead>(response, "Lead update failed"));
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
  return fetch(`/api/leads/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Lead delete failed");
    }
  });
}
