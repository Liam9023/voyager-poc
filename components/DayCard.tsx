"use client";

import { useEffect, useRef, useState } from "react";
import type { Activity, ActivityType, ConflictIssue, Day, DecisionStyle, PlacedActivity } from "@/types";
import { useTrip } from "@/lib/store";
import { getDayView, getEffectiveDay, detectConflicts, areaFor } from "@/lib/schedule";
import { getAddAlternatives, optionCountFor } from "@/lib/alternatives";
import { buildLocationQuery } from "@/lib/places-client";
import ActivityRow from "@/components/ActivityRow";
import AlternativesPicker from "@/components/AlternativesPicker";
import ConflictSheet from "@/components/ConflictSheet";
import { TYPE_ICON, TYPE_LABEL } from "@/components/ui";

const ADD_TYPES: ActivityType[] = ["activity", "dining"];
const TIME_SLOTS: { key: string; label: string }[] = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

// Item 2 (pacing) — a day this full of an activity/dining item only matters when it exceeds
// what the traveller said they wanted; "flight"/"hotel"/"car"/"transfer" are logistics, not
// "things to do", so they don't count toward density.
const PACING_MAX: Record<"relaxed" | "balanced" | "packed", number | null> = {
  relaxed: 3,
  balanced: 5,
  packed: null,
};
const DENSITY_TYPES: ActivityType[] = ["activity", "dining"];

let addCounter = 0;
function nextAddedId() {
  addCounter += 1;
  return `added-${addCounter}-${Math.floor(Math.random() * 1e6)}`;
}

