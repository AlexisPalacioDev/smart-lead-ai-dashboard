/**
 * dashboard-view-model.ts
 * Declares shared dashboard ViewModel types consumed by route and application
 * hooks.
 * Depends on dashboard presentation contracts such as KPI cards and trend points.
 */
import type { KpiCard } from "../../../components/dashboard/kpi-grid";
import type { LeadsTrendPoint } from "../../../components/dashboard/leads-trend-chart";
import type { Lead } from "../../leads/domain/lead";

/**
 * Compact recent-activity row shown on dashboard feed.
 */
export type DashboardRecentActivityItem = {
  id: string;
  name: string;
  source: string;
  product: string;
  createdAt: string;
};

/**
 * Full populated dashboard state used by presentational sections.
 */
export type DashboardViewModel = {
  kpis: KpiCard[];
  sourceItems: Array<{ label: string; value: number }>;
  trendItems: LeadsTrendPoint[];
  recentItems: DashboardRecentActivityItem[];
};

/**
 * Header action metadata rendered in page chrome.
 */
export type DashboardHeaderAction = {
  label: string;
  to: "/leads" | "/ai-summary";
  isPrimary?: boolean;
};

/**
 * Shared page-header data for dashboard route states.
 */
export type DashboardHeaderViewModel = {
  title: string;
  description: string;
  actions: DashboardHeaderAction[];
};

/**
 * Route-level async state consumed by dashboard route renderer.
 */
export type DashboardRouteViewModel =
  | { status: "loading"; header: DashboardHeaderViewModel }
  | { status: "error"; header: DashboardHeaderViewModel; retry: () => void }
  | { status: "empty"; header: DashboardHeaderViewModel; retry: () => void }
  | {
      status: "ready";
      header: DashboardHeaderViewModel;
      dashboard: DashboardViewModel;
    };

/**
 * Optional props for rendering populated dashboard with injected state.
 */
export type DashboardPageProps = {
  leads?: Lead[];
  viewModel?: DashboardViewModel;
};
