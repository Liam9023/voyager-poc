import { useState } from "react";

const C = {
  bg: "#F7F7F7",
  surface: "#FFFFFF",
  border: "#E0E0E0",
  borderDark: "#BDBDBD",
  text: "#1C1C1E",
  textMid: "#555555",
  textLight: "#999999",
  accent: "#C17B3F",
  accentLight: "#F5EDE3",
  locked: "#F0F0F0",
  lockedText: "#BBBBBB",
  lockedBorder: "#E0E0E0",
  tag: "#EFEFEF",
  green: "#38A169",
};

const Phone = ({ children, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>}
    <div style={{
      width: 320, height: 640, background: C.surface, borderRadius: 36,
      border: `2px solid ${C.borderDark}`, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      overflow: "hidden", display: "flex", flexDirection: "column", position: "relative",
    }}>
      <div style={{ height: 28, background: C.surface, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>9:41</span>
        <span style={{ fontSize: 11, color: C.text }}>●●● ▲ ■</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  </div>
);

const WireframeNote = ({ text }) => (
  <div style={{ background: "#FFFDE7", border: "1px dashed #F0C040", borderRadius: 8, padding: "6px 10px", margin: "6px 0" }}>
    <span style={{ fontSize: 10, color: "#7A6000", fontWeight: 600 }}>📐 {text}</span>
  </div>
);

const LockedDay = ({ day, title, preview }) => (
  <div style={{ marginBottom: 8, borderRadius: 10, border: `1px solid ${C.lockedBorder}`, overflow: "hidden" }}>
    <div style={{ padding: "10px 12px", background: C.locked, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.lockedText }}>Day {day}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.lockedText }}>{title}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <rect x="1" y="5" width="10" height="8" rx="2" stroke="#BBBBBB" strokeWidth="1.2"/>
          <path d="M4 5V3.5C4 2.12 4.9 1 6 1C7.1 1 8 2.12 8 3.5V5" stroke="#BBBBBB" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 10, color: C.lockedText, fontWeight: 600 }}>Locked</span>
      </div>
    </div>
    {preview && (
      <div style={{ padding: "8px 12px", background: C.surface }}>
        <div style={{ fontSize: 11, color: C.lockedText, lineHeight: 1.4 }}>{preview}</div>
      </div>
    )}
  </div>
);

