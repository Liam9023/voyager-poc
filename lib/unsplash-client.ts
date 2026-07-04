"use client";

export interface DayPhoto {
  url: string;
  altDescription?: string;
  photographerName: string;
  photographerProfileUrl: string;
  downloadLocation?: string;
}

// Module-level cache — persists across DayCard mounts/re-renders for the life of the tab,
// so switching days back and forth never re-fetches the same photo (item 13).
const cache = new Map<string, DayPhoto | null>();
const pinged = new Set<string>();

export async function fetchDayPhoto(query: string): Promise<DayPhoto | null> {
  if (cache.has(query)) return cache.get(query) ?? null;
  try {
    const res = await fetch(`/api/day-photo?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      cache.set(query, null);
      return null;
    }
    const data = (await res.json()) as { photo: DayPhoto | null };
    cache.set(query, data.photo ?? null);
    return data.photo ?? null;
  } catch {
    cache.set(query, null);
    return null;
  }
}

/** Fires the required Unsplash download-tracking ping once per photo per session. */
export function trackDayPhotoDisplay(downloadLocation?: string): void {
  if (!downloadLocation || pinged.has(downloadLocation)) return;
  pinged.add(downloadLocation);
  fetch("/api/day-photo/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ downloadLocation }),
  }).catch(() => {});
}
