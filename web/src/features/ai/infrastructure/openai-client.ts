/**
 * openai-client.ts
 * Wraps the frontend-only OpenAI Responses API request used by the AI Summary
 * route. Assumes credentials are provided through Vite environment variables.
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
