# Repo Structure Convention Design

Date: 2026-04-18
Version: 1.0
Status: Proposed and approved for documentation
Scope: global repository convention for future code organization

## Goal

Define a global repository structure convention that keeps files small, responsibilities explicit, and feature boundaries clear across the whole repo.

The convention must support incremental adoption. It should guide future changes without forcing a large one-time refactor.

## Decision

The repository standard will be **feature-first and flexible**.

This means:
- organize code around feature boundaries first
- create subfolders only when the code justifies them
- keep presentation, behavior, types, and external adapters separated
- avoid placeholder folders and generic catch-all buckets

## Core Rules

### 1. Route files compose, they do not own business logic

`routes/` files should assemble screen-level state and presentational components.

They should not become the long-term home for:
- business rules
- data transformation pipelines
- large ViewModel builders
- shared feature contracts

If a route starts accumulating behavior, extract that behavior into the owning feature.

### 2. Components render, application files coordinate

`components/` should contain reusable presentational UI.

Feature behavior belongs in `features/<feature>/application`, including:
- custom hooks
- ViewModels
- builders
- selectors
- feature-specific orchestration

This preserves separation of concerns:
- components explain how things look
- application files explain how things behave

### 3. Domain stays pure

If a feature has business entities, invariants, or pure decision rules, they belong in `features/<feature>/domain`.

`domain/` should stay framework-agnostic.

### 4. Infrastructure owns external adapters

Anything that talks to external systems belongs in `features/<feature>/infrastructure`.

Examples:
- HTTP clients
- storage adapters
- persistence helpers
- third-party service adapters

### 5. Types are extracted only when they improve clarity

Do not create `types/` by default.

Create `features/<feature>/types` only when one or more of these is true:
- multiple files share the same feature contracts
- the owner file becomes crowded by type declarations
- the extracted types form a coherent API surface for the feature

If a type is only used in one small file and improves readability by staying close, keep it local.

### 6. Avoid generic `utils/` by default

Do not introduce `utils/` as a catch-all bucket unless there is a strong feature-local reason.

Prefer intentional names such as:
- `builders`
- `selectors`
- `formatters`
- `mappers`

If no clear intention name exists, that is a signal to re-evaluate whether the code should be extracted at all.

### 7. Keep files small and focused

Files should stay small enough that their purpose is obvious without scrolling through multiple concerns.

Target:
- ideal: under 200 lines
- if a file grows beyond that, treat it as a refactor signal

This is not a hard mechanical rule. It is a design pressure toward single-purpose files.

## Standard Shape

The default shape for a feature is:

```text
features/<feature>/
  application/
  domain/           # only if needed
  infrastructure/   # only if needed
  types/            # only if needed
```

The default shape for presentation is:

```text
routes/
components/<feature>/
components/ui/
```

## Example

A dashboard feature following this convention can look like:

```text
web/src/
  routes/
    dashboard.tsx

  components/
    dashboard/
      kpi-grid.tsx
      leads-trend-chart.tsx
      recent-activity.tsx
      source-bar-chart.tsx

  features/
    dashboard/
      application/
        use-dashboard-view-model.ts
        build-dashboard-view-model.ts
      types/
        dashboard-view-model.ts
```

This means:
- `dashboard.tsx` renders route states and screen composition
- `components/dashboard/*` render reusable dashboard sections
- `use-dashboard-view-model.ts` owns query and route behavior
- `build-dashboard-view-model.ts` owns transformation from entities to UI-ready data
- `dashboard-view-model.ts` owns shared contracts between route and application files

## Anti-Patterns

The convention explicitly avoids:

- large route files that mix render, query logic, builders, and feature contracts
- giant feature files that contain types, hooks, mappers, and render logic together
- generic `utils/` directories with unrelated helpers
- creating `domain/`, `types/`, or `infrastructure/` folders before they are needed
- spreading one feature across random top-level folders without a clear owner

## Adoption Strategy

This convention will be adopted incrementally.

Rules:
- do not perform a global repo-wide refactor only for structural purity
- apply the convention when touching existing code
- prefer targeted extraction over broad churn
- when a file becomes crowded, split it along responsibility boundaries

This repo should follow a boy-scout approach:
- each change leaves the touched area closer to the convention than before

## Recording the Rule

To make this convention durable, it should be recorded in two places:

1. `AGENTS.md`
Purpose:
- short operational rules
- mandatory guardrails for future edits

2. architecture or design documentation under `docs/`
Purpose:
- rationale
- examples
- decision criteria

`AGENTS.md` answers:
- what must be done

The design doc answers:
- why this convention exists
- when to create or avoid subfolders
- how to apply the pattern to real features

## Success Criteria

This convention is successful if future changes consistently move the repo toward:
- smaller files
- clearer ownership
- reduced mixing of presentation and behavior
- predictable feature boundaries
- fewer generic helper buckets

## Out of Scope

This design does not mandate:
- a one-shot refactor of the full repository
- automatic migration tooling
- a strict required folder template for every feature
- renaming current files unless they are being actively touched
