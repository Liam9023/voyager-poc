"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NOOSA_ITINERARY as IT } from "@/lib/itinerary";
import { BOOKINGS } from "@/lib/bookings";
import { useTrip } from "@/lib/store";
import { SectionLabel, TYPE_LABEL } from "@/components/ui";
import ActivityRow from "@/components/ActivityRow";
import AskPanel from "@/components/AskPanel";
import type { Activity } from "@/types";

type Tab = "itinerary" | "bookings" | "ask" | "trip";

export default function TripPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-text-mid">Loading your trip…</div>}>
      <TripInner />
    </Suspense>
  );
}

function TripInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { unlocked, ready } = useTrip();

  const initial = (params.get("tab") as Tab) || "itinerary";
  const about = params.get("about");
  const [tab, setTab] = useState<Tab>(
    ["itinerary", "bookings", "ask", "trip"].includes(initial) ? initial : "itinerary",
  );

  // Gentle gate: the trip experience is post-unlock.
  useEffect(() => {
    if (ready && !unlocked) router.replace("/preview");
  }, [ready, unlocked, router]);

  if (!ready || !unlocked) {
    return <div className="p-6 text-sm text-text-mid">Loading your trip…</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="shrink-0 bg-gradient-to-br from-hero to-hero-alt px-4 pb-2.5 pt-3">
        <div className="mb-1 flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg bg-white/10 px-2 py-0.5 text-[11px] text-white"
          >
            ‹ Trips
          </Link>
          <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#caa68f]">
            Upcoming · Noosa Days
          </span>
        </div>
        <div className="font-heading text-[17px] font-bold text-white">{IT.title}</div>
        <div className="text-[10px] text-white/50">📍 Noosa Heads, Queensland · 1–8 Nov 2026</div>
      </div>

      {/* Tab body */}
      <div className="flex-1 overflow-hidden">
        {tab === "itinerary" && <ItineraryTab />}
        {tab === "bookings" && <BookingsTab />}
        {tab === "ask" && <AskTab about={about} />}
        {tab === "trip" && <TripToolsTab />}
      </div>

      {/* Bottom nav */}
      <nav className="flex shrink-0 border-t border-border bg-surface">
        {(
          [
            ["itinerary", "📅", "Itinerary"],
            ["bookings", "✓", "Bookings"],
            ["ask", "💬", "Ask"],
            ["trip", "⚙️", "Trip"],
          ] as [Tab, string, string][]
        ).map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 pb-2.5"
          >
            <span className={`text-lg ${tab === id ? "opacity-100" : "opacity-35"}`}>{icon}</span>
            <span
              className={`text-[9px] ${tab === id ? "font-bold text-accent" : "font-medium text-text-light"}`}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ---------------- Itinerary tab ---------------- */
function ItineraryTab() {
  const [open, setOpen] = useState<number>(1);

  return (
    <div className="h-full overflow-y-auto px-3.5 py-3">
      {/* Proactive nudge */}
      <div className="mb-3 rounded-[16px] border border-[#7F543D33] bg-accent-light px-3.5 py-3">
        <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
          Worth doing now
        </div>
        <div className="text-[12px] font-bold text-text">Lock in the two that sell out</div>
        <p className="mt-0.5 text-[11px] text-text-mid">
          Sum Yung Guys (Day 6) and the Everglades kayak (Day 3) book weeks ahead. Everything else
          can wait.
        </p>
        <div className="mt-2 flex gap-2">
          <Link
            href="/trip?tab=bookings"
            className="rounded-lg border border-accent bg-surface px-3 py-1 text-[10px] font-bold text-accent"
          >
            Go to bookings
          </Link>
        </div>
      </div>

      {IT.days.map((d) => {
        const isOpen = open === d.day_number;
        return (
          <div
            key={d.day_number}
            className="mb-2.5 overflow-hidden rounded-[16px] border border-border bg-surface"
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : d.day_number)}
              className="flex w-full items-center justify-between px-3.5 py-3 text-left"
            >
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wide text-text-light">
                  Day {d.day_number} · {d.weekday.slice(0, 3)} {d.date.slice(8)} Nov
                </div>
                <div className="font-heading text-[14px] font-bold text-text">{d.title}</div>
                <div className="text-[10px] text-text-mid">{d.location}</div>
              </div>
              <span className={`text-text-light transition-transform ${isOpen ? "rotate-90" : ""}`}>
                ›
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-border px-3.5 py-3 animate-fade-in-fast">
                <p className="mb-3 text-[11.5px] leading-relaxed text-text-mid">{d.summary}</p>
                {d.activities.map((a: Activity) => (
                  <ActivityRow key={a.id} activity={a} editable tellMore />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Bookings tab ---------------- */
function BookingsTab() {
  const { extraBooked, markBooked } = useTrip();
  const [view, setView] = useState<"day" | "all">("day");
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const isConfirmed = (b: (typeof BOOKINGS)[number]) =>
    b.status === "confirmed" || extraBooked.includes(b.id);

  const confirmed = BOOKINGS.filter(isConfirmed).length;
  const toBook = BOOKINGS.length - confirmed;

  const days = Array.from(new Set(BOOKINGS.map((b) => b.day))).sort((a, b) => a - b);
  const dayBookings = BOOKINGS.filter((b) => b.day === selectedDay);

  function Card({ b }: { b: (typeof BOOKINGS)[number] }) {
    const done = isConfirmed(b);
    return (
      <div
        className={`mb-2 flex items-start gap-2.5 rounded-[14px] border px-3 py-2.5 ${
          done ? "border-green-border bg-green-light" : "border-border bg-surface"
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-sm ${
            done ? "bg-secondary text-white" : "bg-tag"
          }`}
        >
          {done ? "✓" : b.icon}
        </div>
        <div className="flex-1">
          <div className="text-[12px] font-bold text-text">{b.title}</div>
          <div className="text-[10px] text-text-mid">{b.detail}</div>
          {(b.ref || (done && !b.ref)) && (
            <div className="mt-0.5 font-mono text-[9px] text-text-light">
              Ref: {b.ref ?? `VYG-${b.id.slice(-5).toUpperCase()}`}
            </div>
          )}
        </div>
        {!done && (
          <button
            onClick={() => markBooked(b.id)}
            className="shrink-0 self-center rounded-lg bg-accent px-3 py-1 text-[10px] font-bold text-white"
          >
            Book
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border px-3.5 py-2.5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="rounded-[10px] border border-green-border bg-green-light px-2.5 py-1 text-center">
              <div className="text-[15px] font-extrabold text-secondary">{confirmed}</div>
              <div className="text-[9px] font-semibold text-secondary">Confirmed</div>
            </div>
            <div className="rounded-[10px] border border-amber-border bg-amber-light px-2.5 py-1 text-center">
              <div className="text-[15px] font-extrabold text-amber">{toBook}</div>
              <div className="text-[9px] font-semibold text-amber">To book</div>
            </div>
          </div>
          <div className="flex gap-1">
            {(["day", "all"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-[10px] px-2.5 py-1 text-[10px] font-semibold ${
                  view === v ? "bg-accent text-white" : "bg-tag text-text-mid"
                }`}
              >
                {v === "day" ? "By day" : "All"}
              </button>
            ))}
          </div>
        </div>

        {view === "day" && (
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
            {days.map((dnum) => {
              const hasUnbooked = BOOKINGS.some((b) => b.day === dnum && !isConfirmed(b));
              const sel = selectedDay === dnum;
              return (
                <button
                  key={dnum}
                  onClick={() => setSelectedDay(dnum)}
                  className={`min-w-[42px] shrink-0 rounded-[10px] border-[1.5px] px-2 py-1 text-center ${
                    sel
                      ? "border-accent bg-accent"
                      : hasUnbooked
                        ? "border-amber bg-tag"
                        : "border-border bg-tag"
                  }`}
                >
                  <div className={`text-[12px] font-extrabold ${sel ? "text-white" : "text-text"}`}>
                    {dnum}
                  </div>
                  <div className={`text-[8px] ${sel ? "text-white/60" : "text-text-light"}`}>
                    {Number(IT.days[dnum - 1].date.slice(8))} Nov
                  </div>
                  {hasUnbooked && !sel && (
                    <div className="mx-auto mt-0.5 h-1 w-1 rounded-full bg-amber" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-2.5">
        {view === "day" ? (
          <>
            <div className="mb-2 text-[11px] font-bold text-text">
              Day {selectedDay} · {IT.days[selectedDay - 1].weekday} · {IT.days[selectedDay - 1].title}
            </div>
            {dayBookings.length === 0 ? (
              <div className="py-6 text-center text-[11px] text-text-light">
                Nothing to book on this day — it&rsquo;s a free one.
              </div>
            ) : (
              dayBookings.map((b) => <Card key={b.id} b={b} />)
            )}
            <div className="mt-1 flex gap-1.5">
              <button
                onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                className="flex-1 rounded-lg bg-tag py-1.5 text-[10px] font-semibold text-text-mid"
              >
                ‹ Previous day
              </button>
              <button
                onClick={() => setSelectedDay(Math.min(IT.days.length, selectedDay + 1))}
                className="flex-1 rounded-lg bg-tag py-1.5 text-[10px] font-semibold text-text-mid"
              >
                Next day ›
              </button>
            </div>
          </>
        ) : (
          BOOKINGS.map((b, i) => (
            <div key={b.id}>
              {(i === 0 || BOOKINGS[i - 1].day !== b.day) && (
                <div className="mb-1.5 mt-2 text-[10px] font-bold uppercase tracking-[0.08em] text-text-light first:mt-0">
                  Day {b.day} · {Number(IT.days[b.day - 1].date.slice(8))} Nov
                </div>
              )}
              <Card b={b} />
            </div>
          ))
        )}

        {/* Add-ons nudge */}
        <div className="mt-2 rounded-[14px] border border-[#7F543D33] bg-accent-light px-3.5 py-3">
          <div className="text-[11px] font-bold text-text">Complete your trip</div>
          <div className="mb-1.5 text-[10px] text-text-mid">
            eSIM and travel insurance keep things smooth on the ground.
          </div>
          <Link
            href="/addons"
            className="inline-block rounded-lg border border-accent px-3 py-1 text-[10px] font-bold text-accent"
          >
            View add-ons
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Ask tab ---------------- */
function AskTab({ about }: { about: string | null }) {
  const activity = about
    ? IT.days.flatMap((d) => d.activities).find((a) => a.id === about)
    : undefined;

  const seed = activity ? `Tell me more about ${activity.title}.` : undefined;
  const elementContext = activity
    ? `${activity.title} (${TYPE_LABEL[activity.type]}) — ${activity.description}`
    : undefined;

  // Re-mount AskPanel when the "about" target changes so the seed re-fires.
  return (
    <div className="h-full">
      <AskPanel key={about ?? "open"} mode="postunlock" seed={seed} elementContext={elementContext} />
    </div>
  );
}

/* ---------------- Trip tools tab ---------------- */
function TripToolsTab() {
  const [section, setSection] = useState<"alerts" | "packing" | "tools" | "settings">("alerts");
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 border-b border-border bg-surface">
        {(
          [
            ["alerts", "🔔 Alerts"],
            ["packing", "🧳 Packing"],
            ["tools", "🛠️ Tools"],
            ["settings", "⚙️ Settings"],
          ] as [typeof section, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex-1 border-b-2 py-2 text-[9px] font-semibold ${
              section === id ? "border-accent text-accent" : "border-transparent text-text-light"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-3.5 py-3">
        {section === "alerts" && <Alerts />}
        {section === "packing" && <Packing />}
        {section === "tools" && <Tools />}
        {section === "settings" && <Settings />}
      </div>
    </div>
  );
}

function Alerts() {
  const alerts = [
    {
      icon: "🥢",
      title: "Sum Yung Guys — book Day 6",
      detail: "The standout meal of the week, and it books out weeks ahead. Don't leave it.",
      urgent: true,
    },
    {
      icon: "🛶",
      title: "Everglades kayak — small groups",
      detail: "Kanu Kapers' Day 3 trip caps numbers. Reserve to be sure of a spot.",
      urgent: false,
    },
    {
      icon: "✈️",
      title: "Return flight not yet booked",
      detail: "8 Nov departure — fares are reasonable right now.",
      urgent: false,
    },
  ];
  return (
    <>
      <p className="mb-2.5 text-[11px] leading-relaxed text-text-mid">
        Time-sensitive items — Voyager flags these as booking windows open.
      </p>
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`mb-2 flex gap-2.5 rounded-[14px] border px-3 py-2.5 ${
            a.urgent ? "border-amber-border bg-amber-light" : "border-border bg-surface"
          }`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-sm ${
              a.urgent ? "bg-amber" : "bg-tag"
            }`}
          >
            {a.urgent ? <span className="text-white">{a.icon}</span> : a.icon}
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-bold text-text">{a.title}</div>
            <div className="text-[11px] leading-snug text-text-mid">{a.detail}</div>
          </div>
          {a.urgent && (
            <Link
              href="/trip?tab=bookings"
              className="shrink-0 self-center rounded-lg bg-accent px-2.5 py-1 text-[10px] font-bold text-white"
            >
              Book
            </Link>
          )}
        </div>
      ))}
      <div className="rounded-[14px] border border-secondary-border bg-secondary-light px-3 py-2.5">
        <p className="text-[11px] leading-snug text-[#3a6b67]">
          💡 More alerts surface as your departure date approaches — Voyager tracks the booking
          windows for you.
        </p>
      </div>
    </>
  );
}

function Packing() {
  const { packed, togglePacked } = useTrip();
  const list = [
    { cat: "Clothing", items: ["Swimwear (×2 — you'll live in it)", "Reef-safe sunscreen", "Light layer for evenings", "A compact rain jacket", "Walking shoes for the park", "Something smart-casual for dinners"] },
    { cat: "Documents", items: ["Passport", "Travel insurance details", "Booking confirmations (in app)", "NZ driver licence — for the hire car"] },
    { cat: "Tech & money", items: ["AU power adapter (Type I)", "eSIM activated before you fly", "AUD on a travel card", "Portable charger"] },
    { cat: "Health", items: ["Any prescription medication", "Aftersun / aloe", "Hat and sunglasses"] },
  ];
  return (
    <>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-[11px] text-text-mid">Queensland · early November · 7 nights</div>
        <button className="rounded-lg border border-accent px-2.5 py-1 text-[10px] font-semibold text-accent">
          + Add item
        </button>
      </div>
      {list.map((c) => (
        <div key={c.cat} className="mb-3">
          <SectionLabel>{c.cat}</SectionLabel>
          <div className="mt-1.5">
            {c.items.map((item) => {
              const done = packed.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => togglePacked(item)}
                  className="flex w-full items-center gap-2.5 border-b border-border py-2 text-left last:border-0"
                >
                  <div
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] ${
                      done ? "border-secondary bg-secondary" : "border-border bg-surface"
                    }`}
                  >
                    {done && <span className="text-[10px] text-white">✓</span>}
                  </div>
                  <span
                    className={`text-[12px] ${done ? "text-text-light line-through" : "text-text"}`}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button className="w-full rounded-[12px] bg-tag py-2.5 text-[11px] font-semibold text-text-mid">
        📱 Share list with travel companion
      </button>
    </>
  );
}

function Tools() {
  const [nzd, setNzd] = useState(100);
  const rate = 0.92; // NZD → AUD
  const weather = [
    ["Sun", "☀️", "27°"],
    ["Mon", "⛅", "26°"],
    ["Tue", "🌤️", "28°"],
    ["Wed", "🌧️", "24°"],
    ["Thu", "☀️", "29°"],
  ];
  return (
    <>
      <div className="mb-2.5 rounded-[16px] bg-tag p-3">
        <SectionLabel>Currency · NZD → AUD</SectionLabel>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 rounded-[10px] bg-surface px-3 py-2">
            <div className="text-[9px] text-text-light">NZD</div>
            <input
              type="number"
              value={nzd}
              onChange={(e) => setNzd(Number(e.target.value) || 0)}
              className="w-full bg-transparent font-heading text-[16px] font-bold text-text outline-none"
            />
          </div>
          <div className="text-base text-text-mid">→</div>
          <div className="flex-1 rounded-[10px] bg-surface px-3 py-2">
            <div className="text-[9px] text-text-light">AUD</div>
            <div className="font-heading text-[16px] font-bold text-accent">
              {(nzd * rate).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="mt-1.5 text-[9px] text-text-light">Indicative rate · 1 NZD ≈ 0.92 AUD</div>
      </div>

      <div className="mb-2.5 rounded-[16px] bg-tag p-3">
        <SectionLabel>Weather · Noosa, next 5 days</SectionLabel>
        <div className="mt-2 flex gap-1.5">
          {weather.map(([d, icon, t]) => (
            <div key={d} className="flex-1 rounded-[10px] bg-surface px-1 py-2 text-center">
              <div className="text-[8px] text-text-light">{d}</div>
              <div className="text-[15px]">{icon}</div>
              <div className="text-[10px] font-bold text-text">{t}</div>
            </div>
          ))}
        </div>
        <div className="mt-1.5 text-[9px] text-text-light">
          Late spring — warm, the odd afternoon storm.
        </div>
      </div>

      <div className="mb-2.5 rounded-[16px] bg-tag p-3">
        <SectionLabel>Emergency info · Australia</SectionLabel>
        <div className="mt-1.5">
          {[
            ["Emergency (police/fire/ambulance)", "000"],
            ["Health advice — healthdirect", "1800 022 222"],
            ["Police non-emergency", "131 444"],
            ["NZ High Commission, Canberra", "+61 2 6270 5800"],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between border-b border-border py-1.5 last:border-0">
              <span className="text-[11px] text-text-mid">{label}</span>
              <span className="text-[11px] font-bold text-text">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[16px] bg-tag p-3">
        <SectionLabel>Time zones</SectionLabel>
        <div className="mt-1.5">
          {[
            ["Auckland (home)", "NZDT · UTC+13"],
            ["Noosa (current)", "AEST · UTC+10"],
          ].map(([city, z]) => (
            <div key={city} className="flex justify-between border-b border-border py-1.5 last:border-0">
              <span className="text-[11px] font-semibold text-text">{city}</span>
              <span className="text-[10px] text-text-light">{z}</span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 text-[9px] text-text-light">
          Queensland is 3 hours behind Auckland in November.
        </div>
      </div>
    </>
  );
}

function Settings() {
  const { reset } = useTrip();
  const rows: [string, string, string][] = [
    ["👥", "Travellers", "Liam (owner) · Sarah · 2 on this trip"],
    ["📤", "Import a booking", "Share a confirmation to update your trip"],
    ["📱", "Invite to trip", "Add a travel companion"],
    ["🔔", "Notifications", "Manage alert preferences"],
    ["💱", "Currency display", "NZD"],
    ["✏️", "Edit itinerary", "Add, remove or swap any element"],
    ["👤", "Profile", "Account details"],
    ["❓", "Help & support", ""],
  ];
  return (
    <>
      {rows.map(([icon, title, desc]) => (
        <div key={title} className="flex items-center gap-2.5 border-b border-border py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-tag text-sm">
            {icon}
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-text">{title}</div>
            {desc && <div className="text-[10px] text-text-mid">{desc}</div>}
          </div>
          <span className="text-base text-text-light">›</span>
        </div>
      ))}
      {/* POC convenience: reset demo state */}
      <button
        onClick={reset}
        className="mt-3 w-full rounded-[12px] border border-border py-2.5 text-[11px] font-semibold text-text-mid"
      >
        Reset demo (re-lock trip)
      </button>
    </>
  );
}
