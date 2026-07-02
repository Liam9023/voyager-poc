/**
 * Google Places API (New) integration — real venue grounding for Voyager Ask and the
 * Swap/Add alternatives (POC_followup_prompt.md item 5).
 *
 * Cost discipline: uses a TIGHT field mask (name, rating, userRatingCount, priceLevel,
 * editorialSummary only) — never the default/broad field mask, which bills far more SKUs
 * per call. Also caches per-query results in memory for 30 minutes so repeat questions in
 * the same demo session don't re-bill the same search.
 *
 * Server-only — never import this from a client component.
 */

export interface PlaceResult {
  name: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  editorialSummary?: string;
}

const FIELD_MASK = "places.displayName,places.rating,places.userRatingCount,places.priceLevel,places.editorialSummary";
const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { at: number; results: PlaceResult[] }>();

export function placesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

/**
 * Text-search Places for real venues. Returns [] if the API key isn't configured, the
 * request fails, or nothing comes back — callers should always have a curated fallback,
 * this never throws.
 */
export async function searchPlaces(query: string, maxResults = 5): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !query.trim()) return [];

  const cacheKey = `${query.trim().toLowerCase()}::${maxResults}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.results;

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({ textQuery: query, maxResultCount: maxResults }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      places?: Array<{
        displayName?: { text?: string };
        rating?: number;
        userRatingCount?: number;
        priceLevel?: string;
        editorialSummary?: { text?: string };
      }>;
    };
    const results: PlaceResult[] = (data.places ?? [])
      .filter((p) => p.displayName?.text)
      .map((p) => ({
        name: p.displayName!.text!,
        rating: p.rating,
        userRatingCount: p.userRatingCount,
        priceLevel: p.priceLevel,
        editorialSummary: p.editorialSummary?.text,
      }));
    cache.set(cacheKey, { at: Date.now(), results });
    return results;
  } catch {
    return [];
  }
}

import { priceLevelLabelClient as priceLevelLabel } from "@/lib/places-format";
export { priceLevelLabelClient as priceLevelLabel } from "@/lib/places-format";

const PLACE_QUERY_PATTERN =
  /\b(restaurants?|cafes?|café|coffee|breakfast|brunch|lunch|dinner|eats?|foods?|bars?|drinks?|cocktails?|desserts?|bakery|bakeries|shops?|shopping|markets?|things? to do|activit(y|ies)|tours?|beach(es)?|hikes?|walks?|swims?|swimming|kayak(ing)?|paddle(board(ing)?)?|boats?|massages?|spas?|hotels?|stay(s|ing)?|accommodation|book(ing)?|reservations?)\b/i;

/** Heuristic: does this question call for a real-venue lookup rather than trip-plan chat? */
export function looksLikePlaceQuery(text: string): boolean {
  return PLACE_QUERY_PATTERN.test(text);
}

/** Formats results as a grounding block to drop into a Claude system prompt. */
export function formatPlacesForPrompt(results: PlaceResult[]): string {
  if (results.length === 0) return "";
  const lines = results.map((p, i) => {
    const bits = [p.name];
    if (p.rating) bits.push(`${p.rating}★${p.userRatingCount ? ` (${p.userRatingCount} reviews)` : ""}`);
    const price = priceLevelLabel(p.priceLevel);
    if (price) bits.push(price);
    if (p.editorialSummary) bits.push(p.editorialSummary);
    return `${i + 1}. ${bits.join(" — ")}`;
  });
  return lines.join("\n");
}
