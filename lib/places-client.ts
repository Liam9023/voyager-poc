"use client";

import type { ActivityType } from "@/types";
import type { Alternative } from "@/lib/alternatives";
import type { PlaceResult } from "@/lib/places-service";
import { priceLevelLabelClient } from "@/lib/places-format";

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
  const bits: string[] = [];
  if (p.rating) bits.push(`${p.rating}★${p.userRatingCount ? ` (${p.userRatingCount} reviews)` : ""}`);
  const price = priceLevelLabelClient(p.priceLevel);
  if (price) bits.push(price);
  const description = p.editorialSummary || (bits.length ? bits.join(" · ") : "Recommended nearby.");
  return { title: p.name, description: bits.length && p.editorialSummary ? `${p.editorialSummary} (${bits.join(" · ")})` : description, type };
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
