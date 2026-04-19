// Application
import { getLeadSourceLabel } from "../../leads/application/lead-source-labels";
// Types
import type { Lead } from "../../leads/domain/lead";
import type { SummaryFilters } from "./summary-ports";

/**
 * build-summary-prompt.ts
 * Builds the Spanish executive-summary prompt from filtered lead inputs.
 * Assumes the UI already applied any desired filters before invocation.
 */

export function buildSummaryPrompt(
  leads: Lead[],
  filters: SummaryFilters,
): string {
  const serializedLeads = leads.map((lead) => ({
    name: lead.name,
    source: getLeadSourceLabel(lead.source),
    productInterest: lead.productInterest,
    budget: lead.budget,
    createdAt: lead.createdAt,
  }));

  return [
    "Genera un resumen ejecutivo breve en espanol para un dashboard comercial.",
    `Fuente filtrada: ${formatSource(filters.source)}`,
    `Rango inicial: ${filters.startDate || "sin limite"}`,
    `Rango final: ${filters.endDate || "sin limite"}`,
    `Cantidad de leads analizados: ${leads.length}`,
    "Devuelve JSON estricto con llaves analysis, mainSource y recommendations.",
    "Recommendations debe incluir exactamente dos acciones concretas.",
    JSON.stringify(serializedLeads),
  ].join("\n");
}

function formatSource(source: SummaryFilters["source"]) {
  return source === "all" ? "Todas" : getLeadSourceLabel(source);
}
