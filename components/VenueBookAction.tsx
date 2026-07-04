"use client";

import { useEffect, useState } from "react";
import { fetchVenueLookup } from "@/lib/places-client";
import type { PlaceResult } from "@/lib/places-service";
import BookLink from "@/components/BookLink";

/**
 * Resolves a real booking action for venues without a clean provider deep link — dining, car
 * hire, rail, transfers (POC_followup_prompt.md item 1, "found during live testing"). Priority
 * order, using live Places data:
 *   1. Venue's own website
 *   2. Its Google Maps listing (often has a direct "reserve a table" option)
 *   3. Its phone number, shown as a tappable "Call to book" action
 *   4. Nothing — never falls back to a plain search results page.
 */
export default function VenueBookAction({
  query,
  onBook,
  className = "",
}: {
  /** The Places text-search query to resolve — caller decides how best to phrase this per category. */
  query: string;
  onBook?: () => void;
  className?: string;
}) {
  const [place, setPlace] = useState<PlaceResult | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setPlace(undefined);
    fetchVenueLookup(query).then((result) => {
      if (!cancelled) setPlace(result);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (place === undefined) return null; // resolving — no flicker of a fake action
  if (!place) return null; // nothing bookable found — venue info only, no fake button

  if (place.websiteUri) {
    return <BookLink href={place.websiteUri} onBook={onBook} className={className} />;
  }
  if (place.googleMapsUri) {
    return <BookLink href={place.googleMapsUri} onBook={onBook} className={className} />;
  }
  if (place.nationalPhoneNumber) {
    return (
      <a
        href={`tel:${place.nationalPhoneNumber}`}
        onClick={onBook}
        className={`inline-flex shrink-0 items-center gap-1 rounded-lg bg-accent px-3 py-1 text-[10px] font-bold text-white transition-colors hover:bg-accent-dark ${className}`}
      >
        📞 Call to book
      </a>
    );
  }
  return null;
}
