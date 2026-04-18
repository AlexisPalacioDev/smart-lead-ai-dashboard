/**
 * -leads.test.tsx
 * Verifies the Leads Directory route exposes searchable, source-filtered
 * tabular lead data through the real router and query providers.
 */
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { beforeEach, describe, expect, it } from "vitest";

import { clearStoredLeads } from "../features/leads/infrastructure/leads-storage";
import { routeTree } from "../routeTree.gen";

/**
 * Renders the Leads Directory route through the generated route tree.
 *
 * @returns {ReturnType<typeof render>} Testing Library render helpers.
 */
function renderLeadsPage() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ["/leads"],
    }),
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return render(<RouterProvider router={router} />);
}

describe("LeadsRoute", () => {
  beforeEach(() => {
    clearStoredLeads();
  });

  it("filters by search and source while preserving the leads table", async () => {
    const { findByRole, findByText, getByRole } = renderLeadsPage();
    const user = userEvent.setup();

    await findByRole("table", { name: /tabla de leads/i });
    await user.type(getByRole("searchbox", { name: /buscar lead/i }), "ana");
    await user.selectOptions(getByRole("combobox", { name: /fuente/i }), [
      "instagram",
    ]);

    expect(getByRole("table", { name: /tabla de leads/i })).toBeInTheDocument();
    expect(await findByText(/ana torres/i)).toBeInTheDocument();
  });
});
