/** Coordinates Leads Directory data loading, URL search state, and ViewModels. */
import { useQuery } from "@tanstack/react-query";

import { createLeadUseCases } from "./lead-use-cases";
import { leadFixtures } from "../infrastructure/lead-fixtures";
import { createLeadsRepository } from "../infrastructure/leads-repository";
import {
  DEFAULT_LEADS_DIRECTORY_SEARCH,
  buildLeadsDirectoryHeaderViewModel,
  buildLeadsDirectoryViewModel,
} from "./build-leads-directory-view-model";
import type {
  LeadsDirectoryFilterChange,
  LeadsDirectoryPageProps,
  LeadsDirectoryRouteViewModel,
  LeadsDirectorySearch,
  LeadsDirectoryViewModel,
} from "../types/leads-directory-view-model";

const LEADS_DIRECTORY_QUERY_KEY = ["leads", "directory"] as const;
const leadUseCases = createLeadUseCases(createLeadsRepository());

/**
 * Updates URL-backed Leads Directory search values.
 */
export type UpdateLeadsDirectorySearch = (
  next: Partial<LeadsDirectorySearch>,
) => void;

/**
 * Builds the route ViewModel from repository data and URL search state.
 *
 * @param {LeadsDirectorySearch} search - Current URL-backed search state.
 * @param {UpdateLeadsDirectorySearch} updateSearch - URL search updater.
 * @returns {LeadsDirectoryRouteViewModel} Async route branch state.
 */
export function useLeadsDirectoryRouteViewModel(
  search: LeadsDirectorySearch,
  updateSearch: UpdateLeadsDirectorySearch,
): LeadsDirectoryRouteViewModel {
  const leadsQuery = useQuery({
    queryKey: LEADS_DIRECTORY_QUERY_KEY,
    queryFn: leadUseCases.listLeads,
  });
  const header = buildLeadsDirectoryHeaderViewModel();

  if (leadsQuery.isLoading) {
    return { status: "loading", header };
  }

  if (leadsQuery.isError) {
    return {
      status: "error",
      header,
      retry: () => {
        void leadsQuery.refetch();
      },
    };
  }

  if (!leadsQuery.data || leadsQuery.data.length === 0) {
    return {
      status: "empty",
      header,
      retry: () => {
        void leadsQuery.refetch();
      },
    };
  }

  return {
    status: "ready",
    directory: buildLeadsDirectoryViewModel(leadsQuery.data, search),
    updateFilters: (next: LeadsDirectoryFilterChange) => {
      updateSearch({ ...next, page: 1 });
    },
    goToPage: (page: number) => {
      updateSearch({ page });
    },
  };
}

/**
 * Supplies a standalone Leads Directory ViewModel for direct component renders.
 *
 * @param {LeadsDirectoryPageProps} props - Optional injected page state.
 * @returns {LeadsDirectoryViewModel} Presentation-ready directory state.
 */
export function useLeadsDirectoryPageViewModel(
  props: LeadsDirectoryPageProps,
): LeadsDirectoryViewModel {
  return (
    props.viewModel ??
    buildLeadsDirectoryViewModel(
      leadFixtures,
      DEFAULT_LEADS_DIRECTORY_SEARCH,
    )
  );
}
