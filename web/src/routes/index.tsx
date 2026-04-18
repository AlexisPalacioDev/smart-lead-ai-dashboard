import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * index.tsx
 * Makes the root path a redirect-only entry point into the dashboard route.
 * Assumes the dashboard is the product's default first screen.
 */

export const Route = createFileRoute("/")({
  // `beforeLoad` runs before the route renders.
  // Here the root path works as an entry point that immediately forwards users
  // to the dashboard instead of rendering its own page component.
  beforeLoad: () => {
    // Throwing `redirect` tells TanStack Router to stop loading this route
    // and navigate to `/dashboard` before any UI for `/` is displayed.
    throw redirect({ to: "/dashboard" });
  },
});
