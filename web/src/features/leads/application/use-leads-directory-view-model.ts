/** Coordinates Leads Directory data loading, URL search state, and ViewModels. */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createLeadUseCases } from "./lead-use-cases";
import type { LeadInput } from "./lead-ports";
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
  const queryClient = useQueryClient();
  const leadsQuery = useQuery({
    queryKey: LEADS_DIRECTORY_QUERY_KEY,
    queryFn: leadUseCases.listLeads,
  });
  const createLeadMutation = useMutation({
    mutationFn: leadUseCases.createLead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LEADS_DIRECTORY_QUERY_KEY }),
  });
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: LeadInput }) =>
      leadUseCases.updateLead(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LEADS_DIRECTORY_QUERY_KEY }),
  });
  const deleteLeadMutation = useMutation({
    mutationFn: leadUseCases.deleteLead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: LEADS_DIRECTORY_QUERY_KEY }),
  });
  const header = buildLeadsDirectoryHeaderViewModel();
  const mutationError =
    getErrorMessage(createLeadMutation.error) ??
    getErrorMessage(updateLeadMutation.error) ??
    getErrorMessage(deleteLeadMutation.error);

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
    leads: leadsQuery.data,
    directory: buildLeadsDirectoryViewModel(leadsQuery.data, search),
    updateFilters: (next: LeadsDirectoryFilterChange) => {
      updateSearch({ ...next, page: 1 });
    },
    goToPage: (page: number) => {
      updateSearch({ page });
    },
    createLead: async (input: LeadInput) => {
      await createLeadMutation.mutateAsync(input);
    },
    updateLead: async (id: string, input: LeadInput) => {
      await updateLeadMutation.mutateAsync({ id, input });
    },
    deleteLead: async (id: string) => {
      await deleteLeadMutation.mutateAsync(id);
    },
    isMutating:
      createLeadMutation.isPending ||
      updateLeadMutation.isPending ||
      deleteLeadMutation.isPending,
    mutationError,
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

/**
 * Normalizes mutation errors for route-level alert surfaces.
 *
 * @param {unknown} error - Error-like value emitted by TanStack Query.
 * @returns {string | null} Message safe to render or null when empty.
 */
function getErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Lead mutation failed";
}
