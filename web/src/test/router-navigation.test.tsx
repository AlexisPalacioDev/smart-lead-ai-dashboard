import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "../routeTree.gen";

/**
 * router-navigation.test.tsx
 * Covers a real route transition through the generated router tree.
 * Assumes route copy remains stable enough for accessible-role assertions.
 */

describe("router navigation", () => {
  it("renders the leads page after clicking Directorio de leads", async () => {
    const user = userEvent.setup();
    const history = createMemoryHistory({
      initialEntries: ["/dashboard"],
    });

    const router = createRouter({
      routeTree,
      history,
      scrollRestoration: true,
      defaultPreload: "intent",
      defaultPreloadStaleTime: 0,
    });

    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("link", { name: /directorio de leads/i }),
    );

    expect(
      await screen.findByRole("heading", { name: "Directorio de leads" }),
    ).toBeInTheDocument();
  });
});
