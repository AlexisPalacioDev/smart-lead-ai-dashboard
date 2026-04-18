/**
 * leads.tsx
 * Defines Leads Directory route rendering for loading, error, empty, and table
 * states. Business rules live in lead application ViewModel hooks and builders.
 */
import { startTransition, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { LeadsFilters } from "../components/leads/leads-filters";
import { LeadsTable } from "../components/leads/leads-table";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import {
  DEFAULT_LEADS_DIRECTORY_SEARCH,
} from "../features/leads/application/build-leads-directory-view-model";
import {
  useLeadsDirectoryPageViewModel,
  useLeadsDirectoryRouteViewModel,
  type UpdateLeadsDirectorySearch,
} from "../features/leads/application/use-leads-directory-view-model";
import { leadSources } from "../features/leads/domain/lead";
import type {
  LeadsDirectoryHeaderViewModel,
  LeadsDirectoryPageProps,
  LeadsDirectorySearch,
} from "../features/leads/types/leads-directory-view-model";

const leadSourceFilterValues = ["all", ...leadSources] as const;

const leadsSearchSchema = z.object({
  query: z.string().catch(DEFAULT_LEADS_DIRECTORY_SEARCH.query),
  source: z
    .enum(leadSourceFilterValues)
    .catch(DEFAULT_LEADS_DIRECTORY_SEARCH.source),
  startDate: z.string().catch(DEFAULT_LEADS_DIRECTORY_SEARCH.startDate),
  endDate: z.string().catch(DEFAULT_LEADS_DIRECTORY_SEARCH.endDate),
  page: z.coerce
    .number()
    .int()
    .positive()
    .catch(DEFAULT_LEADS_DIRECTORY_SEARCH.page),
});

export const Route = createFileRoute("/leads")({
  validateSearch: leadsSearchSchema,
  component: LeadsRoute,
});

/**
 * Renders route branch state using URL-backed search and repository data.
 *
 * @returns {JSX.Element} Loading, error, empty, or populated Leads Directory.
 */
function LeadsRoute() {
  const search = Route.useSearch() as LeadsDirectorySearch;
  const navigate = Route.useNavigate();
  const updateSearch: UpdateLeadsDirectorySearch = (next) => {
    startTransition(() => {
      void navigate({
        search: (previous) => ({
          ...previous,
          ...next,
        }),
      });
    });
  };
  const viewModel = useLeadsDirectoryRouteViewModel(search, updateSearch);

  if (viewModel.status === "loading") {
    return (
      <LeadsScaffold
        header={viewModel.header}
        body={<LoadingState label="Loading lead register." />}
      />
    );
  }

  if (viewModel.status === "error") {
    return (
      <LeadsScaffold
        header={viewModel.header}
        body={
          <ErrorState
            title="No fue posible cargar los leads."
            action={
              <button
                type="button"
                onClick={() => viewModel.retry()}
                className="terminal-link terminal-link--primary"
              >
                [REINTENTAR]
              </button>
            }
          />
        }
      />
    );
  }

  if (viewModel.status === "empty") {
    return (
      <LeadsScaffold
        header={viewModel.header}
        body={
          <EmptyState
            title="No hay leads para mostrar."
            actionLabel="Recargar"
            onAction={() => viewModel.retry()}
          />
        }
      />
    );
  }

  return (
    <LeadsPage
      viewModel={viewModel.directory}
      onFilterChange={viewModel.updateFilters}
      onPageChange={viewModel.goToPage}
    />
  );
}

/**
 * Renders populated Leads Directory using injected or default ViewModel state.
 *
 * @param {LeadsDirectoryPageProps} props - Optional page state and handlers.
 * @returns {JSX.Element} Filter toolbar, result summary, and leads table.
 */
export function LeadsPage({
  viewModel,
  onFilterChange = () => {},
  onPageChange = () => {},
}: LeadsDirectoryPageProps) {
  const pageViewModel = useLeadsDirectoryPageViewModel({ viewModel });

  return (
    <LeadsScaffold
      header={pageViewModel.header}
      body={
        <>
          <LeadsFilters
            filters={pageViewModel.filters}
            onChange={onFilterChange}
          />
          <p className="terminal-eyebrow">{pageViewModel.resultSummary}</p>
          <LeadsTable
            rows={pageViewModel.rows}
            pagination={pageViewModel.pagination}
            onSelectLead={() => {}}
            onPageChange={onPageChange}
          />
        </>
      }
    />
  );
}

/**
 * Wraps Leads Directory body content with stable page header chrome.
 *
 * @param {{ header: LeadsDirectoryHeaderViewModel; body: ReactNode }} props -
 * Header metadata and state-specific body.
 * @returns {JSX.Element} Shared route layout.
 */
function LeadsScaffold({
  header,
  body,
}: {
  header: LeadsDirectoryHeaderViewModel;
  body: ReactNode;
}) {
  return (
    <section className="space-y-8">
      <PageHeader
        title={header.title}
        description={header.description}
        actions={
          <button
            type="button"
            className="terminal-link terminal-link--primary"
          >
            [{header.actionLabel}]
          </button>
        }
      />
      {body}
    </section>
  );
}
