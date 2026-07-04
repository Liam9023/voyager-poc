import { NOOSA_ITINERARY as IT } from "@/lib/itinerary";
import type { Activity, Booking } from "@/types";

/**
 * Real, correctly pre-filled booking deep links (POC_followup_prompt.md items 7 & 8).
 * Provider names never appear in UI copy (CLAUDE.md rule 3) — the label is always "Book"/
 * "Flights"/"Hotels"/"Activities", only the destination URL differs.
 *
 * Only Booking.com, Viator and Google's own flights surface have publicly documented, stable
 * query-parameter formats we can construct without an API key or partner account — so those
 * are used directly for flight/hotel/activity types.
 *
 * Everything else (dining reservations, car hire, rail, transfers) has no such provider —
 * live testing found the plain-Google-search fallback previously used for these looked broken
 * and generic (item 10, folded into item 1 below). `bookingUrlForActivity`/`bookingUrlForBooking`
 * return `null` for these types to signal the caller should resolve a real per-venue link
 * instead (website → Google Maps listing → phone → no button at all) via `VenueBookAction`,
 * using live Places data rather than a canned search URL.
 */

const ORIGIN_CITY = "Auckland";
const DEST_AIRPORT_CITY = "Sunshine Coast";
const DEST_REGION = "Noosa Heads, Queensland, Australia";
const HOTEL_NAME = "Netanya Noosa, Hastings Street, Noosa Heads";

function dayDate(dayNumber: number): string {
  return IT.days[dayNumber - 1]?.date ?? IT.start_date;
}

function isReturnLeg(dayNumber: number): boolean {
  return dayNumber >= IT.days.length;
}

/** Flights — Google Flights as the POC stand-in for a real Duffel booking flow. */
export function googleFlightsUrl(dayNumber: number): string {
  const date = dayDate(dayNumber);
  const outbound = !isReturnLeg(dayNumber);
  const from = outbound ? ORIGIN_CITY : DEST_AIRPORT_CITY;
  const to = outbound ? DEST_AIRPORT_CITY : ORIGIN_CITY;
  const q = `Flights to ${to} from ${from} on ${date}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}`;
}

/** Hotels — Booking.com, real search params (ss/checkin/checkout/guests). */
export function bookingComUrl(): string {
  const params = new URLSearchParams({
    ss: HOTEL_NAME,
    checkin: IT.start_date,
    checkout: IT.end_date,
    group_adults: String(IT.party_size),
    no_rooms: "1",
    group_children: "0",
  });
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

/** Activities — Viator free-text search. */
export function viatorUrl(activityTitle: string): string {
  const q = `${activityTitle} ${DEST_REGION}`;
  return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(q)}`;
}

/**
 * A pre-filled query for resolving a car-hire venue via live Places lookup — used by
 * `VenueBookAction`, not returned directly as a URL (item 1).
 */
export function carHireSearchQuery(dayNumber: number): string {
  return `car hire ${DEST_AIRPORT_CITY} Airport ${dayDate(dayNumber)}`;
}

/**
 * Builds the Places text-search query `VenueBookAction` should resolve for a given
 * activity/booking, for the categories with no clean provider deep link (item 1). Car hire
 * gets its own airport-anchored query since the activity's own title ("Collect the hire car")
 * isn't a venue name; everything else searches on the venue title plus its day's location.
 */
export function venueBookingQuery(type: Activity["type"] | Booking["type"], title: string, dayNumber: number, location?: string): string {
  if (type === "car") return carHireSearchQuery(dayNumber);
  return location ? `${title} ${location}` : `${title} ${DEST_REGION}`;
}

/**
 * Real deep link for flight/hotel/activity — the categories with genuine provider coverage.
 * `null` means there's no clean provider integration for this type; the caller should resolve
 * a live per-venue link instead (see `VenueBookAction`) rather than fall back to a bare search.
 */
export function bookingUrlForActivity(activity: Activity, dayNumber: number): string | null {
  switch (activity.type) {
    case "flight":
      return googleFlightsUrl(dayNumber);
    case "hotel":
      return bookingComUrl();
    case "activity":
      return viatorUrl(activity.title);
    case "car":
    case "rail":
    case "transfer":
    case "dining":
    default:
      return null;
  }
}

export function bookingUrlForBooking(booking: Booking): string | null {
  switch (booking.type) {
    case "flight":
      return googleFlightsUrl(booking.day);
    case "hotel":
      return bookingComUrl();
    case "activity":
      return viatorUrl(booking.title);
    default:
      return null;
  }
}
