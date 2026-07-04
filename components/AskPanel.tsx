"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePreferences, hasAnyPreferences } from "@/lib/preferences-store";
import type { AskMessage } from "@/types";

interface Prompt {
  icon: string;
  category: string;
  text: string;
}

export const PROMPTS_BEFORE: Prompt[] = [
  {
    icon: "🥾",
    category: "Day 2 · National Park",
    text: "Walk the Coastal Track early — it's best before 9am, before the heat and the day-trippers.",
  },
  {
    icon: "🌤️",
    category: "Weather · early November",
    text: "Late spring: warm high-20s°C days with the odd afternoon storm. Pack reef-safe sunscreen and a light layer for evenings.",
  },
  {
    icon: "🍽️",
    category: "Dining · book ahead",
    text: "Sum Yung Guys and Locale book out weeks ahead — lock those two in as early as you can.",
  },
  {
    icon: "🚗",
    category: "Getting around",
    text: "You only really need the hire car for the Everglades and hinterland days — Hastings Street is all walkable.",
  },
];

export const PROMPTS_DURING: Prompt[] = [
  {
    icon: "📍",
    category: "You're in Noosa Heads",
    text: "The national park gate is a 5-minute walk from Hastings Street — skip the car, the car park fills by 8am.",
  },
  {
    icon: "🐬",
    category: "Tea Tree Bay",
    text: "Slow down on the rocks past Tea Tree — it's one of the best places in the country to see wild dolphins surfing the break.",
  },
  {
    icon: "☕",
    category: "Coffee",
    text: "The Sunshine Coast takes coffee seriously — Café Le Monde on Hastings Street is the easy local pick.",
  },
  {
    icon: "💳",
    category: "Paying & tipping",
    text: "Tipping isn't expected in Australia. Tap-to-pay works everywhere — even small market stalls.",
  },
];

const PREUNLOCK_SUGGESTIONS = [
  "Should we fly into Brisbane or Sunshine Coast Airport?",
  "Is Hastings Street the right base for us?",
  "Is the water warm enough to swim in early November?",
];

const POSTUNLOCK_SUGGESTIONS = [
  "Any tips for the Everglades kayak day?",
  "What should I know about driving in the hinterland?",
  "Where's the best coffee near our hotel?",
];

function VoyagerAvatar() {
  return (
    <div className="mr-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] border border-[#7F543D33] bg-accent-light text-[12px] font-bold text-accent font-heading">
      V
    </div>
  );
}

