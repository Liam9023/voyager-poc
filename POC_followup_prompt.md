I've tested the POC and have a refined set of fixes and additions, all scoped to this POC (not full V1). Please work through these in order.

## 1. Fix and expand itinerary editing — Add, Remove, Swap
Currently non-functional — fix all three, and build them as a shared underlying mechanism:

- **Remove**: removes the activity from state, offers a suggested replacement (respecting decision style — see item 2)
- **Swap**: opens alternatives for that exact slot — same day, same time-of-day, same category
- **Add**: NEW — available on ANY day, at ANY point in the trip lifecycle (preview, post-unlock, mid-trip), whether or not anything was removed first. User taps Add on a day, specifies what and roughly when (morning/afternoon/evening or specific time)
- **Tell Me More**: opens Ask pre-loaded with that activity's context

**Conflict checking (applies to all three actions):** after any edit, check the change against the rest of that day — time overlaps, unrealistic travel distances, clashes with fixed bookings (flights, confirmed reservations). If there's a conflict, ALWAYS surface it and ask before adjusting anything else — never auto-rearrange other parts of the day silently. Show the conflict clearly, propose an adjustment, let the user confirm or decline.

## 2. Add two new onboarding preferences: Pacing and Decision Style
Both are simple selectors, similar UI pattern, added to conversation mode (inferred where possible from natural language) and as explicit quick-select options on the form-based onboarding paths.

**Pacing** (density of each day):
- Relaxed = 2-3 activities/day
- Balanced = 4-5 activities/day (default)
- Packed = 6+ activities/day

**Decision style** (how much Voyager decides vs the traveller):
- "Decide for me" — Voyager makes one confident choice per slot. Swap shows 1 alternative, not a menu.
- "Show me a few options" — default. Swap/add show 2-3 real grounded alternatives to pick from.
- "I know what I want" — onboarding should actively ask "any specific places you already want included?" and build around those fixed points, filling only gaps. Editing favours free-form text input over curated suggestions for this group.

Update the itinerary generation prompt to respect both preferences.

## 3. Add a Preferences section to Settings — TEST THIS NOW
Build using localStorage (no real auth needed for this POC — same pattern as existing trip state persistence). Fields:
- Home airport/city
- Preferred airlines
- Dietary requirements (multi-select: vegetarian, vegan, gluten-free, allergies-free-text)
- Food dislikes (free text)
- Accessibility needs (free text)
- General notes — free text, "anything else Voyager should always know"

Editable any time from Settings. Where fields are filled in, fold them automatically into itinerary generation and Ask context (same mechanism as trip context injection). All fields optional — empty preferences should not degrade output quality.

This is the section I most want to test hands-on once built — please make sure it's fully navigable and the data visibly persists across a page refresh before calling it done.

## 4. Add manual booking entry
On the Bookings tab: "Add booking manually" action. Simple form — type, title, detail, date(s), reference number (optional, never required). Saves into the same bookings state as everything else.

## 5. Integrate Google Places API for real venue grounding — priority item
Current recommendations (itinerary + Voyager Ask) are generated from model knowledge alone and are noticeably worse than a Google search. Fix:

