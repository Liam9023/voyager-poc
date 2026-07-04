"use client";

import { useEffect, useState } from "react";
import { fetchDayPhoto, trackDayPhotoDisplay, type DayPhoto } from "@/lib/unsplash-client";

const UTM = "?utm_source=voyager_poc&utm_medium=referral";

function GradientPlaceholder() {
  return (
    <div className="flex h-24 w-full items-center justify-center bg-gradient-to-br from-hero to-hero-alt text-lg text-white/50">
      ✈️
    </div>
  );
}

/**
 * A free visual anchor for a day card — a photo evoking the day's location/theme, not a
 * literal photo of a specific venue (POC_followup_prompt.md item 13). `query: null` (a
 * travel/logistics day with no destination content of its own, e.g. the departure day) skips
 * the Unsplash call entirely and shows a plain gradient instead of forcing an unrelated photo.
 * A resolved-but-empty search also falls back to the gradient, so every day card has a
 * consistent visual regardless of what Unsplash returns.
 */
export default function DayHeroPhoto({ query, alt }: { query: string | null; alt: string }) {
  const [photo, setPhoto] = useState<DayPhoto | null | undefined>(query ? undefined : null);

  useEffect(() => {
    if (!query) {
      setPhoto(null);
      return;
    }
    let cancelled = false;
    setPhoto(undefined);
    fetchDayPhoto(query).then((p) => {
      if (!cancelled) setPhoto(p);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (photo === undefined) return null; // resolving — no flicker of a placeholder then a swap
  if (photo === null) return <GradientPlaceholder />;

  return (
    <div className="relative h-24 w-full overflow-hidden bg-tag">
      {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked per Unsplash API terms, never re-hosted */}
      <img
        src={photo.url}
        alt={photo.altDescription || alt}
        className="h-full w-full object-cover"
        onLoad={() => trackDayPhotoDisplay(photo.downloadLocation)}
      />
      {/* Small, low-contrast credit strip — Unsplash's terms require attribution, but it
          shouldn't read as a bar across the photo. */}
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute bottom-0.5 right-1.5 text-[7px] font-medium text-white/60">
        Photo:{" "}
        <a
          href={`${photo.photographerProfileUrl}${UTM}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/90 hover:underline"
        >
          {photo.photographerName}
        </a>{" "}
        /{" "}
        <a
          href={`https://unsplash.com${UTM}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/90 hover:underline"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}
