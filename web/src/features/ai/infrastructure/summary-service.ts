// Types
import type {
  SummaryResult,
  SummaryServicePort,
} from "../application/summary-ports";
// Infrastructure
import { requestOpenAISummary } from "./openai-client";

/**
 * summary-service.ts
 * Adapts raw OpenAI Responses API payloads into the stable `SummaryServicePort`
 * contract consumed by the application layer.
 *
 * This file sits between transport and application concerns:
 * - `openai-client.ts` knows how to call the HTTP API
 * - this service knows how to extract and validate the returned text payload
 * - the route and use case only receive a stable `SummaryResult`
 *
 * Even though the request asks OpenAI for strict JSON-schema output, this
 * adapter still performs runtime validation. That extra guard keeps malformed
 * or partial model responses from leaking into the UI and gives the feature one
 * predictable failure mode when the payload shape is not what the rest of the
 * app expects.
 */

export const summaryService: SummaryServicePort = {
  async createSummary(prompt: string) {
    const payload = await requestOpenAISummary(prompt);
    const text = readOutputText(payload);
    // The transport layer returns text-oriented response fields, so this
    // adapter is responsible for turning the model output into structured data.
    const parsed = JSON.parse(text) as Partial<SummaryResult>;

    if (
      typeof parsed.analysis !== "string" ||
      typeof parsed.mainSource !== "string" ||
      !Array.isArray(parsed.recommendations) ||
      parsed.recommendations.some((item) => typeof item !== "string")
    ) {
      // Keep one stable domain-facing error instead of exposing transport or
      // model-specific parsing details to the route.
      throw new Error("OpenAI devolvio un resumen invalido.");
    }

    return {
      analysis: parsed.analysis,
      mainSource: parsed.mainSource,
      recommendations: parsed.recommendations,
    };
  },
};

function readOutputText(payload: {
  output?: Array<{ content?: Array<{ text?: string; type?: string }> }>;
  output_text?: string;
}) {
  // Prefer the convenience field when OpenAI provides it because it already
  // represents the assembled text output for the response.
  if (typeof payload.output_text === "string" && payload.output_text !== "") {
    return payload.output_text;
  }

  // Fall back to walking the nested `output -> content -> text` structure so
  // the feature remains resilient if the convenience field is absent.
  const content = payload.output?.flatMap((item) => item.content ?? []) ?? [];
  const textBlock = content.find((item) => typeof item.text === "string");

  if (textBlock?.text) {
    return textBlock.text;
  }

  throw new Error("OpenAI no devolvio contenido de resumen.");
}
