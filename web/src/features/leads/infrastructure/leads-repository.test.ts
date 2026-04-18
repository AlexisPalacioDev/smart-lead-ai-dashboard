import { beforeEach, describe, expect, it } from "vitest";

import { createLeadsRepository } from "./leads-repository";
import { leadFixtures } from "./lead-fixtures";
import { clearStoredLeads, seedStoredLeads } from "./leads-storage";

/**
 * leads-repository.test.ts
 * Verifies repository behavior through the same browser-facing persistence layer
 * used by the app. Assumes MSW handlers are active in shared test setup.
 */

describe("leads repository", () => {
  beforeEach(() => {
    clearStoredLeads();
    seedStoredLeads(leadFixtures);
  });

  it("lists and mutates leads through the frontend persistence layer", async () => {
    const repository = createLeadsRepository();

    const initial = await repository.list();
    expect(initial).toHaveLength(10);

    const created = await repository.create({
      name: "Karen Mejia",
      email: "karen@example.com",
      phone: "3001001011",
      source: "facebook",
      productInterest: "AI Assist",
      budget: 999,
    });

    expect(created.id).toBeTruthy();

    const afterCreate = await repository.list();
    expect(afterCreate).toHaveLength(11);
  });
});
