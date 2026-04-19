/**
 * leads.tsx
 * Defines Leads Directory route rendering for loading, error, empty, and table
 * states. Business rules live in lead application ViewModel hooks and builders.
 */
import { startTransition, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  LeadCrudModals,
  type LeadModalState,
} from "../components/leads/lead-crud-modals";
import { LeadsPage, LeadsScaffold } from "../components/leads/leads-page";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import {
  DEFAULT_LEADS_DIRECTORY_SEARCH,
} from "../features/leads/application/build-leads-directory-view-model";
import {
  useLeadsDirectoryRouteViewModel,
  type UpdateLeadsDirectorySearch,
} from "../features/leads/application/use-leads-directory-view-model";
import { leadSources } from "../features/leads/domain/lead";
import type { LeadsDirectorySearch } from "../features/leads/types/leads-directory-view-model";

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
  const [modalState, setModalState] = useState<LeadModalState>({
    type: "closed",
  });
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
        body={<LoadingState label="Cargando directorio de leads." />}
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
            actionLabel="Crear lead"
            onAction={() => setModalState({ type: "create" })}
          />
        }
      />
    );
  }

  return (
    <>
      <LeadsPage
        viewModel={viewModel.directory}
        onFilterChange={viewModel.updateFilters}
        onPageChange={viewModel.goToPage}
        onCreateLead={() => setModalState({ type: "create" })}
        onSelectLead={(leadId) => setModalState({ type: "detail", leadId })}
        onEditLead={(leadId) => setModalState({ type: "edit", leadId })}
        onDeleteLead={(leadId) => setModalState({ type: "delete", leadId })}
      />
      <LeadCrudModals
        modalState={modalState}
        leads={viewModel.leads}
        isMutating={viewModel.isMutating}
        mutationError={viewModel.mutationError}
        onClose={() => setModalState({ type: "closed" })}
        onEditLead={(leadId) => setModalState({ type: "edit", leadId })}
        onDeleteLead={(leadId) => setModalState({ type: "delete", leadId })}
        onCreateLead={viewModel.createLead}
        onUpdateLead={viewModel.updateLead}
        onConfirmDelete={viewModel.deleteLead}
      />
    </>
  );
}
