// Voyager — core types. Mirrors the ItinerarySchema in the Technical Specification (Section 4.1).

export type ActivityType =
  | "flight"
  | "hotel"
  | "rail"
  | "car"
  | "activity"
  | "dining"
  | "transfer";

/** Coarse geographic zone used for lightweight "unrealistic travel distance" conflict checks. */
export type Area =
  | "noosa_heads"
  | "noosa_river"
  | "hinterland"
  | "noosa_marina"
  | "sunshine_beach"
  | "airport";

export interface Activity {
  id: string;
  time_of_day: string; // "09:00" or "morning"/"afternoon"/"evening"
  type: ActivityType;
  title: string;
  description: string; // specific, locally informed detail
  booking_required: boolean;
  booking_notes?: string;
  estimated_cost_nzd?: number;
  /** Marks the venue/price-bearing recommendation that anchors the day (used for emphasis). */
  highlight?: boolean;
  /** Coarse zone for travel-distance conflict checks; defaults to the day's own location if unset. */
  area?: Area;
  /** Real Places data, only present when this activity came from a live swap/add pick (item 11). */
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  googleMapsUri?: string;
}

export interface Day {
  day_number: number;
  date: string; // YYYY-MM-DD
  weekday: string; // e.g. "Sunday"
  title: string;
  location: string;
  country_code: string;
  summary: string; // day-level local insight
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  title: string;
  summary: string;
  origin: string;
  destination: string;
  destinations: string[];
  country_codes: string[];
  start_date: string;
  end_date: string;
  nights: number;
  party_size: number;
  travel_style: string;
  budget_tier: string;
  estimated_value_nzd: number;
  base_rate: number; // 0.0075
  complexity_multiplier: number;
  complexity_tier: string; // e.g. "Moderate"
  voyager_fee_nzd: number;
  sample_day_number: number;
  highlights: string[]; // chips shown on the preview "what's included"
  days: Day[];
}

export type BookingStatus = "confirmed" | "to_book";

export interface Booking {
  id: string;
  type: ActivityType | "other";
  icon: string;
  title: string;
  detail: string;
  status: BookingStatus;
  ref: string | null;
  day: number;
  cost_nzd?: number;
  /** True for bookings the traveller entered by hand (Bookings tab > Add manually). */
  manual?: boolean;
}

export interface AddOn {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  priceNote: string;
  cta: string;
  tag?: string;
  cost: number;
}

export interface AskMessage {
  role: "user" | "assistant";
  content: string;
}

export type DietaryTag = "vegetarian" | "vegan" | "gluten_free";

export interface Preferences {
  homeAirport: string;
  preferredAirlines: string;
  dietary: DietaryTag[];
  allergies: string;
  foodDislikes: string;
  accessibilityNeeds: string;
  generalNotes: string;
}

/** Density of each day — see POC_followup_prompt.md item 2. */
export type Pacing = "relaxed" | "balanced" | "packed";

/** How much Voyager decides vs. the traveller, for Swap/Add/Remove-replacement flows. */
export type DecisionStyle = "decide_for_me" | "show_options" | "know_what_i_want";

/** An activity the traveller added themselves, placed onto a specific day. */
export interface PlacedActivity extends Activity {
  day_number: number;
  /** True once the id was generated client-side (all user-added activities). */
  user_added: true;
}

export type ConflictKind = "overlap" | "fixed_clash" | "distance";

export interface ConflictIssue {
  kind: ConflictKind;
  /** Short headline, e.g. "That overlaps with your Coastal Track walk". */
  message: string;
  /** Longer explanation shown in the conflict sheet. */
  detail: string;
  /** The activity ids involved, for highlighting. */
  activityIds: string[];
  /** Optional one-tap fix — shifts one of the involved activities to a clearer time. */
  proposal?: {
    activityId: string;
    activityTitle: string;
    newTime: string;
    label: string;
  };
}

/**
 * Group expense tracking — tracking and calculation only, like Splitwise. No real payment
 * processing; nothing here ever moves money (POC_followup_prompt.md item 15).
 */
export interface Expense {
  id: string;
  title: string;
  amount: number;
  /** Traveller name who paid (see lib/travellers.ts). */
  paidBy: string;
  date: string; // YYYY-MM-DD
  category?: string;
  /** Traveller names splitting this expense — defaults to all travellers, editable per expense. */
  splitWith: string[];
}
