import { NOOSA_ITINERARY as IT } from "@/lib/itinerary";
import type { Activity, Booking } from "@/types";

/**
 * Real, correctly pre-filled booking deep links (POC_followup_prompt.md items 7 & 8).
 * Every category gets a genuinely working search/booking URL, never a placeholder button.
 * Provider names never appear in UI copy (CLAUDE.md rule 3) — the label is always "Book"/
 * "Flights"/"Hotels"/"Activities", only the destination URL differs.
 *
 * Only Booking.com, Viator and Google's own search/flights surfaces have publicly documented,
 * stable query-parameter formats we can construct without an API key or partner account —
 * so those are used directly. Everything else (dining reservations, taxi transfers, rail —
 * none of which appear in this itinerary, and Omio's search needs internal city IDs we can't
 * derive from a name) falls back to a general search link per item 7, rather than ship a
 * deep link we can't verify actually resolves.
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

/** Car hire — no generic API-free deep link exists, so a dated, located Google search. */
export function carHireUrl(dayNumber: number): string {
  const q = `car hire Sunshine Coast Airport ${dayDate(dayNumber)}`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

/** Item 7 fallback — for anything without clean provider coverage. */
export function fallbackSearchUrl(title: string, context = DEST_REGION): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${title} ${context}`)}`;
}

export function bookingUrlForActivity(activity: Activity, dayNumber: number): string {
  switch (activity.type) {
    case "flight":
      return googleFlightsUrl(dayNumber);
    case "hotel":
      return bookingComUrl();
    case "car":
      return carHireUrl(dayNumber);
    case "activity":
      return viatorUrl(activity.title);
    case "rail":
    case "transfer":
    case "dining":
    default:
      return fallbackSearchUrl(activity.title);
  }
}

export function bookingUrlForBooking(booking: Booking): string {
  switch (booking.type) {
    case "flight":
      return googleFlightsUrl(booking.day);
    case "hotel":
      return bookingComUrl();
    case "car":
      return carHireUrl(booking.day);
    case "activity":
      return viatorUrl(booking.title);
    default:
      return fallbackSearchUrl(booking.title);
  }
}
