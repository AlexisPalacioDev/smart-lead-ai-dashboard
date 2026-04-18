import { setupServer } from "msw/node";

import { handlers } from "../mocks/handlers";

/**
 * msw-server.ts
 * Creates the Node-side MSW server shared by the test environment.
 * Assumes all API mocking for tests is declared in `../mocks/handlers`.
 */

export const server = setupServer(...handlers);
