"use client";

import { useEffect, useState } from "react";
import type { Activity } from "@/types";
import { fetchVenueLookup, isLiveSearchable } from "@/lib/places-client";
import VenueBadge from "@/components/VenueBadge";

/**
 * Wraps `VenueBadge` with a live Places lookup for venues that don't already carry rating
 * data. Swap/Add picks already have `activity.rating` etc. attached (see `applyAlternative` in
 * ActivityRow.tsx) and are used as-is. The original hand-authored itinerary never fabricates a
 * rating, so those venues had no badge at all until now — this fetches their real rating by
 * venue name + day location, same mechanism as `VenueBookAction` (item 1), so item 11's
 * "on every venue card" requirement actually holds for the default, untouched itinerary too.
 */
export default function VenueBadgeAuto({
  activity,
  dayLocation,
  className = "",
}: {
  activity: Activity;
  dayLocation?: string;
  className?: string;
}) {
  const hasOwnData =
    activity.rating !== undefined || activity.priceLevel !== undefined || activity.googleMapsUri !== undefined;
  const [live, setLive] = useState<{
    rating?: number;
    userRatingCount?: number;
    priceLevel?: string;
    googleMapsUri?: string;
  } | null>(null);

  useEffect(() => {
    if (hasOwnData || !dayLocation || !isLiveSearchable(activity.type)) return;
    let cancelled = false;
    fetchVenueLookup(`${activity.title} ${dayLocation}`).then((result) => {
      if (!cancelled && result) {
        setLive({
          rating: result.rating,
          userRatingCount: result.userRatingCount,
          priceLevel: result.priceLevel,
          googleMapsUri: result.googleMapsUri,
        });
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id, activity.title, activity.type, dayLocation, hasOwnData]);

  const rating = activity.rating ?? live?.rating;
  const userRatingCount = activity.userRatingCount ?? live?.userRatingCount;
  const priceLevel = activity.priceLevel ?? live?.priceLevel;
  const googleMapsUri = activity.googleMapsUri ?? live?.googleMapsUri;

  return (
    <VenueBadge
      rating={rating}
      userRatingCount={userRatingCount}
      priceLevel={priceLevel}
      googleMapsUri={googleMapsUri}
      className={className}
    />
  );
}
