"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AskMessage, DecisionStyle, Pacing } from "@/types";
import { Logo, Chip, Button } from "@/components/ui";
import { usePreferences, hasAnyPreferences } from "@/lib/preferences-store";
import { useTrip } from "@/lib/store";
import { inferPacingAndDecisionStyle } from "@/lib/infer-preferences";

type Screen =
  | "welcome"
  | "form1"
  | "form2"
  | "detailed"
  | "convo"
  | "building";

export default function PlanPage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const router = useRouter();
  const { setPacing, setDecisionStyle } = useTrip();

  // Pacing & decision style (POC_followup_prompt.md item 2) — lifted here so they survive
  // navigating between onboarding screens (e.g. Form2 -> "+ Add more detail" -> DetailedForm).
  const [pacing, setLocalPacing] = useState<Pacing>("balanced");
  const [decisionStyle, setLocalDecisionStyle] = useState<DecisionStyle>("show_options");

  function finish() {
    setPacing(pacing);
    setDecisionStyle(decisionStyle);
    setScreen("building");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {screen === "welcome" && <Welcome go={setScreen} />}
      {screen === "form1" && <Form1 go={setScreen} />}
      {screen === "form2" && (
        <Form2
          go={setScreen}
          pacing={pacing}
          setPacing={setLocalPacing}
          decisionStyle={decisionStyle}
          setDecisionStyle={setLocalDecisionStyle}
          onFinish={finish}
        />
      )}
      {screen === "detailed" && <DetailedForm go={setScreen} onFinish={finish} />}
      {screen === "convo" && (
        <Conversation
          go={setScreen}
          onFinish={(inferred) => {
            if (inferred.pacing) setLocalPacing(inferred.pacing);
            if (inferred.decisionStyle) setLocalDecisionStyle(inferred.decisionStyle);
            setPacing(inferred.pacing ?? pacing);
            setDecisionStyle(inferred.decisionStyle ?? decisionStyle);
            setScreen("building");
          }}
        />
      )}
      {screen === "building" && <Building onDone={() => router.push("/preview")} />}
    </div>
  );
}

