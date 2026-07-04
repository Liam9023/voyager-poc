"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NOOSA_ITINERARY as IT } from "@/lib/itinerary";
import { BOOKINGS } from "@/lib/bookings";
import { useTrip } from "@/lib/store";
import { SectionLabel, TYPE_ICON, TYPE_LABEL } from "@/components/ui";
import DayCard from "@/components/DayCard";
import DayHeroPhoto from "@/components/DayHeroPhoto";
import { DAY_PHOTO_QUERIES } from "@/lib/day-photo-queries";
import AskPanel from "@/components/AskPanel";
import BookLink from "@/components/BookLink";
import VenueBookAction from "@/components/VenueBookAction";
import { bookingUrlForBooking, venueBookingQuery } from "@/lib/deep-links";
import { TRIP_TRAVELLERS } from "@/lib/travellers";
import { computeBalances } from "@/lib/expenses";
import type { ActivityType, Booking, Expense } from "@/types";

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

  const urlTab = (params.get("tab") as Tab) || "itinerary";
  const about = params.get("about");
  const aboutDay = params.get("aboutDay");
  const [tab, setTab] = useState<Tab>(
    ["itinerary", "bookings", "ask", "trip"].includes(urlTab) ? urlTab : "itinerary",
  );

  // Links like "Tell me more" / "Ask about this day" navigate to /trip?tab=ask&... while
  // already mounted on /trip — sync the tab whenever the URL's tab param changes under us.
  useEffect(() => {
    if (["itinerary", "bookings", "ask", "trip"].includes(urlTab)) setTab(urlTab);
  }, [urlTab]);

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
        {tab === "ask" && <AskTab about={about} aboutDay={aboutDay} />}
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
            <DayHeroPhoto query={DAY_PHOTO_QUERIES[d.day_number] ?? null} alt={d.title} />
            <div className="flex w-full items-center justify-between px-3.5 py-3">
              <button
                onClick={() => setOpen(isOpen ? -1 : d.day_number)}
                className="flex flex-1 items-center justify-between text-left"
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
              <Link
                href={`/trip?tab=ask&aboutDay=${d.day_number}`}
                className="ml-2 shrink-0 rounded-full border border-accent bg-accent-light px-2.5 py-1.5 text-[10px] font-bold text-accent"
                title={`Ask Voyager about Day ${d.day_number}`}
              >
                💬 Ask about this day
              </Link>
            </div>
            {isOpen && (
              <div className="border-t border-border px-3.5 py-3 animate-fade-in-fast">
                <p className="mb-3 text-[11.5px] leading-relaxed text-text-mid">{d.summary}</p>
                <DayCard day={d} />
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
  const { extraBooked, markBooked, manualBookings } = useTrip();
  const [view, setView] = useState<"day" | "all">("day");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const allBookings = [...BOOKINGS, ...manualBookings];

  const isConfirmed = (b: (typeof allBookings)[number]) =>
    b.status === "confirmed" || extraBooked.includes(b.id);

  const confirmed = allBookings.filter(isConfirmed).length;
  const toBook = allBookings.length - confirmed;

  const days = Array.from(new Set(allBookings.map((b) => b.day))).sort((a, b) => a - b);
  const dayBookings = allBookings
    .filter((b) => b.day === selectedDay)
    .sort((a, b) => (a.manual === b.manual ? 0 : a.manual ? 1 : -1));
  const sortedAll = [...allBookings].sort((a, b) => a.day - b.day);

  function Card({ b }: { b: (typeof allBookings)[number] }) {
    const done = isConfirmed(b);
    const bookingUrl = bookingUrlForBooking(b);
    const location = IT.days[b.day - 1]?.location;
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
          <div className="flex items-center gap-1.5">
            <div className="text-[12px] font-bold text-text">{b.title}</div>
            {b.manual && (
              <span className="rounded-full bg-secondary-light px-1.5 py-px text-[8px] font-bold text-secondary">
                Added by you
              </span>
            )}
          </div>
          <div className="text-[10px] text-text-mid">{b.detail}</div>
          {b.ref ? (
            <div className="mt-0.5 font-mono text-[9px] text-text-light">Ref: {b.ref}</div>
          ) : (
            done &&
            !b.manual && (
              <div className="mt-0.5 font-mono text-[9px] text-text-light">
                Ref: VYG-{b.id.slice(-5).toUpperCase()}
              </div>
            )
          )}
        </div>
        {!done &&
          (bookingUrl ? (
            <BookLink href={bookingUrl} onBook={() => markBooked(b.id)} className="self-center" />
          ) : (
            <VenueBookAction
              query={venueBookingQuery(b.type, b.title, b.day, location)}
              onBook={() => markBooked(b.id)}
              className="self-center"
            />
          ))}
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
              const hasUnbooked = allBookings.some((b) => b.day === dnum && !isConfirmed(b));
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
          sortedAll.map((b, i) => (
            <div key={b.id}>
              {(i === 0 || sortedAll[i - 1].day !== b.day) && (
                <div className="mb-1.5 mt-2 text-[10px] font-bold uppercase tracking-[0.08em] text-text-light first:mt-0">
                  Day {b.day} · {Number(IT.days[b.day - 1].date.slice(8))} Nov
                </div>
              )}
              <Card b={b} />
            </div>
          ))
        )}

        {showAddForm ? (
          <AddManualBooking onDone={() => setShowAddForm(false)} />
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[14px] border border-dashed border-accent bg-accent-light/50 py-2.5 text-[11px] font-bold text-accent transition-colors hover:bg-accent-light"
          >
            ＋ Add booking manually
          </button>
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

const BOOKING_TYPES: (ActivityType | "other")[] = [
  "flight",
  "hotel",
  "activity",
  "dining",
  "car",
  "rail",
  "transfer",
  "other",
];
const TYPE_ICON_WITH_OTHER: Record<ActivityType | "other", string> = { ...TYPE_ICON, other: "📌" };
const TYPE_LABEL_WITH_OTHER: Record<ActivityType | "other", string> = { ...TYPE_LABEL, other: "Other" };

function AddManualBooking({ onDone }: { onDone: () => void }) {
  const { addManualBooking } = useTrip();
  const [type, setType] = useState<ActivityType | "other">("activity");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [day, setDay] = useState(1);
  const [ref, setRef] = useState("");

  function submit() {
    if (!title.trim()) return;
    const booking: Booking = {
      id: `manual-${day}-${Math.floor(Math.random() * 1e6)}`,
      type,
      icon: TYPE_ICON_WITH_OTHER[type],
      title: title.trim(),
      detail: detail.trim() || `Day ${day}`,
      status: "confirmed",
      ref: ref.trim() || null,
      day,
      manual: true,
    };
    addManualBooking(booking);
    onDone();
  }

  return (
    <div className="mt-2 rounded-[16px] border border-accent bg-accent-light/40 p-3 animate-fade-in-fast">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-bold text-text">Add a booking</div>
        <button onClick={onDone} className="text-[11px] text-text-light">
          ✕
        </button>
      </div>

      <div className="mb-2">
        <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.06em] text-text-light">Type</div>
        <div className="flex flex-wrap gap-1.5">
          {BOOKING_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                type === t ? "bg-accent text-white" : "bg-tag text-text-mid"
              }`}
            >
              {TYPE_ICON_WITH_OTHER[t]} {TYPE_LABEL_WITH_OTHER[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title — e.g. Noosa Marina sunset cruise"
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-2.5 py-2 text-[11.5px] outline-none focus:border-accent"
        />
      </div>
      <div className="mb-2">
        <input
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Detail — e.g. 6pm · booked via operator's site"
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-2.5 py-2 text-[11.5px] outline-none focus:border-accent"
        />
      </div>

      <div className="mb-2">
        <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.06em] text-text-light">
          Which day
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
          {IT.days.map((d) => (
            <button
              key={d.day_number}
              onClick={() => setDay(d.day_number)}
              className={`min-w-[36px] shrink-0 rounded-[8px] px-2 py-1 text-center text-[11px] font-bold ${
                day === d.day_number ? "bg-accent text-white" : "bg-tag text-text-mid"
              }`}
            >
              {d.day_number}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Reference number (optional)"
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-2.5 py-2 text-[11.5px] outline-none focus:border-accent"
        />
      </div>

      <button
        onClick={submit}
        disabled={!title.trim()}
        className="w-full rounded-[12px] bg-accent py-2.5 text-[12px] font-bold text-white disabled:opacity-40"
      >
        Save booking
      </button>
    </div>
  );
}

/* ---------------- Ask tab ---------------- */
function AskTab({ about, aboutDay }: { about: string | null; aboutDay: string | null }) {
  const activityDay = about ? IT.days.find((d) => d.activities.some((a) => a.id === about)) : undefined;
  const activity = activityDay?.activities.find((a) => a.id === about);
  const day = !activity && aboutDay ? IT.days.find((d) => d.day_number === Number(aboutDay)) : undefined;

  // "Tell me more" fires a real question straight away — that's what the button promises.
  // "Ask about this day" (item 12) does NOT: the day's detail goes in invisibly as
  // `elementContext` below, and Voyager just opens with a short natural line instead of
  // dumping the day's contents as a fake user message and immediately calling the API.
  const seed = activity ? `Tell me more about ${activity.title}.` : undefined;
  const initialAssistant = day ? `What's on your mind for ${day.title}?` : undefined;
  const elementContext = activity
    ? `${activity.title} (${TYPE_LABEL[activity.type]}) — ${activity.description}`
    : day
      ? `Day ${day.day_number} (${day.weekday} ${day.date}) — ${day.title}, ${day.location}. Planned: ${day.activities.map((a) => a.title).join("; ")}.`
      : undefined;
  const contextLabel = activity && activityDay
    ? `Day ${activityDay.day_number} · ${activity.title}`
    : day
      ? `Day ${day.day_number} · ${day.location}`
      : undefined;

  // Re-mount AskPanel when the target changes so the seed/opener re-fires.
  return (
    <div className="h-full">
      <AskPanel
        key={about ?? aboutDay ?? "open"}
        mode="postunlock"
        seed={seed}
        initialAssistant={initialAssistant}
        elementContext={elementContext}
        contextLabel={contextLabel}
      />
    </div>
  );
}

/* ---------------- Trip tools tab ---------------- */
function TripToolsTab() {
  const [section, setSection] = useState<"alerts" | "packing" | "expenses" | "tools" | "settings">("alerts");
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 border-b border-border bg-surface">
        {(
          [
            ["alerts", "🔔 Alerts"],
            ["packing", "🧳 Packing"],
            ["expenses", "💰 Expenses"],
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
        {section === "expenses" && <Expenses />}
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

const EXPENSE_CATEGORIES = ["Food & drink", "Activities", "Transport", "Accommodation", "Other"];

function Expenses() {
  const { expenses, addExpense, removeExpense } = useTrip();
  const [showAddForm, setShowAddForm] = useState(false);
  const balances = computeBalances(expenses, TRIP_TRAVELLERS);
  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {balances.map((b) => (
          <div key={b.name} className="rounded-[14px] border border-border bg-surface p-2.5">
            <div className="text-[11px] font-bold text-text">{b.name}</div>
            <div className="mt-1 flex justify-between text-[9px] text-text-light">
              <span>Paid</span>
              <span className="font-semibold text-text-mid">${b.paid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[9px] text-text-light">
              <span>Owes</span>
              <span className="font-semibold text-text-mid">${b.owed.toFixed(2)}</span>
            </div>
            <div
              className={`mt-1 rounded-[8px] px-1.5 py-1 text-center text-[10px] font-bold ${
                b.net > 0.005
                  ? "bg-green-light text-secondary"
                  : b.net < -0.005
                    ? "bg-amber-light text-amber"
                    : "bg-tag text-text-mid"
              }`}
            >
              {b.net > 0.005
                ? `Is owed $${b.net.toFixed(2)}`
                : b.net < -0.005
                  ? `Owes $${Math.abs(b.net).toFixed(2)}`
                  : "Settled up"}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.06em] text-text-light">
        Group ledger — tracking only, no money moves
      </div>

      {sorted.length === 0 ? (
        <div className="mb-2.5 rounded-[14px] border border-dashed border-border py-6 text-center text-[11px] text-text-light">
          No expenses logged yet.
        </div>
      ) : (
        sorted.map((e) => (
          <div
            key={e.id}
            className="mb-2 flex items-start justify-between gap-2 rounded-[14px] border border-border bg-surface px-3 py-2.5"
          >
            <div className="flex-1">
              <div className="text-[12px] font-bold text-text">{e.title}</div>
              <div className="text-[10px] text-text-mid">
                {e.paidBy} paid · {e.date}
                {e.category ? ` · ${e.category}` : ""}
              </div>
              <div className="mt-0.5 text-[9px] text-text-light">
                Split: {e.splitWith.join(", ")}
              </div>
            </div>
            <div className="text-right">
              <div className="font-heading text-[13px] font-bold text-text">${e.amount.toFixed(2)}</div>
              <button
                onClick={() => removeExpense(e.id)}
                className="mt-1 text-[9px] font-semibold text-text-light hover:text-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {showAddForm ? (
        <AddExpenseForm onDone={() => setShowAddForm(false)} onAdd={addExpense} />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-[14px] border border-dashed border-accent bg-accent-light/50 py-2.5 text-[11px] font-bold text-accent transition-colors hover:bg-accent-light"
        >
          ＋ Add expense
        </button>
      )}
    </>
  );
}

function AddExpenseForm({
  onDone,
  onAdd,
}: {
  onDone: () => void;
  onAdd: (expense: Expense) => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<string>(TRIP_TRAVELLERS[0]);
  const [date, setDate] = useState(IT.start_date);
  const [category, setCategory] = useState<string>("");
  const [splitWith, setSplitWith] = useState<string[]>([...TRIP_TRAVELLERS]);

  function toggleSplit(name: string) {
    setSplitWith((s) =>
      s.includes(name) ? s.filter((x) => x !== name) : [...s, name],
    );
  }

  function submit() {
    const value = Number(amount);
    if (!title.trim() || !value || value <= 0 || splitWith.length === 0) return;
    onAdd({
      id: `exp-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      title: title.trim(),
      amount: value,
      paidBy,
      date,
      category: category || undefined,
      splitWith,
    });
    onDone();
  }

  return (
    <div className="mt-1 rounded-[16px] border border-accent bg-accent-light/40 p-3 animate-fade-in-fast">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-bold text-text">Add an expense</div>
        <button onClick={onDone} className="text-[11px] text-text-light">
          ✕
        </button>
      </div>

      <div className="mb-2 flex gap-1.5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Dinner at Locale"
          className="flex-1 rounded-[10px] border-[1.5px] border-border bg-surface px-2.5 py-2 text-[11.5px] outline-none focus:border-accent"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="$0.00"
          className="w-24 rounded-[10px] border-[1.5px] border-border bg-surface px-2.5 py-2 text-[11.5px] outline-none focus:border-accent"
        />
      </div>

      <div className="mb-2">
        <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.06em] text-text-light">Who paid</div>
        <div className="flex flex-wrap gap-1.5">
          {TRIP_TRAVELLERS.map((name) => (
            <button
              key={name}
              onClick={() => setPaidBy(name)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                paidBy === name ? "bg-accent text-white" : "bg-tag text-text-mid"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.06em] text-text-light">
          Split between
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TRIP_TRAVELLERS.map((name) => (
            <button
              key={name}
              onClick={() => toggleSplit(name)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                splitWith.includes(name) ? "bg-secondary text-white" : "bg-tag text-text-mid"
              }`}
            >
              {splitWith.includes(name) ? "✓ " : ""}
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 flex gap-1.5">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 rounded-[10px] border-[1.5px] border-border bg-surface px-2.5 py-2 text-[11.5px] outline-none focus:border-accent"
        />
      </div>

      <div className="mb-3">
        <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.06em] text-text-light">
          Category (optional)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {EXPENSE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory((cur) => (cur === c ? "" : c))}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                category === c ? "bg-accent text-white" : "bg-tag text-text-mid"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!title.trim() || !Number(amount) || splitWith.length === 0}
        className="w-full rounded-[12px] bg-accent py-2.5 text-[11px] font-bold text-white disabled:opacity-40"
      >
        Add expense
      </button>
    </div>
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
  const rows: [string, string, string, string?][] = [
    ["🧭", "Preferences", "Home airport, dietary needs, notes Voyager always uses", "/settings"],
    ["👥", "Travellers", "Liam (owner) · Sarah · 2 on this trip"],
    ["📤", "Import a booking", "Share a confirmation to update your trip"],
    ["📱", "Invite to trip", "Add a travel companion"],
    ["🔔", "Notifications", "Manage alert preferences"],
    ["💱", "Currency display", "NZD"],
    ["✏️", "Edit itinerary", "Add, remove or swap any element"],
    ["❓", "Help & support", ""],
  ];
  return (
    <>
      {rows.map(([icon, title, desc, href]) => {
        const row = (
          <div className="flex items-center gap-2.5 border-b border-border py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-tag text-sm">
              {icon}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-text">{title}</div>
              {desc && <div className="text-[10px] text-text-mid">{desc}</div>}
            </div>
            <span className="text-base text-text-light">›</span>
          </div>
        );
        return href ? (
          <Link key={title} href={href}>
            {row}
          </Link>
        ) : (
          <div key={title}>{row}</div>
        );
      })}
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
