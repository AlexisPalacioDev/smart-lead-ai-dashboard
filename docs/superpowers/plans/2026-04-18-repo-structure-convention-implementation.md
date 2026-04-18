# Repo Structure Convention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Record the approved feature-first flexible structure convention in durable repo docs and apply it to the current dashboard slice as the reference implementation.

**Architecture:** This work is documentation-first and incremental. First, add short mandatory guardrails to `AGENTS.md` and a durable architecture reference under `docs/`. Then, align the already-touched `dashboard` feature to the convention by separating route rendering, application behavior, builders, and feature types without broad repo churn.

**Tech Stack:** Markdown docs, AGENTS repo policy, TanStack Start, TypeScript, Vitest, React Testing Library

---

## File Map

- `AGENTS.md` - short mandatory repository-wide structure rules for future edits
- `docs/architecture/feature-first-flexible-structure.md` - durable human-readable architecture reference with examples and anti-patterns
- `web/src/routes/dashboard.tsx` - render-only route composition for the dashboard screen
- `web/src/features/dashboard/application/use-dashboard-view-model.ts` - route-level query and state behavior
- `web/src/features/dashboard/application/build-dashboard-view-model.ts` - pure transformation of leads into dashboard presentation state
- `web/src/features/dashboard/types/dashboard-view-model.ts` - shared dashboard contracts for route and application files
- `web/src/routes/-dashboard.test.tsx` - dashboard route regression coverage
- `web/src/test/route-placeholders.test.tsx` - route smoke coverage for dashboard render path
- `web/src/test/router-navigation.test.tsx` - integration coverage for route transitions

## Task 1: Record the convention in repo policy and durable docs

**Files:**
- Modify: `AGENTS.md`
- Create: `docs/architecture/feature-first-flexible-structure.md`

- [x] **Step 1: Write the failing convention-presence check**

Run:

```bash
rg -n "feature-first flexible|avoid generic `utils/`|routes compose" AGENTS.md docs/architecture/feature-first-flexible-structure.md
```

Expected:
- FAIL because `docs/architecture/feature-first-flexible-structure.md` does not exist yet

- [x] **Step 2: Add the repository rule block to `AGENTS.md`**

Insert this block after `## 📝 Code Standards` and before `### Naming Conventions`:

```md
## 🧭 Repository Structure Convention

- Follow a feature-first, flexible structure across the repo.
- `routes/` compose screens; they should not own business rules, large builders, or shared feature contracts.
- `components/` hold reusable presentational UI.
- `features/<feature>/application` holds hooks, ViewModels, builders, selectors, and feature orchestration.
- `features/<feature>/domain` holds framework-agnostic business rules when needed.
- `features/<feature>/infrastructure` holds external adapters when needed.
- `features/<feature>/types` should exist only when extracted types improve clarity or are shared across multiple files.
- Avoid generic `utils/` directories by default; prefer intention-revealing names like `builders`, `selectors`, `formatters`, or `mappers`.
- Keep files small and focused; treat files above 200 lines as a refactor signal.
```

- [x] **Step 3: Create the durable architecture reference**

Create `docs/architecture/feature-first-flexible-structure.md` with this content:

```md
# Feature-First Flexible Structure

Date: 2026-04-18
Status: Active repository convention

## Purpose

This document explains the repository-wide structure convention used for future changes.

The convention is feature-first and flexible:
- organize code by feature boundary first
- create subfolders only when code justifies them
- keep rendering, behavior, types, and external adapters separated

## Rules

### Routes

- `routes/` compose screens
- route files should not own large ViewModel builders or business rules

### Components

- `components/` contain reusable presentational UI

### Features

- `features/<feature>/application` for hooks, ViewModels, builders, selectors, and orchestration
- `features/<feature>/domain` for pure business rules when needed
- `features/<feature>/infrastructure` for external adapters when needed
- `features/<feature>/types` only when extracted types improve clarity or are reused across files

### Folder creation policy

- do not create empty structure by template
- add folders only when a concrete ownership boundary exists

### Anti-patterns

- route files mixing render, query logic, builders, and shared contracts
- giant feature files with types, hooks, mappers, and rendering in one place
- generic `utils/` directories used as catch-all buckets

## Example

```text
web/src/
  routes/
    dashboard.tsx

  components/
    dashboard/
    ui/

  features/
    dashboard/
      application/
        use-dashboard-view-model.ts
        build-dashboard-view-model.ts
      types/
        dashboard-view-model.ts
```
```

- [x] **Step 4: Run the convention-presence check again**

Run:

```bash
rg -n "feature-first flexible|avoid generic `utils/`|routes compose" AGENTS.md docs/architecture/feature-first-flexible-structure.md
```

Expected:
- PASS with matches in both files

- [x] **Step 5: Commit the documentation and policy changes**

```bash
git add AGENTS.md docs/architecture/feature-first-flexible-structure.md
git commit -m "docs: record repo structure convention"
```

## Task 2: Apply the convention to the dashboard feature as reference implementation

**Files:**
- Create: `web/src/features/dashboard/types/dashboard-view-model.ts`
- Delete: `web/src/features/dashboard/application/dashboard-view-model.ts`
- Modify: `web/src/features/dashboard/application/use-dashboard-view-model.ts`
- Modify: `web/src/features/dashboard/application/build-dashboard-view-model.ts`
- Modify: `web/src/routes/dashboard.tsx`
- Test: `web/src/routes/-dashboard.test.tsx`

- [x] **Step 1: Write the failing dashboard type-location assertion**

Add this test to `web/src/routes/-dashboard.test.tsx`:

