# Smart Lead AI Dashboard

Desktop-first TanStack Start workspace for dashboard, leads directory, and AI executive summaries.

## Requirements

- Node.js 20+
- pnpm 9+

## Setup

1. `cd web`
2. `pnpm install`
3. `cp .env.example .env`
4. Set `VITE_OPENAI_API_KEY`
5. Optionally change `VITE_OPENAI_MODEL`

## Development

- `pnpm dev`
- `pnpm test`
- `pnpm build`

## Storybook

- `pnpm --dir web storybook` runs the visual component catalog locally
- `pnpm --dir web build-storybook` validates the catalog before delivery or CI
- Reusable components should live in `web/src/components/**` and ship with a colocated `*.stories.tsx` file

## Architecture

- `web/src/features/*/domain` keeps framework-agnostic business rules
- `web/src/features/*/application` keeps use cases, builders, and ports
- `web/src/features/*/infrastructure` keeps adapters for browser persistence, MSW, and OpenAI
- `web/src/routes` and `web/src/components` act as UI adapters

## Mock Leads

- MSW intercepts lead operations in browser and tests
- Fixture seed data starts in `web/src/features/leads/infrastructure/lead-fixtures.ts`
- Create, update, and delete operations persist in `localStorage`

## OpenAI Notes

- AI Summary uses the OpenAI Responses API from the browser for this technical exercise
- `web/.env.example` documents required frontend variables
- Do not use this frontend-only key strategy in production
