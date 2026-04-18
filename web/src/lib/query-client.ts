import { QueryClient } from '@tanstack/react-query'

const QUERY_STALE_TIME_MS = 30_000
const QUERY_RETRY_COUNT = 1

/**
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
  })
}
