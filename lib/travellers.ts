/**
 * The Noosa trip's travellers (POC_followup_prompt.md item 15). This POC doesn't have a real
 * multi-user account model — matches the "Liam (owner) · Sarah · 2 on this trip" shown in
 * Settings > Travellers.
 */
export const TRIP_TRAVELLERS = ["Liam", "Sarah"] as const;
export type TravellerName = (typeof TRIP_TRAVELLERS)[number];
