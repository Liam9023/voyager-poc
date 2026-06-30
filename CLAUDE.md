# Voyager — Proof of Concept Build Brief

## What This Is

Voyager is an AI-powered travel planning and trip companion product. This is a **proof of concept**, not the production V1 build. The goal is a working, polished demo that Liam can show to people close to him — on a phone in person, and as a shareable link viewed in a browser — to demonstrate the core value of the product before any business accounts, paid integrations, or commercial setup happens.

**This is not the full build.** No Stripe, no Duffel, no affiliate bookings, no Supabase, no push notifications, no PWA service worker. Those all belong to the V1 production CLAUDE.md, which is a separate document for a separate phase. Do not implement anything from those categories here, even if it seems easy to add.

## What "Done" Looks Like

A single deployable Next.js web app, responsive across phone and desktop browser, that someone can open via a public URL and experience:

1. Open the app, see a clean Voyager home screen
2. Start planning a trip via conversation mode (real Claude API)
3. Watch a complete, beautiful itinerary appear for a one-week Noosa trip (Auckland → Noosa, departing 1 November)
4. Browse the itinerary day by day
5. Open Voyager Ask and ask real questions about the trip — get real, locally-informed Claude responses
6. See a simulated unlock screen (no real payment)
7. See a simulated bookings view with realistic-looking confirmed/to-book items

The bar for quality is: **a smart, well-travelled friend should look at this and think "this looks like a real, working travel app" — not "this is a wireframe" or "this is obviously fake."**

## What's Real vs Mocked

| Feature | Status | Notes |
|---|---|---|
| Conversation mode onboarding | **REAL** — Claude API | Natural conversation, collects destination/dates/party size/preferences |
| Voyager Ask | **REAL** — Claude API | Trip-aware, responds to real questions about Noosa |
| Itinerary generation | **MOCKED** — fixed, pre-written | One complete, excellent 7-night Noosa itinerary written by hand for quality control. Do not generate this live — write it once, make it genuinely excellent, hardcode it. |
| Standard form / Detailed form onboarding paths | **SIMPLIFIED** | Build conversation mode properly. The other two onboarding paths can be simple forms that, when submitted, also lead to the same hardcoded Noosa itinerary. Low priority. |
| Unlock / payment screen | **MOCKED** | Real-looking fee display and "Pay" button. Tapping it just transitions to the unlocked state — no Stripe, no real charge. |
| Bookings tab | **MOCKED** | Realistic-looking confirmed and to-book items for the Noosa trip with fake (but realistic-format) booking references. No real booking links — buttons can be non-functional or show a "this would open Booking.com" style placeholder. |
| Push notifications | **NOT BUILT** | Skip entirely for POC. |
| Multi-trip home screen | **SIMPLIFIED** | Single active trip (Noosa) is enough. Past trips and upcoming trips can show 1-2 hardcoded example cards for visual completeness but don't need to be functional. |
| Group travel / traveller invitations | **NOT BUILT** | Skip for POC. |
| PWA / offline / service worker | **NOT BUILT** | Skip for POC. Standard responsive web app only. |

## Priority Order

Build in this order. The first two are what actually prove the concept — give them the most time and polish.

1. **Itinerary generation result** (mocked but excellent) — this is the single most important screen. It needs to look and read like it was built by a genuine local expert, not generic AI travel content. See "The Noosa Itinerary" section below for full detail to use.
2. **Voyager Ask** (real Claude API, trip-aware) — second most important. Responses need to be specific, locally informed, and never generic. This is what proves the AI quality.
3. Onboarding — conversation mode (real Claude API)
4. Itinerary browsing UI — day-by-day view
5. Unlock screen (mocked)
6. Bookings tab (mocked)
7. Home screen with trip card

## The Noosa Itinerary — Reference Content

Use this as the foundation for the hardcoded itinerary. Expand it into the full day-by-day JSON structure (matching the ItinerarySchema in the tech spec) but keep the specificity and local detail — this is what separates Voyager from a generic travel app.

**Trip:** Auckland → Noosa, Queensland. 1–8 November (7 nights). 2 adults.

**Character of the trip:** Noosa is relaxed beachside Queensland — not Gold Coast high-rise, not Sydney urban. The drawcard is Noosa National Park, Hastings Street, the Noosa River, and a string of excellent restaurants that don't feel touristy. Late spring weather — warm, occasional afternoon storms, water still cool for swimming but fine for paddleboarding.

