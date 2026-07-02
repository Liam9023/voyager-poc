import { NextRequest } from "next/server";
import { streamAI, type ChatTurn } from "@/lib/ai-service";
import { CONVERSATION_SYSTEM, buildPreferencesContext } from "@/lib/prompts";
import type { Preferences } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ConversationBody {
  messages: ChatTurn[];
  // Optional: the traveller's saved Settings > Preferences (localStorage, sent by the client).
  preferences?: Preferences;
}

export async function POST(req: NextRequest) {
  let body: ConversationBody;
  try {
    body = (await req.json()) as ConversationBody;
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  if (messages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  const system = body.preferences
    ? CONVERSATION_SYSTEM + buildPreferencesContext(body.preferences)
    : CONVERSATION_SYSTEM;
  const stream = streamAI("conversation", system, messages);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
