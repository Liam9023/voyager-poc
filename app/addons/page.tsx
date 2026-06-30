"use client";

import { useRouter } from "next/navigation";
import { ADDONS } from "@/lib/bookings";
import { useTrip } from "@/lib/store";

export default function AddonsPage() {
  const { addons, toggleAddon } = useTrip();
  const router = useRouter();

  const selectedCount = addons.length;
  const total = ADDONS.filter((a) => addons.includes(a.key)).reduce((sum, a) => sum + a.cost, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="shrink-0 border-b border-border bg-surface px-5 py-3.5">
        <div className="mb-0.5 text-[10px] font-bold text-secondary">
          ✓ Trip unlocked — Noosa Days, 7 nights
        </div>
        <div className="font-heading text-[18px] font-bold text-text">
          A few things worth sorting now
        </div>
        <div className="text-[11px] text-text-mid">Everything below is optional — tailored to your trip</div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-3.5">
        {ADDONS.map((a) => {
          const selected = addons.includes(a.key);
          return (
            <div
              key={a.key}
              className={`mb-2.5 overflow-hidden rounded-[16px] border-[1.5px] transition-all ${
                selected ? "border-accent bg-accent-light" : "border-border bg-surface"
              }`}
            >
              <div className="p-3.5">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-lg ${
                      selected ? "bg-accent" : "bg-tag"
                    }`}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <div className="text-[13px] font-bold text-text">{a.title}</div>
                      {a.tag && (
                        <span className="rounded-lg border border-amber-border bg-amber-light px-1.5 py-px text-[9px] font-bold text-amber">
                          {a.tag}
                        </span>
                      )}
                    </div>
                    <div className="mb-1 text-[11px] text-text-mid">{a.subtitle}</div>
                    <div className="text-[11px] leading-snug text-text-mid">{a.description}</div>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-extrabold text-text">{a.price}</div>
                    <div className="text-[10px] text-text-light">{a.priceNote}</div>
                  </div>
                  <button
                    onClick={() => toggleAddon(a.key)}
                    className={`rounded-full border-[1.5px] border-accent px-4 py-1.5 text-[12px] font-bold transition-all ${
                      selected ? "bg-accent text-white" : "bg-surface text-accent"
                    }`}
                  >
                    {selected ? "✓ Added" : a.cta}
                  </button>
                </div>
              </div>
              {selected && (
                <div className="border-t border-secondary-border bg-green-light px-3.5 py-2">
                  <div className="text-[10px] font-semibold text-secondary">
                    ✓ Will be sorted before your trip — details sent to your email
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {selectedCount > 0 && (
          <div className="mb-2.5 rounded-[16px] border border-[#7F543D33] bg-accent-light p-3.5 animate-fade-in">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[12px] font-bold text-text">
                {selectedCount} item{selectedCount > 1 ? "s" : ""} added
              </div>
              {total > 0 && <div className="text-[13px] font-extrabold text-accent">NZD ${total}+</div>}
            </div>
            <button
              onClick={() => router.push("/trip?tab=itinerary")}
              className="w-full rounded-[12px] bg-accent py-2.5 text-[13px] font-bold text-white"
            >
              Continue to my itinerary →
            </button>
          </div>
        )}

        <button
          onClick={() => router.push("/trip?tab=itinerary")}
          className="mb-2 w-full rounded-[12px] border border-border bg-transparent py-2.5 text-[12px] font-semibold text-text-mid"
        >
          {selectedCount > 0 ? "Skip the rest" : "Skip — go straight to my itinerary"}
        </button>

        <div className="pb-3 text-center text-[10px] leading-snug text-text-light">
          These can also be accessed later from your trip dashboard
        </div>
      </main>
    </div>
  );
}
