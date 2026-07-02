import type { ActivityType, DecisionStyle } from "@/types";

/**
 * Curated swap/add alternatives. When a user swaps an activity, removes one, or adds a
 * new one, Voyager offers real, locally-informed options — drawing on the same Noosa
 * knowledge that built the original (PRD 4.1d). Once lib/places-service.ts is wired in
 * (item 5), these curated picks stay as the offline fallback and Places results are
 * preferred where available — same shape, same call sites.
 */
export interface Alternative {
  title: string;
  description: string;
  type: ActivityType;
  cost_nzd?: number;
  booking_required?: boolean;
}

// Swap-in-place options, keyed by the activity id being swapped. Ordered best-first —
// "decide for me" always takes index 0.
const SWAP_POOL: Record<string, Alternative[]> = {
  "d2-coffee": [
    {
      title: "Coffee at Clandestino, then walk in",
      description:
        "Clandestino Roasters do some of the best coffee on the coast. Grab a takeaway and stroll to the national park entrance at the end of Hastings Street.",
      type: "dining",
      cost_nzd: 20,
    },
    {
      title: "Coffee at Aromas, Hastings Street",
      description:
        "Right on the main strip with outdoor tables — less of a local secret than Clandestino but easier if you're starting from the Netanya end of the street.",
      type: "dining",
      cost_nzd: 18,
    },
  ],
  "d2-lunch": [
    {
      title: "Lunch at Sails on the beach",
      description:
        "Swap the surf club for something smarter — Sails sits right where Hastings Street meets the sand. A dozen oysters and a glass of something cold after the walk.",
      type: "dining",
      cost_nzd: 220,
      booking_required: true,
    },
    {
      title: "Poke bowls at Little Pearl",
      description:
        "Quick, fresh, and a five-minute walk from the park entrance — the better call if you don't want a sit-down lunch eating into beach time.",
      type: "dining",
      cost_nzd: 45,
    },
  ],
  "d2-dinner": [
    {
      title: "Dinner at Season Restaurant",
      description:
        "If Locale is booked out, Season is the beachfront alternative on Hastings Street — big windows onto Main Beach and a fresh, light menu that does the Sunshine Coast thing very well.",
      type: "dining",
      cost_nzd: 130,
      booking_required: true,
    },
    {
      title: "Dinner at Wasabi, Noosa Sound",
      description:
        "A step up from typical resort-town Japanese — degustation-quality sashimi with a river view. Bookable, a little more formal than Locale.",
      type: "dining",
      cost_nzd: 210,
      booking_required: true,
    },
  ],
  "d2-afternoon": [
    {
      title: "Afternoon at Little Cove",
      description:
        "Skip the gelato queue and walk five minutes to Little Cove — a tiny, sheltered, locals' beach tucked under the national park. Quieter than Main Beach and lovely late in the day.",
      type: "activity",
    },
    {
      title: "Noosa Marina wander + ice cream",
      description:
        "A short drive to the Marina for a slower, boat-watching kind of afternoon — less crowded than Hastings Street in peak season.",
      type: "activity",
      cost_nzd: 15,
    },
  ],
  "d1-dinner": [
    {
      title: "Dinner at Locale Noosa",
      description:
        "Make night one the big one — handmade pasta and a serious wine list just off Hastings Street. Book ahead; it's the table everyone wants.",
      type: "dining",
      cost_nzd: 200,
      booking_required: true,
    },
    {
      title: "Dinner at Wasabi, Noosa Sound",
      description: "Excellent sashimi and a river view — a quieter first night than the Hastings Street strip.",
      type: "dining",
      cost_nzd: 190,
      booking_required: true,
    },
  ],
  "d6-dinner": [
    {
      title: "Dinner at Embassy XO, Sunshine Beach",
      description:
        "Another standout over the hill — refined modern Chinese, a tasting menu worth doing, and a quieter room than Sum Yung Guys next door.",
      type: "dining",
      cost_nzd: 210,
      booking_required: true,
    },
    {
      title: "Dinner at Betty's Burgers, Sunshine Beach",
      description: "Far more casual if you want to save the big meal for another night — reliably good, no fuss.",
      type: "dining",
      cost_nzd: 60,
    },
  ],
};

const SWAP_FALLBACK: Record<string, Alternative[]> = {
  dining: [
    {
      title: "Dinner at Rococo on the river",
      description:
        "Relaxed riverside Mediterranean on Noosa Sound with the sunset over the water — book the deck.",
      type: "dining",
      cost_nzd: 140,
      booking_required: true,
    },
    {
      title: "Casual noodles at Sum Yung Guys' sister spot",
      description: "Same kitchen team, faster and cheaper — a good option if the full restaurant's booked out.",
      type: "dining",
      cost_nzd: 55,
    },
  ],
  activity: [
    {
      title: "Sunset SUP on the Noosa River",
      description:
        "Swap it for a paddle on the flat river as the light goes — boards by the hour from Gympie Terrace, no experience needed.",
      type: "activity",
      cost_nzd: 50,
    },
    {
      title: "Noosa Marina stroll",
      description: "A flat, easy wander past the boats — a good lower-key option than a full activity block.",
      type: "activity",
    },
  ],
};

