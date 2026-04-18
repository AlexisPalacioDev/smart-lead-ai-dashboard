/**
 * lead-stats.test.ts
 * Covers tie-breaking and empty-state behavior for dashboard metric helpers.
 * Uses compact fixture builders so expectations stay focused on edge cases.
 */
import { describe, expect, it } from "vitest";

import type { Lead } from "../domain/lead";
import { buildLeadStats } from "./lead-stats";

/**
 * Creates a minimal lead fixture with override support for isolated tests.
 *
 * @param {Partial<Lead>} overrides - Field overrides for each test scenario.
 * @returns {Lead} Fully shaped lead fixture.
 */
const buildLead = (overrides: Partial<Lead>): Lead => ({
  id: "lead-1",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "3001234567",
  source: "instagram",
  productInterest: "Consulting",
  budget: 1000,
  createdAt: "2026-04-18T10:00:00.000Z",
  ...overrides,
});

describe("buildLeadStats", () => {
  it("returns instagram as the fallback top source when there are no leads", () => {
    const stats = buildLeadStats([], "2026-04-18");

    expect(stats.topSource).toBe("instagram");
    expect(stats.leadsBySource).toEqual({
      instagram: 0,
      facebook: 0,
      landing_page: 0,
      referido: 0,
      otro: 0,
    });
  });

  it("keeps the declared source order when multiple sources are tied", () => {
    const leads = [
      buildLead({ id: "lead-1", source: "instagram" }),
      buildLead({ id: "lead-2", source: "facebook" }),
    ];

    const stats = buildLeadStats(leads, "2026-04-18");

    expect(stats.topSource).toBe("instagram");
  });
});
