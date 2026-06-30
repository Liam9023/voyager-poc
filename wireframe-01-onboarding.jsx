import { useState, useEffect } from "react";

// ── DESIGN TOKENS (wireframe style — greyscale with Voyager accent for CTAs only)
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
  locked: "#E8E8E8",
  lockedText: "#AAAAAA",
  tag: "#EFEFEF",
};

// ── SHARED COMPONENTS
const Phone = ({ children, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>}
    <div style={{
      width: 320, minHeight: 620, background: C.surface, borderRadius: 36,
      border: `2px solid ${C.borderDark}`, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      overflow: "hidden", display: "flex", flexDirection: "column", position: "relative",
    }}>
      {/* Status bar */}
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

const TopBar = ({ title, onBack, step, totalSteps }) => (
  <div style={{ padding: "12px 20px 8px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
    {onBack && (
      <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.textMid, padding: 0, lineHeight: 1 }}>‹</button>
    )}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{title}</div>
      {step && <div style={{ fontSize: 10, color: C.textLight, marginTop: 1 }}>Step {step} of {totalSteps}</div>}
    </div>
    {step && (
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{ width: 20, height: 3, borderRadius: 2, background: i < step ? C.accent : C.border }} />
        ))}
      </div>
    )}
  </div>
);

const Field = ({ label, value, placeholder, type = "text" }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{label}</div>
    <div style={{
      padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${value ? C.accent : C.border}`,
      fontSize: 13, color: value ? C.text : C.textLight, background: C.surface,
    }}>
      {value || placeholder}
    </div>
  </div>
);

const SelectChip = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${selected ? C.accent : C.border}`,
    background: selected ? C.accentLight : C.surface, color: selected ? C.accent : C.textMid,
    fontSize: 12, fontWeight: selected ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap",
  }}>
    {label}
  </button>
);

const CTAButton = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: "100%", padding: "14px", borderRadius: 14, background: disabled ? C.locked : C.accent,
    color: disabled ? C.lockedText : "white", fontSize: 14, fontWeight: 700,
    border: "none", cursor: disabled ? "default" : "pointer", marginTop: 8,
  }}>
    {label}
  </button>
);

const SecondaryButton = ({ label, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", padding: "12px", borderRadius: 14, background: C.surface,
    color: C.accent, fontSize: 13, fontWeight: 600, border: `1.5px solid ${C.accent}`,
    cursor: "pointer", marginTop: 8,
  }}>
    {label}
  </button>
);

const WireframeNote = ({ text }) => (
  <div style={{ background: "#FFFDE7", border: "1px dashed #F0C040", borderRadius: 8, padding: "8px 12px", margin: "8px 0" }}>
    <span style={{ fontSize: 10, color: "#7A6000", fontWeight: 600 }}>📐 {text}</span>
  </div>
);

