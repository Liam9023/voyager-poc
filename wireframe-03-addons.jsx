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
  tag: "#EFEFEF",
  green: "#38A169",
  greenLight: "#EDFAF3",
  greenBorder: "#9AE6B4",
};

const Phone = ({ children, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>}
    <div style={{
      width: 320, height: 640, background: C.surface, borderRadius: 36,
      border: `2px solid ${C.borderDark}`, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      overflow: "hidden", display: "flex", flexDirection: "column",
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
  <div style={{ background: "#FFFDE7", border: "1px dashed #F0C040", borderRadius: 8, padding: "6px 10px", margin: "4px 0" }}>
    <span style={{ fontSize: 10, color: "#7A6000", fontWeight: 600 }}>📐 {text}</span>
  </div>
);

const AddOnCard = ({ icon, title, subtitle, description, price, priceNote, cta, selected, onToggle, tag }) => (
  <div style={{
    borderRadius: 12, border: `1.5px solid ${selected ? C.accent : C.border}`,
    background: selected ? C.accentLight : C.surface,
    marginBottom: 10, overflow: "hidden",
    transition: "all 0.15s",
  }}>
    <div style={{ padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: selected ? C.accent : C.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "background 0.15s" }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</div>
            {tag && <div style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8, background: "#FFF8E7", color: "#92660A", border: "1px solid #FCD34D" }}>{tag}</div>}
          </div>
          <div style={{ fontSize: 11, color: C.textMid, marginBottom: 4 }}>{subtitle}</div>
          <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.4 }}>{description}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{price}</div>
          {priceNote && <div style={{ fontSize: 10, color: C.textLight }}>{priceNote}</div>}
        </div>
        <button onClick={onToggle} style={{
          padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
          background: selected ? C.accent : C.surface,
          color: selected ? "white" : C.accent,
          border: `1.5px solid ${C.accent}`,
          cursor: "pointer", transition: "all 0.15s",
        }}>
          {selected ? "✓ Added" : cta}
        </button>
      </div>
    </div>
    {selected && (
      <div style={{ padding: "8px 14px", background: C.greenLight, borderTop: `1px solid ${C.greenBorder}` }}>
        <div style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>✓ Will be sorted before your trip — details sent to your email</div>
      </div>
    )}
  </div>
);

export default function AddOnWireframe() {
  const [selected, setSelected] = useState({});
  const toggle = (key) => setSelected(prev => ({ ...prev, [key]: !prev[key] }));

  const totalSelected = Object.values(selected).filter(Boolean).length;

  const addons = [
    {
      key: "esim",
      icon: "📶",
      title: "Stay connected abroad",
      subtitle: "Local data in 190+ countries — activate before you land",
      description: "Skip the roaming charges. A local data plan means your maps, messages, and bookings work from the moment you arrive.",
      price: "From NZD $28",
      priceNote: "28 days · UK coverage",
      cta: "Add eSIM",
      tag: "Recommended",
    },
    {
      key: "insurance",
      icon: "🛡️",
      title: "Travel insurance",
      subtitle: "Medical, cancellation, and baggage cover for your trip",
      description: "Covers the unexpected — medical emergencies, cancelled flights, lost luggage, and trip interruption. Your dates and destination are already set.",
      price: "From NZD $89",
      priceNote: "28 nights · 2 adults · UK",
      cta: "Get covered",
      tag: "Recommended",
    },
    {
      key: "fx",
      icon: "💳",
      title: "Travel money card",
      subtitle: "Spend in GBP with no foreign transaction fees",
      description: "Load GBP before you go and spend at the real exchange rate. No fees at ATMs or contactless payments across the UK.",
      price: "No card fee",
      priceNote: "Exchange rate applies",
      cta: "Get card",
    },
    {
      key: "transfer",
      icon: "🚐",
      title: "Airport transfer",
      subtitle: "London Heathrow → Marylebone · 27 August",
      description: "Meet and greet at arrivals. Fixed price, no meter running in traffic. Fits 2 passengers and luggage.",
      price: "NZD $95",
      priceNote: "Fixed price · 27 Aug",
      cta: "Book transfer",
    },
  ];

  const totalCost = [
    selected.esim ? 28 : 0,
    selected.insurance ? 89 : 0,
    selected.fx ? 0 : 0,
    selected.transfer ? 95 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#F0F0F0", minHeight: "100vh", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ maxWidth: 800, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>Voyager — Wireframe 03</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Add-On Offer Screen</div>
        </div>
        <div style={{ fontSize: 11, color: C.textLight, background: "#FFFDE7", border: "1px solid #F0C040", borderRadius: 8, padding: "4px 10px" }}>
          📐 Wireframe — structure only
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto 20px", background: C.surface, borderRadius: 12, padding: "14px 20px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Context</div>
        <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6 }}>
          This screen appears immediately after the unlock payment is confirmed. The user has just committed to their trip — highest purchase intent in the entire flow. 
          All recommendations are contextual: destination, duration, dates, and party size are already known. Everything is optional and skippable in one tap.
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center" }}>
        <Phone label="Screen 5 — Add-Ons">
          {/* Header */}
          <div style={{ padding: "14px 20px 10px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: C.green, fontWeight: 700, marginBottom: 3 }}>✓ Trip unlocked — London & Beyond, 28 nights</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 2 }}>A few things worth sorting now</div>
            <div style={{ fontSize: 11, color: C.textMid }}>Everything below is optional — tailored to your trip</div>
          </div>

          {/* Add-on cards */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
            <WireframeNote text="Cards are contextual — airport transfer matches actual arrival airport and date" />

            {addons.map(addon => (
              <AddOnCard
                key={addon.key}
                {...addon}
                selected={!!selected[addon.key]}
                onToggle={() => toggle(addon.key)}
              />
            ))}

            {/* Summary if items selected */}
            {totalSelected > 0 && (
              <div style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{totalSelected} item{totalSelected > 1 ? "s" : ""} added</div>
                  {totalCost > 0 && <div style={{ fontSize: 13, fontWeight: 800, color: C.accent }}>NZD ${totalCost}+</div>}
                </div>
                <button style={{
                  width: "100%", padding: "11px", borderRadius: 10, background: C.accent,
                  color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>
                  Continue to my itinerary →
                </button>
              </div>
            )}

            {/* Skip option — always visible */}
            <button style={{
              width: "100%", padding: "11px", borderRadius: 10,
              background: "none", border: `1px solid ${C.border}`,
              color: C.textMid, fontSize: 12, fontWeight: 600, cursor: "pointer",
              marginBottom: 8,
            }}>
              Skip — go straight to my itinerary
            </button>

            <div style={{ fontSize: 10, color: C.textLight, textAlign: "center", lineHeight: 1.5, paddingBottom: 8 }}>
              These can also be accessed later from your trip dashboard
            </div>
          </div>
        </Phone>
      </div>

      {/* Design notes */}
      <div style={{ maxWidth: 800, margin: "20px auto 0", background: C.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Key design decisions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["Contextual pricing", "Every card shows pricing specific to this trip — 28 days UK eSIM, 2-adult insurance, actual arrival airport transfer."],
            ["Recommended tags", "eSIM and insurance are tagged as recommended — the two most universally relevant for international trips."],
            ["Skip always visible", "One tap to skip all. No dark patterns, no forced selections. The skip link also notes add-ons are accessible later."],
            ["No Voyager Assurance", "Removed — Voyager's liability is covered by business indemnity insurance. Customer exposure is covered by travel insurance."],
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
