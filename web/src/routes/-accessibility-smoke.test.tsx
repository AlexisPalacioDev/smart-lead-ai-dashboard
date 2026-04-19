/**
 * accessibility-smoke.test.tsx
 * Validates route-level accessibility basics for headings, landmarks, and
 * primary actions across the three top-level screens.
 */
import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { LeadsPage } from "../components/leads/leads-page";
import { routeTree } from "../routeTree.gen";

/**
 * Renders a specific route entry using the generated router tree.
 */
function renderRoute(path: "/dashboard" | "/leads" | "/ai-summary") {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [path],
    }),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return render(<RouterProvider router={router} />);
}

describe("Route accessibility smoke", () => {
  it("keeps dashboard heading and main landmark visible", async () => {
    renderRoute("/dashboard");

    expect(
      await screen.findByRole("heading", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("keeps leads primary action visible", async () => {
    render(<LeadsPage />);

    expect(
      await screen.findByRole("heading", { name: /leads directory/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /lead/i }),
    ).toBeInTheDocument();
  });

  it("keeps ai summary primary action visible", async () => {
    renderRoute("/ai-summary");

    expect(
      await screen.findByRole("heading", { name: /ai summary/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /generar resumen/i }),
    ).toBeInTheDocument();
  });
});