const UnlockedActivity = ({ time, icon, title, detail, type, onRemove, removed }) => {
  if (removed) return null;
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
      <div style={{ flexShrink: 0, textAlign: "center", width: 36 }}>
        <div style={{ fontSize: 10, color: C.textLight, marginBottom: 2 }}>{time}</div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentLight, border: `1px solid ${C.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
      </div>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>{title}</div>
          {onRemove && (
            <button onClick={onRemove} style={{ fontSize: 10, color: C.textLight, background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 6px", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>Remove</button>
          )}
        </div>
        <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.4 }}>{detail}</div>
        {type && <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, marginTop: 3 }}>{type}</div>}
      </div>
    </div>
  );
};

// ── SCREENS
const SCREENS = {

  // Preview — scrollable main screen
  preview: ({ go }) => {
    const [tab, setTab] = useState("overview");
    return (
      <Phone label="Screen 4 — Preview (Overview Tab)">
        {/* Header */}
        <div style={{ background: `linear-gradient(150deg, #1C1C1E, #2C2010)`, padding: "14px 20px 12px", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "rgba(193,123,63,0.8)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>Your trip preview</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>London & Beyond</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>27 Aug — 24 Sep · 2 adults · 28 nights</div>
          {/* Complexity badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, background: "rgba(193,123,63,0.15)", border: "1px solid rgba(193,123,63,0.3)", borderRadius: 20, padding: "3px 10px" }}>
            <span style={{ fontSize: 10, color: "#C17B3F", fontWeight: 700 }}>Complex · 1.2x</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.surface }}>
          {[["overview", "Overview"], ["sample", "Day 8 ✦"], ["unlock", "Unlock"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "10px 0", fontSize: 11, fontWeight: tab === id ? 700 : 500,
              color: tab === id ? C.accent : C.textLight,
              background: "none", border: "none", cursor: "pointer",
              borderBottom: `2px solid ${tab === id ? C.accent : "transparent"}`,
            }}>{label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tab === "overview" && <OverviewTab go={go} setTab={setTab} />}
          {tab === "sample" && <SampleDayTab go={go} setTab={setTab} />}
          {tab === "unlock" && <UnlockTab go={go} />}
        </div>
      </Phone>
    );
  },
};

const OverviewTab = ({ go, setTab }) => (
  <div style={{ padding: "16px 20px" }}>
    {/* Destination intelligence paragraph */}
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>About your trip</div>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>
        London rewards slower exploration — this plan keeps you out of the tourist corridors and into the city's real texture. You'll base yourself in Marylebone, walking distance to Hyde Park but local enough to feel grounded. Beyond London, three days in the Cotswolds and a night in Bath give the trip shape and contrast.
      </div>
    </div>
    {/* No hidden fees banner */}
    <div style={{ background: "#EDFAF3", border: "1px solid #9AE6B4", borderRadius: 10, padding: "8px 12px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 8 }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>✓</span>
      <div style={{ fontSize: 11, color: "#276749", lineHeight: 1.5 }}>
        <strong>No hidden fees.</strong> The Voyager fee below is the only charge from us. Flights, hotels, and activities are booked at their standard prices — no markup, no commission.
      </div>
    </div>

    {/* Trip highlights */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>What's included</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {["✈️ Flights", "🚂 Rail passes", "🏨 15 nights London", "🏡 3 nights Cotswolds", "🛁 2 nights Bath", "🚗 Car hire", "🎭 12 activities", "🍽️ 8 dining picks"].map(t => (
          <div key={t} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: C.tag, color: C.textMid, fontWeight: 500 }}>{t}</div>
        ))}
      </div>
    </div>

    {/* Day structure — locked */}
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>Your 28-night itinerary</div>
        <div style={{ fontSize: 10, color: C.textLight }}>Tap to preview · Edit after unlock</div>
      </div>
      <WireframeNote text="Days shown in outline — detail locked until payment. Full editing available post-unlock." />

      <LockedDay day="1–2" title="Arrival & settling in" preview="Flight from Auckland, transfer, check in. Easy first evening in Marylebone." />
      <LockedDay day="3–5" title="London — Central & East" preview="Three days across the city's most distinct neighbourhoods..." />

      {/* Day 8 — UNLOCKED SAMPLE */}
      <div style={{ marginBottom: 8, borderRadius: 10, border: `1.5px solid ${C.accent}`, overflow: "hidden" }}>
        <div style={{ padding: "10px 12px", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.accent }}>Day 8 · Preview ✦ — try editing it</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>The Cotswolds</div>
          </div>
          <button onClick={() => setTab("sample")} style={{ fontSize: 10, color: C.accent, fontWeight: 700, background: "none", border: `1px solid ${C.accent}`, borderRadius: 10, padding: "4px 8px", cursor: "pointer" }}>
            View & Edit →
          </button>
        </div>
      </div>

      <LockedDay day="9–12" title="London — South & West" />
      <LockedDay day="13–15" title="Bath & surrounds" />
      <LockedDay day="16–20" title="Back to London" />
      <LockedDay day="21–28" title="Final week & departure" />
    </div>

    {/* Unlock CTA */}
    <div style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: "12px 14px", marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, color: C.textMid }}>Estimated trip value</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>NZD $11,400</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: C.textMid }}>Voyager fee</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>NZD $103</div>
        </div>
      </div>
      <button onClick={() => setTab("unlock")} style={{
        width: "100%", padding: "12px", borderRadius: 10, background: C.accent,
        color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
      }}>
        Unlock full itinerary →
      </button>
    </div>
  </div>
);

