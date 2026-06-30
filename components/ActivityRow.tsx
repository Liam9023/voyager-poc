"use client";

import { useState } from "react";
import Link from "next/link";
import type { Activity } from "@/types";
import { TYPE_ICON, TYPE_LABEL } from "@/components/ui";
import { getAlternative, type Alternative } from "@/lib/alternatives";
import { useTrip } from "@/lib/store";

export default function ActivityRow({
  activity,
  editable = false,
  tellMore = false,
}: {
  activity: Activity;
  editable?: boolean;
  tellMore?: boolean;
}) {
  const { removedActivities, removeActivity, restoreActivity } = useTrip();
  const [swap, setSwap] = useState<Alternative | null>(null);

  const removed = removedActivities.includes(activity.id);

  if (removed) {
    return (
      <div className="mb-2.5 flex items-center justify-between rounded-[14px] border border-dashed border-border bg-surface-alt px-3 py-2.5">
        <div className="text-[11px] text-text-light">
          <span className="line-through">{activity.title}</span> removed
          <div className="mt-0.5 text-[10px] text-secondary">
            ✓ Voyager can suggest an alternative for this slot.
          </div>
        </div>
        <button
          onClick={() => restoreActivity(activity.id)}
          className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-text-mid hover:bg-surface"
        >
          Undo
        </button>
      </div>
    );
  }

  const shown = swap
    ? { ...activity, title: swap.title, description: swap.description, type: swap.type }
    : activity;

  return (
    <div className="mb-3 flex gap-3">
      {/* Time + icon rail */}
      <div className="w-9 shrink-0 text-center">
        <div className="mb-1 text-[10px] text-text-light">{activity.time_of_day}</div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-[12px] border text-base ${
            activity.highlight
              ? "border-accent bg-accent-light"
              : "border-[#7F543D1f] bg-accent-light/60"
          }`}
        >
          {TYPE_ICON[shown.type]}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[12.5px] font-bold leading-snug text-text">{shown.title}</div>
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-text-mid">{shown.description}</p>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-tag px-2 py-0.5 text-[9px] font-bold text-text-mid">
            {TYPE_LABEL[shown.type]}
          </span>
          {activity.estimated_cost_nzd ? (
            <span className="rounded-full bg-tag px-2 py-0.5 text-[9px] font-semibold text-text-mid">
              ~NZD ${activity.estimated_cost_nzd}
            </span>
          ) : null}
          {activity.booking_required && (
            <span className="rounded-full bg-amber-light px-2 py-0.5 text-[9px] font-semibold text-amber">
              Book ahead
            </span>
          )}
          {swap && (
            <span className="rounded-full bg-secondary-light px-2 py-0.5 text-[9px] font-bold text-secondary">
              ✓ Swapped by Voyager
            </span>
          )}
        </div>

        {activity.booking_notes && (
          <div className="mt-1 text-[10px] italic text-text-light">{activity.booking_notes}</div>
        )}

        {(editable || tellMore) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tellMore && (
              <Link
                href={`/trip?tab=ask&about=${activity.id}`}
                className="rounded-lg border border-accent bg-accent-light px-2.5 py-1 text-[10px] font-semibold text-accent"
              >
                💬 Tell me more
              </Link>
            )}
            {editable && (
              <>
                {swap ? (
                  <button
                    onClick={() => setSwap(null)}
                    className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-text-mid hover:bg-surface-alt"
                  >
                    ↺ Undo swap
                  </button>
                ) : (
                  <button
                    onClick={() => setSwap(getAlternative(activity.id, activity.type))}
                    className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-text-mid hover:bg-surface-alt"
                  >
                    ⇄ Swap
                  </button>
                )}
                <button
                  onClick={() => removeActivity(activity.id)}
                  className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-text-mid hover:bg-surface-alt"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