// Day/category-scoped ideas for the Add flow — genuinely different from anything already
// booked that day, so Add never just re-suggests what's already on the itinerary.
const ADD_POOL: Partial<Record<number, Partial<Record<ActivityType, Alternative[]>>>> = {
  1: {
    dining: [
      {
        title: "Casual fish and chips at the Noosa Boathouse",
        description: "An easy, no-booking option if Bistro C's queue is out the door on arrival night.",
        type: "dining",
        cost_nzd: 60,
      },
    ],
  },
  2: {
    activity: [
      {
        title: "Noosa Marina sunset stroll",
        description: "A flatter, shorter alternative to the Coastal Track if you want to keep the day easy.",
        type: "activity",
      },
    ],
  },
  3: {
    dining: [
      {
        title: "Picnic from the Boreen Point General Store",
        description: "Grab supplies before you launch — a simpler alternative to the tour-provided lunch.",
        type: "dining",
        cost_nzd: 30,
      },
    ],
  },
  4: {
    activity: [
      {
        title: "Kenilworth cheese factory detour",
        description: "Swap Maleny Dairies for the famous Kenilworth cheese and the over-the-top bakery doughnuts.",
        type: "activity",
        cost_nzd: 20,
      },
    ],
  },
  5: {
    activity: [
      {
        title: "Noosa Chocolate Factory tasting",
        description: "A short, air-conditioned break from the Hastings Street browse — good on a hot afternoon.",
        type: "activity",
        cost_nzd: 20,
      },
    ],
  },
  6: {
    dining: [
      {
        title: "Coffee and cake at Locale's café side",
        description: "A lighter option between the boat and Sunshine Beach if lunch on Gympie Terrace feels like too much.",
        type: "dining",
        cost_nzd: 25,
      },
    ],
  },
  7: {
    activity: [
      {
        title: "Bribie or Noosa Marina day-out swap",
        description: "If you've done the park twice already, a slower Marina wander makes a nice change of scene.",
        type: "activity",
      },
    ],
  },
};

const GENERIC_ADD: Partial<Record<ActivityType, Alternative[]>> = {
  dining: [
    {
      title: "Casual bite at the Noosa Junction food strip",
      description: "A few minutes back from the beach, less touristy, and easy without a booking.",
      type: "dining",
      cost_nzd: 40,
    },
  ],
  activity: [
    {
      title: "Free afternoon by Laguna Bay",
      description: "Sometimes the best plan is no plan — a stretch of sand and nowhere to be.",
      type: "activity",
    },
  ],
};

/** How many options to surface for a given decision style. */
export function optionCountFor(style: DecisionStyle): number {
  if (style === "decide_for_me") return 1;
  if (style === "know_what_i_want") return 2; // shown collapsed/secondary behind free text
  return 3;
}

/** Swap: alternatives for the exact slot being replaced (same day, same time-of-day, same category). */
export function getSwapAlternatives(activityId: string, type: ActivityType, count: number): Alternative[] {
  const curated = SWAP_POOL[activityId] ?? [];
  const fallback = SWAP_FALLBACK[type] ?? [];
  const pool = [...curated, ...fallback.filter((f) => !curated.some((c) => c.title === f.title))];
  if (pool.length === 0) {
    pool.push({
      title: "An alternative for this slot",
      description:
        "Voyager can line up another option that fits the day — tell Ask what you'd prefer and it'll swap it in.",
      type,
    });
  }
  return pool.slice(0, Math.max(1, count));
}

/** Add: ideas for a new activity on a given day, filtered by category. */
export function getAddAlternatives(dayNumber: number, type: ActivityType, count: number): Alternative[] {
  const curated = ADD_POOL[dayNumber]?.[type] ?? [];
  const generic = (GENERIC_ADD[type] ?? []).filter((g) => !curated.some((c) => c.title === g.title));
  const pool = [...curated, ...generic];
  if (pool.length === 0) {
    pool.push({
      title: "Tell Voyager what you're after",
      description: "Nothing curated for this slot yet — describe what you'd like and Voyager will find it.",
      type,
    });
  }
  return pool.slice(0, Math.max(1, count));
}

// Back-compat single-alternative accessor, still used where only one suggestion is needed.
export function getAlternative(id: string, type: ActivityType): Alternative {
  return getSwapAlternatives(id, type, 1)[0];
}
