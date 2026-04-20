/**
 * app-shell.test.tsx
 * Verifies the shared shell preserves the baseline accessibility affordances
 * expected by every route in the Smart Lead AI workspace.
 */
import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "../../routeTree.gen";

/**
 * Renders the shell inside a minimal TanStack Router tree because the primary
 * nav uses framework links that require router context even in isolated tests.
 *
 * @returns {ReturnType<typeof render>} Testing Library render result.
 */
function renderAppShell() {
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

describe("AppShell", () => {
  it("renders a skip link and keeps the primary navigation visible", async () => {
    renderAppShell();

    expect(
      await screen.findByRole("link", { name: /saltar al contenido principal/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("navigation", { name: /principal/i }),
    ).toBeInTheDocument();
  });
});