**Suggested day shape (expand fully):**
- Day 1: Arrive, settle into accommodation (Noosa Heads — walking distance to Hastings St and the National Park entrance), easy first evening
- Day 2: Noosa National Park — Coastal Track to Hell's Gates, swim at one of the bays
- Day 3: Noosa River — kayak or stand-up paddleboard upriver toward Noosa Everglades, lunch at a riverside spot
- Day 4: Hastings Street day — shopping, beach time, sunset drinks
- Day 5: Day trip to the Noosa hinterland — Eumundi Markets (only on Wed/Sat — adjust trip dates or note this), Montville or Maleny for hinterland views
- Day 6: Relaxed beach day, Noosa Marina, dinner at a well-regarded local restaurant (invent a specific, plausible name and description — be specific not generic)
- Day 7: Free morning, pack, afternoon departure prep
- Day 8: Depart Noosa → Auckland

Write full, specific descriptions for each activity — the way the Burford/Bibury Cotswolds example was written earlier in this product's design process. Real-sounding venue names, specific local insight, the tone of someone who actually knows the area.

## Design System — Use Exactly As Specified

Full design system reference: **Coastal Retreat × Olive Oasis — Warm Balance**

```
Colours:
  accent:        #7F543D  (warm terracotta — CTAs, highlights)
  accentLight:   #F4EDE7
  accentDark:    #50321E
  secondary:     #74A8A4  (coastal teal — secondary accents, confirmed states)
  secondaryLight:#E8F2F2
  hero:          #2C4858  (trip card dark backgrounds)
  heroAlt:       #335765
  bg:            #E9E4DC  (app background)
  surface:       #FDFAF6  (card/sheet surfaces)
  border:        #D4CCBE
  text:          #1A1E22
  textMid:       #504840
  textLight:     #948A80
  tag:           #EDE8E0
  green/secondary: #74A8A4 (confirmed bookings)
  greenLight:    #E8F2F2
  amber:         #CB7A5C  (alerts)
  amberLight:    #FAF0EB

Typography:
  heading: 'Libre Baskerville', Georgia, serif
  body:    'Nunito', system-ui, sans-serif
  mono:    ui-monospace, 'SF Mono', monospace (booking refs only)

Radius (Bold & Rounded):
  sm:   12px (chips, small cards)
  md:   20px (standard cards)
  lg:   24px (buttons, large cards)
  xl:   32px (sheets, modals)
  full: 9999px (pills)
```

Google Fonts import:
```
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;500;600;700;800&display=swap');
```

## Critical Product Rules — Apply Throughout

1. **Never use the word "AI."** Never "AI-generated," "AI suggests," "AI-powered." The product is "Voyager." Copy reads "Voyager built this for you," "Voyager recommends," never anything that surfaces the underlying technology.
2. **No hidden fees messaging** must appear at the unlock screen and anywhere a fee is shown. Something like: "This is the only Voyager charge — no markup on flights, hotels, or activities."
3. **Provider invisibility.** Even in mocked booking links, never show "Booking.com" or "Duffel" as visible labels. Use "Flights," "Hotels," "Activities."
4. **Itinerary is editable.** Activities in the itinerary view should have a working remove/swap interaction even in the POC — this is a core differentiator and should feel real, not static.
5. **Mobile-first, fully responsive.** Build for a 390px-wide viewport first, then ensure it holds up cleanly at desktop widths. Test both.

## Tech Setup for POC

- Next.js 14 (App Router) + Tailwind CSS
- Single environment variable needed: `ANTHROPIC_API_KEY`
- No database required — the hardcoded itinerary can live as a JSON file or TypeScript constant in the repo. Chat history for Ask can be component state (lost on refresh — that's fine for a POC).
- Deploy to Vercel, connected to a GitHub repo, for a public URL
- No auth required — the app can open straight to the home/trip experience, no login wall

## Reference Materials

The following documents exist and should be referenced for visual and structural guidance, understanding these are written for the full V1 product and need to be scoped down per the "What's Real vs Mocked" table above:

- Voyager PRD v2.7 — full product context, feature reasoning, positioning principles
- Voyager Technical Specification v1.0 — database schema (for reference only, not built in POC), AI prompt architecture (the itinerary generation and Ask prompts in Section 4 ARE directly usable for the real Claude API calls in this POC)
- Voyager Design System — full token reference
- Wireframes 01–05 — screen layouts and interaction patterns to follow

## Out of Scope — Do Not Build

Stripe, Duffel, Supabase, Omio, Trip.com, Booking.com, Viator, GetYourGuide affiliate links, push notifications, PWA/service worker/offline mode, multi-trip management beyond visual placeholders, group travel, user accounts/auth, past trip archive functionality, packing list persistence beyond component state, currency/weather API calls (can be hardcoded sample data), email/SMS of any kind.

If in doubt about whether something belongs in the POC, the test is: **does this prove the AI quality and product feel to someone seeing it for the first time?** If yes, build it properly. If it's infrastructure or a real integration, mock it or skip it.
