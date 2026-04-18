import type { LeadSource } from "../domain/lead";

/**
 * leads-directory-view-model.ts
 * Declares presentation contracts for the Leads Directory route. These types
 * keep route, hook, and component boundaries explicit while preserving the lead
 * domain model as the source of truth for source values.
 */

/**
 * Search state persisted in the Leads Directory URL.
 */
export type LeadsDirectorySearch = {
  query: string;
  source: LeadSource | "all";
  startDate: string;
  endDate: string;
  page: number;
};

/**
 * Partial filter changes emitted by the filter toolbar.
 */
export type LeadsDirectoryFilterChange = Partial<
  Pick<LeadsDirectorySearch, "query" | "source" | "startDate" | "endDate">
>;

/**
 * Source option shown in the filter toolbar.
 */
export type LeadsDirectorySourceOption = {
  value: LeadsDirectorySearch["source"];
  label: string;
};

/**
 * Header metadata for route-level page chrome.
 */
export type LeadsDirectoryHeaderViewModel = {
  title: string;
  description: string;
  actionLabel: string;
};

/**
 * Controlled filter values and option metadata for presentational filters.
 */
export type LeadsDirectoryFiltersViewModel = LeadsDirectorySearch & {
  sourceOptions: LeadsDirectorySourceOption[];
};

/**
 * Table row data formatted for display.
 */
export type LeadsDirectoryRowViewModel = {
  id: string;
  name: string;
  email: string;
  phone: string;
  sourceLabel: string;
  productInterest: string;
  budgetLabel: string;
  createdAtLabel: string;
};

/**
 * Pagination metadata and actions for the visible table page.
 */
export type LeadsDirectoryPaginationViewModel = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
};

/**
 * Fully prepared Leads Directory page state.
 */
export type LeadsDirectoryViewModel = {
  header: LeadsDirectoryHeaderViewModel;
  filters: LeadsDirectoryFiltersViewModel;
  rows: LeadsDirectoryRowViewModel[];
  pagination: LeadsDirectoryPaginationViewModel;
  resultSummary: string;
};

/**
 * Route-level branch state for async lead loading.
 */
export type LeadsDirectoryRouteViewModel =
  | {
      status: "loading";
      header: LeadsDirectoryHeaderViewModel;
    }
  | {
      status: "error";
      header: LeadsDirectoryHeaderViewModel;
      retry: () => void;
    }
  | {
      status: "empty";
      header: LeadsDirectoryHeaderViewModel;
      retry: () => void;
    }
  | {
      status: "ready";
      directory: LeadsDirectoryViewModel;
      updateFilters: (next: LeadsDirectoryFilterChange) => void;
      goToPage: (page: number) => void;
    };

/**
 * Optional props used to render the page with injected state in tests/stories.
 */
export type LeadsDirectoryPageProps = {
  viewModel?: LeadsDirectoryViewModel;
  onFilterChange?: (next: LeadsDirectoryFilterChange) => void;
  onPageChange?: (page: number) => void;
};
