# Smart Lead AI Dashboard (Web)

Frontend workspace for dashboard, lead directory, and AI executive summaries.

## Requirements

- Node.js 20+
- pnpm 9+ (or newer)

## Local Setup

From the repository root:

```bash
cd web
pnpm install
cp .env.example .env
```

Set these variables in `web/.env`:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_MODEL=gpt-5.4
```

## Commands

Run from `web/`:

```bash
pnpm dev
```

Other commands:

```bash
pnpm test
pnpm build
pnpm preview
pnpm storybook
pnpm build-storybook
```

## Runtime Behavior

- **Development (`pnpm dev`)**
  - Lead APIs use HTTP (`/api/leads`) mocked with MSW.
  - Mock seed data is in `src/features/leads/infrastructure/lead-fixtures.ts`.
- **Production build (`pnpm build` / deployed app)**
  - Lead APIs use browser `localStorage` through the infrastructure adapter.
  - This avoids runtime 404s for `/api/leads` when no backend is deployed.

## Architecture

The frontend follows a hexagonal style:

- `src/features/*/domain`: framework-agnostic business rules
- `src/features/*/application`: use cases, ports, and orchestration
- `src/features/*/infrastructure`: adapters (MSW/HTTP, localStorage, OpenAI transport)
- `src/routes` + `src/components`: UI adapters and route composition

For leads, the composition is in:

- `src/features/leads/infrastructure/leads-api.ts`

That module selects the adapter by environment (`import.meta.env.DEV`).

## OpenAI Notes

- AI summary uses the OpenAI Responses API from the browser for this exercise.
- Never expose production secrets in public frontend apps.
- If this moves to production with real users, place OpenAI calls behind a server endpoint.

## Troubleshooting

- If local dev shows stale module/chunk 404 errors, stop dev server and restart:

```bash
pnpm dev
```

## TanStack Reference

This project uses TanStack Start + TanStack Router with file-based routing.

- Routes live in `src/routes`.
- The root layout/shell is `src/routes/__root.tsx`.
- New routes are created by adding new files under `src/routes`.

Example link usage:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>;
```

TanStack Start also supports server functions and API route handlers when needed:

- Server functions: `createServerFn` from `@tanstack/react-start`
- Route handlers: `server.handlers` in route definitions

Official docs:

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router/latest)
- [Data Loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