function TopBar({
  title,
  onBack,
  step,
  total,
}: {
  title: string;
  onBack: () => void;
  step?: number;
  total?: number;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3">
      <button onClick={onBack} className="text-2xl leading-none text-text-mid">
        ‹
      </button>
      <div className="flex-1">
        <div className="text-[14px] font-bold text-text">{title}</div>
        {step && <div className="text-[10px] text-text-light">Step {step} of {total}</div>}
      </div>
      {step && total && (
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-[3px] w-5 rounded-full ${i < step ? "bg-accent" : "bg-border"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Welcome({ go }: { go: (s: Screen) => void }) {
  const paths: { icon: string; title: string; desc: string; screen: Screen; featured?: boolean }[] = [
    { icon: "💬", title: "Chat with Voyager", desc: "Describe your trip — we'll figure out the rest", screen: "convo", featured: true },
    { icon: "📋", title: "Quick form", desc: "Fill in your trip details — under 2 minutes", screen: "form1" },
    { icon: "🎯", title: "Detailed planner", desc: "Full control over every preference", screen: "detailed" },
  ];
  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <div className="mb-6">
        <Link href="/" className="mb-4 inline-block text-[13px] text-text-mid">
          ‹ Home
        </Link>
        <Logo />
        <h1 className="mt-1.5 font-heading text-[26px] font-bold leading-tight text-text">
          Plan your trip,
          <br />
          your way.
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-mid">
          Tell us about your trip and Voyager will build a complete, expert itinerary —
          ready to book.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {paths.map((p) => (
          <button
            key={p.title}
            onClick={() => go(p.screen)}
            className={`flex items-center gap-3 rounded-[20px] border-[1.5px] p-4 text-left transition-all hover:border-accent ${
              p.featured ? "border-accent bg-accent-light" : "border-border bg-surface"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-surface text-xl shadow-sm">
              {p.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 text-[14px] font-bold text-text">
                {p.title}
                {p.featured && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-[11px] text-text-mid">{p.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-auto pt-6 text-center text-[11px] text-text-light">
        A smart, slower way to plan than a dozen browser tabs.
      </p>
    </div>
  );
}

/* ---------- Standard form ---------- */
function Form1({ go }: { go: (s: Screen) => void }) {
  const [origin, setOrigin] = useState("Auckland");
  const [dest, setDest] = useState("Noosa, Queensland");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const ready = origin.trim() && dest.trim();

  return (
    <>
      <TopBar title="Your trip" onBack={() => go("welcome")} step={1} total={2} />
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-accent">✱ Required</span>
          <span className="text-[10px] text-text-light">— everything else is optional</span>
        </div>
        <LabeledInput label="Flying from ✱" value={origin} onChange={setOrigin} />
        <LabeledInput label="Destination ✱" value={dest} onChange={setDest} />
        <div className="mb-3.5 grid grid-cols-2 gap-2.5">
          <FakeField label="Depart" value="1 Nov 2026" />
          <FakeField label="Return" value="8 Nov 2026" />
        </div>
        <div className="mb-3.5">
          <FieldLabel>Travellers</FieldLabel>
          <div className="flex gap-2.5">
            <Stepper label="Adults" sub="18+" value={adults} set={setAdults} min={1} />
            <Stepper label="Children" sub="Under 12" value={children} set={setChildren} min={0} />
          </div>
        </div>
        <Button full disabled={!ready} onClick={() => go("form2")}>
          Continue →
        </Button>
      </div>
    </>
  );
}

const PACING_OPTIONS: { value: Pacing; label: string; hint: string }[] = [
  { value: "relaxed", label: "Relaxed", hint: "2-3 things a day" },
  { value: "balanced", label: "Balanced", hint: "4-5 things a day" },
  { value: "packed", label: "Packed", hint: "6+ things a day" },
];

const DECISION_OPTIONS: { value: DecisionStyle; label: string; hint: string }[] = [
  { value: "decide_for_me", label: "Decide for me", hint: "One confident pick each time" },
  { value: "show_options", label: "Show me a few options", hint: "2-3 to choose from" },
  { value: "know_what_i_want", label: "I know what I want", hint: "Ask me for specifics" },
];

function PacingDecisionPicker({
  pacing,
  setPacing,
  decisionStyle,
  setDecisionStyle,
}: {
  pacing: Pacing;
  setPacing: (p: Pacing) => void;
  decisionStyle: DecisionStyle;
  setDecisionStyle: (d: DecisionStyle) => void;
}) {
  return (
    <>
      <div className="mb-3.5">
        <FieldLabel>Pacing (optional)</FieldLabel>
        <div className="flex flex-col gap-1.5">
          {PACING_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setPacing(o.value)}
              className={`flex items-center justify-between rounded-[12px] border-[1.5px] px-3 py-2.5 text-left ${
                pacing === o.value ? "border-accent bg-accent-light" : "border-border bg-surface"
              }`}
            >
              <span className="text-[12px] font-semibold text-text">{o.label}</span>
              <span className="text-[10px] text-text-light">{o.hint}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3.5">
        <FieldLabel>How much should Voyager decide? (optional)</FieldLabel>
        <div className="flex flex-col gap-1.5">
          {DECISION_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setDecisionStyle(o.value)}
              className={`flex items-center justify-between rounded-[12px] border-[1.5px] px-3 py-2.5 text-left ${
                decisionStyle === o.value ? "border-accent bg-accent-light" : "border-border bg-surface"
              }`}
            >
              <span className="text-[12px] font-semibold text-text">{o.label}</span>
              <span className="text-[10px] text-text-light">{o.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function Form2({
  go,
  pacing,
  setPacing,
  decisionStyle,
  setDecisionStyle,
  onFinish,
}: {
  go: (s: Screen) => void;
  pacing: Pacing;
  setPacing: (p: Pacing) => void;
  decisionStyle: DecisionStyle;
  setDecisionStyle: (d: DecisionStyle) => void;
  onFinish: () => void;
}) {
  const [budget, setBudget] = useState("Mid-range");
  const [style, setStyle] = useState("Relaxed");
  const [accom, setAccom] = useState("Hotel");
  return (
    <>
      <TopBar title="Your style" onBack={() => go("form1")} step={2} total={2} />
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-3 rounded-[12px] border border-secondary-border bg-secondary-light px-3 py-2.5">
          <p className="text-[11px] leading-snug text-[#3a6b67]">
            💡 <strong>Not sure?</strong> Skip everything here — Voyager will build a great
            itinerary from the destination alone.
          </p>
        </div>
        <ChipGroup label="Budget (optional)" hint="Default: mid-range" options={["Budget", "Mid-range", "Premium"]} value={budget} set={setBudget} />
        <ChipGroup label="Travel style (optional)" hint="Default: mixed" options={["Relaxed", "Cultural", "Adventure", "Foodie", "Mixed"]} value={style} set={setStyle} />
        <ChipGroup label="Accommodation (optional)" hint="Default: hotel" options={["Hotel", "Apartment", "Either"]} value={accom} set={setAccom} />
        <PacingDecisionPicker
          pacing={pacing}
          setPacing={setPacing}
          decisionStyle={decisionStyle}
          setDecisionStyle={setDecisionStyle}
        />
        <div className="mb-3.5">
          <FieldLabel>Anything specific? (optional)</FieldLabel>
          <div className="rounded-[16px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[12px] text-text-light">
            e.g. celebrating our anniversary, love good food, want a bit of nature…
          </div>
        </div>
        <button
          onClick={() => go("detailed")}
          className="mb-2 w-full rounded-[12px] border border-dashed border-accent bg-accent-light px-3 py-2.5 text-[12px] font-semibold text-accent"
        >
          + Add more detail
        </button>
        <Button full onClick={onFinish}>
          Build my trip →
        </Button>
      </div>
    </>
  );
}

function DetailedForm({ go, onFinish }: { go: (s: Screen) => void; onFinish: () => void }) {
  return (
    <>
      <TopBar title="More detail" onBack={() => go("welcome")} step={1} total={1} />
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-3 rounded-[12px] border border-secondary-border bg-secondary-light px-3 py-2.5 text-[11px] text-[#3a6b67]">
          All fields optional — Voyager uses whatever you provide.
        </div>
        <LabeledInput label="Preferred airlines" placeholder="e.g. Air New Zealand, Jetstar" />
        <LabeledInput label="Areas or neighbourhoods" placeholder="e.g. stay near Hastings Street" />
        <LabeledInput label="Dietary requirements" placeholder="e.g. vegetarian, gluten free" />
        <LabeledInput label="Accessibility needs" placeholder="e.g. ground-floor room" />
        <ChipGroupStatic label="Occasion" options={["Anniversary", "Honeymoon", "Family holiday", "Solo", "Friends trip", "Birthday"]} />
        <LabeledInput label="Must-sees" placeholder="e.g. the Everglades, Eumundi Markets" />
        <LabeledInput label="Things to avoid" placeholder="e.g. crowds, long drives" />
        <Button full onClick={onFinish}>
          Build my trip →
        </Button>
      </div>
    </>
  );
}

/* ---------- Conversation mode (real Claude) ---------- */
function Conversation({
  go,
  onFinish,
}: {
  go: (s: Screen) => void;
  onFinish: (inferred: { pacing?: Pacing; decisionStyle?: DecisionStyle }) => void;
}) {
  const GREETING =
    "Hi! Tell me about the trip you're thinking of — just describe it like you'd tell a travel agent. Where, when, who's going, and it's fine if you don't have all the details yet.";
  const [messages, setMessages] = useState<AskMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { preferences } = usePreferences();

  const examples = [
    "We'd love a week somewhere warm and relaxed in early November — thinking Noosa, just the two of us.",
    "First time to the Sunshine Coast, love good food and a bit of nature. Where should we base ourselves?",
    "A relaxed beach week with one or two adventurous days. Flying from Auckland.",
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || streaming) return;
    setInput("");
    const next: AskMessage[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          preferences: hasAnyPreferences(preferences) ? preferences : undefined,
        }),
      });
      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const c = [...prev];
          c[c.length - 1] = { role: "assistant", content: acc };
          return c;
        });
      }
    } catch {
      setMessages((prev) => {
        const c = [...prev];
        c[c.length - 1] = {
          role: "assistant",
          content: "Sorry — I lost that for a second. Could you say it again?",
        };
        return c;
      });
    } finally {
      setStreaming(false);
    }
  }

  const exchanges = messages.filter((m) => m.role === "user").length;

  return (
    <>
      <TopBar title="Chat with Voyager" onBack={() => go("welcome")} />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => {
          const empty = m.role === "assistant" && m.content === "";
          return (
            <div
              key={i}
              className={`mb-2.5 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-line px-3.5 py-2.5 text-[12px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-[16px] rounded-br-[4px] bg-accent text-white"
                    : "rounded-[16px] rounded-bl-[4px] bg-tag text-text"
                }`}
              >
                {empty && streaming ? (
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

        {messages.length === 1 && (
          <div className="animate-fade-in-fast">
            <div className="mb-2 text-center text-[10px] text-text-light">
              Or tap an example to get started
            </div>
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => send(ex)}
                className="mb-1.5 w-full rounded-[12px] border border-border bg-surface px-3 py-2.5 text-left text-[11px] text-text-mid transition-colors hover:border-accent"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>
        )}

        {exchanges >= 2 && !streaming && (
          <div className="mt-2 text-center animate-fade-in">
            <button
              onClick={() => {
                const said = messages
                  .filter((m) => m.role === "user")
                  .map((m) => m.content)
                  .join(" ");
                onFinish(inferPacingAndDecisionStyle(said));
              }}
              className="rounded-full bg-accent px-5 py-2.5 text-[12px] font-bold text-white"
            >
              Looks good — build my trip →
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 border-t border-border px-4 pb-4 pt-2.5">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Describe your trip…"
            className="flex-1 rounded-full border-[1.5px] border-border bg-surface px-3.5 py-2.5 text-[12px] outline-none focus:border-accent"
          />
          <button
            onClick={() => send(input)}
            disabled={streaming}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-base text-white disabled:opacity-50"
          >
            →
          </button>
        </div>
        <div className="mt-1.5 text-center text-[10px] text-text-light">
          Speak naturally — like calling a travel agent
        </div>
      </div>
    </>
  );
}

/* ---------- Building animation ---------- */
function Building({ onDone }: { onDone: () => void }) {
  const steps = [
    { icon: "✈️", text: "Finding the best flights from Auckland", detail: "Direct to Sunshine Coast" },
    { icon: "🏘️", text: "Getting to know Noosa Heads", detail: "Local knowledge layer" },
    { icon: "🏨", text: "Choosing your base", detail: "Beachfront, Hastings Street" },
    { icon: "🗓️", text: "Building your day-by-day itinerary", detail: "7 nights, hand-crafted" },
    { icon: "🍽️", text: "Adding dining and local experiences", detail: "The good, non-touristy spots" },
    { icon: "💰", text: "Calculating your trip value", detail: "NZD $6,800 estimated" },
  ];
  const [active, setActive] = useState(0);
  const done = active >= steps.length;

  useEffect(() => {
    if (active < steps.length) {
      const t = setTimeout(() => setActive((a) => a + 1), 650);
      return () => clearTimeout(t);
    }
  }, [active, steps.length]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative overflow-hidden bg-gradient-to-br from-hero to-hero-alt px-6 pb-5 pt-8">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#caa68f33]" />
        <div className="absolute -right-2 -top-2 h-20 w-20 rounded-full border border-[#caa68f22]" />
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#caa68f]">
          Building your trip to
        </div>
        <div className="font-heading text-[30px] font-bold text-white">Noosa</div>
        <div className="mb-4 text-[12px] text-white/50">1–8 Nov · 2 adults · 7 nights</div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-white/40">AKL</span>
          <div className="relative h-px flex-1 bg-gradient-to-r from-[#caa68f99] to-[#caa68f33]">
            <div
              className="absolute -top-2 text-xs transition-all duration-700"
              style={{ left: `${Math.min(100, (active / steps.length) * 100)}%`, transform: "translateX(-50%)" }}
            >
              ✈
            </div>
          </div>
          <span className="text-[11px] font-semibold text-white/40">MCY</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-3.5 text-[12px] font-medium text-text-mid">
          {done ? "Your itinerary is ready ✓" : "This takes about 20–30 seconds…"}
        </div>
        <div className="flex flex-col gap-2.5">
          {steps.map((s, i) => {
            const isActive = i === active;
            const isDone = i < active;
            return (
              <div
                key={i}
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{ opacity: i > active ? 0.3 : 1 }}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border-[1.5px] text-base transition-all ${
                    isDone ? "border-accent bg-accent-light" : "border-border bg-tag"
                  }`}
                >
                  {isDone ? <span className="text-sm text-accent">✓</span> : s.icon}
                </div>
                <div className="flex-1">
                  <div className={`text-[12px] ${isDone ? "font-semibold text-text" : "text-text-mid"}`}>
                    {s.text}
                  </div>
                  {isDone && <div className="mt-0.5 text-[10px] text-accent">{s.detail}</div>}
                </div>
                {isActive && (
                  <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent border-t-transparent animate-spin-slow" />
                )}
              </div>
            );
          })}
        </div>

        {done && (
          <div className="mt-5 animate-fade-in">
            <div className="mb-3 rounded-[16px] border border-accent bg-accent-light px-4 py-3 text-center">
              <div className="font-heading text-[14px] font-bold text-text">Your trip is ready</div>
              <div className="mt-0.5 text-[11px] text-text-mid">
                Estimated trip value: <strong className="text-text">NZD $6,800</strong>
              </div>
            </div>
            <Button full onClick={onDone}>
              See my itinerary preview →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- small form helpers ---------- */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-text-mid">
      {children}
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-3.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={!onChange}
        className={`w-full rounded-[16px] border-[1.5px] bg-surface px-3.5 py-3 text-[13px] outline-none focus:border-accent ${
          value ? "border-accent text-text" : "border-border text-text-light"
        }`}
      />
    </div>
  );
}

function FakeField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="rounded-[16px] border-[1.5px] border-accent bg-surface px-3.5 py-3 text-[13px] text-text">
        {value}
      </div>
    </div>
  );
}

function Stepper({
  label,
  sub,
  value,
  set,
  min,
}: {
  label: string;
  sub: string;
  value: number;
  set: (n: number) => void;
  min: number;
}) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-[16px] border-[1.5px] border-border px-3 py-2.5">
      <div>
        <div className="text-[11px] font-bold text-text">{label}</div>
        <div className="text-[10px] text-text-light">{sub}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => set(Math.max(min, value - 1))}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-sm"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-bold">{value}</span>
        <button
          onClick={() => set(value + 1)}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  hint,
  options,
  value,
  set,
}: {
  label: string;
  hint?: string;
  options: string[];
  value: string;
  set: (v: string) => void;
}) {
  return (
    <div className="mb-3.5">
      <FieldLabel>{label}</FieldLabel>
      {hint && <div className="-mt-1 mb-1.5 text-[10px] text-text-light">{hint}</div>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => set(o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function ChipGroupStatic({ label, options }: { label: string; options: string[] }) {
  const [v, setV] = useState("");
  return <ChipGroup label={label} options={options} value={v} set={setV} />;
}
