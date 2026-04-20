type RequestBody = {
  prompt?: unknown;
};

type OpenAIResponsesPayload = {
  error?: { message?: string };
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

/**
 * Proxies AI summary generation to OpenAI using server-side environment
 * variables so API keys never reach the browser.
 */
export default async function handler(
  request: {
    method?: string;
    body?: RequestBody;
  },
  response: {
    status: (code: number) => {
      json: (payload: unknown) => void;
    };
  },
) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const prompt = request.body?.prompt;
  if (typeof prompt !== "string" || prompt.trim() === "") {
    response.status(400).json({ error: "Prompt is required." });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
  if (!apiKey) {
    response.status(500).json({
      error: "OPENAI_API_KEY is not configured in the server environment.",
    });
    return;
  }

  try {
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
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

    const payload = (await openAIResponse.json()) as OpenAIResponsesPayload;
    if (!openAIResponse.ok) {
      response.status(openAIResponse.status).json({
        error: payload.error?.message || "OpenAI request failed.",
      });
      return;
    }

    response.status(200).json(payload);
  } catch {
    response.status(500).json({
      error: "Unexpected error while generating the AI summary.",
    });
  }
}
