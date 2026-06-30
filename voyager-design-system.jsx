import { useState } from "react";

const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;500;600;700;800&display=swap');
`;

// ── CONFIRMED DESIGN SYSTEM — VOYAGER
// Palette: Coastal Retreat x Olive Oasis — Warm Balance
// Typography: Libre Baskerville + Nunito
// Radius: Bold & Rounded

const DS = {
  // ── COLOUR TOKENS
  colors: {
    // Core
    accent:       "#7F543D",  // Primary — warm terracotta. CTAs, links, highlights
    accentLight:  "#F4EDE7",  // Accent wash — backgrounds behind accent elements
    accentDark:   "#50321E",  // Accent pressed / deep state
    secondary:    "#74A8A4",  // Secondary — coastal teal. Supporting accents, tags, icons
    secondaryLight: "#E8F2F2",// Secondary wash

    // Hero / dark surfaces
    hero:         "#2C4858",  // Trip card hero background
    heroAlt:      "#335765",  // Slightly lighter hero variant

    // Backgrounds
    bg:           "#E9E4DC",  // App background — warm off-white
    surface:      "#FDFAF6",  // Card / sheet surface — warm white
    surfaceAlt:   "#F4F0E8",  // Slightly warmer surface variant

    // Borders
    border:       "#D4CCBE",  // Default border
    borderStrong: "#B8AE9E",  // Stronger border for emphasis

    // Text
    text:         "#1A1E22",  // Primary text — near black with cool undertone
    textMid:      "#504840",  // Secondary text — warm mid
    textLight:    "#948A80",  // Tertiary / placeholder text

    // UI
    tag:          "#EDE8E0",  // Chip / tag background
    overlay:      "rgba(26,30,34,0.5)", // Modal overlay

    // Status — green (confirmed bookings)
    green:        "#74A8A4",  // Using secondary teal as confirmed state
    greenLight:   "#E8F2F2",
    greenBorder:  "#A8CCC8",

    // Status — amber (alerts, partial)
    amber:        "#CB7A5C",  // Warm amber alert — from Olive Oasis terracotta
    amberLight:   "#FAF0EB",
    amberBorder:  "#E8B89A",

    // Status — red (errors)
    red:          "#C53030",
    redLight:     "#FFF5F5",
    redBorder:    "#FEB2B2",

    // White / black
    white:        "#FFFFFF",
    black:        "#000000",
  },

  // ── TYPOGRAPHY TOKENS
  typography: {
    // Families
    heading: "'Libre Baskerville', Georgia, serif",
    body:    "'Nunito', system-ui, sans-serif",
    mono:    "ui-monospace, 'SF Mono', Consolas, monospace",

    // Scale
    sizes: {
      xs:   9,
      sm:   11,
      base: 13,
      md:   15,
      lg:   18,
      xl:   22,
      xxl:  28,
      hero: 34,
    },

    // Weights
    weights: {
      regular: 400,
      medium:  500,
      semibold: 600,
      bold:    700,
      black:   800,
    },

    // Line heights
    leading: {
      tight:   1.2,
      snug:    1.4,
      normal:  1.6,
      relaxed: 1.8,
    },

    // Letter spacing
    tracking: {
      tight:  "-0.02em",
      normal: "0",
      wide:   "0.04em",
      wider:  "0.08em",
      widest: "0.12em",
    },
  },

  // ── RADIUS TOKENS — Bold & Rounded
  radius: {
    xs:   8,   // Small inline elements
    sm:   12,  // Chips, small cards
    md:   20,  // Standard cards
    lg:   24,  // Buttons, large cards
    xl:   32,  // Bottom sheets, modal cards
    full: 9999, // Pills
  },

  // ── SPACING TOKENS
  spacing: {
    1:  4,
    2:  8,
    3:  12,
    4:  16,
    5:  20,
    6:  24,
    8:  32,
    10: 40,
    12: 48,
    16: 64,
  },

  // ── SHADOW TOKENS
  shadows: {
    sm:   "0 1px 4px rgba(26,30,34,0.08)",
    md:   "0 4px 16px rgba(26,30,34,0.10)",
    lg:   "0 8px 32px rgba(26,30,34,0.14)",
    hero: "0 4px 24px rgba(44,72,88,0.25)",
  },
};

// ── COMPONENT PREVIEWS
const C = DS.colors;
const heading = (size, weight = 700, extra = {}) => ({
  fontFamily: DS.typography.heading,
  fontSize: size,
  fontWeight: weight,
  ...extra,
});
const body = (size, weight = 400, extra = {}) => ({
  fontFamily: DS.typography.body,
  fontSize: size,
  fontWeight: weight,
  ...extra,
});

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ fontSize: 10, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, ...body(10, 700) }}>{title}</div>
    {children}
  </div>
);

const Token = ({ name, value, preview }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
    {preview}
    <div style={{ flex: 1 }}>
      <div style={{ ...body(11, 700), color: C.text }}>{name}</div>
      <div style={{ ...body(10, 400), color: C.textLight, fontFamily: DS.typography.mono }}>{value}</div>
    </div>
  </div>
);

export default function DesignSystem() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "colours", label: "Colours" },
    { id: "typography", label: "Typography" },
    { id: "components", label: "Components" },
    { id: "tokens", label: "Tokens" },
  ];

  return (
    <div style={{ fontFamily: DS.typography.body, background: C.bg, minHeight: "100vh" }}>
      <style>{FONT_STYLES}</style>

      {/* Header */}
      <div style={{ background: C.hero, padding: "20px 28px", position: "sticky", top: 0, zIndex: 100, boxShadow: DS.shadows.hero }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ ...body(9, 700), color: `${C.accent}CC`, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Voyager</div>
              <div style={{ ...heading(22), color: C.white }}>Design System</div>
              <div style={{ ...body(11), color: "rgba(255,255,255,0.45)", marginTop: 3 }}>Warm Balance · Libre Baskerville · Bold & Rounded</div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {["#2C4858","#7F543D","#74A8A4","#E9E4DC","#FDFAF6"].map((s, i) => (
                <div key={i} style={{ width: 20, height: 20, borderRadius: DS.radius.xs, background: s, border: "1px solid rgba(255,255,255,0.12)" }} />
              ))}
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "6px 14px", borderRadius: DS.radius.full, ...body(11, 600),
                background: activeTab === tab.id ? C.accent : "rgba(255,255,255,0.08)",
                color: activeTab === tab.id ? "white" : "rgba(255,255,255,0.6)",
                border: "none", cursor: "pointer", transition: "all 0.15s",
              }}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <Section title="Design Principles">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  ["Warm & Luxurious", "Every surface and tone should feel expensive and considered. Warm whites, rich darks, no clinical greys."],
                  ["Modern & Crisp", "Bold radius and confident typography. Clean layouts with generous whitespace. Never cluttered."],
                  ["Expert, Not Robotic", "Language and design both position Voyager as a knowledgeable companion — never an automated tool."],
                  ["Consistent Throughout", "The same design language applies from onboarding through companion mode. One product, one feel."],
                ].map(([title, desc]) => (
                  <div key={title} style={{ background: C.surface, borderRadius: DS.radius.md, padding: "16px", border: `1px solid ${C.border}` }}>
                    <div style={{ ...heading(13), color: C.accent, marginBottom: 6 }}>{title}</div>
                    <div style={{ ...body(11), color: C.textMid, lineHeight: DS.typography.leading.normal }}>{desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Palette at a Glance">
              <div style={{ display: "flex", gap: 0, borderRadius: DS.radius.md, overflow: "hidden", marginBottom: 16, boxShadow: DS.shadows.md }}>
                {[
                  { color: C.hero, label: "Hero", hex: "#2C4858" },
                  { color: C.accent, label: "Accent", hex: "#7F543D" },
                  { color: C.secondary, label: "Secondary", hex: "#74A8A4" },
                  { color: C.bg, label: "Background", hex: "#E9E4DC" },
                  { color: C.surface, label: "Surface", hex: "#FDFAF6" },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: s.color, padding: "20px 12px 12px", minHeight: 80 }}>
                    <div style={{ ...body(9, 700), color: i < 2 ? "rgba(255,255,255,0.6)" : C.textMid, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ ...body(9, 400), color: i < 2 ? "rgba(255,255,255,0.4)" : C.textLight, fontFamily: DS.typography.mono }}>{s.hex}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Typography Scale">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "20px", border: `1px solid ${C.border}` }}>
                {[
                  ["Hero / Display", 34, true, "London & Beyond"],
                  ["H1 / Trip Title", 22, true, "London & Beyond"],
                  ["H2 / Section", 18, true, "The Cotswolds"],
                  ["H3 / Card Title", 14, true, "Day 8 — Burford"],
                  ["Body / Primary", 13, false, "Your complete 28-night trip plan, built around your travel style and budget."],
                  ["Body / Small", 11, false, "Tap to view full itinerary and booking details for this day."],
                  ["Label / Uppercase", 9, false, "Active trip · Day 8"],
                ].map(([label, size, isHeading, sample]) => (
                  <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 140, ...body(9, 700), color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>{label}</div>
                    <div style={{ flex: 1, ...(isHeading ? heading(size) : body(size)), color: C.text, ...(label.includes("Uppercase") ? { textTransform: "uppercase", letterSpacing: "0.1em", ...body(size, 700) } : {}) }}>
                      {sample}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Radius Scale">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {Object.entries(DS.radius).filter(([k]) => k !== "full").map(([name, val]) => (
                  <div key={name} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: val, padding: "16px 20px", textAlign: "center" }}>
                    <div style={{ ...body(13, 700), color: C.accent }}>{val}px</div>
                    <div style={{ ...body(9), color: C.textLight }}>{name}</div>
                  </div>
                ))}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: DS.radius.full, padding: "16px 20px", textAlign: "center" }}>
                  <div style={{ ...body(13, 700), color: C.accent }}>9999</div>
                  <div style={{ ...body(9), color: C.textLight }}>full</div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* COLOURS */}
        {activeTab === "colours" && (
          <div>
            <Section title="Primary Colours">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { name: "Accent", token: "colors.accent", hex: C.accent, bg: C.accent, textCol: "white", desc: "CTAs, links, active states, key highlights" },
                  { name: "Accent Light", token: "colors.accentLight", hex: C.accentLight, bg: C.accentLight, textCol: C.accent, desc: "Backgrounds behind accent elements, selected states" },
                  { name: "Accent Dark", token: "colors.accentDark", hex: C.accentDark, bg: C.accentDark, textCol: "white", desc: "Pressed / active accent state" },
                  { name: "Secondary", token: "colors.secondary", hex: C.secondary, bg: C.secondary, textCol: "white", desc: "Supporting accents, confirmed booking states, secondary CTAs" },
                  { name: "Secondary Light", token: "colors.secondaryLight", hex: C.secondaryLight, bg: C.secondaryLight, textCol: C.secondary, desc: "Backgrounds for secondary accent elements" },
                  { name: "Hero", token: "colors.hero", hex: C.hero, bg: C.hero, textCol: "white", desc: "Trip card hero backgrounds, primary dark surface" },
                ].map(s => (
                  <div key={s.name} style={{ borderRadius: DS.radius.md, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: DS.shadows.sm }}>
                    <div style={{ background: s.bg, height: 60, display: "flex", alignItems: "flex-end", padding: "8px 12px" }}>
                      <div style={{ ...body(9, 700), color: s.textCol, opacity: 0.7, fontFamily: DS.typography.mono }}>{s.hex}</div>
                    </div>
                    <div style={{ background: C.surface, padding: "10px 12px" }}>
                      <div style={{ ...body(11, 700), color: C.text, marginBottom: 2 }}>{s.name}</div>
                      <div style={{ ...body(9, 400), color: C.textLight, fontFamily: DS.typography.mono, marginBottom: 4 }}>{s.token}</div>
                      <div style={{ ...body(9), color: C.textMid, lineHeight: 1.4 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Background & Surface">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { name: "Background", token: "colors.bg", hex: C.bg, desc: "App background — warm off-white" },
                  { name: "Surface", token: "colors.surface", hex: C.surface, desc: "Card and sheet surfaces — warm white" },
                  { name: "Surface Alt", token: "colors.surfaceAlt", hex: C.surfaceAlt, desc: "Slightly warmer surface for nesting" },
                  { name: "Tag", token: "colors.tag", hex: C.tag, desc: "Chip and tag backgrounds" },
                  { name: "Border", token: "colors.border", hex: C.border, desc: "Default border — all cards and inputs" },
                  { name: "Border Strong", token: "colors.borderStrong", hex: C.borderStrong, desc: "Emphasis borders, active input rings" },
                ].map(s => (
                  <div key={s.name} style={{ borderRadius: DS.radius.md, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: DS.shadows.sm }}>
                    <div style={{ background: s.hex, height: 40, border: `1px solid ${C.borderStrong}` }} />
                    <div style={{ background: C.surface, padding: "10px 12px" }}>
                      <div style={{ ...body(11, 700), color: C.text, marginBottom: 1 }}>{s.name}</div>
                      <div style={{ ...body(9), color: C.textLight, fontFamily: DS.typography.mono, marginBottom: 3 }}>{s.hex}</div>
                      <div style={{ ...body(9), color: C.textMid }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Status Colours">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { name: "Confirmed / Booked", bg: C.greenLight, border: C.greenBorder, text: C.green, label: "✓ Booked", desc: "Confirmed bookings, completed states" },
                  { name: "Alert / Partial", bg: C.amberLight, border: C.amberBorder, text: C.amber, label: "⚠ Partial", desc: "Alerts, partial bookings, attention needed" },
                  { name: "Error", bg: C.redLight, border: C.redBorder, text: C.red, label: "✕ Error", desc: "Error states, destructive actions" },
                ].map(s => (
                  <div key={s.name} style={{ borderRadius: DS.radius.md, background: s.bg, border: `1.5px solid ${s.border}`, padding: "14px 16px" }}>
                    <div style={{ ...body(13, 700), color: s.text, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ ...body(10, 700), color: C.text, marginBottom: 3 }}>{s.name}</div>
                    <div style={{ ...body(9), color: C.textMid }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Text Colours">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "16px", border: `1px solid ${C.border}` }}>
                {[
                  { name: "Text Primary", token: "colors.text", hex: C.text, sample: "Primary headings and body text" },
                  { name: "Text Mid", token: "colors.textMid", hex: C.textMid, sample: "Secondary text, descriptions, labels" },
                  { name: "Text Light", token: "colors.textLight", hex: C.textLight, sample: "Tertiary text, placeholders, metadata" },
                ].map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: DS.radius.sm, background: s.hex, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ ...body(13), color: s.hex, marginBottom: 1 }}>{s.sample}</div>
                      <div style={{ ...body(9), color: C.textLight, fontFamily: DS.typography.mono }}>{s.token} · {s.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* TYPOGRAPHY */}
        {activeTab === "typography" && (
          <div>
            <Section title="Font Families">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "20px", border: `1px solid ${C.border}` }}>
                  <div style={{ ...body(9, 700), color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Heading — Libre Baskerville</div>
                  <div style={{ ...heading(28), color: C.text, marginBottom: 8 }}>London</div>
                  <div style={{ ...heading(22), color: C.text, marginBottom: 8 }}>& Beyond</div>
                  <div style={{ ...heading(16, 400, { fontStyle: "italic" }), color: C.textMid, marginBottom: 12 }}>28 nights · 2 adults</div>
                  <div style={{ ...body(9), color: C.textLight, fontFamily: DS.typography.mono }}>typography.heading</div>
                </div>
                <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "20px", border: `1px solid ${C.border}` }}>
                  <div style={{ ...body(9, 700), color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Body — Nunito</div>
                  <div style={{ ...body(15, 700), color: C.text, marginBottom: 6 }}>Your trip is ready</div>
                  <div style={{ ...body(13), color: C.textMid, lineHeight: 1.6, marginBottom: 8 }}>Your complete 28-night plan covering flights, accommodation, activities, dining, and transfers — ready to book.</div>
                  <div style={{ ...body(11), color: C.textLight, marginBottom: 12 }}>Tap to see full itinerary details and booking links.</div>
                  <div style={{ ...body(9), color: C.textLight, fontFamily: DS.typography.mono }}>typography.body</div>
                </div>
              </div>
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "16px 20px", border: `1px solid ${C.border}` }}>
                <div style={{ ...body(9, 700), color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Monospace — System Mono</div>
                <div style={{ ...body(13), color: C.text, fontFamily: DS.typography.mono, marginBottom: 4 }}>NZ-ABC123 · BK-XY9871 · TL-223441</div>
                <div style={{ ...body(9), color: C.textLight, fontFamily: DS.typography.mono }}>Booking references, codes, technical values only</div>
              </div>
            </Section>

            <Section title="Type Scale">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "20px", border: `1px solid ${C.border}` }}>
                {[
                  { label: "Hero / 34px", size: 34, isH: true, sample: "Japan" },
                  { label: "H1 / 22px", size: 22, isH: true, sample: "London & Beyond" },
                  { label: "H2 / 18px", size: 18, isH: true, sample: "The Cotswolds" },
                  { label: "H3 / 14px", size: 14, isH: true, sample: "Day 8 — Burford & Bibury" },
                  { label: "Body Large / 15px", size: 15, isH: false, sample: "Your complete 28-night trip plan, built around your travel style." },
                  { label: "Body / 13px", size: 13, isH: false, sample: "Tap to view full itinerary and all booking details for this day." },
                  { label: "Body Small / 11px", size: 11, isH: false, sample: "Booking confirmation imported · Ref: NZ-ABC123" },
                  { label: "Label / 9px", size: 9, isH: false, sample: "ACTIVE TRIP · DAY 8 · CONFIRMED", upper: true },
                ].map(t => (
                  <div key={t.label} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 150, ...body(9, 700), color: C.textLight, flexShrink: 0 }}>{t.label}</div>
                    <div style={{ flex: 1, ...(t.isH ? heading(t.size) : body(t.size)), color: C.text, ...(t.upper ? { textTransform: "uppercase", letterSpacing: "0.1em" } : {}) }}>
                      {t.sample}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* COMPONENTS */}
        {activeTab === "components" && (
          <div>
            <Section title="Buttons">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "20px", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Primary CTA", bg: C.accent, color: "white", border: "none", text: "Unlock my trip →" },
                  { label: "Secondary", bg: C.surface, color: C.accent, border: `1.5px solid ${C.accent}`, text: "Ask Voyager" },
                  { label: "Ghost / Tertiary", bg: "transparent", color: C.textMid, border: `1px solid ${C.border}`, text: "Skip for now" },
                  { label: "Destructive", bg: C.redLight, color: C.red, border: `1px solid ${C.redBorder}`, text: "Remove activity" },
                ].map(b => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 110, ...body(9, 700), color: C.textLight }}>{b.label}</div>
                    <button style={{ padding: "12px 24px", borderRadius: DS.radius.lg, background: b.bg, color: b.color, border: b.border, ...body(13, 700), cursor: "pointer" }}>{b.text}</button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Chips & Tags">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "20px", border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {[
                    { text: "✈️ Flights", bg: C.tag, color: C.textMid, border: "none" },
                    { text: "🏨 Hotels", bg: C.tag, color: C.textMid, border: "none" },
                    { text: "🚂 Rail", bg: C.tag, color: C.textMid, border: "none" },
                    { text: "Recommended", bg: C.accentLight, color: C.accent, border: `1px solid ${C.accent}35` },
                    { text: "✓ Confirmed", bg: C.greenLight, color: C.secondary, border: `1px solid ${C.greenBorder}` },
                    { text: "⚠ Partial", bg: C.amberLight, color: C.amber, border: `1px solid ${C.amberBorder}` },
                    { text: "👥 Shared", bg: "#F3F0FF", color: "#7C3AED", border: "none" },
                    { text: "👤 Individual", bg: C.secondaryLight, color: C.secondary, border: "none" },
                  ].map(chip => (
                    <div key={chip.text} style={{ padding: "6px 14px", borderRadius: DS.radius.full, background: chip.bg, color: chip.color, border: chip.border || "none", ...body(11, 700) }}>
                      {chip.text}
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Cards">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Trip hero card */}
                <div style={{ borderRadius: DS.radius.xl, overflow: "hidden", boxShadow: DS.shadows.hero }}>
                  <div style={{ background: `linear-gradient(150deg, ${C.hero}, #335765)`, padding: "20px" }}>
                    <div style={{ ...body(9, 700), color: `${C.accent}CC`, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>Active trip · Day 8</div>
                    <div style={{ ...heading(24), color: C.white, marginBottom: 4 }}>London & Beyond</div>
                    <div style={{ ...body(11), color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>27 Aug — 24 Sep · 28 nights · 2 adults</div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: "50%", background: `linear-gradient(90deg, ${C.accent}, ${C.secondary})`, borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ background: C.accentLight, padding: "12px 16px", display: "flex", gap: 8 }}>
                    {[["52", "days to go", C.accent], ["14", "booked", C.secondary], ["3", "alerts", C.amber]].map(([n, l, col]) => (
                      <div key={l} style={{ flex: 1, padding: "8px", background: C.surface, borderRadius: DS.radius.md, textAlign: "center" }}>
                        <div style={{ ...body(16, 800), color: col }}>{n}</div>
                        <div style={{ ...body(9), color: C.textLight }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day card — partial */}
                <div style={{ borderRadius: DS.radius.lg, border: `1.5px solid ${C.amberBorder}`, background: C.amberLight, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ ...body(9, 700), color: C.textLight, marginBottom: 3 }}>Day 8 · Thu 4 Sep</div>
                      <div style={{ ...heading(15), color: C.text, marginBottom: 3 }}>The Cotswolds</div>
                      <div style={{ ...body(11), color: C.textMid }}>Burford & Bibury · Car hire</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber }} />
                      <div style={{ ...body(10, 700), color: C.amber }}>Partial</div>
                    </div>
                  </div>
                </div>

                {/* Day card — booked */}
                <div style={{ borderRadius: DS.radius.lg, border: `1.5px solid ${C.greenBorder}`, background: C.greenLight, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ ...body(9, 700), color: C.textLight, marginBottom: 3 }}>Day 2 · Fri 28 Aug</div>
                      <div style={{ ...heading(15), color: C.text, marginBottom: 3 }}>Settling in — London</div>
                      <div style={{ ...body(11), color: C.textMid }}>Marylebone · Hotel confirmed</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.secondary }} />
                      <div style={{ ...body(10, 700), color: C.secondary }}>✓ Booked</div>
                    </div>
                  </div>
                </div>

                {/* No hidden fees banner */}
                <div style={{ borderRadius: DS.radius.lg, background: C.greenLight, border: `1px solid ${C.greenBorder}`, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16 }}>✓</span>
                  <div style={{ ...body(11, 700), color: C.secondary, lineHeight: 1.5 }}>
                    No hidden fees — this is the only Voyager charge. Every flight, hotel, and activity is booked at its standard published price.
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Inputs">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "20px", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ ...body(10, 700), color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Destination ✱</div>
                  <div style={{ padding: "12px 16px", borderRadius: DS.radius.lg, border: `1.5px solid ${C.accent}`, ...body(13), color: C.text, background: C.surface }}>London</div>
                </div>
                <div>
                  <div style={{ ...body(10, 700), color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Travel style <span style={{ fontWeight: 400, color: C.textLight }}>(optional)</span></div>
                  <div style={{ padding: "12px 16px", borderRadius: DS.radius.lg, border: `1.5px solid ${C.border}`, ...body(13), color: C.textLight, background: C.surface }}>e.g. relaxed, cultural, adventure...</div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* TOKENS */}
        {activeTab === "tokens" && (
          <div>
            <Section title="Colour Tokens — for Claude Code">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "16px", border: `1px solid ${C.border}`, fontFamily: DS.typography.mono }}>
                <pre style={{ fontSize: 11, color: C.text, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
{`// Voyager Design System — Colour Tokens
// Palette: Coastal Retreat x Olive Oasis — Warm Balance

const colors = {
  // Primary
  accent:          "#7F543D",  // Warm terracotta — CTAs, highlights
  accentLight:     "#F4EDE7",  // Accent wash
  accentDark:      "#50321E",  // Pressed accent
  secondary:       "#74A8A4",  // Coastal teal — secondary, confirmed
  secondaryLight:  "#E8F2F2",  // Secondary wash

  // Hero
  hero:            "#2C4858",  // Trip card dark background
  heroAlt:         "#335765",  // Lighter hero variant

  // Surfaces
  bg:              "#E9E4DC",  // App background
  surface:         "#FDFAF6",  // Card / sheet
  surfaceAlt:      "#F4F0E8",  // Nested surface

  // Borders
  border:          "#D4CCBE",  // Default
  borderStrong:    "#B8AE9E",  // Emphasis

  // Text
  text:            "#1A1E22",  // Primary
  textMid:         "#504840",  // Secondary
  textLight:       "#948A80",  // Tertiary

  // UI
  tag:             "#EDE8E0",  // Chip backgrounds
  overlay:         "rgba(26,30,34,0.5)",

  // Status
  green:           "#74A8A4",  // Confirmed — teal
  greenLight:      "#E8F2F2",
  greenBorder:     "#A8CCC8",
  amber:           "#CB7A5C",  // Alert — warm terracotta
  amberLight:      "#FAF0EB",
  amberBorder:     "#E8B89A",
  red:             "#C53030",  // Error
  redLight:        "#FFF5F5",
  redBorder:       "#FEB2B2",
};`}
                </pre>
              </div>
            </Section>

            <Section title="Typography Tokens — for Claude Code">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "16px", border: `1px solid ${C.border}`, fontFamily: DS.typography.mono }}>
                <pre style={{ fontSize: 11, color: C.text, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
{`// Voyager Design System — Typography Tokens
// Heading: Libre Baskerville (Google Fonts)
// Body: Nunito (Google Fonts)

const typography = {
  heading: "'Libre Baskerville', Georgia, serif",
  body:    "'Nunito', system-ui, sans-serif",
  mono:    "ui-monospace, 'SF Mono', Consolas, monospace",

  sizes: {
    xs: 9, sm: 11, base: 13, md: 15,
    lg: 18, xl: 22, xxl: 28, hero: 34,
  },

  weights: {
    regular: 400, medium: 500,
    semibold: 600, bold: 700, black: 800,
  },
};

// Google Fonts import
// @import url('https://fonts.googleapis.com/css2?
//   family=Libre+Baskerville:ital,wght@0,400;0,700;1,400
//   &family=Nunito:wght@400;500;600;700;800
//   &display=swap');`}
                </pre>
              </div>
            </Section>

            <Section title="Radius & Spacing Tokens — for Claude Code">
              <div style={{ background: C.surface, borderRadius: DS.radius.md, padding: "16px", border: `1px solid ${C.border}`, fontFamily: DS.typography.mono }}>
                <pre style={{ fontSize: 11, color: C.text, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
{`// Voyager Design System — Radius & Spacing
// Style: Bold & Rounded

const radius = {
  xs:   8,    // Small inline elements
  sm:   12,   // Chips, small cards
  md:   20,   // Standard cards
  lg:   24,   // Buttons, large cards
  xl:   32,   // Bottom sheets, modals
  full: 9999, // Pills, fully rounded
};

const spacing = {
  1: 4,   2: 8,   3: 12,  4: 16,
  5: 20,  6: 24,  8: 32,  10: 40,
  12: 48, 16: 64,
};

const shadows = {
  sm:   "0 1px 4px rgba(26,30,34,0.08)",
  md:   "0 4px 16px rgba(26,30,34,0.10)",
  lg:   "0 8px 32px rgba(26,30,34,0.14)",
  hero: "0 4px 24px rgba(44,72,88,0.25)",
};`}
                </pre>
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
