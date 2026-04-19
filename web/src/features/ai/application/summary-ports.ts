import type { Lead, LeadSource } from "../../leads/domain/lead";

/**
 * summary-ports.ts
 * Declares the AI summary boundary shared by the application and
 * infrastructure layers.
 */

export type SummaryFilters = {
  source: LeadSource | "all";
  startDate: string;
  endDate: string;
};

export type SummaryResult = {
  analysis: string;
  mainSource: string;
  recommendations: string[];
};

export type CreateSummaryInput = {
  leads: Lead[];
  filters: SummaryFilters;
};

export interface SummaryServicePort {
  createSummary(prompt: string): Promise<SummaryResult>;
}
