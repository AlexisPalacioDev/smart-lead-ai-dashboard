import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";

import { routeTree } from "../routeTree.gen";

/**
 * route-placeholders.test.tsx
 * Verifies implemented and placeholder routes expose their expected headings
 * and primary actions while the plan is still in progress.
 * Assumes route tree generation stays current with files under `src/routes`.
 */

/**
 * Renders a route entry with an in-memory router for integration-style assertions.
 *
 * @param {string} entry - Route path to mount as the initial history entry.
 * @returns {ReturnType<typeof render>} Testing Library render result.
 */
function renderRoute(entry: string) {
  const history = createMemoryHistory({
    initialEntries: [entry],
  });

  const router = createRouter({
    routeTree,
    history,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return render(<RouterProvider router={router} />);
}

describe("route placeholders", () => {
  it("renders the dashboard route without React document warnings", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderRoute("/dashboard");

    expect(await screen.findByText(/^total leads$/i)).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("renders an executive dashboard with actions into leads and ai summary", async () => {
    renderRoute("/dashboard");

    expect(await screen.findByText(/^dashboard$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /\[open directory\]/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /\[open ai\]/i }),
    ).toBeInTheDocument();
  });

  it("renders the operational leads directory with filters and create action", async () => {
    renderRoute("/leads");

    expect(await screen.findByText(/^leads directory$/i)).toBeInTheDocument();
    expect(
      await screen.findByRole("searchbox", { name: /buscar lead/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /\[new lead\]/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: /tabla de leads/i }),
    ).toBeInTheDocument();
  });

  it("renders an intelligence placeholder with a return action", async () => {
    renderRoute("/ai-summary");

    expect(await screen.findByText(/^ai briefing$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /\[ return to directory \]/i }),
    ).toBeInTheDocument();
  });
});
