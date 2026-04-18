/** Centralizes dashboard route behavior and presentation-ready metrics. */
import { useQuery } from "@tanstack/react-query";
import { createLeadUseCases } from "../../leads/application/lead-use-cases";
import { leadFixtures } from "../../leads/infrastructure/lead-fixtures";
import { createLeadsRepository } from "../../leads/infrastructure/leads-repository";
import { buildDashboardViewModel } from "./build-dashboard-view-model";
import type {
  DashboardHeaderViewModel,
  DashboardPageProps,
  DashboardRouteViewModel,
  DashboardViewModel,
} from "../types/dashboard-view-model";
const DASHBOARD_QUERY_KEY = ["leads", "dashboard"] as const;
const leadUseCases = createLeadUseCases(createLeadsRepository());

/**
 * Centralizes route behavior and branch conditions for dashboard loading.
 *
 * @returns {DashboardRouteViewModel} Route state ready for rendering.
 */
export function useDashboardRouteViewModel(): DashboardRouteViewModel {
  const leadsQuery = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: leadUseCases.listLeads,
  });
  const header = useDashboardHeaderViewModel();

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
    header,
    dashboard: buildDashboardViewModel(leadsQuery.data),
  };
}
/**
 * Supplies stable dashboard header content for all route states.
 *
 * @returns {DashboardHeaderViewModel} Header copy and action metadata.
 */
export function useDashboardHeaderViewModel(): DashboardHeaderViewModel {
  return {
    title: "Dashboard",
    description:
      "Resumen ejecutivo del pipeline actual: volumen, presupuesto, ritmo reciente y fuente dominante.",
    actions: [
      { label: "OPEN DIRECTORY", to: "/leads", isPrimary: true },
      { label: "OPEN AI", to: "/ai-summary" },
    ],
  };
}
/**
 * Supplies dashboard display data from either precomputed state or raw leads.
 *
 * @param {DashboardPageProps} props - Optional lead set or injected ViewModel.
 * @returns {DashboardViewModel} Dashboard data ready for presentational components.
 */
export function useDashboardPageViewModel(
  props: DashboardPageProps,
): DashboardViewModel {
  const leads = props.leads?.length ? props.leads : leadFixtures;

  return props.viewModel ?? buildDashboardViewModel(leads);
}
