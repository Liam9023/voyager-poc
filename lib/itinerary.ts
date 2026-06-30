import type { Itinerary } from "@/types";

/**
 * The Noosa itinerary — written by hand for quality control (see CLAUDE.md).
 * Auckland → Noosa, Queensland. 1–8 November 2026 (7 nights). 2 adults.
 *
 * This is the single most important content in the POC. Every recommendation is
 * specific and locally informed — the way a well-travelled friend who knows the
 * Sunshine Coast would actually plan it. Do not regenerate this live.
 *
 * Fee maths (matches pricing-service in the Tech Spec):
 *   value 6800 × base 0.0075 × complexity 1.05 = 53.55 → NZD $54
 *   complexity 1.05 = avg(duration 1.1, destinations 1.0, party 1.0, complexity 1.1)
 */
export const NOOSA_ITINERARY: Itinerary = {
  id: "noosa-nov-2026",
  title: "Noosa Days",
  summary:
    "Seven nights of the good, slow version of Queensland — based a two-minute walk from Hastings Street and the national park gate, with the river, the hinterland and a string of genuinely good restaurants all within easy reach. Built around late-spring weather, a hire car for two of the days, and not over-planning the rest.",
  origin: "Auckland",
  destination: "Noosa",
  destinations: ["Noosa Heads, Queensland"],
  country_codes: ["AU"],
  start_date: "2026-11-01",
  end_date: "2026-11-08",
  nights: 7,
  party_size: 2,
  travel_style: "Relaxed, with a bit of everything",
  budget_tier: "Mid-range",
  estimated_value_nzd: 6800,
  base_rate: 0.0075,
  complexity_multiplier: 1.05,
  complexity_tier: "Moderate",
  voyager_fee_nzd: 54,
  sample_day_number: 2,
  highlights: [
    "✈️ Direct flights",
    "🏨 7 nights, Hastings St",
    "🚗 Car hire — 2 days",
    "🥾 Noosa National Park",
    "🛶 Everglades by water",
    "🛍️ Eumundi Markets",
    "⛰️ Hinterland day",
    "🍽️ 8 dining picks",
  ],
  days: [
    {
      day_number: 1,
      date: "2026-11-01",
      weekday: "Sunday",
      title: "Wheels down, slow down",
      location: "Noosa Heads",
      country_code: "AU",
      summary:
        "Fly into Sunshine Coast Airport rather than Brisbane — it's 35 minutes from Noosa instead of nearly two hours, and worth paying a little more for on day one. Don't plan anything ambitious tonight. Settle in, get your feet in the sand, eat somewhere easy.",
      activities: [
        {
          id: "d1-flight",
          time_of_day: "08:05",
          type: "flight",
          title: "Auckland → Sunshine Coast (MCY)",
          description:
            "Direct across the Tasman, roughly 3h45 in the air, landing early afternoon local time (Queensland is 2 hours behind Auckland in November — they don't do daylight saving). Sunshine Coast Airport at Marcoola is small and quick; you'll be in a hire car within 20 minutes of the seatbelt sign going off.",
          booking_required: true,
          booking_notes: "Book seats on the left (A) side for coastline views on descent.",
          estimated_cost_nzd: 1180,
        },
        {
          id: "d1-car",
          time_of_day: "13:30",
          type: "car",
          title: "Collect the hire car",
          description:
            "A small SUV or hatch is plenty. You only strictly need a car for the Everglades and hinterland days, but having it for the airport run and a few beach trips makes life easier than relying on the (good but limited) local buses. Pick-up is right at the terminal.",
          booking_required: true,
          booking_notes: "A compact is fine — Noosa parking is tight, especially near Hastings St.",
          estimated_cost_nzd: 520,
        },
        {
          id: "d1-checkin",
          time_of_day: "14:30",
          type: "hotel",
          title: "Check in — Netanya Noosa, Hastings Street",
          description:
            "Beachfront, low-rise, and about as central as Noosa gets without being on top of the crowds — Hastings Street restaurants one direction, the national park entrance the other, Main Beach directly in front. Ask for an ocean-facing room high as they'll give you; the sound of Laguna Bay at night is the whole point.",
          booking_required: true,
          booking_notes: "7 nights. Self-contained apartments — handy for breakfasts in.",
          estimated_cost_nzd: 3150,
          highlight: true,
        },
        {
          id: "d1-beach",
          time_of_day: "16:30",
          type: "activity",
          title: "First swim at Main Beach",
          description:
            "One of the few east-coast beaches that faces north, so it's protected, calm, and patrolled — an easy first dip. Swim between the flags. The light here in the late afternoon is genuinely lovely.",
          booking_required: false,
        },
        {
          id: "d1-dinner",
          time_of_day: "19:00",
          type: "dining",
          title: "Dinner at Bistro C",
          description:
            "Right on the Hastings Street boardwalk with the beach a few metres away. It's been there forever for good reason — unfussy, generous, and the calamari is something of a local institution. A relaxed first night with a view, no reservation drama.",
          booking_required: true,
          booking_notes: "Book a 7pm table for the sunset end of the room.",
          estimated_cost_nzd: 150,
          highlight: true,
        },
      ],
    },
    {
      day_number: 2,
      date: "2026-11-02",
      weekday: "Monday",
      title: "Noosa National Park",
      location: "Noosa Heads",
      country_code: "AU",
      summary:
        "This is the day that makes people fall for Noosa. The Coastal Track runs from the end of Hastings Street out along the headland past a string of small bays to Hell's Gates, with the chance of turtles and dolphins off the rocks. Go in the morning before the heat and the crowds, take swimmers, and don't rush it.",
      activities: [
        {
          id: "d2-coffee",
          time_of_day: "07:30",
          type: "dining",
          title: "Coffee at Café Le Monde, then walk in",
          description:
            "Grab a flat white and a pastry at Le Monde on Hastings Street (Sunshine Coast takes its coffee seriously). The national park entrance is a five-minute stroll from the far end of the street — no need to drive, and parking down there fills by 8am anyway.",
          booking_required: false,
          estimated_cost_nzd: 22,
        },
        {
          id: "d2-track",
          time_of_day: "08:15",
          type: "activity",
          title: "Coastal Track to Hell's Gates",
          description:
            "An easy, mostly flat 5.4km return along the cliffs. You'll pass Tea Tree Bay and Granite Bay — slow down at the rocks past Tea Tree, this stretch is one of the best places in Australia to spot wild dolphins surfing the break, plus turtles and the occasional koala in the pandanus. Hell's Gates is the dramatic rock cleft at the end with a lookout over the open ocean.",
          booking_required: false,
          booking_notes: "Free entry. Take water and a hat — there's no shade on the headland.",
          highlight: true,
        },
        {
          id: "d2-swim",
          time_of_day: "10:00",
          type: "activity",
          title: "Swim at Tea Tree Bay (or the Fairy Pools)",
          description:
            "On the way back, drop down into Tea Tree Bay for a swim — sheltered, clear, and far quieter than Main Beach. If the swell is small and the tide is low, the Fairy Pools just past Granite Bay are a rock-pool spot the day-trippers walk straight past. Lovely, but only when conditions are calm — check before scrambling down.",
          booking_required: false,
        },
        {
          id: "d2-lunch",
          time_of_day: "12:30",
          type: "dining",
          title: "Lunch at the Noosa Heads Surf Club",
          description:
            "Unpretentious, right on Main Beach, and the deck looks straight back at the headland you just walked. This is where locals eat — fish and chips or a burger and a cold one, no booking needed. The kind of honest lunch that beats anything fancier after a morning's walking.",
          booking_required: false,
          estimated_cost_nzd: 70,
        },
        {
          id: "d2-afternoon",
          time_of_day: "15:00",
          type: "activity",
          title: "Massimo's gelato + an easy afternoon",
          description:
            "Earn it, then ruin it: Massimo's on Hastings Street has a near-permanent queue and is worth it — proper Italian gelato, the salted caramel and the mango both excellent. Take it down to the beach and do nothing for a while. That's the assignment.",
          booking_required: false,
          estimated_cost_nzd: 18,
        },
        {
          id: "d2-dinner",
          time_of_day: "19:30",
          type: "dining",
          title: "Dinner at Locale Noosa",
          description:
            "The best Italian in town and a proper night out — handmade pasta, a serious wine list, and a buzzy room just off Hastings Street. Book ahead; it's the table everyone wants. The tasting-style approach works well if you can't decide.",
          booking_required: true,
          booking_notes: "Reserve a few days out, especially for a weekend.",
          estimated_cost_nzd: 200,
          highlight: true,
        },
      ],
    },
    {
      day_number: 3,
      date: "2026-11-03",
      weekday: "Tuesday",
      title: "Up the river to the Everglades",
      location: "Noosa River & Lake Cootharaba",
      country_code: "AU",
      summary:
        "The Noosa Everglades is one of only two everglade systems on earth (the other's in Florida) — a mirror-flat blackwater river winding through paperbark and reflections so clean it's disorienting. The smart way to see it is by kayak from Boreen Point, paddling the upper reaches where the tour boats can't follow.",
      activities: [
        {
          id: "d3-drive",
          time_of_day: "08:00",
          type: "car",
          title: "Drive to Boreen Point",
          description:
            "About 40 minutes up through Tewantin and around Lake Cootharaba. Stop for a takeaway coffee and something for a picnic lunch before you leave the shops behind — there's nothing once you're up the lake.",
          booking_required: false,
        },
        {
          id: "d3-kayak",
          time_of_day: "09:30",
          type: "activity",
          title: "Guided kayak into the Everglades — Kanu Kapers",
          description:
            "Kanu Kapers run the trips locals actually recommend — small groups, good guides, and they launch from the quiet top end so you're paddling the 'River of Mirrors' before the day boats arrive from Noosa. It's flat, easy water; you don't need to be fit, just up for a few hours on the river. The stillness in the narrow upper channels is the bit you'll remember.",
          booking_required: true,
          booking_notes: "Book ahead — small groups sell out. Full-day trip includes lunch and gear.",
          estimated_cost_nzd: 320,
          highlight: true,
        },
        {
          id: "d3-lunch",
          time_of_day: "13:00",
          type: "dining",
          title: "Riverbank lunch at Harry's Hut",
          description:
            "The tours usually pull in at Harry's Hut, an old timber-getters' camp on the riverbank deep in the Cooloola wilderness — picnic tables, towering paperbarks, and absolutely nothing else. Bring your own or take what the tour provides. Swimming in the tannin-stained water is part of it.",
          booking_required: false,
        },
        {
          id: "d3-pub",
          time_of_day: "16:00",
          type: "dining",
          title: "A cold one at the Apollonian Hotel, Boreen Point",
          description:
            "Back at the cars, the Apollonian is a beautifully preserved 1860s pub relocated plank by plank from Gympie — wide verandahs, cold beer, and famous for its Sunday spit roast. On a Tuesday it's just a perfect quiet stop before the drive home.",
          booking_required: false,
          estimated_cost_nzd: 35,
        },
        {
          id: "d3-dinner",
          time_of_day: "19:30",
          type: "dining",
          title: "Easy dinner at Thomas Corner Eatery, Noosaville",
          description:
            "Back in town, keep it low-key on the Noosaville river side. Thomas Corner is chef David Rayner's relaxed local — seasonal, seafood-leaning, genuinely good and a fraction of the Hastings Street prices. The kind of place you'd come back to twice.",
          booking_required: true,
          booking_notes: "A short drive or 10-minute taxi from Hastings St.",
          estimated_cost_nzd: 160,
        },
      ],
    },
    {
      day_number: 4,
      date: "2026-11-04",
      weekday: "Wednesday",
      title: "Eumundi Markets & the hinterland edge",
      location: "Eumundi & Noosa hinterland",
      country_code: "AU",
      summary:
        "Eumundi Markets only run Wednesday and Saturday — and your trip happens to land a Wednesday, which is the quieter, more local of the two days. Go in the morning, then drift back through the hinterland's green hills for the afternoon. You've still got the hire car today.",
      activities: [
        {
          id: "d4-drive",
          time_of_day: "08:30",
          type: "car",
          title: "Drive to Eumundi",
          description:
            "25 minutes inland. Get there by 9 when it opens and before the tour buses — parking is easy early and the stallholders are still setting out the good stuff.",
          booking_required: false,
        },
        {
          id: "d4-markets",
          time_of_day: "09:00",
          type: "activity",
          title: "Eumundi Markets",
          description:
            "Over 500 stalls under the fig trees, and unlike a lot of 'markets' this one is genuinely makers and growers — woodwork, ceramics, leather, plants, and a serious amount of good food. Graze your way through breakfast. Don't miss a coffee from Clandestino, the local roaster that started right here, and the wood-fired stuff at the food end.",
          booking_required: false,
          booking_notes: "Wednesday & Saturday only. Cash handy for smaller stalls, though most take card.",
          estimated_cost_nzd: 60,
          highlight: true,
        },
        {
          id: "d4-montville",
          time_of_day: "12:30",
          type: "activity",
          title: "Drive up to Montville",
          description:
            "Climb into the Blackall Range to Montville — a ridgeline village with German/Tudor-ish cottages, galleries, and views that fall away to the coast you came from. Touristy, yes, but the outlook is real. Wander the main street and the gardens.",
          booking_required: false,
        },
        {
          id: "d4-lunch",
          time_of_day: "13:15",
          type: "dining",
          title: "Lunch with a view at Maleny",
          description:
            "Carry on 15 minutes to Maleny, the more down-to-earth hinterland town. The Maleny Botanic Gardens / Bird World pairing is worth it, but the real move is lunch looking out over the Glass House Mountains — those volcanic plugs Captain Cook named are unforgettable in the afternoon light. Mary Cairncross Reserve nearby has a short rainforest boardwalk if you want a leg-stretch.",
          booking_required: false,
          estimated_cost_nzd: 90,
        },
        {
          id: "d4-cheese",
          time_of_day: "15:30",
          type: "activity",
          title: "Maleny Dairies (or Kenilworth on the way back)",
          description:
            "If you like a food stop: Maleny Dairies do tours and excellent milk and yoghurt, or loop back via Kenilworth for the famous cheese and the over-the-top Kenilworth Bakery doughnuts. Either is a good excuse to take the long way home through the cane country.",
          booking_required: false,
          estimated_cost_nzd: 30,
        },
        {
          id: "d4-dinner",
          time_of_day: "19:30",
          type: "dining",
          title: "Dinner in, or Rococo on the river",
          description:
            "After a full day you might just want the apartment and a bottle of something from the bottle shop. If you're out, Rococo on Noosa Sound does relaxed riverside Mediterranean with the sunset over the water — book the deck.",
          booking_required: true,
          booking_notes: "Today's the last day with the car — drop it back tomorrow or keep it; see Day 5.",
          estimated_cost_nzd: 140,
        },
      ],
    },
    {
      day_number: 5,
      date: "2026-11-05",
      weekday: "Thursday",
      title: "Hastings Street, properly",
      location: "Noosa Heads",
      country_code: "AU",
      summary:
        "A no-car day. Return the hire car this morning (you won't need it again until the airport — a taxi for the last day is cheaper than three days' parking and idle hire). Then give Hastings Street the slow, indulgent day it's built for: beach, browse, long lunch, sunset drink.",
      activities: [
        {
          id: "d5-carback",
          time_of_day: "09:00",
          type: "car",
          title: "Drop the hire car back",
          description:
            "There's a depot in Noosaville; the desk will run you back to Hastings Street, or it's a quick taxi. From here everything you need is walkable.",
          booking_required: false,
        },
        {
          id: "d5-beach",
          time_of_day: "10:00",
          type: "activity",
          title: "Beach morning + a surf lesson (optional)",
          description:
            "Main Beach's gentle, north-facing break is one of the best places in the country to learn to surf — Merrick's Noosa Learn to Surf run group lessons right off the sand and have a near-perfect track record of getting people standing. Or just claim a patch of sand and a book.",
          booking_required: false,
          booking_notes: "If you want the lesson, book the morning slot the day before.",
          estimated_cost_nzd: 140,
        },
        {
          id: "d5-lunch",
          time_of_day: "13:00",
          type: "dining",
          title: "Long lunch at Sails",
          description:
            "Sails sits right where Hastings Street meets the beach, under the namesake white sails, and lunch here — a dozen oysters, something off the grill, a glass of Sunshine Coast hinterland wine — is the quintessential Noosa indulgence. It's not cheap; it's the one to do properly.",
          booking_required: true,
          booking_notes: "Book a table on the open edge for the beach outlook.",
          estimated_cost_nzd: 220,
          highlight: true,
        },
        {
          id: "d5-browse",
          time_of_day: "15:30",
          type: "activity",
          title: "Browse Hastings Street",
          description:
            "Australian labels and a few proper boutiques — it's an easy, pretty browse rather than a serious shopping strip. Duck into the Noosa Chocolate Factory, and the bookshop. The point is the amble, not the haul.",
          booking_required: false,
        },
        {
          id: "d5-sunset",
          time_of_day: "17:30",
          type: "dining",
          title: "Sunset drinks at Rickys River Bar",
          description:
            "Tucked at the quiet end of Hastings Street on the river, Rickys is the spot for a glass of wine as the light goes — west-facing over the water, polished but not stuffy. Stay for dinner if the mood takes you; the seafood is excellent.",
          booking_required: true,
          booking_notes: "Sunset tables go first — book ahead or arrive by 5.",
          estimated_cost_nzd: 60,
        },
      ],
    },
    {
      day_number: 6,
      date: "2026-11-06",
      weekday: "Friday",
      title: "On the water, then over the hill",
      location: "Noosa River & Sunshine Beach",
      country_code: "AU",
      summary:
        "Split the day between the calm river and the wild side of the headland. A morning pottering on the Noosa River in a little electric boat, then an afternoon at Sunshine Beach — the locals' beach over the back of the national park — and dinner at one of the best restaurants on the coast.",
      activities: [
        {
          id: "d6-boat",
          time_of_day: "09:30",
          type: "activity",
          title: "Hire an electric picnic boat — Noosa Dreamboats",
          description:
            "No licence needed. You captain a little canopied electric boat up the river yourself, BYO picnic and bubbles, and potter along at walking pace past the millionaires' jetties and the pelicans. Two hours is plenty. It's quietly one of the most fun things you can do here, and you'll have the river to yourselves on a weekday morning.",
          booking_required: true,
          booking_notes: "Book the 2-hour morning slot; they'll show you the ropes in five minutes.",
          estimated_cost_nzd: 180,
          highlight: true,
        },
        {
          id: "d6-paddle",
          time_of_day: "11:45",
          type: "activity",
          title: "Or: stand-up paddleboard the river",
          description:
            "If a boat's not your thing, the river is flat and forgiving for paddleboarding — Noosa Stand Up Paddle hire boards by the hour from Gympie Terrace. The water's still cool for swimming in early November but perfect for paddling.",
          booking_required: false,
          estimated_cost_nzd: 50,
        },
        {
          id: "d6-lunch",
          time_of_day: "13:00",
          type: "dining",
          title: "Riverside lunch on Gympie Terrace",
          description:
            "The Noosaville river strip is where locals eat away from the Hastings Street prices. Grab a table at one of the waterfront spots — The Boat Shed if you want a proper sit-down, or fish and chips on the grass by the water if you don't.",
          booking_required: false,
          estimated_cost_nzd: 80,
        },
        {
          id: "d6-sunshine",
          time_of_day: "15:00",
          type: "activity",
          title: "Afternoon at Sunshine Beach",
          description:
            "Ten minutes over the hill (taxi it) is Sunshine Beach — a long, open, surf beach with a completely different feel to the protected Main Beach, and where a lot of Noosa locals actually live. Patrolled, broad, and brilliant for a late-afternoon walk. You can also reach it on foot via the national park's Tanglewood track if you're keen.",
          booking_required: false,
        },
        {
          id: "d6-dinner",
          time_of_day: "19:00",
          type: "dining",
          title: "Dinner at Sum Yung Guys, Sunshine Beach",
          description:
            "While you're over here, eat at Sum Yung Guys — modern South-East Asian that's become one of the most talked-about restaurants on the whole coast. Punchy, generous sharing plates and a real buzz. This is the standout meal of the week; book it the moment you commit to the trip.",
          booking_required: true,
          booking_notes: "Books out weeks ahead. Reserve early — this is the one not to miss.",
          estimated_cost_nzd: 200,
          highlight: true,
        },
      ],
    },
    {
      day_number: 7,
      date: "2026-11-07",
      weekday: "Saturday",
      title: "A last slow Saturday",
      location: "Noosa Heads",
      country_code: "AU",
      summary:
        "Your last full day, and a Saturday — keep it open. A second walk in the park, the riverside Noosa Farmers Market if you're up early, one more swim, and a final dinner with a view. Pack tonight so the morning's easy.",
      activities: [
        {
          id: "d7-market",
          time_of_day: "07:30",
          type: "activity",
          title: "Noosa Farmers Market (AFL Grounds, Saturday)",
          description:
            "On Saturdays the Noosa Farmers Market runs at the AFL grounds in Weyba Road — smaller and far more local than Eumundi, all regional growers and producers. Breakfast among the locals, pick up fruit and a coffee. A lovely, low-key start to the last day. (Eumundi also runs Saturdays if you'd rather a second crack at it.)",
          booking_required: false,
          estimated_cost_nzd: 30,
        },
        {
          id: "d7-walk",
          time_of_day: "10:00",
          type: "activity",
          title: "One more loop of the headland",
          description:
            "Do the short Noosa Hill or Tanglewood loop in the national park, or simply re-walk the first stretch of the Coastal Track to Tea Tree for a last swim where the dolphins are. You'll notice things you missed the first time.",
          booking_required: false,
        },
        {
          id: "d7-lunch",
          time_of_day: "12:30",
          type: "dining",
          title: "Lunch at Season Restaurant",
          description:
            "Beachfront on Hastings Street, big windows onto Main Beach, and a menu that does the fresh, light, Sunshine Coast thing very well. A relaxed last lunch with the bay in front of you.",
          booking_required: true,
          estimated_cost_nzd: 130,
        },
        {
          id: "d7-pack",
          time_of_day: "16:00",
          type: "activity",
          title: "Swim, then pack",
          description:
            "Last dip at Main Beach, then get the bags sorted this evening so tomorrow is unhurried. Confirm your morning taxi to the airport.",
          booking_required: false,
        },
        {
          id: "d7-dinner",
          time_of_day: "19:00",
          type: "dining",
          title: "Farewell dinner at Miss Moneypenny's",
          description:
            "End on the buzziest table on Hastings Street — Miss Moneypenny's is all greenery, cocktails and Mediterranean sharing plates, and exactly the right note for a last night. Order the burrata and a spritz and toast a good week.",
          booking_required: true,
          booking_notes: "Saturday night — book well ahead.",
          estimated_cost_nzd: 180,
          highlight: true,
        },
      ],
    },
    {
      day_number: 8,
      date: "2026-11-08",
      weekday: "Sunday",
      title: "Home",
      location: "Noosa → Auckland",
      country_code: "AU",
      summary:
        "An easy departure. The flight back gains you the two hours you lost on the way over, so you land in Auckland in good time. No need to rush the morning.",
      activities: [
        {
          id: "d8-breakfast",
          time_of_day: "08:00",
          type: "dining",
          title: "Last coffee on the beach",
          description:
            "Walk down for a final flat white and watch the early swimmers. Check out is usually 10am; the bags can wait at reception if your flight's later.",
          booking_required: false,
          estimated_cost_nzd: 20,
        },
        {
          id: "d8-transfer",
          time_of_day: "11:30",
          type: "transfer",
          title: "Taxi to Sunshine Coast Airport",
          description:
            "35 minutes to Marcoola. Pre-book the night before so you're not waiting. Allow time for the cross-Tasman check-in and a wander through duty free.",
          booking_required: true,
          booking_notes: "Pre-book the taxi — Sunday morning cars get busy.",
          estimated_cost_nzd: 95,
        },
        {
          id: "d8-flight",
          time_of_day: "14:10",
          type: "flight",
          title: "Sunshine Coast → Auckland",
          description:
            "Direct home, landing early evening NZ time. With the two-hour time change in your favour, it's a gentle end to the trip.",
          booking_required: true,
          estimated_cost_nzd: 0,
        },
      ],
    },
  ],
};
