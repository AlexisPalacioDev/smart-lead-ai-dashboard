import type { Lead } from "../domain/lead";

/**
 * lead-ports.ts
 * Defines application-layer contracts for reading and mutating lead data.
 * These interfaces decouple UI and use cases from storage or transport details.
 */

export type LeadInput = Omit<Lead, "id" | "createdAt">;

export interface LeadRepositoryPort {
  /**
   * Returns all available leads.
   *
   * @returns {Promise<Lead[]>} Promise resolving to full lead collection.
   */
  list(): Promise<Lead[]>;
  /**
   * Persists a new lead record.
   *
   * @param {LeadInput} input - New lead values provided by the caller.
   * @returns {Promise<Lead>} Promise resolving to the created lead.
   */
  create(input: LeadInput): Promise<Lead>;
  /**
   * Updates an existing lead record.
   *
   * @param {string} id - Unique identifier of the lead to update.
   * @param {LeadInput} input - Replacement lead payload.
   * @returns {Promise<Lead>} Promise resolving to the updated lead.
   */
  update(id: string, input: LeadInput): Promise<Lead>;
  /**
   * Removes an existing lead record.
   *
   * @param {string} id - Unique identifier of the lead to remove.
   * @returns {Promise<void>} Promise resolving when deletion finishes.
   */
  remove(id: string): Promise<void>;
}
