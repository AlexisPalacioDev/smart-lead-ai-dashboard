import type {
  SummaryResult,
  SummaryServicePort,
} from "../application/summary-ports";
import { requestOpenAISummary } from "./openai-client";

/**
 * summary-service.ts
 * Parses OpenAI Responses API payloads into the stable summary contract used by
 * the UI. Assumes the request asked for strict JSON-schema output.
 */

export const summaryService: SummaryServicePort = {
  async createSummary(prompt: string) {
    const payload = await requestOpenAISummary(prompt);
    const text = readOutputText(payload);
    const parsed = JSON.parse(text) as Partial<SummaryResult>;

    if (
      typeof parsed.analysis !== "string" ||
      typeof parsed.mainSource !== "string" ||
      !Array.isArray(parsed.recommendations) ||
      parsed.recommendations.some((item) => typeof item !== "string")
    ) {
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
  if (typeof payload.output_text === "string" && payload.output_text !== "") {
    return payload.output_text;
  }

  const content = payload.output?.flatMap((item) => item.content ?? []) ?? [];
  const textBlock = content.find((item) => typeof item.text === "string");

  if (textBlock?.text) {
    return textBlock.text;
  }

  throw new Error("OpenAI no devolvio contenido de resumen.");
}
