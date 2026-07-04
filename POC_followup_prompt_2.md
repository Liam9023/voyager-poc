This is a new, standalone addition — a dedicated build session, separate from the previous batch of fixes. Please confirm the previous items are all working before starting this (quick sanity check is fine, no need to re-verify everything in depth).

## Save & Explore — self-directed map discovery

This introduces a third way of interacting with the itinerary, alongside AI-curated suggestions (Ask, itinerary generation) and direct editing (add/remove/swap). This one is self-directed browsing — the traveller explores a real map on their own terms and saves things that catch their eye, without needing to ask Voyager anything or commit to a specific day.

It serves two moments:
1. **Pre-trip browsing** — while planning, browse the destination on a map, save anything interesting to a holding list, undecided on timing
2. **In-trip discovery** — while actually there, see what's nearby right now using the phone's location, save something on the spot if it catches your eye

### What to build

**1. Interactive map component**
- Use Google Maps JavaScript API (new env var: GOOGLE_MAPS_API_KEY — I'll provide this, sign up via the same Google Cloud project already used for Places)
- Cost note: this is a separate, much cheaper product from Places API — 10,000 free map loads per month, a few dollars per thousand after that. Negligible at this scale.
- Show nearby places as pins, using the existing Places data/service already built — don't duplicate that logic, reuse it
- Accessible from a new "Explore" entry point (placement is your call — could be its own tab, or nested under an existing one; whatever feels least cluttered given everything else already in the nav)

**2. Location awareness for in-trip mode**
- Use the browser's native Geolocation API (free, no new service needed) to center the map on the user's actual current location when they're mid-trip
- Pre-trip, the map should center on the destination generally rather than requesting location

**3. Save action**
- A "Save" button on any place shown on the map (or in search results within the map view) — distinct from "Add," which commits something to a specific day
- Saved items go into a new holding list, not tied to any day yet
- This list should be visible somewhere sensible in the Trip tab structure

**4. Converting a saved item into the itinerary**
- From the saved list, an item can be converted into a real itinerary slot at any time
- Reuse the existing Add flow and conflict-checking logic already built (Item 1 from the previous session) — don't build a separate mechanism, this should feed into the same underlying system

### Testing
Test both moments explicitly: browse the Noosa map pre-trip and save 2-3 places, then simulate the in-trip case (can fake/override location for testing purposes if real geolocation isn't practical to test locally) and confirm nearby places show correctly. Convert one saved item into an actual day and confirm it goes through the existing conflict-check flow correctly.

Let me know when it's ready to test, and flag anything about placement/UX decisions you made that you'd want my input on.
