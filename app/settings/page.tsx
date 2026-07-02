"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/lib/preferences-store";
import { SectionLabel, Chip } from "@/components/ui";
import type { DietaryTag } from "@/types";

const DIETARY_OPTIONS: { key: DietaryTag; label: string }[] = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "vegan", label: "Vegan" },
  { key: "gluten_free", label: "Gluten-free" },
];

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const cls =
    "w-full rounded-[12px] border-[1.5px] border-border bg-surface px-3 py-2.5 text-[13px] text-text outline-none placeholder:text-text-light focus:border-accent";
  return (
    <div className="mb-3.5">
      <label className="mb-1 block text-[12px] font-bold text-text">{label}</label>
      {hint && <div className="mb-1.5 text-[10.5px] text-text-light">{hint}</div>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { preferences, ready, updatePreferences } = usePreferences();
  const [savedPulse, setSavedPulse] = useState(false);
  const firstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSavedPulse(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSavedPulse(false), 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences, ready]);

  function toggleDietary(tag: DietaryTag) {
    const has = preferences.dietary.includes(tag);
    updatePreferences({
      dietary: has ? preferences.dietary.filter((t) => t !== tag) : [...preferences.dietary, tag],
    });
  }

  if (!ready) {
    return <div className="p-6 text-sm text-text-mid">Loading your preferences…</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="shrink-0 border-b border-border bg-surface px-5 py-3.5">
        <div className="mb-1">
          <Link href="/" className="rounded-lg bg-tag px-2 py-0.5 text-[11px] text-text-mid">
            ‹ Home
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-heading text-[18px] font-bold text-text">Preferences</div>
          <span
            className={`text-[10px] font-bold text-secondary transition-opacity duration-300 ${
              savedPulse ? "opacity-100" : "opacity-0"
            }`}
          >
            ✓ Saved
          </span>
        </div>
        <div className="mt-0.5 text-[11px] leading-snug text-text-mid">
          Voyager remembers this and folds it into every itinerary and answer — no need to repeat
          yourself.
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <section className="mb-5">
          <SectionLabel>Travel basics</SectionLabel>
          <div className="mt-2">
            <Field
              label="Home airport / city"
              value={preferences.homeAirport}
              onChange={(v) => updatePreferences({ homeAirport: v })}
              placeholder="e.g. Auckland (AKL)"
            />
            <Field
              label="Preferred airlines"
              value={preferences.preferredAirlines}
              onChange={(v) => updatePreferences({ preferredAirlines: v })}
              placeholder="e.g. Air New Zealand, Qantas"
            />
          </div>
        </section>

        <section className="mb-5">
          <SectionLabel>Food</SectionLabel>
          <div className="mt-2">
            <div className="mb-3.5">
              <label className="mb-1.5 block text-[12px] font-bold text-text">
                Dietary requirements
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map((o) => (
                  <Chip
                    key={o.key}
                    active={preferences.dietary.includes(o.key)}
                    onClick={() => toggleDietary(o.key)}
                  >
                    {o.label}
                  </Chip>
                ))}
              </div>
            </div>
            <Field
              label="Allergies"
              value={preferences.allergies}
              onChange={(v) => updatePreferences({ allergies: v })}
              placeholder="e.g. peanuts, shellfish"
            />
            <Field
              label="Food dislikes"
              value={preferences.foodDislikes}
              onChange={(v) => updatePreferences({ foodDislikes: v })}
              placeholder="e.g. not big on spicy food"
            />
          </div>
        </section>

        <section className="mb-5">
          <SectionLabel>Accessibility</SectionLabel>
          <div className="mt-2">
            <Field
              label="Accessibility needs"
              value={preferences.accessibilityNeeds}
              onChange={(v) => updatePreferences({ accessibilityNeeds: v })}
              placeholder="e.g. limited mobility, avoid long walks"
              multiline
            />
          </div>
        </section>

        <section className="mb-5">
          <SectionLabel>Anything else</SectionLabel>
          <div className="mt-2">
            <Field
              label="General notes"
              hint="Anything else Voyager should always know"
              value={preferences.generalNotes}
              onChange={(v) => updatePreferences({ generalNotes: v })}
              placeholder="e.g. we're celebrating an anniversary, prefer boutique stays over chains"
              multiline
            />
          </div>
        </section>

        <div className="rounded-[14px] border border-secondary-border bg-secondary-light px-3.5 py-3">
          <p className="text-[11px] leading-relaxed text-[#3a6b67]">
            💡 All of this is optional. Fill in what&rsquo;s useful — Voyager builds a great trip
            either way, this just sharpens it.
          </p>
        </div>
      </main>
    </div>
  );
}
