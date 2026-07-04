/**
 * Unsplash integration — free hero photos for day cards (POC_followup_prompt.md item 13).
 * Deliberately NOT Google Places photos, which sit in the same expensive pricing tier as the
 * review snippets skipped in item 11.
 *
 * Server-only — never import this from a client component. Caches per query in memory for
 * 24 hours so re-renders and repeat sessions during a demo don't re-hit the API needlessly
 * (Unsplash's free tier is rate-limited per hour).
 */

export interface UnsplashPhoto {
  /** Direct, hotlinkable image URL — per Unsplash's API terms, never download/re-host this. */
  url: string;
  altDescription?: string;
  photographerName: string;
  photographerProfileUrl: string;
  /** Ping this (via `trackUnsplashDownload`) when the photo is actually displayed — required by Unsplash's API guidelines, distinct from a real file download. */
  downloadLocation?: string;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; photo: UnsplashPhoto | null }>();

export function unsplashConfigured(): boolean {
  return Boolean(process.env.UNSPLASH_ACCESS_KEY);
}

interface UnsplashSearchResult {
  results?: Array<{
    urls?: { regular?: string; small?: string };
    alt_description?: string;
    user?: { name?: string; links?: { html?: string } };
    links?: { download_location?: string };
  }>;
}

export async function searchDayPhoto(query: string): Promise<UnsplashPhoto | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || !query.trim()) return null;

  const cacheKey = query.trim().toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.photo;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } },
    );
    if (!res.ok) {
      cache.set(cacheKey, { at: Date.now(), photo: null });
      return null;
    }
    const data = (await res.json()) as UnsplashSearchResult;
    const first = data.results?.[0];
    if (!first?.urls?.regular && !first?.urls?.small) {
      cache.set(cacheKey, { at: Date.now(), photo: null });
      return null;
    }
    const photo: UnsplashPhoto = {
      url: (first.urls!.regular ?? first.urls!.small)!,
      altDescription: first.alt_description ?? undefined,
      photographerName: first.user?.name ?? "Unsplash",
      photographerProfileUrl: first.user?.links?.html ?? "https://unsplash.com",
      downloadLocation: first.links?.download_location,
    };
    cache.set(cacheKey, { at: Date.now(), photo });
    return photo;
  } catch {
    return null;
  }
}

/** Required by Unsplash's API guidelines whenever a photo fetched via the API is displayed. */
export async function trackUnsplashDownload(downloadLocation: string): Promise<void> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || !downloadLocation) return;
  try {
    await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${accessKey}` } });
  } catch {
    // best-effort — never block the UI on this
  }
}