const SampleDayTab = ({ go, setTab }) => {
  const [removed, setRemoved] = useState({});
  const remove = (key) => setRemoved(prev => ({ ...prev, [key]: true }));
  return (
  <div style={{ padding: "16px 20px" }}>
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Day 8 of 28 · Preview day</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>The Cotswolds</div>
      <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.5 }}>
        The tourist buses go to Bourton-on-the-Water. You're going to Burford and Bibury instead — quieter, more beautiful, and genuinely local. Pick up the hire car from central London the evening before.
      </div>
    </div>
    {/* Edit strip */}
    <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, padding: "7px 10px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontSize: 10, color: "#1A6B8A" }}>✏️ <strong>Try it:</strong> remove or swap any activity below</div>
      <WireframeNote text="Full edit available post-unlock" />
    </div>
    <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Your day</div>

    <UnlockedActivity time="8:30" icon="🚗" title="Drive to Burford" detail="90 min from London via the A40. Park on the high street — it's free before 9am." type="Car hire" removed={removed["drive"]} onRemove={() => remove("drive")} />
    <UnlockedActivity time="10:00" icon="🏘️" title="Burford & Bibury" detail="Burford's high street is the real Cotswolds. Walk down to the river then drive 20 min to Bibury — Arlington Row is worth the detour." type="Recommendation" removed={removed["bibury"]} onRemove={() => remove("bibury")} />
    <UnlockedActivity time="13:00" icon="🍺" title="Lunch at The Swan, Bibury" detail="On the river, genuinely good food, no tourist pricing. Book ahead — it fills up." type="Dining recommendation" removed={removed["lunch"]} onRemove={() => remove("lunch")} />
    <UnlockedActivity time="15:30" icon="🛍️" title="Bourton-on-the-Water" detail="If you want the busier village experience, it's 20 min away. Fine to skip — Burford and Bibury are better." type="Optional" removed={removed["bourton"]} onRemove={() => remove("bourton")} />
    <UnlockedActivity time="18:00" icon="🏨" title="Check in — The Bay Tree, Burford" detail="Four-star, genuinely characterful, Cotswolds stone building. NZD $420/night." type="Hotel" removed={removed["hotel"]} onRemove={() => remove("hotel")} />
    <UnlockedActivity time="20:00" icon="🍽️" title="Dinner at The Lamb Inn" detail="100m from your hotel. Classic British menu, excellent wine list, book the window table." type="Dining recommendation" removed={removed["dinner"]} onRemove={() => remove("dinner")} />
    {Object.values(removed).some(Boolean) && (
      <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, padding: "7px 10px", marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#1A6B8A" }}>✓ Removed. After unlock, Voyager can suggest alternatives for any removed activity.</div>
      </div>
    )}

    {/* Locked reminder */}
    <div style={{ background: C.locked, borderRadius: 10, padding: "10px 12px", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <rect x="1" y="5" width="10" height="8" rx="2" stroke="#BBBBBB" strokeWidth="1.2"/>
        <path d="M4 5V3.5C4 2.12 4.9 1 6 1C7.1 1 8 2.12 8 3.5V5" stroke="#BBBBBB" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <div style={{ fontSize: 11, color: C.lockedText }}>27 more days like this — unlock to see everything</div>
    </div>

    <div style={{ marginTop: 14, background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: C.textMid }}>Trip value</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>NZD $11,400</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: C.textMid }}>Voyager fee</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.accent }}>NZD $103</div>
        </div>
      </div>
      <button onClick={() => setTab("unlock")} style={{
        width: "100%", padding: "12px", borderRadius: 10, background: C.accent,
        color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
      }}>
        Unlock full itinerary →
      </button>
    </div>
  </div>
  );
};

