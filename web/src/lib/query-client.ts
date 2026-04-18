import { QueryClient } from "@tanstack/react-query";

/**
 * query-client.ts
 * Creates the shared TanStack Query client used by route components.
 * Assumes one long-lived client instance per app runtime is sufficient.
 */

const QUERY_STALE_TIME_MS = 30_000;
const QUERY_RETRY_COUNT = 1;

/**
 * Builds the application's QueryClient with conservative default behavior.
 * Builds shared query client config for route-level data access.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        retry: QUERY_RETRY_COUNT,
      },
    },
  });
}
