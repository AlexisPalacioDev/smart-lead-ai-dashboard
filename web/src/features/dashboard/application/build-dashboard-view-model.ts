/**
 * build-dashboard-view-model.ts
 * Converts raw lead entities into dashboard-ready presentation data.
 * Depends on lead metric helpers and dashboard ViewModel types.
 */
import { buildLeadStats } from "../../leads/application/lead-stats";
import {
  type Lead,
  type LeadSource,
  leadSources,
} from "../../leads/domain/lead";
import type { LeadsTrendPoint } from "../../../components/dashboard/leads-trend-chart";
import type { DashboardViewModel } from "./dashboard-view-model";

const DEFAULT_REFERENCE_DATE = "2026-04-18";
const DAYS_IN_TREND_WINDOW = 7;

const SOURCE_LABELS: Record<LeadSource, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  landing_page: "Landing Page",
  referido: "Referido",
  otro: "Otro",
};

/**
 * Converts raw leads into dashboard-ready view data.
 *
 * @param {Lead[]} leads - Lead records included in dashboard.
 * @returns {DashboardViewModel} KPI, chart, and activity data.
 */
export function buildDashboardViewModel(leads: Lead[]): DashboardViewModel {
  const referenceDate = selectReferenceDate(leads);
  const stats = buildLeadStats(leads, referenceDate);

  return {
    kpis: [
      {
        label: "Total Leads",
        value: String(stats.totalLeads),
        description: "Volumen total registrado en almacenamiento local.",
      },
      {
        label: "Prom. Presupuesto",
        value: formatBudget(stats.averageBudget),
        description:
          "Promedio calculado solo con leads que reportan presupuesto.",
      },
      {
        label: "Ultimos 7 Dias",
        value: String(stats.leadsLast7Days),
        description:
          "Entradas creadas dentro de ventana operativa mas reciente.",
      },
      {
        label: "Fuente Principal",
        value: SOURCE_LABELS[stats.topSource],
        description: "Canal con mayor participacion dentro del set actual.",
      },
    ],
    sourceItems: leadSources.map((source) => ({
      label: SOURCE_LABELS[source],
      value: stats.leadsBySource[source],
    })),
    trendItems: buildTrendItems(leads, referenceDate),
    recentItems: [...leads]
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, 4)
      .map((lead) => ({
        id: lead.id,
        name: lead.name,
        source: SOURCE_LABELS[lead.source],
        product: lead.productInterest,
        createdAt: lead.createdAt,
      })),
  };
}

/**
 * Selects reporting anchor from most recent lead date.
 *
 * @param {Lead[]} leads - Lead records available to dashboard.
 * @returns {string} ISO date string used as summary anchor.
 */
function selectReferenceDate(leads: Lead[]): string {
  return leads.length === 0
    ? DEFAULT_REFERENCE_DATE
    : [...leads]
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]
        .createdAt.slice(0, 10);
}

/**
 * Builds seven-day daily totals using UTC-safe date keys.
 *
 * @param {Lead[]} leads - Lead records included in chart.
 * @param {string} referenceDate - ISO date string for chart end date.
 * @returns {LeadsTrendPoint[]} Ordered daily totals.
 */
function buildTrendItems(
  leads: Lead[],
  referenceDate: string,
): LeadsTrendPoint[] {
  return Array.from({ length: DAYS_IN_TREND_WINDOW }, (_, index) => {
    const date = shiftIsoDate(
      referenceDate,
      index - (DAYS_IN_TREND_WINDOW - 1),
    );
    return {
      date,
      total: leads.filter((lead) => lead.createdAt.slice(0, 10) === date)
        .length,
    };
  });
}

/**
 * Formats budget metrics for compact KPI presentation.
 *
 * @param {number} value - Average budget value.
 * @returns {string} Currency-like compact string.
 */
function formatBudget(value: number): string {
  return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value)}`;
}

/**
 * Shifts an ISO date string by whole UTC days without timezone drift.
 *
 * @param {string} isoDate - Base ISO date in `YYYY-MM-DD` format.
 * @param {number} offsetDays - Whole day offset, positive or negative.
 * @returns {string} Shifted ISO date in `YYYY-MM-DD` format.
 */
function shiftIsoDate(isoDate: string, offsetDays: number): string {
  const nextDate = new Date(`${isoDate}T00:00:00.000Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + offsetDays);
  return nextDate.toISOString().slice(0, 10);
}
