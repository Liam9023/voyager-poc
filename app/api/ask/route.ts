import { NextRequest } from "next/server";
import { streamAI, type ChatTurn } from "@/lib/ai-service";
import {
  ASK_SYSTEM_POSTUNLOCK,
  ASK_SYSTEM_PREUNLOCK,
  NOOSA_ASK_CONTEXT,
  buildPreferencesContext,
} from "@/lib/prompts";
import { formatPlacesForPrompt, looksLikePlaceQuery, searchPlaces } from "@/lib/places-service";
import type { Preferences } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 30;

interface AskBody {
  messages: ChatTurn[];
  mode?: "preunlock" | "postunlock";
  // Optional: context passed when opened from a "Tell me more" itinerary element.
  elementContext?: string;
  // Optional: the traveller's saved Settings > Preferences (localStorage, sent by the client).
  preferences?: Preferences;
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
  if (body.preferences) {
    system += buildPreferencesContext(body.preferences);
  }
  if (body.elementContext) {
    system += `\n\nThe traveller opened this conversation from a specific item in their itinerary: ${body.elementContext}. Tailor your first answer to that item.`;
  }

  // Real venue grounding (item 5) — only for questions that actually call for one.
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  if (looksLikePlaceQuery(lastUserMessage)) {
    const places = await searchPlaces(`${lastUserMessage} in Noosa Heads, Queensland, Australia`, 5);
    const grounding = formatPlacesForPrompt(places);
    if (grounding) {
      system += `\n\nReal, current venue data for this question (Google Places) — when recommending somewhere NEW (not already in the itinerary above), only name venues from this list, and use the rating/review count/price to back up why. Add your own local colour on top, but don't invent venues or details not shown here:\n${grounding}`;
    }
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
