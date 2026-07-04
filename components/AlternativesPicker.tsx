"use client";

import { useEffect, useState } from "react";
import type { ActivityType, DecisionStyle } from "@/types";
import type { Alternative } from "@/lib/alternatives";
import { fetchLiveAlternatives, isLiveSearchable } from "@/lib/places-client";
import VenueBadge from "@/components/VenueBadge";

/**
 * Shared "what should go here instead" picker — used by Swap, Remove's suggested
 * replacement, and Add (POC_followup_prompt.md item 1). Behaviour changes with decision
 * style (item 2): one confident pick, 2-3 options, or a free-text-first layout.
 *
 * When `liveQuery`/`liveType` are given, it fetches real venues (item 5) on mount and
 * swaps them in once they arrive — the curated `pool` renders immediately so there's never
 * a blank state, and stays as-is if Places isn't configured or returns nothing.
 */
export default function AlternativesPicker({
  pool: staticPool,
  decisionStyle,
  onPick,
  onFreeText,
  onCancel,
  freeTextLabel = "Tell Voyager what you'd like instead",
  freeTextPlaceholder = "e.g. a quiet café near the hotel",
  liveQuery,
  liveType,
}: {
  pool: Alternative[];
  decisionStyle: DecisionStyle;
  onPick: (alt: Alternative) => void;
  onFreeText?: (text: string) => void;
  onCancel: () => void;
  freeTextLabel?: string;
  freeTextPlaceholder?: string;
  liveQuery?: string;
  liveType?: ActivityType;
}) {
  const [pool, setPool] = useState(staticPool);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [freeText, setFreeText] = useState("");
  const [showCurated, setShowCurated] = useState(false);

  useEffect(() => {
    if (!liveQuery || !liveType || !isLiveSearchable(liveType)) return;
    let cancelled = false;
    fetchLiveAlternatives(liveQuery, liveType, Math.max(3, staticPool.length)).then((live) => {
      if (!cancelled && live.length > 0) setPool(live);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveQuery, liveType]);

  if (decisionStyle === "know_what_i_want" && onFreeText) {
    return (
      <div className="mt-2 rounded-[14px] border border-border bg-surface p-3 animate-fade-in-fast">
        <div className="mb-1.5 text-[11px] font-bold text-text">{freeTextLabel}</div>
        <div className="flex gap-1.5">
          <input
            autoFocus
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && freeText.trim() && onFreeText(freeText.trim())}
            placeholder={freeTextPlaceholder}
            className="flex-1 rounded-[10px] border-[1.5px] border-border bg-surface px-2.5 py-2 text-[11.5px] outline-none focus:border-accent"
          />
          <button
            onClick={() => freeText.trim() && onFreeText(freeText.trim())}
            disabled={!freeText.trim()}
            className="shrink-0 rounded-[10px] bg-accent px-3 py-2 text-[10.5px] font-bold text-white disabled:opacity-40"
          >
            Add
          </button>
        </div>
        <button
          onClick={() => setShowCurated((s) => !s)}
          className="mt-2 text-[10px] font-semibold text-accent"
        >
          {showCurated ? "Hide Voyager's ideas" : "Or pick one of Voyager's ideas"}
        </button>
        {showCurated && (
          <div className="mt-1.5 flex flex-col gap-1.5">
            {pool.slice(0, 2).map((alt, i) => (
              <div
                key={i}
                className="rounded-[10px] border border-border bg-tag px-2.5 py-2 transition-colors hover:border-accent"
              >
                <button onClick={() => onPick(alt)} className="w-full text-left">
                  <div className="text-[11px] font-bold text-text">{alt.title}</div>
                  <div className="text-[10px] leading-snug text-text-mid">{alt.description}</div>
                </button>
                <VenueBadge {...alt} className="mt-1" />
              </div>
            ))}
          </div>
        )}
        <button onClick={onCancel} className="mt-2 text-[10px] font-semibold text-text-light">
          Cancel
        </button>
      </div>
    );
  }

  if (decisionStyle === "decide_for_me") {
    const alt = pool[cycleIndex % pool.length];
    return (
      <div className="mt-2 animate-fade-in-fast">
        <div className="rounded-[14px] border border-accent bg-accent-light p-3">
          <div className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-accent">
            Voyager&rsquo;s pick
          </div>
          <div className="text-[12px] font-bold text-text">{alt.title}</div>
          <div className="mt-0.5 text-[10.5px] leading-snug text-text-mid">{alt.description}</div>
          <VenueBadge {...alt} className="mt-1" />
        </div>
        <div className="mt-1.5 flex gap-1.5">
          <button
            onClick={() => onPick(alt)}
            className="rounded-lg bg-accent px-3 py-1.5 text-[10.5px] font-bold text-white"
          >
            Use this
          </button>
          {pool.length > 1 && (
            <button
              onClick={() => setCycleIndex((i) => i + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-[10.5px] font-semibold text-text-mid hover:bg-surface-alt"
            >
              Not this one
            </button>
          )}
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-3 py-1.5 text-[10.5px] font-semibold text-text-mid hover:bg-surface-alt"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // show_options (default) — 2-3 real grounded alternatives to pick from.
  return (
    <div className="mt-2 flex flex-col gap-1.5 animate-fade-in-fast">
      {pool.slice(0, 3).map((alt, i) => (
        <div
          key={i}
          className="rounded-[12px] border border-border bg-surface px-3 py-2.5 transition-colors hover:border-accent"
        >
          <button onClick={() => onPick(alt)} className="w-full text-left">
            <div className="text-[12px] font-bold text-text">{alt.title}</div>
            <div className="mt-0.5 text-[10.5px] leading-snug text-text-mid">{alt.description}</div>
          </button>
          <VenueBadge {...alt} className="mt-1" />
        </div>
      ))}
      <button
        onClick={onCancel}
        className="self-start text-[10px] font-semibold text-text-light hover:text-text-mid"
      >
        Cancel
      </button>
    </div>
  );
}
