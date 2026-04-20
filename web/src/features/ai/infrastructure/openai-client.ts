/**
 * openai-client.ts
 * Encapsulates the browser request to the local serverless `/api/summary`
 * endpoint. The OpenAI API key remains server-side in Vercel environment
 * variables, so no secret is exposed to client bundles.
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

export async function requestOpenAISummary(
  prompt: string,
): Promise<OpenAIResponsesPayload> {
  const response = await fetch("/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
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
