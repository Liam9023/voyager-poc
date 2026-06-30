"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NOOSA_ITINERARY as IT } from "@/lib/itinerary";
import { useTrip } from "@/lib/store";
import { NoHiddenFees, SectionLabel } from "@/components/ui";
import ActivityRow from "@/components/ActivityRow";
import AskPanel from "@/components/AskPanel";

type Tab = "overview" | "sample" | "unlock";

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-text-mid">Loading your preview…</div>}>
      <PreviewInner />
    </Suspense>
  );
}

function PreviewInner() {
  const params = useSearchParams();
  const initial = (params.get("tab") as Tab) || "overview";
  const [tab, setTab] = useState<Tab>(["overview", "sample", "unlock"].includes(initial) ? initial : "overview");
  const [showAsk, setShowAsk] = useState(false);

  const sampleDay = IT.days.find((d) => d.day_number === IT.sample_day_number)!;

  if (showAsk) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3">
          <button onClick={() => setShowAsk(false)} className="text-2xl leading-none text-text-mid">
            ‹
          </button>
          <div className="text-[14px] font-bold text-text">Ask before you pay</div>
        </div>
        <div className="flex-1 overflow-hidden">
          <AskPanel mode="preunlock" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Dark header */}
      <div className="shrink-0 bg-gradient-to-br from-hero to-hero-alt px-5 pb-3 pt-4">
        <Link href="/" className="mb-1 inline-block text-[11px] text-white/50">
          ‹ Home
        </Link>
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#caa68f]">
          Your trip preview
        </div>
        <div className="font-heading text-[22px] font-bold text-white">{IT.title}</div>
        <div className="mt-0.5 text-[11px] text-white/50">
          1–8 Nov 2026 · 2 adults · {IT.nights} nights
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#caa68f55] bg-[#caa68f1f] px-2.5 py-1">
          <span className="text-[10px] font-bold text-[#caa68f]">
            {IT.complexity_tier} · {IT.complexity_multiplier.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b border-border bg-surface">
        {([
          ["overview", "Overview"],
          ["sample", `Day ${IT.sample_day_number} ✦`],
          ["unlock", "Unlock"],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 border-b-2 py-3 text-[11px] font-semibold transition-colors ${
              tab === id ? "border-accent text-accent" : "border-transparent text-text-light"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "overview" && <Overview setTab={setTab} onAsk={() => setShowAsk(true)} />}
        {tab === "sample" && (
          <SampleDay day={sampleDay} setTab={setTab} />
        )}
        {tab === "unlock" && <UnlockTab onAsk={() => setShowAsk(true)} />}
      </div>
    </div>
  );
}

function FeeCta({ setTab }: { setTab: (t: Tab) => void }) {
  return (
    <div className="rounded-[20px] border border-[#7F543D33] bg-accent-light p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-text-mid">Estimated trip value</div>
          <div className="font-heading text-[17px] font-bold text-text">
            NZD ${IT.estimated_value_nzd.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-text-mid">Voyager fee</div>
          <div className="font-heading text-[17px] font-bold text-accent">
            NZD ${IT.voyager_fee_nzd}
          </div>
        </div>
      </div>
      <button
        onClick={() => setTab("unlock")}
        className="w-full rounded-[12px] bg-accent py-3 text-[13px] font-bold text-white"
      >
        Unlock full itinerary →
      </button>
    </div>
  );
}

function Overview({ setTab, onAsk }: { setTab: (t: Tab) => void; onAsk: () => void }) {
  return (
    <div className="px-5 py-4">
      <div className="mb-3">
        <SectionLabel>About your trip</SectionLabel>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-text">{IT.summary}</p>
      </div>

      <NoHiddenFees className="mb-3" />

      <div className="mb-4">
        <SectionLabel>What&rsquo;s included</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {IT.highlights.map((h) => (
            <span key={h} className="rounded-full bg-tag px-2.5 py-1 text-[11px] font-medium text-text-mid">
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Your 7-night itinerary</SectionLabel>
          <span className="text-[10px] text-text-light">Edit after unlock</span>
        </div>

        {IT.days.map((d) =>
          d.day_number === IT.sample_day_number ? (
            <div
              key={d.day_number}
              className="mb-2 overflow-hidden rounded-[16px] border-[1.5px] border-accent"
            >
              <div className="flex items-center justify-between bg-accent-light px-3 py-2.5">
                <div>
                  <div className="text-[10px] font-bold text-accent">
                    Day {d.day_number} · Preview ✦ — try editing it
                  </div>
                  <div className="text-[12.5px] font-bold text-text">{d.title}</div>
                </div>
                <button
                  onClick={() => setTab("sample")}
                  className="shrink-0 rounded-[10px] border border-accent px-2.5 py-1.5 text-[10px] font-bold text-accent"
                >
                  View &amp; Edit →
                </button>
              </div>
            </div>
          ) : (
            <LockedDay key={d.day_number} num={d.day_number} title={d.title} teaser={d.summary} />
          ),
        )}
      </div>

      <FeeCta setTab={setTab} />

      <button
        onClick={onAsk}
        className="mt-3 w-full rounded-[16px] border border-border bg-surface py-3 text-[12px] font-semibold text-text-mid"
      >
        Questions? Chat with Voyager before you pay →
      </button>
    </div>
  );
}

function LockedDay({ num, title, teaser }: { num: number; title: string; teaser: string }) {
  const words = teaser.split(" ").slice(0, 9).join(" ");
  return (
    <div className="mb-2 overflow-hidden rounded-[16px] border border-border">
      <div className="flex items-center justify-between bg-surface-alt px-3 py-2.5">
        <div>
          <div className="text-[10px] font-bold text-text-light">Day {num}</div>
          <div className="text-[12px] font-semibold text-text-light">{title}</div>
        </div>
        <div className="flex items-center gap-1 text-text-light">
          <svg width="11" height="13" viewBox="0 0 12 14" fill="none">
            <rect x="1" y="5" width="10" height="8" rx="2" stroke="#948A80" strokeWidth="1.2" />
            <path d="M4 5V3.5C4 2.12 4.9 1 6 1C7.1 1 8 2.12 8 3.5V5" stroke="#948A80" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] font-semibold">Locked</span>
        </div>
      </div>
      <div className="bg-surface px-3 py-2">
        <div className="text-[11px] text-text-light">{words}…</div>
      </div>
    </div>
  );
}

function SampleDay({
  day,
  setTab,
}: {
  day: (typeof IT.days)[number];
  setTab: (t: Tab) => void;
}) {
  return (
    <div className="px-5 py-4">
      <div className="mb-2.5">
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
          Day {day.day_number} of {IT.nights + 1} · Preview day
        </div>
        <div className="font-heading text-[18px] font-bold text-text">{day.title}</div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-text-mid">{day.summary}</p>
      </div>

      <div className="mb-3 flex items-center justify-between rounded-[12px] border border-secondary-border bg-secondary-light px-3 py-2.5">
        <div className="text-[10.5px] text-[#3a6b67]">
          ✏️ <strong>Try it:</strong> remove or swap any activity below
        </div>
      </div>

      <SectionLabel>Your day</SectionLabel>
      <div className="mt-2.5">
        {day.activities.map((a) => (
          <ActivityRow key={a.id} activity={a} editable />
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-[16px] bg-surface-alt px-3 py-3">
        <svg width="11" height="13" viewBox="0 0 12 14" fill="none">
          <rect x="1" y="5" width="10" height="8" rx="2" stroke="#948A80" strokeWidth="1.2" />
          <path d="M4 5V3.5C4 2.12 4.9 1 6 1C7.1 1 8 2.12 8 3.5V5" stroke="#948A80" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <div className="text-[11px] text-text-light">
          Six more days like this — unlock to see everything
        </div>
      </div>

      <div className="mt-3.5">
        <FeeCta setTab={setTab} />
      </div>
    </div>
  );
}

function UnlockTab({ onAsk }: { onAsk: () => void }) {
  const router = useRouter();
  const { unlock } = useTrip();

  const unlocked = [
    ["📅", "Full 7-night day-by-day itinerary"],
    ["✈️", "Flights — all passengers and dates set"],
    ["🏨", "Beachfront stay on Hastings Street"],
    ["🚗", "Car hire for the Everglades & hinterland days"],
    ["🥾", "Activities, dining and local recommendations"],
    ["💬", "Voyager — your companion throughout the trip"],
    ["📍", "Live trip tracker and booking manager"],
  ];

  const breakdown: [string, string, boolean][] = [
    ["Estimated trip value", `NZD $${IT.estimated_value_nzd.toLocaleString()}`, false],
    ["Base rate", "0.75%", false],
    ["Complexity tier", `${IT.complexity_tier} · ${IT.complexity_multiplier.toFixed(2)}x`, false],
    ["Voyager fee", `NZD $${IT.voyager_fee_nzd}`, true],
  ];

  function pay() {
    unlock();
    router.push("/addons");
  }

  return (
    <div className="px-5 py-4">
      <div className="mb-3">
        <div className="font-heading text-[18px] font-bold text-text">Unlock your trip</div>
        <p className="mt-1 text-[12px] leading-relaxed text-text-mid">
          One payment unlocks everything — your full 7-night plan, all booking access, and
          Voyager as your companion for the whole journey.
        </p>
      </div>

      <NoHiddenFees className="mb-3.5" />

      <div className="mb-4">
        <SectionLabel>What&rsquo;s unlocked</SectionLabel>
        <div className="mt-2 space-y-2">
          {unlocked.map(([icon, text]) => (
            <div key={text} className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-accent-light text-[13px]">
                {icon}
              </div>
              <div className="text-[12px] text-text">{text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3.5 rounded-[16px] bg-tag p-3.5">
        <SectionLabel>Fee calculation</SectionLabel>
        <div className="mt-2">
          {breakdown.map(([k, v, total], i) => (
            <div
              key={k}
              className={`flex justify-between py-1.5 ${i < 3 ? "border-b border-border" : ""}`}
            >
              <span className={`text-[11px] ${total ? "font-bold text-text" : "text-text-mid"}`}>{k}</span>
              <span className={`text-[11px] ${total ? "font-extrabold text-accent" : "font-medium text-text"}`}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={pay}
        className="mb-2.5 w-full rounded-[16px] bg-accent py-3.5 text-[14px] font-bold text-white shadow-sm transition-colors hover:bg-accent-dark"
      >
        Pay NZD ${IT.voyager_fee_nzd} — Unlock trip
      </button>

      <div className="flex justify-center gap-4 text-[10px] text-text-light">
        <span>🔒 Secure payment</span>
        <span>✓ Encrypted</span>
        <span>No subscription</span>
      </div>

      <button
        onClick={onAsk}
        className="mt-3.5 w-full rounded-[12px] bg-tag py-2.5 text-center text-[11px] text-text-mid"
      >
        Questions? Chat with Voyager before you pay.
      </button>
    </div>
  );
}
