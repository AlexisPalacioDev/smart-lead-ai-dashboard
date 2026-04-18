/**
 * dashboard.tsx
 * Defines render-only dashboard route surfaces for loading, error, empty, and
 * populated states.
 * Depends on dashboard ViewModel hooks from the application layer.
 */
import { Link, createFileRoute } from "@tanstack/react-router";

import { KpiGrid } from "../components/dashboard/kpi-grid";
import { LeadsTrendChart } from "../components/dashboard/leads-trend-chart";
import { RecentActivity } from "../components/dashboard/recent-activity";
import { SourceBarChart } from "../components/dashboard/source-bar-chart";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorState } from "../components/ui/error-state";
import { LoadingState } from "../components/ui/loading-state";
import { PageHeader } from "../components/ui/page-header";
import type {
  DashboardHeaderViewModel,
  DashboardPageProps,
} from "../features/dashboard/types/dashboard-view-model";
import {
  useDashboardHeaderViewModel as useDashboardHeaderViewModelHook,
  useDashboardPageViewModel,
  useDashboardRouteViewModel,
} from "../features/dashboard/application/use-dashboard-view-model";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
});

/**
 * Renders dashboard route using precomputed route-level ViewModel state.
 *
 * @returns {JSX.Element} Loading, error, empty, or populated dashboard route.
 */
function DashboardRoute() {
  const viewModel = useDashboardRouteViewModel();

  if (viewModel.status === "loading") {
    return (
      <DashboardScaffold
        header={viewModel.header}
        body={<LoadingState label="Compiling dashboard telemetry." />}
      />
    );
  }

  if (viewModel.status === "error") {
    return (
      <DashboardScaffold
        header={viewModel.header}
        body={
          <ErrorState
            title="No fue posible cargar el dashboard."
            action={
              <button
                type="button"
                onClick={() => void viewModel.retry()}
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
      <DashboardScaffold
        header={viewModel.header}
        body={
          <EmptyState
            title="No hay leads para resumir."
            actionLabel="Recargar"
            onAction={() => void viewModel.retry()}
          />
        }
      />
    );
  }

  return <DashboardPage viewModel={viewModel.dashboard} />;
}

/**
 * Renders populated dashboard from precomputed display data.
 *
 * @param {DashboardPageProps} props - Optional lead set or injected ViewModel.
 * @returns {JSX.Element} Dashboard with KPIs, charts, and recent activity.
 */
export function DashboardPage({
  leads,
  viewModel,
}: DashboardPageProps) {
  const dashboardViewModel = useDashboardPageViewModel({ leads, viewModel });
  const headerViewModel = useDashboardHeaderViewModelHook();

  return (
    <DashboardScaffold
      header={headerViewModel}
      body={
        <>
          <KpiGrid items={dashboardViewModel.kpis} />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <SourceBarChart items={dashboardViewModel.sourceItems} />
            <LeadsTrendChart values={dashboardViewModel.trendItems} />
          </div>
          <RecentActivity items={dashboardViewModel.recentItems} />
        </>
      }
    />
  );
}

/**
 * Renders shared dashboard page chrome around any route-state body.
 *
 * @param {{ header: DashboardHeaderViewModel; body: React.ReactNode }} props -
 * Header metadata and state-specific body content.
 * @returns {JSX.Element} Shared dashboard layout shell.
 */
function DashboardScaffold({
  header,
  body,
}: {
  header: DashboardHeaderViewModel;
  body: React.ReactNode;
}) {
  return (
    <section className="space-y-8">
      <DashboardHeader viewModel={header} />
      {body}
    </section>
  );
}

/**
 * Renders dashboard header from precomputed metadata.
 *
 * @param {{ viewModel: DashboardHeaderViewModel }} props - Header view data.
 * @returns {JSX.Element} Shared dashboard header.
 */
function DashboardHeader({
  viewModel,
}: {
  viewModel: DashboardHeaderViewModel;
}) {
  const Actions = () => {
    return (
      <>
        {viewModel.actions.map((action) => (
          <Link
            key={action.to}
            className={
              action.isPrimary
                ? "terminal-link terminal-link--primary"
                : "terminal-link"
            }
            to={action.to}
          >
            [{action.label}]
          </Link>
        ))}
      </>
    );
  };

  return (
    <PageHeader
      title={viewModel.title}
      description={viewModel.description}
      actions={<Actions />}
    />
  );
}
