import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const STORYBOOK_FILES = [
  ".storybook/main.ts",
  ".storybook/preview.ts",
  ".storybook/vite.config.ts",
  "src/stories/foundations.mdx",
  "src/components/ui/page-header.stories.tsx",
  "src/components/ui/loading-state.stories.tsx",
  "src/components/ui/empty-state.stories.tsx",
  "src/components/ui/error-state.stories.tsx",
  "src/components/leads/leads-table.stories.tsx",
  "src/components/leads/lead-form-modal.stories.tsx",
  "src/components/dashboard/source-bar-chart.stories.tsx",
  "src/components/ai/summary-state.stories.tsx",
];

describe("storybook smoke setup", () => {
  it("creates required Storybook config and story files", () => {
    for (const relativePath of STORYBOOK_FILES) {
      expect(existsSync(resolve(process.cwd(), relativePath))).toBe(true);
    }
  });
});
