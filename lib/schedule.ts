import type { Activity, Area, ConflictIssue, Day, PlacedActivity } from "@/types";

/**
 * Shared itinerary-editing engine — powers Add, Remove and Swap (POC_followup_prompt.md
 * item 1) with one consistent conflict-checking pass across all three. Nothing here ever
 * silently rearranges a day; it only ever proposes, for the caller to confirm or decline.
 */

/* ---------------- Areas & travel time ---------------- */

// Every activity in the base itinerary happens in one of these zones. New/swapped
// activities inherit the day's default zone unless the caller says otherwise.
const DAY_DEFAULT_AREA: Record<number, Area> = {
  1: "noosa_heads",
  2: "noosa_heads",
  3: "noosa_river",
  4: "hinterland",
  5: "noosa_heads",
  6: "noosa_river",
  7: "noosa_heads",
  8: "noosa_heads",
};

// Exceptions — activities that happen somewhere other than their day's default zone.
const ACTIVITY_AREA_OVERRIDES: Record<string, Area> = {
  "d1-flight": "airport",
  "d1-car": "airport",
  "d4-dinner": "noosa_river", // Rococo, Noosa Sound
  "d5-carback": "noosa_river", // depot at Noosaville
  "d6-sunshine": "sunshine_beach",
  "d6-dinner": "sunshine_beach",
  "d8-transfer": "airport",
  "d8-flight": "airport",
};

const AREA_LABEL: Record<Area, string> = {
  noosa_heads: "Noosa Heads",
  noosa_river: "the river / Noosaville",
  hinterland: "the hinterland",
  noosa_marina: "the Marina",
  sunshine_beach: "Sunshine Beach",
  airport: "the airport",
};

// Rough drive times in minutes between zones (symmetric). Approximate but grounded in
// the real geography — good enough to explain a genuine clash without needing live maps.
const TRAVEL_MINUTES: Record<Area, Partial<Record<Area, number>>> = {
  noosa_heads: { noosa_river: 10, hinterland: 40, noosa_marina: 8, sunshine_beach: 12, airport: 35 },
  noosa_river: { noosa_heads: 10, hinterland: 35, noosa_marina: 12, sunshine_beach: 18, airport: 30 },
  hinterland: { noosa_heads: 40, noosa_river: 35, noosa_marina: 42, sunshine_beach: 45, airport: 45 },
  noosa_marina: { noosa_heads: 8, noosa_river: 12, hinterland: 42, sunshine_beach: 15, airport: 38 },
  sunshine_beach: { noosa_heads: 12, noosa_river: 18, hinterland: 45, noosa_marina: 15, airport: 40 },
  airport: { noosa_heads: 35, noosa_river: 30, hinterland: 45, noosa_marina: 38, sunshine_beach: 40 },
};

export function areaFor(dayNumber: number, activityId: string, explicit?: Area): Area {
  return explicit ?? ACTIVITY_AREA_OVERRIDES[activityId] ?? DAY_DEFAULT_AREA[dayNumber] ?? "noosa_heads";
}

function travelMinutes(a: Area, b: Area): number {
  if (a === b) return 5;
  return TRAVEL_MINUTES[a]?.[b] ?? 30;
}

/* ---------------- Time parsing ---------------- */

const BUCKET_MINUTES: Record<string, number> = {
  morning: 9 * 60,
  midday: 12 * 60,
  afternoon: 15 * 60,
  evening: 18 * 60 + 30,
  night: 20 * 60 + 30,
};

export function timeToMinutes(t: string): number {
  const exact = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (exact) return Number(exact[1]) * 60 + Number(exact[2]);
  const key = t.trim().toLowerCase();
  return BUCKET_MINUTES[key] ?? BUCKET_MINUTES.afternoon;
}

export function minutesToLabel(mins: number): string {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const period = h24 >= 12 ? "pm" : "am";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")}${period}`;
}

