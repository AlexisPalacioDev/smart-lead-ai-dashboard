/**
 * openai-client.ts
 * Encapsulates the low-level HTTP request sent to the OpenAI Responses API for
 * the AI Summary feature.
 *
 * This module is intentionally transport-focused:
 * - it reads the browser-side Vite environment variables
 * - it sends the request to `/v1/responses`
 * - it asks OpenAI for strict JSON-schema output
 * - it converts transport failures into stable UI-safe errors
 *
 * Prompt composition does not live here. The application layer builds the
 * prompt before calling this client, and the summary service parses the JSON
 * payload after this client returns it. Keeping this file narrow prevents the
 * route and use case layers from depending on fetch details, auth headers, or
 * raw OpenAI response shapes.
 */

type OpenAIResponsesPayload = {
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
  output_text?: string;
};

const DEFAULT_OPENAI_MODEL = "gpt-5.4";
const SUMMARY_SCHEMA = {
  type: "object",
  properties: {
    analysis: {
      type: "string",
      minLength: 1,
    },
    mainSource: {
      type: "string",
      minLength: 1,
    },
    recommendations: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
      minItems: 2,
      maxItems: 2,
    },
  },
  required: ["analysis", "mainSource", "recommendations"],
  additionalProperties: false,
} as const;

export async function requestOpenAISummary(
  prompt: string,
): Promise<OpenAIResponsesPayload> {
  /**
   * Uses a configurable model from Vite env when present and otherwise falls
   * back to a stable default. This keeps local setup lightweight while still
   * allowing the feature to switch models without code changes.
   */
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_OPENAI_MODEL || DEFAULT_OPENAI_MODEL;

  if (!apiKey) {
    throw new Error("Configura VITE_OPENAI_API_KEY para generar resumenes.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "lead_summary",
          strict: true,
          schema: SUMMARY_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json() as Promise<OpenAIResponsesPayload>;
}

async function readErrorMessage(response: Response) {
  /**
   * OpenAI error bodies may include a structured `error.message`. When that is
   * unavailable or malformed, the feature falls back to one stable Spanish
   * message so the UI does not leak transport-specific details or crash on
   * unexpected payloads.
   */
  try {
    const payload = (await response.json()) as {
      error?: { message?: string };
    };

    if (payload.error?.message) {
      return payload.error.message;
    }
  } catch {
    // Ignore malformed error bodies and fall back to a stable message.
  }

  return "No fue posible generar el resumen con OpenAI.";
}
