// Voyager — core types. Mirrors the ItinerarySchema in the Technical Specification (Section 4.1).

export type ActivityType =
  | "flight"
  | "hotel"
  | "rail"
  | "car"
  | "activity"
  | "dining"
  | "transfer";

export interface Activity {
  id: string;
  time_of_day: string; // "09:00" or "morning"
  type: ActivityType;
  title: string;
  description: string; // specific, locally informed detail
  booking_required: boolean;
  booking_notes?: string;
  estimated_cost_nzd?: number;
  /** Marks the venue/price-bearing recommendation that anchors the day (used for emphasis). */
  highlight?: boolean;
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
