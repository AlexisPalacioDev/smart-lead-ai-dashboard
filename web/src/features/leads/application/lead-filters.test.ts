import { describe, expect, it } from "vitest";

import { leadFixtures } from "../infrastructure/lead-fixtures";
import { buildLeadStats } from "./lead-stats";
import { filterLeads, paginateLeads, sortLeadsByNewest } from "./lead-filters";

/**
 * lead-filters.test.ts
 * Verifies lead filtering, sorting, pagination, and stats helpers against
 * deterministic fixture data. Assumes fixture timestamps remain stable.
 */

describe("lead filters and stats", () => {
  it("searches, filters, sorts, paginates, and computes required dashboard metrics", () => {
    const filtered = filterLeads(leadFixtures, {
      query: "ana",
      source: "instagram",
      startDate: "2026-04-01",
      endDate: "2026-04-30",
    });

    const sorted = sortLeadsByNewest(filtered);
    const page = paginateLeads(sorted, 1, 5);
    const stats = buildLeadStats(leadFixtures, "2026-04-18");

    expect(page.items).toHaveLength(1);
    expect(page.items[0].name).toBe("Ana Torres");
    expect(stats.totalLeads).toBe(10);
    expect(stats.leadsLast7Days).toBeGreaterThan(0);
    expect(stats.averageBudget).toBeGreaterThan(0);
    expect(stats.topSource).toBe("instagram");
  });
});