```tsx
it("renders the dashboard through extracted feature types and view models", async () => {
  renderDashboard();

  expect(await screen.findByText(/total leads/i)).toBeInTheDocument();
  expect(screen.getByText(/tendencia reciente/i)).toBeInTheDocument();
});
```

- [x] **Step 2: Run the focused dashboard suite**

Run:

```bash
pnpm --dir web exec vitest run src/routes/-dashboard.test.tsx src/test/route-placeholders.test.tsx src/test/router-navigation.test.tsx
```

Expected:
- PASS before the move, giving a safety baseline before refactoring

- [x] **Step 3: Create the dashboard types module**

Create `web/src/features/dashboard/types/dashboard-view-model.ts` with this content:

```ts
/**
 * dashboard-view-model.ts
 * Declares shared dashboard view-model contracts consumed by route and application files.
 * Depends on dashboard presentation contracts and lead entity typing.
 */
import type { KpiCard } from "../../../components/dashboard/kpi-grid";
import type { LeadsTrendPoint } from "../../../components/dashboard/leads-trend-chart";
import type { Lead } from "../../leads/domain/lead";

export type DashboardRecentActivityItem = {
  id: string;
  name: string;
  source: string;
  product: string;
  createdAt: string;
};

export type DashboardViewModel = {
  kpis: KpiCard[];
  sourceItems: Array<{ label: string; value: number }>;
  trendItems: LeadsTrendPoint[];
  recentItems: DashboardRecentActivityItem[];
};

export type DashboardHeaderAction = {
  label: string;
  to: "/leads" | "/ai-summary";
  isPrimary?: boolean;
};

export type DashboardHeaderViewModel = {
  title: string;
  description: string;
  actions: DashboardHeaderAction[];
};

export type DashboardRouteViewModel =
  | { status: "loading"; header: DashboardHeaderViewModel }
  | { status: "error"; header: DashboardHeaderViewModel; retry: () => void }
  | { status: "empty"; header: DashboardHeaderViewModel; retry: () => void }
  | {
      status: "ready";
      header: DashboardHeaderViewModel;
      dashboard: DashboardViewModel;
    };

export type DashboardPageProps = {
  leads?: Lead[];
  viewModel?: DashboardViewModel;
};
```

- [x] **Step 4: Remove the old dashboard types file and update application imports**

Delete `web/src/features/dashboard/application/dashboard-view-model.ts`.

Then update `web/src/features/dashboard/application/use-dashboard-view-model.ts` to import the shared contracts from the new location:

```ts
import type {
  DashboardHeaderViewModel,
  DashboardRouteViewModel,
  DashboardViewModel,
} from "../types/dashboard-view-model";
```

In `web/src/features/dashboard/application/build-dashboard-view-model.ts`, import:

```ts
import type { DashboardViewModel } from "../types/dashboard-view-model";
```

- [x] **Step 5: Update the route to consume the extracted dashboard types**

In `web/src/routes/dashboard.tsx`, import:

```ts
import type {
  DashboardHeaderViewModel,
  DashboardPageProps,
} from "../features/dashboard/types/dashboard-view-model";
```

And keep hook imports coming from:

```ts
import {
  useDashboardHeaderViewModel,
  useDashboardPageViewModel,
  useDashboardRouteViewModel,
} from "../features/dashboard/application/use-dashboard-view-model";
```

- [x] **Step 6: Run the focused dashboard suite again**

Run:

```bash
pnpm --dir web exec vitest run src/routes/-dashboard.test.tsx src/test/route-placeholders.test.tsx src/test/router-navigation.test.tsx
```

Expected:
- PASS with no behavior changes

- [x] **Step 7: Commit the dashboard reference implementation**

```bash
git rm web/src/features/dashboard/application/dashboard-view-model.ts
git add \
  web/src/features/dashboard/types/dashboard-view-model.ts \
  web/src/features/dashboard/application/use-dashboard-view-model.ts \
  web/src/features/dashboard/application/build-dashboard-view-model.ts \
  web/src/routes/dashboard.tsx \
  web/src/routes/-dashboard.test.tsx \
  web/src/test/route-placeholders.test.tsx \
  web/src/test/router-navigation.test.tsx
git commit -m "refactor(web): align dashboard to repo structure convention"
```

## Task 3: Verify the convention is durable and documented for future work

**Files:**
- Modify: `docs/superpowers/specs/2026-04-18-repo-structure-convention-design.md`
- Modify: `docs/superpowers/plans/2026-04-18-repo-structure-convention-implementation.md`

- [x] **Step 1: Mark the implementation plan progress as tasks complete**

When Task 1 and Task 2 finish, update this plan file by changing completed steps from `- [ ]` to `- [x]`.

- [x] **Step 2: Add an implementation note to the spec**

Append this short section to `docs/superpowers/specs/2026-04-18-repo-structure-convention-design.md`:

```md
## Implementation Note

Initial adoption is intentionally incremental.

The first concrete reference implementation is the `dashboard` feature under `web/src/features/dashboard/**`, which demonstrates:
- render-only route files
- extracted application behavior
- extracted view-model builders
- feature-local shared types
```

- [x] **Step 3: Verify the written record exists in all intended places**

Run:

```bash
rg -n "feature-first|dashboard feature under `web/src/features/dashboard`|Avoid generic `utils/`" \
  AGENTS.md \
  docs/architecture/feature-first-flexible-structure.md \
  docs/superpowers/specs/2026-04-18-repo-structure-convention-design.md
```

Expected:
- PASS with matches in all three locations

- [x] **Step 4: Commit the final record alignment**

```bash
git add -f \
  docs/superpowers/specs/2026-04-18-repo-structure-convention-design.md \
  docs/superpowers/plans/2026-04-18-repo-structure-convention-implementation.md
git commit -m "docs: align structure convention records"
```