export default function DayCard({ day, tellMore = true }: { day: Day; tellMore?: boolean }) {
  const {
    removedActivities,
    swappedActivities,
    addedActivities,
    timeOverrides,
    decisionStyle,
    pacing,
    addActivity,
    setTimeOverride,
  } = useTrip();
  const [densityDismissed, setDensityDismissed] = useState(false);

  const edits = {
    removedIds: removedActivities,
    swaps: swappedActivities,
    added: addedActivities,
    timeOverrides,
  };
  const view = getDayView(day, edits);

  const [conflicts, setConflicts] = useState<ConflictIssue[]>([]);
  // Fingerprint each activity's slot-relevant state so we can tell exactly which one
  // changed — conflict checks only ever focus on that activity, never the whole day.
  const fingerprint: Record<string, string> = {};
  for (const a of view) fingerprint[a.id] = `${a.removed}|${a.swapped}|${a.time_of_day}|${a.title}`;
  const editsKey = JSON.stringify(fingerprint);
  const prevFingerprintRef = useRef<Record<string, string>>(fingerprint);

  useEffect(() => {
    const prev = prevFingerprintRef.current;
    if (JSON.stringify(prev) === editsKey) return;
    const focusIds = Object.keys(fingerprint).filter((id) => fingerprint[id] !== prev[id]);
    prevFingerprintRef.current = fingerprint;
    if (focusIds.length === 0) return;
    setConflicts(detectConflicts(getEffectiveDay(day, edits), focusIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editsKey]);

  function handleAdjust(issue: ConflictIssue) {
    if (issue.proposal) setTimeOverride(issue.proposal.activityId, issue.proposal.newTime);
    setConflicts((cs) => cs.filter((c) => c !== issue));
  }
  function handleLeave(issue: ConflictIssue) {
    setConflicts((cs) => cs.filter((c) => c !== issue));
  }

  const densityCount = view.filter((a) => !a.removed && DENSITY_TYPES.includes(a.type)).length;
  const densityMax = PACING_MAX[pacing];
  const overPace = densityMax !== null && densityCount > densityMax;

  return (
    <div>
      {overPace && !densityDismissed && (
        <div className="mb-2.5 flex items-start justify-between gap-2 rounded-[14px] border border-secondary-border bg-secondary-light px-3 py-2.5 animate-fade-in-fast">
          <p className="text-[11px] leading-snug text-[#3a6b67]">
            💡 This day has {densityCount} things on it — fuller than the {pacing} pace you asked
            for. Remove anything that doesn&rsquo;t feel essential.
          </p>
          <button
            onClick={() => setDensityDismissed(true)}
            className="shrink-0 text-[11px] text-[#3a6b67]"
          >
            ✕
          </button>
        </div>
      )}
      {view.map((a) => (
        <ActivityRow
          key={a.id}
          activity={a}
          dayNumber={day.day_number}
          dayLocation={day.location}
          source={a.source}
          swapped={a.swapped}
          removed={a.removed}
          editable
          tellMore={tellMore}
        />
      ))}

      <AddToDay
        dayNumber={day.day_number}
        dayLocation={day.location}
        decisionStyle={decisionStyle}
        onAdd={(activity) => addActivity(activity)}
      />

      <ConflictSheet
        issues={conflicts}
        onAdjust={handleAdjust}
        onLeave={handleLeave}
        onClose={() => setConflicts([])}
      />
    </div>
  );
}

function AddToDay({
  dayNumber,
  dayLocation,
  decisionStyle,
  onAdd,
}: {
  dayNumber: number;
  dayLocation: string;
  decisionStyle: DecisionStyle;
  onAdd: (activity: PlacedActivity) => void;
}) {
  const [open, setOpen] = useState(false);
  const [slot, setSlot] = useState("afternoon");
  const [type, setType] = useState<ActivityType>("activity");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-2.5 flex w-full items-center justify-center gap-1.5 rounded-[14px] border border-dashed border-accent bg-accent-light/50 py-2.5 text-[11px] font-bold text-accent transition-colors hover:bg-accent-light"
      >
        ＋ Add to this day
      </button>
    );
  }

  const pool = getAddAlternatives(dayNumber, type, optionCountFor(decisionStyle));

  function place(base: Activity) {
    const placed: PlacedActivity = {
      ...base,
      id: nextAddedId(),
      day_number: dayNumber,
      time_of_day: slot,
      area: areaFor(dayNumber, base.id ?? ""),
      user_added: true,
    };
    onAdd(placed);
    setOpen(false);
  }

  return (
    <div className="mb-2.5 rounded-[16px] border border-accent bg-accent-light/40 p-3 animate-fade-in-fast">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-bold text-text">Add to this day</div>
        <button onClick={() => setOpen(false)} className="text-[11px] text-text-light">
          ✕
        </button>
      </div>

      <div className="mb-2">
        <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.06em] text-text-light">When</div>
        <div className="flex gap-1.5">
          {TIME_SLOTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSlot(s.key)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                slot === s.key ? "bg-accent text-white" : "bg-tag text-text-mid"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-1">
        <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.06em] text-text-light">What kind</div>
        <div className="flex gap-1.5">
          {ADD_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                type === t ? "bg-accent text-white" : "bg-tag text-text-mid"
              }`}
            >
              {TYPE_ICON[t]} {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      <AlternativesPicker
        pool={pool}
        decisionStyle={decisionStyle}
        liveQuery={buildLocationQuery(type, dayLocation)}
        liveType={type}
        onPick={(alt) =>
          place({
            id: `add-${type}`,
            time_of_day: slot,
            type: alt.type,
            title: alt.title,
            description: alt.description,
            booking_required: alt.booking_required ?? false,
            estimated_cost_nzd: alt.cost_nzd,
          })
        }
        onFreeText={(text) =>
          place({
            id: `add-${type}`,
            time_of_day: slot,
            type,
            title: text,
            description: "Added by you — Voyager doesn't have local detail on this one yet.",
            booking_required: false,
          })
        }
        onCancel={() => setOpen(false)}
        freeTextLabel="Or tell Voyager exactly what you'd like"
        freeTextPlaceholder="e.g. golf at Peregian, a specific café…"
      />
    </div>
  );
}
