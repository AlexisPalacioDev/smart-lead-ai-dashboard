# Feature-First Flexible Structure

Date: 2026-04-18
Status: Active repository convention

## Purpose

`AGENTS.md` is the normative operational guardrail for this repository. This document is supplementary rationale and examples for the same convention.

The convention is feature-first flexible:
- organize code by feature boundary first
- create subfolders only when code justifies them
- keep rendering, behavior, types, and external adapters separated

## Rules

### Routes

- routes compose screens
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
