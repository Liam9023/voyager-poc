import type { ActivityType } from "@/types";

/**
 * Curated swap alternatives. When a user swaps an activity, Voyager offers a real,
 * locally-informed replacement — drawing on the same Noosa knowledge that built the
 * original (PRD 4.1d). Keyed by activity id where we have a great specific swap,
 * with sensible per-type fallbacks otherwise.
 */
export interface Alternative {
  title: string;
  description: string;
  type: ActivityType;
}

export const ALTERNATIVES: Record<string, Alternative> = {
  // Day 2 — National Park
  "d2-coffee": {
    title: "Coffee at Clandestino, then walk in",
    description:
      "Clandestino Roasters do some of the best coffee on the coast. Grab a takeaway and stroll to the national park entrance at the end of Hastings Street.",
    type: "dining",
  },
  "d2-lunch": {
    title: "Lunch at Sails on the beach",
    description:
      "Swap the surf club for something smarter — Sails sits right where Hastings Street meets the sand. A dozen oysters and a glass of something cold after the walk.",
    type: "dining",
  },
  "d2-dinner": {
    title: "Dinner at Season Restaurant",
    description:
      "If Locale is booked out, Season is the beachfront alternative on Hastings Street — big windows onto Main Beach and a fresh, light menu that does the Sunshine Coast thing very well.",
    type: "dining",
  },
  "d2-afternoon": {
    title: "Afternoon at Little Cove",
    description:
      "Skip the gelato queue and walk five minutes to Little Cove — a tiny, sheltered, locals' beach tucked under the national park. Quieter than Main Beach and lovely late in the day.",
    type: "activity",
  },
  // Day 1
  "d1-dinner": {
    title: "Dinner at Locale Noosa",
    description:
      "Make night one the big one — handmade pasta and a serious wine list just off Hastings Street. Book ahead; it's the table everyone wants.",
    type: "dining",
  },
  // Day 6
  "d6-dinner": {
    title: "Dinner at Embassy XO, Sunshine Beach",
    description:
      "Another standout over the hill — refined modern Chinese, a tasting menu worth doing, and a quieter room than Sum Yung Guys next door.",
    type: "dining",
  },
};

const FALLBACK: Record<string, Alternative> = {
  dining: {
    title: "Dinner at Rococo on the river",
    description:
      "Relaxed riverside Mediterranean on Noosa Sound with the sunset over the water — book the deck.",
    type: "dining",
  },
  activity: {
    title: "Sunset SUP on the Noosa River",
    description:
      "Swap it for a paddle on the flat river as the light goes — boards by the hour from Gympie Terrace, no experience needed.",
    type: "activity",
  },
};

export function getAlternative(id: string, type: ActivityType): Alternative {
  return (
    ALTERNATIVES[id] ??
    FALLBACK[type] ?? {
      title: "An alternative for this slot",
      description:
        "Voyager can line up another option that fits the day — tell Ask what you'd prefer and it'll swap it in.",
      type,
    }
  );
}
