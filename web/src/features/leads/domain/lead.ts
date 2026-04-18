/**
 * lead.ts
 * Declares the lead domain vocabulary shared across application, infrastructure,
 * and UI layers. Assumes lead timestamps use ISO strings and sources stay within
 * the controlled list exported below.
 */
export const leadSources = [
  "instagram",
  "facebook",
  "landing_page",
  "referido",
  "otro",
] as const;

/**
 * Allowed source values for a lead.
 */
export type LeadSource = (typeof leadSources)[number];

/**
 * Canonical lead entity used throughout the application.
 */
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  productInterest: string;
  budget: number | null;
  createdAt: string;
};

/**
 * User-facing filtering criteria applied to lead collections.
 */
export type LeadFilters = {
  query: string;
  source: LeadSource | "all";
  startDate: string;
  endDate: string;
};
