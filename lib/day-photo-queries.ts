/**
 * Per-day Unsplash search queries for the day-card hero photo (item 13, revised after
 * live testing). A single location-based query per day ("Noosa Heads, Queensland, Australia")
 * returned the same handful of cached results for every day sharing that location — these are
 * hand-picked per day's actual theme instead, so each day gets a distinct, relevant image.
 *
 * Day 8 is a travel/departure day with no destination content of its own — `null` means
 * DayHeroPhoto skips the Unsplash call entirely and renders a plain gradient placeholder.
 */
export const DAY_PHOTO_QUERIES: Record<number, string | null> = {
  1: "Noosa Main Beach",
  2: "Noosa National Park",
  3: "Everglades kayak",
  4: "farmers market stalls",
  5: "palm trees beach promenade",
  6: "stand up paddleboard river",
  7: "green headland ocean view",
  8: null,
};
