import type { LeadSource } from "../domain/lead";

/**
 * lead-source-labels.ts
 * Centralizes human-readable source labels used by lead-facing ViewModels.
 * Depends only on the lead domain source union.
 */

const SOURCE_LABELS: Record<LeadSource, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  landing_page: "Landing Page",
  referido: "Referido",
  otro: "Otro",
};

/**
 * Returns the display label for a controlled lead source.
 *
 * @param {LeadSource} source - Domain source value.
 * @returns {string} Human-readable source label.
 */
export function getLeadSourceLabel(source: LeadSource): string {
  return SOURCE_LABELS[source];
}
