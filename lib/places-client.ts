"use client";

import type { ActivityType } from "@/types";
import type { Alternative } from "@/lib/alternatives";
import type { PlaceResult } from "@/lib/places-service";

// Only these categories are meaningfully Places-searchable — logistics (flight/hotel/car/
// rail/transfer) stay on curated content.
const LIVE_TYPES: ActivityType[] = ["dining", "activity"];

export function isLiveSearchable(type: ActivityType): boolean {
  return LIVE_TYPES.includes(type);
}

/** Builds a Places text-search query for a swap/add slot, grounded to where the day actually is. */
export function buildLocationQuery(type: ActivityType, location: string): string {
  const category = type === "dining" ? "restaurants and cafes" : "things to do and local attractions";
  return `${category} near ${location}, Queensland, Australia`;
}

function toAlternative(p: PlaceResult, type: ActivityType): Alternative {
  return {
    title: p.name,
    description: p.editorialSummary || "Recommended nearby.",
    type,
    rating: p.rating,
    userRatingCount: p.userRatingCount,
    priceLevel: p.priceLevel,
    googleMapsUri: p.googleMapsUri,
  };
}

/** Fetches live, real-venue alternatives. Returns [] on any failure — caller keeps its curated fallback. */
export async function fetchLiveAlternatives(query: string, type: ActivityType, count: number): Promise<Alternative[]> {
  try {
    const res = await fetch("/api/places-alternatives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, count }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results: PlaceResult[] };
    return (data.results ?? []).map((p) => toAlternative(p, type));
  } catch {
    return [];
  }
}

/**
 * Looks up the single best-matching real venue for a booking-fallback decision
 * (POC_followup_prompt.md item 1) — used by `VenueBookAction` to find a website/Maps
 * listing/phone number for categories with no clean provider deep link. Returns null on any
 * failure or no match; caller shows no booking action rather than a fake one.
 */
export async function fetchVenueLookup(query: string): Promise<PlaceResult | null> {
  try {
    const res = await fetch("/api/places-alternatives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, count: 1 }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { results: PlaceResult[] };
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}
