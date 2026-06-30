import { NextRequest } from "next/server";
import { streamAI, type ChatTurn } from "@/lib/ai-service";
import {
  ASK_SYSTEM_POSTUNLOCK,
  ASK_SYSTEM_PREUNLOCK,
  NOOSA_ASK_CONTEXT,
} from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

interface AskBody {
  messages: ChatTurn[];
  mode?: "preunlock" | "postunlock";
  // Optional: context passed when opened from a "Tell me more" itinerary element.
  elementContext?: string;
}

export async function POST(req: NextRequest) {
  let body: AskBody;
  try {
    body = (await req.json()) as AskBody;
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  if (messages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  const base =
    body.mode === "preunlock" ? ASK_SYSTEM_PREUNLOCK : ASK_SYSTEM_POSTUNLOCK;

  let system = base + NOOSA_ASK_CONTEXT;
  if (body.elementContext) {
    system += `\n\nThe traveller opened this conversation from a specific item in their itinerary: ${body.elementContext}. Tailor your first answer to that item.`;
  }

  const task = body.mode === "preunlock" ? "ask" : "ask";
  const stream = streamAI(task, system, messages);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
