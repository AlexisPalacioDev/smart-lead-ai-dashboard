// Application
import { buildSummaryPrompt } from "./build-summary-prompt";
// Types
import type { CreateSummaryInput, SummaryServicePort } from "./summary-ports";

/**
 * create-summary-use-case.ts
 * Orchestrates prompt assembly and summary service invocation for the route.
 */

export function createSummaryUseCase(service: SummaryServicePort) {
  return {
    execute(input: CreateSummaryInput) {
      return service.createSummary(
        buildSummaryPrompt(input.leads, input.filters),
      );
    },
  };
}
