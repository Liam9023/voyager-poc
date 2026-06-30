# Voyager — Proof of Concept

An AI-powered travel planning and trip companion. This is the **POC** (see `CLAUDE.md`) —
a polished, deployable demo built around one excellent, hand-written trip: **Auckland → Noosa,
1–8 November 2026 (7 nights, 2 adults).**

Built with Next.js 14 (App Router) + Tailwind, using the Claude API for the genuinely
intelligent parts.

## What's real vs mocked

| Feature | Status |
| --- | --- |
| Voyager Ask (trip-aware) | **Real Claude API** — streaming, knows the Noosa itinerary |
| Conversation onboarding | **Real Claude API** — natural chat that collects trip details |
| Noosa itinerary | **Hand-written** for quality (`lib/itinerary.ts`) — not generated live |
| Standard / detailed forms | Simplified — all paths lead to the Noosa itinerary |
| Unlock / payment | Mocked — realistic fee + "Pay" button, no real charge |
| Bookings | Mocked — realistic confirmed / to-book items, fake refs |
| Add-ons | Mocked — eSIM, insurance, FX card, transfer |

No Stripe, Duffel, Supabase, push notifications, or service worker — those belong to V1.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

The Anthropic API key lives in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

`.env.local` is git-ignored. For Vercel, set `ANTHROPIC_API_KEY` in the project's
environment variables.

## Demo flow

1. **Home** (`/`) — clean Voyager home with the Noosa trip card.
2. **Plan** (`/plan`) — pick **Chat with Voyager** for the real conversation onboarding,
   then "Build my trip".
3. **Preview** (`/preview`) — Overview, the showcase **Day 2** (try Remove / Swap on an
   activity), and the **Unlock** tab with transparent fee maths. Pre-unlock Ask is available
   (3 free questions).
4. **Add-ons** (`/addons`) — contextual offers after the (mocked) payment.
5. **Trip** (`/trip`) — day-by-day itinerary (editable, with "Tell me more"), Bookings,
   **Voyager Ask** (unlimited, trip-aware), and Trip tools (alerts, packing, currency,
   weather, emergency info).

> Tip: the Trip → Settings tab has a **Reset demo** button that re-locks the trip so you can
> run the full flow again.

## Project structure

```
app/
  api/ask/route.ts            # streaming, trip-aware Voyager Ask
  api/conversation/route.ts   # onboarding conversation
  page.tsx                    # home
  plan/ preview/ addons/ trip/
lib/
  itinerary.ts                # the hand-written Noosa itinerary (the crown jewel)
  bookings.ts                 # mocked bookings + add-ons
  prompts.ts                  # system prompts + trip context (Tech Spec §4)
  ai-service.ts               # Claude abstraction layer (Tech Spec §1.3)
  alternatives.ts             # curated swap alternatives
  store.tsx                   # client trip state (unlock, edits) via localStorage
components/                   # AskPanel, ActivityRow, ui primitives
```

## Design system

Coastal Retreat × Olive Oasis — Warm Balance. Tokens are mapped into
`tailwind.config.ts`; Libre Baskerville (headings) + Nunito (body) via Google Fonts.
Mobile-first (390px), centred app column that holds at desktop widths.

## Product rules honoured

- Never says "AI" anywhere in the UI — it's always "Voyager".
- "No hidden fees" messaging wherever a fee is shown.
- Provider invisibility — labels are "Flights", "Stay", "Activities", never the provider.
- The itinerary is genuinely editable (remove / swap), pre- and post-unlock.