function MicButton() {
  return (
    <button
      type="button"
      title="Voice input"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent bg-accent-light"
    >
      <svg width="13" height="17" viewBox="0 0 14 18" fill="none">
        <rect x="4" y="0" width="6" height="11" rx="3" fill="#7F543D" />
        <path
          d="M1 8C1 11.3137 3.68629 14 7 14C10.3137 14 13 11.3137 13 8"
          stroke="#7F543D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line x1="7" y1="14" x2="7" y2="17" stroke="#7F543D" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4.5" y1="17" x2="9.5" y2="17" stroke="#7F543D" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default function AskPanel({
  mode,
  seed,
  elementContext,
  initialAssistant,
  contextLabel,
}: {
  mode: "preunlock" | "postunlock";
  seed?: string;
  elementContext?: string;
  initialAssistant?: string;
  /** One-line label above the chat (e.g. "Day 8 · The Cotswolds") — a label, never a chat message. */
  contextLabel?: string;
}) {
  const { preferences } = usePreferences();
  const [messages, setMessages] = useState<AskMessage[]>(
    initialAssistant ? [{ role: "assistant", content: initialAssistant }] : [],
  );
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [promptSet, setPromptSet] = useState<"before" | "during">("before");
  const endRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  const LIMIT = 3;
  const remaining = Math.max(0, LIMIT - questionsUsed);
  const limitReached = mode === "preunlock" && questionsUsed >= LIMIT;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || streaming || limitReached) return;
    setInput("");

    const nextMessages: AskMessage[] = [...messages, { role: "user", content: q }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setStreaming(true);
    if (mode === "preunlock") setQuestionsUsed((n) => n + 1);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          mode,
          elementContext,
          preferences: hasAnyPreferences(preferences) ? preferences : undefined,
        }),
      });
      if (!res.body) throw new Error("No response");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Voyager couldn't reach the knowledge layer just now — please try again in a moment.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  // Auto-send a seeded question (e.g. from "Tell me more").
  useEffect(() => {
    if (seed && !seededRef.current) {
      seededRef.current = true;
      send(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  const showFeed = messages.length === (initialAssistant ? 1 : 0) && !streaming;
  const prompts = promptSet === "before" ? PROMPTS_BEFORE : PROMPTS_DURING;
  const suggestions = mode === "preunlock" ? PREUNLOCK_SUGGESTIONS : POSTUNLOCK_SUGGESTIONS;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 pb-2.5 pt-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-heading text-[15px] font-bold text-text">Voyager Ask</div>
            <div className="text-[10px] text-text-mid">
              Noosa Days ·{" "}
              {mode === "preunlock" ? "Planning" : (contextLabel ?? "Your Noosa trip")}
            </div>
          </div>
          {mode === "preunlock" ? (
            <div
              className={`rounded-[10px] border px-2.5 py-1 text-center ${
                limitReached
                  ? "border-danger-border bg-danger-light"
                  : "border-amber-border bg-amber-light"
              }`}
            >
              <div
                className={`text-[13px] font-extrabold ${
                  limitReached ? "text-danger" : "text-amber"
                }`}
              >
                {remaining}
              </div>
              <div
                className={`text-[8px] font-semibold ${
                  limitReached ? "text-danger" : "text-amber"
                }`}
              >
                left
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] border border-green-border bg-green-light px-2.5 py-1 text-center">
              <div className="text-[9px] font-bold text-secondary">✓ Unlocked</div>
              <div className="text-[8px] text-secondary">Unlimited</div>
            </div>
          )}
        </div>

        {mode === "preunlock" && (
          <div className="mt-2">
            <div className="h-[3px] rounded-full bg-tag">
              <div
                className={`h-full rounded-full transition-all ${
                  limitReached ? "bg-danger" : "bg-accent"
                }`}
                style={{ width: `${(questionsUsed / LIMIT) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-[9px] text-text-light">
              {questionsUsed} of {LIMIT} free questions used · Unlock your trip for unlimited Ask
            </div>
          </div>
        )}

        {mode === "postunlock" && (
          <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto">
            {(["before", "during"] as const).map((id) => (
              <button
                key={id}
                onClick={() => setPromptSet(id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  promptSet === id ? "bg-accent text-white" : "bg-tag text-text-mid"
                }`}
              >
                {id === "before" ? "Before travel" : "On the trip"}
              </button>
            ))}
            <div className="whitespace-nowrap px-1.5 py-1 text-[9px] text-text-light">
              Prompts update with your trip stage
            </div>
          </div>
        )}
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3">
        {showFeed && (
          <div className="animate-fade-in-fast">
            {elementContext ? null : (
              <>
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
                  {mode === "preunlock"
                    ? "Try asking"
                    : promptSet === "during"
                      ? "Right now · Day 2 · Noosa Heads"
                      : "Before you go · Coming up"}
                </div>
                {prompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => send(p.text)}
                    className="mb-1.5 flex w-full items-start gap-2.5 rounded-[14px] border border-border bg-surface px-3 py-2.5 text-left transition-colors hover:border-accent"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-accent-light text-base">
                      {p.icon}
                    </div>
                    <div>
                      <div className="mb-0.5 text-[9px] font-bold text-accent">{p.category}</div>
                      <div className="text-[11px] leading-snug text-text">{p.text}</div>
                    </div>
                  </button>
                ))}

                <div className="mt-3 border-t border-border pt-3">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
                    Or ask anything
                  </div>
                  {suggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => send(q)}
                      className="mb-1.5 w-full rounded-[12px] border border-border bg-tag px-3 py-2 text-left text-[11px] text-text transition-colors hover:border-accent"
                    >
                      &ldquo;{q}&rdquo;
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          const empty = m.role === "assistant" && m.content === "";
          return (
            <div
              key={i}
              className={`mb-2.5 flex items-start ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && <VoyagerAvatar />}
              <div
                className={`max-w-[82%] whitespace-pre-line px-3 py-2.5 text-[12px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-[16px] rounded-br-[4px] bg-accent text-white"
                    : "rounded-[16px] rounded-bl-[4px] bg-tag text-text"
                }`}
              >
                {empty && isLast && streaming ? (
                  <span className="flex gap-1 py-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                ) : (
                  m.content
                )}
              </div>
            </div>
          );
        })}

        {messages.length > (initialAssistant ? 1 : 0) && !showFeed && (
          <div className="mt-2">
            <button
              onClick={() => {
                setMessages(initialAssistant ? [{ role: "assistant", content: initialAssistant }] : []);
              }}
              className="rounded-lg border border-border px-2.5 py-1 text-[10px] text-text-light hover:bg-surface-alt"
            >
              ← Back to prompts
            </button>
          </div>
        )}

        {limitReached && (
          <div className="mt-2 rounded-[16px] border border-[#7F543D33] bg-accent-light p-3.5 text-center animate-fade-in">
            <div className="mb-1 font-heading text-[14px] font-bold text-text">
              Unlock unlimited Ask
            </div>
            <p className="mb-2.5 text-[11px] leading-snug text-text-mid">
              You&rsquo;ve used your 3 free questions. Unlock your itinerary for unlimited Voyager Ask
              throughout your whole trip.
            </p>
            <Link
              href="/preview?tab=unlock"
              className="inline-flex w-full items-center justify-center rounded-[12px] bg-accent px-4 py-2.5 text-[12px] font-bold text-white"
            >
              Unlock my itinerary →
            </Link>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      {!limitReached && (
        <div className="shrink-0 border-t border-border px-3.5 pb-3.5 pt-2.5">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask anything about your trip…"
              className="flex-1 rounded-full border-[1.5px] border-border bg-surface px-3.5 py-2.5 text-[12px] outline-none focus:border-accent"
            />
            <MicButton />
            <button
              onClick={() => send(input)}
              disabled={streaming}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-base text-white disabled:opacity-50"
            >
              →
            </button>
          </div>
          {mode === "postunlock" && (
            <div className="mt-1.5 text-center text-[9px] text-text-light">
              Trip-aware · Knows your itinerary, dates and destinations
            </div>
          )}
        </div>
      )}
    </div>
  );
}
