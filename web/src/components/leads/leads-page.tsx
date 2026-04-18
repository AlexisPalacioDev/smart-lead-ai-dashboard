import type { ReactNode } from "react";

import type {
  LeadsDirectoryHeaderViewModel,
  LeadsDirectoryPageProps,
} from "../../features/leads/types/leads-directory-view-model";
import { useLeadsDirectoryPageViewModel } from "../../features/leads/application/use-leads-directory-view-model";
import { PageHeader } from "../ui/page-header";
import { LeadsFilters } from "./leads-filters";
import { LeadsTable } from "./leads-table";

type LeadsPageProps = LeadsDirectoryPageProps & {
  onCreateLead?: () => void;
  onSelectLead?: (leadId: string) => void;
  onEditLead?: (leadId: string) => void;
  onDeleteLead?: (leadId: string) => void;
};

/**
 * Renders populated Leads Directory using injected or default ViewModel state.
 *
 * @param {LeadsPageProps} props - Optional page state and handlers.
 * @returns {JSX.Element} Filter toolbar, result summary, and leads table.
 */
export function LeadsPage({
  viewModel,
  onFilterChange = () => {},
  onPageChange = () => {},
  onCreateLead = () => {},
  onSelectLead = () => {},
  onEditLead = () => {},
  onDeleteLead = () => {},
}: LeadsPageProps) {
  const pageViewModel = useLeadsDirectoryPageViewModel({ viewModel });

  return (
    <LeadsScaffold
      header={pageViewModel.header}
      onCreateLead={onCreateLead}
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
            onSelectLead={onSelectLead}
            onEditLead={onEditLead}
            onDeleteLead={onDeleteLead}
            onPageChange={onPageChange}
          />
        </>
      }
    />
  );
}

/**
 * Wraps Leads Directory body content with stable page header chrome.
 */
export function LeadsScaffold({
  header,
  body,
  onCreateLead,
}: {
  header: LeadsDirectoryHeaderViewModel;
  body: ReactNode;
  onCreateLead?: () => void;
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
            onClick={onCreateLead}
          >
            [{header.actionLabel}]
          </button>
        }
      />
      {body}
    </section>
  );
}