// ── SCREENS
const SCREENS = {
  // 0 — Welcome / path selection
  welcome: ({ go }) => (
    <Phone label="Screen 1 — Welcome">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 20px 20px" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Voyager</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text, lineHeight: 1.2, marginBottom: 8 }}>Plan your trip,<br />your way.</div>
          <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5 }}>
            Tell us about your trip and we'll build a complete, expert itinerary — ready to book.
          </div>
        </div>

        <WireframeNote text="Path selection — user chooses how they want to plan" />

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          <button onClick={() => go("form1")} style={{
            padding: "16px", borderRadius: 14, border: `1.5px solid ${C.border}`,
            background: C.surface, textAlign: "left", cursor: "pointer",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>📋 Quick form</div>
            <div style={{ fontSize: 11, color: C.textMid }}>Fill in your trip details — ready in under 2 minutes</div>
          </button>

          <button onClick={() => go("form1_detailed")} style={{
            padding: "16px", borderRadius: 14, border: `1.5px solid ${C.border}`,
            background: C.surface, textAlign: "left", cursor: "pointer",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>🎯 Detailed planner</div>
            <div style={{ fontSize: 11, color: C.textMid }}>Full control over every preference and detail</div>
          </button>

          <button onClick={() => go("convo")} style={{
            padding: "16px", borderRadius: 14, border: `1.5px solid ${C.border}`,
            background: C.surface, textAlign: "left", cursor: "pointer",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>💬 Chat with Voyager</div>
            <div style={{ fontSize: 11, color: C.textMid }}>Describe your trip and we'll figure out the rest</div>
          </button>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.textLight }}>Already have an account? <span style={{ color: C.accent, fontWeight: 600 }}>Sign in</span></div>
        </div>
      </div>
    </Phone>
  ),

  // 1 — Standard form screen 1
  form1: ({ go }) => {
    const [origin, setOrigin] = useState("Auckland");
    const [dest, setDest] = useState("");
    const [depart, setDepart] = useState("");
    const [ret, setRet] = useState("");
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const ready = dest && depart;

    return (
      <Phone label="Screen 2a — Standard Form (Trip Details)">
        <TopBar title="Your trip" onBack={() => go("welcome")} step={1} totalSteps={2} />
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>✱ Required</span>
          <span style={{ fontSize: 10, color: C.textLight }}>— everything else is optional</span>
        </div>
        <Field label="Flying from ✱" value={origin} placeholder="City or airport" />
          <Field label="Destination ✱" value={dest} placeholder="Where to? (one or more)" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Depart</div>
              <div style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.textLight }}>Select date</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Return</div>
              <div style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.textLight }}>Select date</div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Travellers</div>
            <div style={{ display: "flex", gap: 12 }}>
              {[["Adults", adults, setAdults], ["Children", children, setChildren]].map(([label, val, set]) => (
                <div key={label} style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{label}</div>
                    <div style={{ fontSize: 10, color: C.textLight }}>{label === "Children" ? "Under 12" : "18+"}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => set(Math.max(0, val - 1))} style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text, minWidth: 16, textAlign: "center" }}>{val}</span>
                    <button onClick={() => set(val + 1)} style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CTAButton label="Continue →" onClick={() => go("form2")} disabled={!ready} />
        </div>
      </Phone>
    );
  },

  // 2 — Standard form screen 2
  form2: ({ go }) => {
    const [budget, setBudget] = useState("Mid-range");
    const [style, setStyle] = useState("Cultural");
    const [accom, setAccom] = useState("Hotel");
    const [notes, setNotes] = useState("");

    return (
      <Phone label="Screen 2b — Standard Form (Preferences)">
        <TopBar title="Your style" onBack={() => go("form1")} step={2} totalSteps={2} />
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#1A6B8A", lineHeight: 1.5 }}>
              💡 <strong>Not sure what you want to do?</strong> Skip everything here — Voyager will build a great itinerary based on the destination alone.
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Budget <span style={{ fontWeight: 400, color: C.textLight }}>(optional)</span></div>
            <div style={{ fontSize: 10, color: C.textLight, marginBottom: 6 }}>Default: mid-range if not selected</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Budget", "Mid-range", "Premium"].map(b => (
                <SelectChip key={b} label={b} selected={budget === b} onClick={() => setBudget(b)} />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Travel style <span style={{ fontWeight: 400, color: C.textLight }}>(optional)</span></div>
            <div style={{ fontSize: 10, color: C.textLight, marginBottom: 6 }}>Default: mixed if not selected</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Relaxed", "Cultural", "Adventure", "Foodie", "Mixed"].map(s => (
                <SelectChip key={s} label={s} selected={style === s} onClick={() => setStyle(s)} />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Accommodation <span style={{ fontWeight: 400, color: C.textLight }}>(optional)</span></div>
            <div style={{ fontSize: 10, color: C.textLight, marginBottom: 6 }}>Default: hotel if not selected</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Hotel", "Apartment / Airbnb", "Either"].map(a => (
                <SelectChip key={a} label={a} selected={accom === a} onClick={() => setAccom(a)} />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Anything specific? <span style={{ fontWeight: 400, color: C.textLight }}>(optional)</span></div>
            <div style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 12, color: C.textLight, minHeight: 60 }}>
              e.g. celebrating our anniversary, travelling with a toddler, want to see the Cotswolds...
            </div>
          </div>
          <WireframeNote text="'Add more detail' expands detailed form fields below" />
          <button onClick={() => go("form2_detailed")} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1px dashed ${C.accent}`, background: C.accentLight, color: C.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
            + Add more detail
          </button>
          <CTAButton label="Build my trip →" onClick={() => go("building")} />
        </div>
      </Phone>
    );
  },

  // 3 — Detailed form expansion
  form2_detailed: ({ go }) => (
    <Phone label="Screen 2c — Detailed Form (Expanded)">
      <TopBar title="More detail" onBack={() => go("form2")} step={2} totalSteps={2} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <WireframeNote text="All fields optional — user fills as many as they want" />
        <Field label="Preferred airlines" placeholder="e.g. Air New Zealand, Emirates" />
        <Field label="Specific areas or neighbourhoods" placeholder="e.g. Stay near Notting Hill, avoid tourist areas" />
        <Field label="Dietary requirements" placeholder="e.g. Vegetarian, gluten free, halal" />
        <Field label="Accessibility needs" placeholder="e.g. Wheelchair accessible, ground floor rooms" />
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Occasion</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Anniversary", "Honeymoon", "Family holiday", "Solo", "Friends trip", "Birthday"].map(o => (
              <SelectChip key={o} label={o} selected={false} onClick={() => {}} />
            ))}
          </div>
        </div>
        <Field label="Must-see destinations or experiences" placeholder="e.g. Stonehenge, afternoon tea, a Premier League match" />
        <Field label="Things to avoid" placeholder="e.g. crowded tourist spots, long bus journeys, seafood" />
        <CTAButton label="Build my trip →" onClick={() => go("building")} />
      </div>
    </Phone>
  ),

  // 4 — Standard form screen 1 with detailed path entry
  form1_detailed: ({ go }) => (
    <Phone label="Screen 2a — Detailed Form (Trip Details)">
      <TopBar title="Your trip" onBack={() => go("welcome")} step={1} totalSteps={3} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <WireframeNote text="Same as standard form screen 1 — 3 steps instead of 2" />
        <Field label="Flying from" value="Auckland" placeholder="City or airport" />
        <Field label="Destination" placeholder="Where to?" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Depart</div>
            <div style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.textLight }}>Select date</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Return</div>
            <div style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.textLight }}>Select date</div>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Travellers</div>
          <div style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: C.textLight }}>2 adults, 0 children</span>
            <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>Edit</span>
          </div>
        </div>
        <CTAButton label="Continue →" onClick={() => go("form2_detailed_full")} />
      </div>
    </Phone>
  ),

  // 5 — Detailed form screen 2
  form2_detailed_full: ({ go }) => (
    <Phone label="Screen 2b — Detailed Form (Preferences)">
      <TopBar title="Your preferences" onBack={() => go("form1_detailed")} step={2} totalSteps={3} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Budget</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Budget", "Mid-range", "Premium"].map(b => <SelectChip key={b} label={b} selected={b === "Mid-range"} onClick={() => {}} />)}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Travel style</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Relaxed", "Cultural", "Adventure", "Foodie", "Mixed"].map(s => <SelectChip key={s} label={s} selected={s === "Cultural"} onClick={() => {}} />)}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Accommodation</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Hotel", "Apartment / Airbnb", "Either"].map(a => <SelectChip key={a} label={a} selected={a === "Hotel"} onClick={() => {}} />)}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Occasion</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Anniversary", "Honeymoon", "Family holiday", "Solo", "Friends trip", "Birthday"].map(o => <SelectChip key={o} label={o} selected={false} onClick={() => {}} />)}
          </div>
        </div>
        <CTAButton label="Continue →" onClick={() => go("form3_detailed")} />
      </div>
    </Phone>
  ),

  // 6 — Detailed form screen 3
  form3_detailed: ({ go }) => (
    <Phone label="Screen 2c — Detailed Form (Specifics)">
      <TopBar title="The details" onBack={() => go("form2_detailed_full")} step={3} totalSteps={3} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <WireframeNote text="All optional — AI uses whatever is provided" />
        <Field label="Preferred airlines" placeholder="e.g. Air New Zealand, Emirates" />
        <Field label="Specific areas or neighbourhoods" placeholder="e.g. Stay near Notting Hill" />
        <Field label="Dietary requirements" placeholder="e.g. Vegetarian, halal, gluten free" />
        <Field label="Accessibility needs" placeholder="e.g. Wheelchair accessible" />
        <Field label="Must-sees" placeholder="e.g. Stonehenge, a Premier League match" />
        <Field label="Things to avoid" placeholder="e.g. Crowded tourist spots, seafood" />
        <CTAButton label="Build my trip →" onClick={() => go("building")} />
      </div>
    </Phone>
  ),

  // 7 — Conversation mode
  convo: ({ go }) => {
    const [messages, setMessages] = useState([
      { from: "voyager", text: "Hi! Tell me about the trip you're thinking of. Type or tap 🎙 to speak — just describe it like you'd tell a travel agent. Where, when, who's going — and it's fine if you don't know all the details yet." }
    ]);
    const [input, setInput] = useState("");
    const examples = [
      "We want 3 weeks in Southeast Asia, been to Thailand before, 2 young kids — not sure what to do there",
      "Thinking Europe in summer, flexible on where, mid-range budget, just the two of us",
      "Anniversary trip to Japan, never been, have no idea what to do — open to everything",
      "Want to go somewhere warm in October, flexible on destination, budget around $5k",
    ];

    const send = (text) => {
      if (!text.trim()) return;
      setMessages(prev => [
        ...prev,
        { from: "user", text },
        { from: "voyager", text: "Got it — that sounds like a wonderful trip. A couple of quick questions: roughly what time of year were you thinking, and do you have a budget range in mind?" }
      ]);
      setInput("");
    };

    return (
      <Phone label="Screen 2d — Conversation Mode">
        <TopBar title="Chat with Voyager" onBack={() => go("welcome")} />
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "80%", padding: "10px 13px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.from === "user" ? C.accent : C.tag,
                color: m.from === "user" ? "white" : C.text, fontSize: 12, lineHeight: 1.5,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {messages.length === 1 && (
            <div>
              <div style={{ fontSize: 10, color: C.textLight, marginBottom: 6, textAlign: "center" }}>Or tap an example to get started</div>
              {examples.map((ex, i) => (
                <button key={i} onClick={() => send(ex)} style={{
                  width: "100%", padding: "9px 12px", borderRadius: 10, border: `1px solid ${C.border}`,
                  background: C.surface, color: C.textMid, fontSize: 11, textAlign: "left", cursor: "pointer", marginBottom: 6,
                }}>
                  "{ex}"
                </button>
              ))}
            </div>
          )}
          {messages.length > 2 && (
            <div style={{ textAlign: "center", marginTop: 4 }}>
              <button onClick={() => go("convo_confirm")} style={{
                padding: "10px 20px", borderRadius: 20, background: C.accent, color: "white",
                border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
                Looks good — build my trip →
              </button>
            </div>
          )}
        </div>
        <div style={{ padding: "10px 16px 16px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <WireframeNote text="Voice input — tap mic to speak, transcript appears in chat" />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Describe your trip... or tap 🎙 to talk"
              style={{ flex: 1, padding: "10px 12px", borderRadius: 20, border: `1.5px solid ${C.border}`, fontSize: 12, outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={() => send("We want to do Southeast Asia for three weeks, we have two young kids and have been to Thailand before — open to suggestions")}
              title="Tap to speak"
              style={{
                width: 36, height: 36, borderRadius: "50%", background: "#F5EDE3",
                border: `1.5px solid ${C.accent}`, cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
              }}>
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="0" width="6" height="11" rx="3" fill="#C17B3F"/>
                <path d="M1 8C1 11.3137 3.68629 14 7 14C10.3137 14 13 11.3137 13 8" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="7" y1="14" x2="7" y2="17" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="4.5" y1="17" x2="9.5" y2="17" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={() => send(input)} style={{
              width: 36, height: 36, borderRadius: "50%", background: C.accent,
              color: "white", border: "none", fontSize: 16, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
            }}>→</button>
          </div>
          <div style={{ fontSize: 10, color: C.textLight, textAlign: "center", marginTop: 6 }}>
            Speak naturally — like calling a travel agent
          </div>
        </div>
      </Phone>
    );
  },

  // 8 — Conversation confirm
  convo_confirm: ({ go }) => (
    <Phone label="Screen 2e — Conversation Confirm">
      <TopBar title="Does this look right?" onBack={() => go("convo")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <WireframeNote text="AI summarises extracted parameters for user to confirm before build" />
        <div style={{ fontSize: 13, color: C.textMid, marginBottom: 14, lineHeight: 1.5 }}>
          Here's what I've understood about your trip. Let me know if anything needs changing.
        </div>
        {[
          ["From", "Auckland"],
          ["To", "London, UK"],
          ["Dates", "27 Aug — 24 Sep 2026 (28 nights)"],
          ["Travellers", "2 adults"],
          ["Budget", "Mid-range"],
          ["Style", "Cultural, some relaxation"],
          ["Accommodation", "Hotel"],
          ["Notes", "Celebrating anniversary, want to see the Cotswolds"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>{k}</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
          </div>
        ))}
        <SecondaryButton label="← Change something" onClick={() => go("convo")} />
        <CTAButton label="Build my trip →" onClick={() => go("building")} />
      </div>
    </Phone>
  ),

  // 9 — Building screen
  building: ({ go }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [done, setDone] = useState(false);

    const steps = [
      { icon: "✈️", text: "Finding the best flights from Auckland", detail: "Scanning 300+ airlines" },
      { icon: "🏘️", text: "Researching London neighbourhoods", detail: "Local knowledge layer" },
      { icon: "🏨", text: "Selecting accommodation for your style", detail: "Mid-range hotels, great locations" },
      { icon: "🗓️", text: "Building your day-by-day itinerary", detail: "28 nights, expert-curated" },
      { icon: "🍽️", text: "Adding dining and local experiences", detail: "Hidden gems and must-sees" },
      { icon: "💷", text: "Calculating your trip value", detail: "NZD $11,400 estimated" },
    ];

    useEffect(() => {
      if (activeStep < steps.length) {
        const t = setTimeout(() => setActiveStep(s => s + 1), 600);
        return () => clearTimeout(t);
      } else {
        setDone(true);
      }
    }, [activeStep]);

    return (
      <Phone label="Screen 3 — Building">
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Hero destination card */}
          <div style={{
            background: `linear-gradient(160deg, #1C1C1E 0%, #2C2418 60%, #3D2E10 100%)`,
            padding: "28px 24px 20px", flexShrink: 0, position: "relative", overflow: "hidden",
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(193,123,63,0.2)" }} />
            <div style={{ position: "absolute", top: -10, right: -10, width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(193,123,63,0.15)" }} />
            <div style={{ fontSize: 10, color: "rgba(193,123,63,0.8)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Building your trip to</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 4 }}>London</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>27 Aug — 24 Sep · 2 adults · 28 nights</div>
            {/* Animated plane path */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>AKL</div>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(193,123,63,0.6), rgba(193,123,63,0.2))", position: "relative" }}>
                <div style={{
                  position: "absolute", top: -6, fontSize: 12,
                  left: `${Math.min(100, (activeStep / steps.length) * 100)}%`,
                  transition: "left 0.6s ease", transform: "translateX(-50%)",
                }}>✈</div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>LHR</div>
            </div>
          </div>

          {/* Steps */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: C.textMid, marginBottom: 14, fontWeight: 500 }}>
              {done ? "Your itinerary is ready ✓" : "This takes about 20–30 seconds..."}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {steps.map((s, i) => {
                const isActive = i === activeStep - 1;
                const isDone = i < activeStep;
                const isPending = i >= activeStep;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    opacity: isPending ? 0.3 : 1,
                    transition: "opacity 0.4s ease",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: isDone ? C.accentLight : C.tag,
                      border: `1.5px solid ${isDone ? C.accent : C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16,
                      transition: "all 0.4s ease",
                    }}>
                      {isDone && !isActive ? <span style={{ fontSize: 14, color: C.accent }}>✓</span> : s.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: isDone ? 600 : 500, color: isDone ? C.text : C.textMid }}>{s.text}</div>
                      {isDone && <div style={{ fontSize: 10, color: C.accent, marginTop: 1 }}>{s.detail}</div>}
                    </div>
                    {isActive && (
                      <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${C.accent}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>

            {done && (
              <div style={{ marginTop: 20 }}>
                <div style={{ background: C.accentLight, border: `1px solid ${C.accent}`, borderRadius: 12, padding: "12px 16px", marginBottom: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>Your trip is ready</div>
                  <div style={{ fontSize: 11, color: C.textMid }}>Estimated trip value: <strong style={{ color: C.text }}>NZD $11,400</strong></div>
                </div>
                <CTAButton label="See my itinerary preview →" onClick={() => go("done")} />
              </div>
            )}
            {!done && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.textLight }}>Step {activeStep} of {steps.length}</div>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Phone>
    );
  },

  // 10 — Done / handoff
  done: ({ go }) => (
    <Phone label="Screen 4 — Handoff to Preview">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✈️</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>Your trip is ready</div>
        <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, marginBottom: 32 }}>
          28 nights · London & surrounds<br />
          Estimated trip value: <strong style={{ color: C.text }}>NZD $11,400</strong><br />
          Voyager fee: <strong style={{ color: C.accent }}>NZD $86</strong>
        </div>
        <CTAButton label="See my itinerary preview →" onClick={() => go("welcome")} />
        <div style={{ marginTop: 12, fontSize: 11, color: C.textLight }}>Next: Wireframe 02 — Preview Screen</div>
      </div>
    </Phone>
  ),
};

// ── FLOW MAP (what each screen links to)
const FLOW_ORDER = ["welcome", "form1", "form2", "form2_detailed", "form1_detailed", "form2_detailed_full", "form3_detailed", "convo", "convo_confirm", "building", "done"];

// ── SCREEN LABELS for nav
const SCREEN_LABELS = {
  welcome: "Welcome",
  form1: "Form S1",
  form2: "Form S2",
  form2_detailed: "Form S2+",
  form1_detailed: "Detail S1",
  form2_detailed_full: "Detail S2",
  form3_detailed: "Detail S3",
  convo: "Chat",
  convo_confirm: "Confirm",
  building: "Building",
  done: "Preview →",
};

export default function OnboardingWireframe() {
  const [screen, setScreen] = useState("welcome");
  const go = (s) => setScreen(s);

  const Screen = SCREENS[screen];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#F0F0F0", minHeight: "100vh", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ maxWidth: 800, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>Voyager — Wireframe 01</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Onboarding & Trip Input Flow</div>
        </div>
        <div style={{ fontSize: 11, color: C.textLight, background: "#FFFDE7", border: "1px solid #F0C040", borderRadius: 8, padding: "4px 10px" }}>
          📐 Wireframe — structure only, not final design
        </div>
      </div>

      {/* Screen nav */}
      <div style={{ maxWidth: 800, margin: "0 auto 20px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FLOW_ORDER.map(s => (
          <button key={s} onClick={() => go(s)} style={{
            padding: "5px 12px", borderRadius: 16, fontSize: 11, fontWeight: 600,
            background: screen === s ? C.accent : C.surface,
            color: screen === s ? "white" : C.textMid,
            border: `1px solid ${screen === s ? C.accent : C.border}`,
            cursor: "pointer",
          }}>
            {SCREEN_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Current screen */}
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center" }}>
        {Screen && <Screen go={go} />}
      </div>

      {/* Flow diagram */}
      <div style={{ maxWidth: 800, margin: "20px auto 0", background: C.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Flow Map</div>
        <div style={{ fontSize: 11, color: C.textMid, lineHeight: 2 }}>
          <strong>Standard:</strong> Welcome → Form S1 → Form S2 → [+ Add detail → Form S2+] → Building → Preview<br />
          <strong>Detailed:</strong> Welcome → Detail S1 → Detail S2 → Detail S3 → Building → Preview<br />
          <strong>Conversation:</strong> Welcome → Chat → Confirm → Building → Preview<br />
          <strong>Mid-flow switch:</strong> Any form screen can switch to Chat mode before build is triggered
        </div>
      </div>
    </div>
  );
}
