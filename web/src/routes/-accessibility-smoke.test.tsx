import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "../routeTree.gen";

function renderRoute(initialPath: "/dashboard" | "/leads" | "/ai-summary") {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialPath],
    }),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return render(<RouterProvider router={router} />);
}

describe("route accessibility smoke test", () => {
  it("keeps headings, named landmarks, and primary actions visible", async () => {
    const dashboard = renderRoute("/dashboard");
    expect(
      await screen.findByRole("heading", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /dashboard/i })).toBeInTheDocument();
    dashboard.unmount();

    const leads = renderRoute("/leads");
    expect(
      await screen.findByRole("heading", { name: /leads directory/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /leads directory/i }),
    ).toBeInTheDocument();
    await screen.findByRole("button", { name: /nuevo lead/i });
    leads.unmount();

    renderRoute("/ai-summary");
    expect(
      await screen.findByRole("heading", { name: /ai summary/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /ai summary/i })).toBeInTheDocument();
    await screen.findByRole("button", { name: /generar resumen/i });
  });
});