/** 24-hour "HH:MM", matching the format Activity.time_of_day uses everywhere else. */
export function minutesTo24h(mins: number): string {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Deliberately conservative — these model "how long before the next thing is fair game",
// not a realistic full duration. Noosa Days is a fast-paced, hand-paced itinerary where
// consecutive activities often flow into each other (a coffee run before a walk, a lookout
// stop on the way to lunch); a generous duration here would flag that intentional pacing as
// a false "conflict". Only flights get a real duration, since nothing else can happen mid-air.
const DEFAULT_DURATION: Record<Activity["type"], number> = {
  flight: 180,
  hotel: 15,
  rail: 30,
  car: 15,
  activity: 45,
  dining: 45,
  transfer: 30,
};

/* ---------------- Effective day (base + edits, merged) ---------------- */

export interface EffectiveActivity extends Activity {
  day_number: number;
  area: Area;
  source: "original" | "added";
  swapped: boolean;
  removed: boolean;
  startMinutes: number;
}

export interface DayEdits {
  removedIds: string[];
  swaps: Record<string, Activity>; // original activity id -> replacement (id preserved)
  added: PlacedActivity[];
  timeOverrides: Record<string, string>;
}

/**
 * Merges the base day with the traveller's edits into one time-sorted list, for rendering.
 * Removed originals are kept (flagged `removed`) so their gap renders in the right place —
 * use `getEffectiveDay` (which filters them out) for conflict checking.
 */
export function getDayView(
  day: Day,
  edits: Pick<DayEdits, "removedIds" | "swaps" | "added" | "timeOverrides">,
): EffectiveActivity[] {
  const originals: EffectiveActivity[] = day.activities.map((a) => {
    const swap = edits.swaps[a.id];
    const effective = swap ? { ...a, ...swap, id: a.id } : a;
    const time = edits.timeOverrides[a.id] ?? effective.time_of_day;
    return {
      ...effective,
      time_of_day: time,
      day_number: day.day_number,
      area: areaFor(day.day_number, a.id, effective.area),
      source: "original" as const,
      swapped: Boolean(swap),
      removed: edits.removedIds.includes(a.id),
      startMinutes: timeToMinutes(time),
    };
  });

  const added: EffectiveActivity[] = edits.added
    .filter((a) => a.day_number === day.day_number)
    .map((a) => {
      const time = edits.timeOverrides[a.id] ?? a.time_of_day;
      return {
        ...a,
        time_of_day: time,
        area: areaFor(day.day_number, a.id, a.area),
        source: "added" as const,
        swapped: false,
        removed: false,
        startMinutes: timeToMinutes(time),
      };
    });

  return [...originals, ...added].sort((a, b) => a.startMinutes - b.startMinutes);
}

/** Same as getDayView but excludes removed activities — the real, conflict-checkable schedule. */
export function getEffectiveDay(
  day: Day,
  edits: Pick<DayEdits, "removedIds" | "swaps" | "added" | "timeOverrides">,
): EffectiveActivity[] {
  return getDayView(day, edits).filter((a) => !a.removed);
}

/* ---------------- Conflict detection ---------------- */

const FIXED_TYPES: Activity["type"][] = ["flight", "hotel", "rail"];

/**
 * Checks one day's effective activity list for problems. Deliberately conservative —
 * only flags things a well-travelled friend would actually raise, never silently fixes them.
 *
 * When `focusIds` is given, only issues touching one of those ids are returned — so editing
 * one activity never re-surfaces pre-existing (intentional) tight pacing elsewhere in the day.
 */
export function detectConflicts(activities: EffectiveActivity[], focusIds?: string[]): ConflictIssue[] {
  const issues: ConflictIssue[] = [];
  const sorted = [...activities].sort((a, b) => a.startMinutes - b.startMinutes);

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const aEnd = a.startMinutes + (DEFAULT_DURATION[a.type] ?? 90);
    const gap = b.startMinutes - aEnd;

    if (gap < 0) {
      const fixedInvolved = FIXED_TYPES.includes(a.type) || FIXED_TYPES.includes(b.type);
      const proposedStart = aEnd + 10;
      issues.push({
        kind: fixedInvolved ? "fixed_clash" : "overlap",
        message: fixedInvolved
          ? `${b.title} clashes with ${a.title}`
          : `${b.title} overlaps with ${a.title}`,
        detail: `${a.title} runs to about ${minutesToLabel(aEnd)}, but ${b.title} is set for ${minutesToLabel(
          b.startMinutes,
        )} — that's ${Math.abs(gap)} minutes short.`,
        activityIds: [a.id, b.id],
        proposal: {
          activityId: b.id,
          activityTitle: b.title,
          newTime: minutesTo24h(proposedStart),
          label: `Move ${b.title} to ${minutesToLabel(proposedStart)}`,
        },
      });
      continue;
    }

    if (a.area !== b.area) {
      const needed = travelMinutes(a.area, b.area);
      if (gap < needed) {
        const proposedStart = aEnd + needed + 5;
        issues.push({
          kind: "distance",
          message: `Tight to get from ${AREA_LABEL[a.area]} to ${AREA_LABEL[b.area]} in time`,
          detail: `That's roughly a ${needed}-minute drive from ${a.title}, but you've only got ${Math.max(
            0,
            gap,
          )} minutes before ${b.title}.`,
          activityIds: [a.id, b.id],
          proposal: {
            activityId: b.id,
            activityTitle: b.title,
            newTime: minutesTo24h(proposedStart),
            label: `Push ${b.title} back to ${minutesToLabel(proposedStart)}`,
          },
        });
      }
    }
  }

  if (!focusIds) return issues;
  return issues.filter((issue) => issue.activityIds.some((id) => focusIds.includes(id)));
}
