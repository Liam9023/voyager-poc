"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTrip } from "@/lib/store";
import { NOOSA_ITINERARY } from "@/lib/itinerary";
import { Logo } from "@/components/ui";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const ms = target.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round(ms / 86_400_000);
}

const ALERTS = [
  { trip: "Noosa", msg: "Sum Yung Guys books out weeks ahead — reserve Day 6 now", urgent: true },
  { trip: "Noosa", msg: "Kayak the Everglades — small groups, lock in Day 3", urgent: false },
  { trip: "Japan", msg: "Cherry blossom dates firming up — review your March trip", urgent: false },
];

const PAST = [
  { id: "italy", flag: "🇮🇹", title: "Italy", dates: "Jun 2025 · 14 nights", highlight: "Rome, Florence, Amalfi Coast" },
  { id: "usa", flag: "🇺🇸", title: "USA Road Trip", dates: "Oct 2024 · 18 nights", highlight: "NYC, Nashville, New Orleans" },
  { id: "bali", flag: "🇮🇩", title: "Bali", dates: "Jan 2024 · 10 nights", highlight: "Ubud, Seminyak, Nusa Penida" },
];

export default function Home() {
  const { unlocked, ready } = useTrip();
  const router = useRouter();
  const [showAlerts, setShowAlerts] = useState(false);

  const away = daysUntil(NOOSA_ITINERARY.start_date);
  const awayLabel = away > 0 ? `${away} days away` : away === 0 ? "Today" : "In progress";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-3.5">
        <div>
          <Logo />
          <div className="font-heading text-[16px] font-bold text-text">Good evening, Liam</div>
        </div>
        <button
          onClick={() => setShowAlerts((s) => !s)}
          className="relative rounded-full p-1.5 transition-colors hover:bg-surface-alt"
          aria-label="Alerts"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2C7.5 2 5 4.5 5 8v5l-2 2v1h16v-1l-2-2V8c0-3.5-2.5-6-6-6z" stroke="#1A1E22" strokeWidth="1.5" />
            <path d="M9 18c0 1.1.9 2 2 2s2-.9 2-2" stroke="#1A1E22" strokeWidth="1.5" />
          </svg>
          <span className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-surface bg-amber text-[7px] font-extrabold text-white">
            3
          </span>
        </button>
      </header>

      {showAlerts && (
        <div className="shrink-0 border-b border-border bg-surface px-5 py-3 animate-fade-in-fast">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
            Alerts across all trips
          </div>
          {ALERTS.map((a, i) => (
            <div key={i} className="flex gap-2.5 border-b border-border py-1.5 last:border-0">
              <div
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.urgent ? "bg-amber" : "bg-accent"}`}
              />
              <div>
                <div className="text-[9px] font-bold text-accent">{a.trip}</div>
                <div className="text-[11px] text-text">{a.msg}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {/* Feature trip — Noosa */}
        <section className="mb-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
            {unlocked ? "Your next trip" : "Ready to view"}
          </div>
          <div className="overflow-hidden rounded-[24px] shadow-hero">
            <div className="bg-gradient-to-br from-hero to-hero-alt p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#caa68f]">
                    {unlocked ? `Upcoming · ${awayLabel}` : "Preview ready"}
                  </div>
                  <div className="font-heading text-[24px] font-bold text-white">
                    {NOOSA_ITINERARY.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-white/50">
                    1–8 Nov 2026 · 7 nights · 2 adults
                  </div>
                  <div className="mt-1.5 text-[10px] font-semibold text-[#caa68f]">
                    📍 Noosa Heads, Queensland
                  </div>
                </div>
              </div>
              <div className="mt-3.5">
                <div className="mb-1 flex justify-between text-[9px] text-white/40">
                  <span>{unlocked ? "Booking progress" : "Auckland → Noosa"}</span>
                  <span>{unlocked ? "6 of 11 booked" : "Built for you"}</span>
                </div>
                <div className="h-[3px] rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-secondary"
                    style={{ width: unlocked ? "55%" : "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 bg-accent-light px-4 py-3">
              {unlocked ? (
                <>
                  <Link
                    href="/trip?tab=itinerary"
                    className="flex-1 rounded-[12px] bg-accent py-2 text-center text-[11px] font-bold text-white"
                  >
                    Open trip
                  </Link>
                  <Link
                    href="/trip?tab=ask"
                    className="rounded-[12px] border border-accent bg-surface px-3 py-2 text-[11px] font-semibold text-accent"
                  >
                    Ask Voyager
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/preview"
                    className="flex-1 rounded-[12px] bg-accent py-2 text-center text-[11px] font-bold text-white"
                  >
                    View preview
                  </Link>
                  <Link
                    href="/preview?tab=unlock"
                    className="rounded-[12px] border border-accent bg-surface px-3 py-2 text-[11px] font-semibold text-accent"
                  >
                    Unlock
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Plan new trip */}
        <button
          onClick={() => router.push("/plan")}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-[20px] bg-accent py-3.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-accent-dark"
        >
          <span className="text-lg leading-none">＋</span> Plan a new trip
        </button>

        {/* Upcoming example */}
        <section className="mb-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-accent">Upcoming</div>
          <div className="rounded-[20px] border-[1.5px] border-border bg-surface p-3.5">
            <div className="mb-1.5 flex items-center justify-between">
              <div>
                <div className="font-heading text-[15px] font-bold text-text">Japan</div>
                <div className="text-[11px] text-text-mid">Mar — Apr 2027 · 21 nights</div>
              </div>
              <div className="text-right">
                <div className="font-heading text-[18px] font-bold text-accent">247</div>
                <div className="text-[9px] text-text-light">days away</div>
              </div>
            </div>
            <div className="mb-1 h-[3px] rounded-full bg-tag">
              <div className="h-full w-[29%] rounded-full bg-accent" />
            </div>
            <div className="text-[10px] text-text-light">6 of 21 nights booked · 1 alert</div>
          </div>
        </section>

        {/* Past trips */}
        <section className="pb-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">Past trips</div>
            <button className="text-[10px] font-semibold text-accent">View all</button>
          </div>
          {PAST.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 border-b border-border py-2.5 last:border-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-tag text-lg">
                {t.flag}
              </div>
              <div className="flex-1">
                <div className="text-[12px] font-bold text-text">{t.title}</div>
                <div className="text-[10px] text-text-light">{t.dates}</div>
                <div className="text-[10px] text-text-mid">{t.highlight}</div>
              </div>
              <span className="text-base text-text-light">›</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
