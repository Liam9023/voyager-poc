"use client";

import { useState } from "react";
import Link from "next/link";
import type { Activity, DecisionStyle } from "@/types";
import { TYPE_ICON, TYPE_LABEL } from "@/components/ui";
import { getSwapAlternatives, optionCountFor, type Alternative } from "@/lib/alternatives";
import { buildLocationQuery, isLiveSearchable } from "@/lib/places-client";
import { bookingUrlForActivity, venueBookingQuery } from "@/lib/deep-links";
import { useTrip } from "@/lib/store";
import AlternativesPicker from "@/components/AlternativesPicker";
import BookLink from "@/components/BookLink";
import VenueBookAction from "@/components/VenueBookAction";
import VenueBadge from "@/components/VenueBadge";

function applyAlternative(base: Activity, alt: Alternative): Activity {
  return {
    ...base,
    title: alt.title,
    description: alt.description,
    type: alt.type,
    estimated_cost_nzd: alt.cost_nzd ?? base.estimated_cost_nzd,
    booking_required: alt.booking_required ?? base.booking_required,
    rating: alt.rating,
    userRatingCount: alt.userRatingCount,
    priceLevel: alt.priceLevel,
    googleMapsUri: alt.googleMapsUri,
  };
}

function fromFreeText(base: Activity, text: string): Activity {
  return {
    ...base,
    title: text,
    description: "Added by you — Voyager doesn't have local detail on this one yet.",
    estimated_cost_nzd: undefined,
    booking_required: false,
    rating: undefined,
    userRatingCount: undefined,
    priceLevel: undefined,
    googleMapsUri: undefined,
  };
}

export default function ActivityRow({
  activity,
  dayNumber,
  dayLocation,
  source = "original",
  swapped = false,
  removed = false,
  editable = false,
  tellMore = false,
}: {
  activity: Activity;
  dayNumber: number;
  dayLocation?: string;
  source?: "original" | "added";
  swapped?: boolean;
  removed?: boolean;
  editable?: boolean;
  tellMore?: boolean;
}) {
  const { removeActivity, restoreActivity, swapActivity, undoSwap, removeAddedActivity, decisionStyle } =
    useTrip();
  const [swapping, setSwapping] = useState(false);
  const liveQuery =
    dayLocation && isLiveSearchable(activity.type) ? buildLocationQuery(activity.type, dayLocation) : undefined;
  const bookingUrl = bookingUrlForActivity(activity, dayNumber);

  if (removed) {
    const pool = getSwapAlternatives(activity.id, activity.type, optionCountFor(decisionStyle));
    return (
      <div className="mb-2.5 rounded-[14px] border border-dashed border-border bg-surface-alt px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-text-light">
            <span className="line-through">{activity.title}</span> removed
          </div>
          <button
            onClick={() => restoreActivity(activity.id)}
            className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-text-mid hover:bg-surface"
          >
            Undo
          </button>
        </div>
        <div className="mt-0.5 text-[10px] text-secondary">Voyager can fill this slot instead:</div>
        <AlternativesPicker
          pool={pool}
          decisionStyle={decisionStyle}
          liveQuery={liveQuery}
          liveType={activity.type}
          onPick={(alt) => {
            restoreActivity(activity.id);
            swapActivity(activity.id, applyAlternative(activity, alt));
          }}
          onFreeText={(text) => {
            restoreActivity(activity.id);
            swapActivity(activity.id, fromFreeText(activity, text));
          }}
          onCancel={() => {
            /* nothing to do — Undo above already covers "keep it removed" */
          }}
          freeTextLabel="Or tell Voyager what should go here instead"
        />
      </div>
    );
  }

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
          {TYPE_ICON[activity.type]}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[12.5px] font-bold leading-snug text-text">{activity.title}</div>
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-text-mid">{activity.description}</p>
        <VenueBadge
          rating={activity.rating}
          userRatingCount={activity.userRatingCount}
          priceLevel={activity.priceLevel}
          googleMapsUri={activity.googleMapsUri}
          className="mt-1"
        />

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-tag px-2 py-0.5 text-[9px] font-bold text-text-mid">
            {TYPE_LABEL[activity.type]}
          </span>
          {activity.estimated_cost_nzd ? (
            <span className="rounded-full bg-tag px-2 py-0.5 text-[9px] font-semibold text-text-mid">
              ~NZD ${activity.estimated_cost_nzd}
            </span>
          ) : null}
          {activity.booking_required && (
            <>
              <span className="rounded-full bg-amber-light px-2 py-0.5 text-[9px] font-semibold text-amber">
                Book ahead
              </span>
              {bookingUrl ? (
                <BookLink href={bookingUrl} />
              ) : (
                <VenueBookAction
                  query={venueBookingQuery(activity.type, activity.title, dayNumber, dayLocation)}
                />
              )}
            </>
          )}
          {swapped && (
            <span className="rounded-full bg-secondary-light px-2 py-0.5 text-[9px] font-bold text-secondary">
              ✓ Swapped by Voyager
            </span>
          )}
          {source === "added" && (
            <span className="rounded-full bg-secondary-light px-2 py-0.5 text-[9px] font-bold text-secondary">
              ✓ Added by you
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
                {source === "original" &&
                  (swapped ? (
                    <button
                      onClick={() => undoSwap(activity.id)}
                      className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-text-mid hover:bg-surface-alt"
                    >
                      ↺ Undo swap
                    </button>
                  ) : (
                    <button
                      onClick={() => setSwapping((s) => !s)}
                      className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-text-mid hover:bg-surface-alt"
                    >
                      ⇄ Swap
                    </button>
                  ))}
                <button
                  onClick={() =>
                    source === "added" ? removeAddedActivity(activity.id) : removeActivity(activity.id)
                  }
                  className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-text-mid hover:bg-surface-alt"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        )}

        {swapping && (
          <AlternativesPicker
            pool={getSwapAlternatives(activity.id, activity.type, optionCountFor(decisionStyle))}
            decisionStyle={decisionStyle}
            liveQuery={liveQuery}
            liveType={activity.type}
            onPick={(alt) => {
              swapActivity(activity.id, applyAlternative(activity, alt));
              setSwapping(false);
            }}
            onFreeText={(text) => {
              swapActivity(activity.id, fromFreeText(activity, text));
              setSwapping(false);
            }}
            onCancel={() => setSwapping(false)}
            freeTextLabel="Tell Voyager what you'd like instead"
          />
        )}
      </div>
    </div>
  );
}
