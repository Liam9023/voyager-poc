import Anthropic from "@anthropic-ai/sdk";

/**
 * AI abstraction layer (Tech Spec 1.3 / 5.2). All Claude calls route through here
 * so the model can be swapped or tiered without touching product code.
 */

const AI_CONFIG = {
  ask: { model: "claude-sonnet-4-6", max_tokens: 1024 },
  conversation: { model: "claude-sonnet-4-6", max_tokens: 512 },
} as const;

export type AiTask = keyof typeof AI_CONFIG;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Streams a Voyager response as plain text chunks via a ReadableStream,
 * suitable for returning directly from a Next.js route handler.
 */
export function streamAI(
  task: AiTask,
  system: string,
  messages: ChatTurn[],
): ReadableStream<Uint8Array> {
  const config = AI_CONFIG[task];
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = getClient().messages.stream({
          model: config.model,
          max_tokens: config.max_tokens,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        stream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await stream.finalMessage();
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Voyager is busy — please try again in a moment.";
        // Surface a graceful, on-brand fallback into the stream.
        controller.enqueue(
          encoder.encode(
            `\n\n(Voyager couldn't reach the knowledge layer just now — ${message}. Please try again in a moment.)`,
          ),
        );
        controller.close();
      }
    },
  });
}