const UnlockTab = ({ go }) => (
  <div style={{ padding: "16px 20px" }}>
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 6 }}>Unlock your trip</div>
      <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6 }}>
        One payment unlocks everything — your full 28-night plan, all booking access, and Voyager as your companion for the entire journey.
      </div>
    </div>
    <div style={{ background: "#EDFAF3", border: "1px solid #9AE6B4", borderRadius: 10, padding: "8px 12px", marginBottom: 14, display: "flex", gap: 8 }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>✓</span>
      <div style={{ fontSize: 11, color: "#276749", lineHeight: 1.5 }}>
        <strong>This is the only Voyager charge.</strong> Every flight, hotel, and activity is booked at its standard published price. No markup, no commission, no surprises.
      </div>
    </div>

    {/* What you get */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>What's unlocked</div>
      {[
        ["📅", "Full 28-night day-by-day itinerary"],
        ["✈️", "Flights — all passengers and dates set"],
        ["🚂", "Train bookings — UK and European rail"],
        ["🏨", "Hotels for every stay"],
        ["🚗", "Car hire where needed"],
        ["🎭", "Activities, dining and local recommendations"],
        ["💬", "Voyager — your trip companion throughout"],
        ["📍", "Live trip tracker and booking manager"],
      ].map(([icon, text]) => (
        <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{icon}</div>
          <div style={{ fontSize: 12, color: C.text }}>{text}</div>
        </div>
      ))}
    </div>

    {/* Fee breakdown */}
    <div style={{ background: C.tag, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Fee calculation</div>
      {[
        ["Estimated trip value", "NZD $11,400"],
        ["Base rate", "0.75%"],
        ["Complexity tier", "Complex · 1.2x"],
        ["Voyager fee", "NZD $103"],
      ].map(([k, v], i) => (
        <div key={k} style={{
          display: "flex", justifyContent: "space-between", padding: "6px 0",
          borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
        }}>
          <span style={{ fontSize: 11, color: i === 3 ? C.text : C.textMid, fontWeight: i === 3 ? 700 : 400 }}>{k}</span>
          <span style={{ fontSize: 11, color: i === 3 ? C.accent : C.text, fontWeight: i === 3 ? 800 : 500 }}>{v}</span>
        </div>
      ))}
    </div>

    {/* Stripe CTA */}
    <button onClick={() => go("addons")} style={{
      width: "100%", padding: "14px", borderRadius: 12, background: C.accent,
      color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10,
    }}>
      Pay NZD $103 — Unlock trip
    </button>

    {/* Trust signals */}
    <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
      {["🔒 Secure payment", "✓ Stripe", "No subscription"].map(t => (
        <div key={t} style={{ fontSize: 10, color: C.textLight }}>{t}</div>
      ))}
    </div>

    <div style={{ marginTop: 12, padding: "10px 12px", background: C.tag, borderRadius: 10 }}>
      <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.5, textAlign: "center" }}>
        Questions? Chat with Voyager before you pay.
      </div>
    </div>
  </div>
);

const FLOW_ORDER = ["preview"];
const SCREEN_LABELS = { preview: "Preview" };

export default function PreviewWireframe() {
  const [screen, setScreen] = useState("preview");
  const [activeTab, setActiveTab] = useState("overview");
  const go = (s) => setScreen(s);

  const Screen = SCREENS[screen];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#F0F0F0", minHeight: "100vh", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ maxWidth: 800, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>Voyager — Wireframe 02</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Preview Screen</div>
        </div>
        <div style={{ fontSize: 11, color: C.textLight, background: "#FFFDE7", border: "1px solid #F0C040", borderRadius: 8, padding: "4px 10px" }}>
          📐 Wireframe — structure only
        </div>
      </div>

      {/* Three tab explanation */}
      <div style={{ maxWidth: 800, margin: "0 auto 20px", background: C.surface, borderRadius: 12, padding: "14px 20px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Preview has 3 tabs — tap through them in the phone</div>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            ["Overview", "Destination intelligence, trip structure in outline, locked days visible, fee CTA"],
            ["Day 8 ✦", "The AI's best day shown in full — specific, locally informed, bookable"],
            ["Unlock", "Full fee breakdown, what's included, Stripe payment CTA"],
          ].map(([tab, desc]) => (
            <div key={tab} style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 3 }}>{tab}</div>
              <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen */}
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center" }}>
        {Screen && <Screen go={go} />}
      </div>

      {/* Design notes */}
      <div style={{ maxWidth: 800, margin: "20px auto 0", background: C.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Key design decisions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["Sample day selection", "AI picks the most compelling day — not Day 1. Labelled clearly as a preview highlight."],
            ["Locked day treatment", "Structure visible (day number, broad title) — specific detail blurred/withheld until unlock."],
            ["Fee transparency", "Trip value, base rate, complexity multiplier, and fee all shown. No surprises."],
            ["Conversion flow", "Fee CTA appears on both Overview and Sample Day tabs — always one tap away from payment."],
          ].map(([title, desc]) => (
            <div key={title} style={{ background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 10, color: C.textMid, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
