/**
 * -dashboard.test.tsx
 * Verifies the populated dashboard view renders the KPI and analytics sections
 * required by the implementation plan.
 */
import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "../routeTree.gen";

/**
 * Renders the dashboard route inside the generated router tree so components
 * depending on router links keep their runtime contract in tests.
 *
 * @returns {ReturnType<typeof render>} Testing Library render result.
 */
function renderDashboard() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/dashboard"],
    }),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return render(<RouterProvider router={router} />);
}

describe("DashboardRoute", () => {
  it("renders the four required KPI cards and chart headings", async () => {
    renderDashboard();

    expect(await screen.findByText(/total leads/i)).toBeInTheDocument();
    expect(screen.getByText(/prom\. presupuesto/i)).toBeInTheDocument();
    expect(screen.getByText(/ultimos 7 dias/i)).toBeInTheDocument();
    expect(screen.getByText(/fuente principal/i)).toBeInTheDocument();
    expect(screen.getByText(/leads por fuente/i)).toBeInTheDocument();
    expect(screen.getByText(/tendencia reciente/i)).toBeInTheDocument();
  });

  it("renders the dashboard through extracted feature types and view models", async () => {
    renderDashboard();

    expect(await screen.findByText(/actividad reciente/i)).toBeInTheDocument();
    expect(screen.getByText(/ana torres/i)).toBeInTheDocument();
  });
});