- New env var: GOOGLE_PLACES_API_KEY (I'll provide this)
- New service (lib/places-service.ts) calling Google Places API (Text Search / Places API New) — returns name, rating, review count, price level, editorial summary where available
- **Cost discipline — important**: Google Places is pay-as-you-go and billed per SKU based on which fields are requested. Use a TIGHT field mask — only request name, rating, userRatingCount, priceLevel, and editorialSummary. Do not request a broad/default field mask. This keeps costs minimal at POC scale and builds the right habit for V1 at production scale.
- Wire into Voyager Ask: for place-type queries, call places service first, pass real results into the Claude prompt as grounding context, Claude curates/contextualizes rather than generating from memory
- Wire into itinerary generation the same way — fetch real venue options per destination/day before generating content
- Update both system prompts to explicitly require: only reference venues from provided real data, never invent them, add value through curation and local context on top of real data

This also directly powers the alternatives shown in Swap and Add (item 1) — same underlying data source.

**Also add — social proof link (no cost, no API call):** next to recommended venues, add a small "See recent posts" tap target that constructs and opens a deep link to Instagram's location/hashtag search or TikTok's search for that venue name + location. This is pure URL construction, not a data pull — Voyager doesn't read anything back, it just hands the user a one-tap way to check social buzz themselves on the actual platform.

## 6. Improve conversational tone throughout — be specific, not just "warmer"
This is about structural habits, not vocabulary. Apply these rules to all AI-facing prompts (conversation mode, Ask, itinerary generation):

- **Lead with the answer.** No windups like "Great question! When it comes to..." — just answer, add colour after.
- **Sentences over bullet lists** for anything a person would just say conversationally. Only use lists for genuinely list-shaped content (e.g. a packing list).
- **State a preference, don't hedge.** "I'd go with X" not "you might want to consider X."
- **Match response length to the question.** A quick question gets a quick answer — don't structure-break everything into a formal breakdown.
- **Don't re-explain context Voyager already has.** Speak as if already familiar with the trip.
- **One specific detail beats generic adjectives.** Cut "great," "wonderful," "amazing" — replace with the one concrete detail that actually matters to the decision (e.g. "it's a 5 minute walk from your hotel" beats "it's a wonderful spot").

Example — same information, two tones:
- Stilted: "Here are some great options for smoothie bowls in Noosa: 1. Locale Noosa — known for their acai bowls... 2. Sum Yung Guys — offers a variety of healthy breakfast options..."
- Natural: "Locale on Hastings Street does a really good one — go for the dragonfruit if it's on. Sum Yung Guys is the other solid option, a bit more casual. Both are a short walk from where you're staying."

Test a few real exchanges after changing the prompts (try the smoothie bowl question again specifically) and iterate until responses consistently read like the natural example, not the stilted one.

## 7. Booking deep link fallback
For activities without clean affiliate/API coverage (e.g. golf tee times, small local operators), fall back to a general search link (Google/venue name) rather than a broken or missing link.

## 8. Real deep links for booking actions — priority item
Every "Book" action in the itinerary and Bookings tab should construct and open a REAL deep link, not a placeholder button. This is what proves the booking flow will genuinely work in V1, not just look like it will.

Build real deep link construction for each category, using the exact URL patterns from the Tech Spec (Section 5.2):

- **Hotels**: Booking.com deep link — real destination, check-in/check-out dates, guest count pre-filled. Use a generic/no affiliate ID for POC (or a placeholder aid parameter) — the link should genuinely open Booking.com with the right search pre-populated.
- **Activities**: Viator and/or GetYourGuide deep link — destination and activity type pre-filled where possible.
- **Rail/ground transport**: Omio deep link — origin, destination, date pre-filled (use this for the Noosa trip's Auckland-side connections if relevant, or skip if not applicable to this specific itinerary).
- **Flights**: since Duffel requires a real API integration (not just a deep link), for the POC construct a Google Flights deep link instead as a stand-in — real origin/destination/dates pre-filled. Label it "Flights" as always, never showing the provider name in the UI copy itself.
- **Car hire**: similar stand-in — a deep link to a car rental search (e.g. a generic Google search or a rental site) with dates and location pre-filled.

Every link should open in a new tab when tapped. The goal: when Liam taps "Book" on any item, it should genuinely land on a real, correctly pre-filled page for that exact booking — proving the mechanism, not just the intention.

Remove the email drafting item entirely — not needed for now. Focus stays on booking links as the highest-value addition.

## 9. Add "Ask about this day" entry point on day cards
Each day in the itinerary should have a small, visible entry point (e.g. a chip or button on the day card) that opens Ask with that day's context pre-loaded — same mechanism as "Tell Me More" on individual activities, just scoped to the whole day rather than one activity. This resolves the need for a separate per-day chat: direct editing (item 1) handles changing things, this handles asking things ("what should I wear this day," "is this area safe at night," "what's this place actually like"). Make sure this feels present and inviting on the day view, not buried — it's a core part of how the day-level companion experience should feel.

---

Please work through these in order, test as you go the same way you did for the initial build, and flag anything you'd want my input on. Item 3 (Preferences) is the one I most want to actually click through and test once it's built, so please let me know specifically when that one is ready even if you're still working on the rest.
