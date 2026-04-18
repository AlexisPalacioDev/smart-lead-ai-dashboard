import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

/**
 * browser.ts
 * Exposes the MSW service worker used for browser-side API mocking.
 * Assumes callers start the worker during local development when needed.
 */

/**
 * Shared browser worker configured with the application's mock handlers.
 */
export const worker = setupWorker(...handlers);
