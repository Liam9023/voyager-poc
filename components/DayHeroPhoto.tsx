"use client";

import { useEffect, useState } from "react";
import { fetchDayPhoto, trackDayPhotoDisplay, type DayPhoto } from "@/lib/unsplash-client";

const UTM = "?utm_source=voyager_poc&utm_medium=referral";

/**
 * A free visual anchor for a day card — a photo evoking the day's location/theme, not a
 * literal photo of a specific venue (POC_followup_prompt.md item 13). Renders nothing while
 * resolving or if no match is found, so a day card never shows a broken-image placeholder.
 */
export default function DayHeroPhoto({ query, alt }: { query: string; alt: string }) {
  const [photo, setPhoto] = useState<DayPhoto | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchDayPhoto(query).then((p) => {
      if (!cancelled) setPhoto(p);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!photo) return null;

  return (
    <div className="relative h-24 w-full overflow-hidden bg-tag">
      {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked per Unsplash API terms, never re-hosted */}
      <img
        src={photo.url}
        alt={photo.altDescription || alt}
        className="h-full w-full object-cover"
        onLoad={() => trackDayPhotoDisplay(photo.downloadLocation)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
      <div className="absolute bottom-1 right-1.5 text-[8px] font-medium text-white/85">
        Photo:{" "}
        <a
          href={`${photo.photographerProfileUrl}${UTM}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:underline"
        >
          {photo.photographerName}
        </a>{" "}
        /{" "}
        <a
          href={`https://unsplash.com${UTM}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:underline"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}
