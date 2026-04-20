/**
 * build-leads-directory-view-model.ts
 * Converts lead entities and URL search state into presentation-ready table,
 * filter, and pagination data for the Leads Directory route.
 */
import { leadSources, type Lead } from "../domain/lead";
import {
  filterLeads,
  paginateLeads,
  sortLeadsByNewest,
} from "./lead-filters";
import { getLeadSourceLabel } from "./lead-source-labels";
import type {
  LeadsDirectorySearch,
  LeadsDirectorySourceOption,
  LeadsDirectoryViewModel,
} from "../types/leads-directory-view-model";

export const LEADS_DIRECTORY_PAGE_SIZE = 5;

export const DEFAULT_LEADS_DIRECTORY_SEARCH: LeadsDirectorySearch = {
  query: "",
  source: "all",
  startDate: "",
  endDate: "",
  page: 1,
};

const SOURCE_OPTIONS: LeadsDirectorySourceOption[] = [
  { value: "all", label: "Todas" },
  ...leadSources.map((source) => ({
    value: source,
    label: getLeadSourceLabel(source),
  })),
];

/**
 * Builds a complete Leads Directory ViewModel from raw leads.
 *
 * @param {Lead[]} leads - Lead collection loaded from the repository.
 * @param {LeadsDirectorySearch} search - URL-backed filter and pagination state.
 * @returns {LeadsDirectoryViewModel} Presentation-ready directory state.
 */
export function buildLeadsDirectoryViewModel(
  leads: Lead[],
  search: LeadsDirectorySearch,
): LeadsDirectoryViewModel {
  const filteredLeads = filterLeads(leads, search);
  const sortedLeads = sortLeadsByNewest(filteredLeads);
  const requestedPage = Math.max(1, search.page);
  const page = paginateLeads(
    sortedLeads,
    requestedPage,
    LEADS_DIRECTORY_PAGE_SIZE,
  );

  return {
    header: buildLeadsDirectoryHeaderViewModel(),
    filters: {
      ...search,
      page: requestedPage,
      sourceOptions: SOURCE_OPTIONS,
    },
    rows: page.items.map(formatLeadRow),
    pagination: {
      page: requestedPage,
      totalPages: page.totalPages,
      total: page.total,
      pageSize: LEADS_DIRECTORY_PAGE_SIZE,
      canGoPrevious: requestedPage > 1,
      canGoNext: requestedPage < page.totalPages,
    },
    resultSummary: buildResultSummary(page.total, leads.length),
  };
}

/**
 * Supplies stable route header copy for all Leads Directory states.
 *
 * @returns {LeadsDirectoryViewModel["header"]} Header copy and CTA label.
 */
export function buildLeadsDirectoryHeaderViewModel(): LeadsDirectoryViewModel["header"] {
  return {
    title: "Directorio de leads",
    description:
      "Gestion operativa de leads con busqueda, filtros, orden por fecha y estados de ruta.",
    actionLabel: "Nuevo lead",
  };
}

/**
 * Formats a lead entity into a table row ViewModel.
 *
 * @param {Lead} lead - Lead entity to render.
 * @returns {LeadsDirectoryViewModel["rows"][number]} Display-ready row data.
 */
function formatLeadRow(lead: Lead): LeadsDirectoryViewModel["rows"][number] {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || "Sin telefono",
    sourceLabel: getLeadSourceLabel(lead.source),
    productInterest: lead.productInterest || "Sin producto",
    budgetLabel:
      lead.budget === null
        ? "Sin presupuesto"
        : `$${new Intl.NumberFormat("es-CO", {
            maximumFractionDigits: 0,
          }).format(lead.budget)}`,
    createdAtLabel: new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(lead.createdAt)),
  };
}

/**
 * Builds compact result copy for current filters.
 *
 * @param {number} visibleCount - Number of leads matching current filters.
 * @param {number} totalCount - Total loaded lead count before filtering.
 * @returns {string} Human-readable result summary.
 */
function buildResultSummary(visibleCount: number, totalCount: number): string {
  return `${visibleCount} de ${totalCount} leads visibles`;
}
