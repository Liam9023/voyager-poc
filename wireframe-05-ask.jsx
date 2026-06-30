import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#F7F7F7", surface: "#FFFFFF", border: "#E0E0E0", borderDark: "#BDBDBD",
  text: "#1C1C1E", textMid: "#555555", textLight: "#999999",
  accent: "#C17B3F", accentLight: "#F5EDE3", tag: "#EFEFEF",
  green: "#38A169", greenLight: "#EDFAF3", greenBorder: "#9AE6B4",
  amber: "#F0A500", amberLight: "#FFFBEB",
  purple: "#7C3AED", purpleLight: "#F3F0FF",
};

const Phone = ({ children, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>}
    <div style={{ width: 320, height: 640, background: C.surface, borderRadius: 36, border: `2px solid ${C.borderDark}`, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 28, background: C.surface, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>9:41</span>
        <span style={{ fontSize: 11, color: C.text }}>●●● ▲ ■</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  </div>
);

const BottomNav = ({ active, setTab }) => (
  <div style={{ borderTop: `1px solid ${C.border}`, display: "flex", background: C.surface, flexShrink: 0 }}>
    {[["itinerary","📅","Itinerary"],["bookings","✓","Bookings"],["ask","💬","Ask"],["trip","⚙️","Trip"]].map(([id, icon, label]) => (
      <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "8px 4px 10px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 18, opacity: active === id ? 1 : 0.35 }}>{icon}</span>
        <span style={{ fontSize: 9, fontWeight: active === id ? 700 : 500, color: active === id ? C.accent : C.textLight }}>{label}</span>
      </button>
    ))}
  </div>
);

const WF = ({ text }) => (
  <div style={{ background: "#FFFDE7", border: "1px dashed #F0C040", borderRadius: 8, padding: "6px 10px", margin: "4px 0" }}>
    <span style={{ fontSize: 10, color: "#7A6000", fontWeight: 600 }}>📐 {text}</span>
  </div>
);

// ── CONTEXTUAL PROMPTS DATA
const PROMPTS_PRETRIPG = [
  { icon: "🏘️", category: "Where to stay", text: "Should you stay in central London or a specific neighbourhood for this trip?" },
  { icon: "🚂", category: "Getting around", text: "What's the best way to get from Heathrow to your hotel in Marylebone?" },
  { icon: "📋", category: "Visa & entry", text: "NZ passport holders don't need a visa for the UK — but you'll need an ETA from 2025." },
  { icon: "💷", category: "Money", text: "Contactless is accepted almost everywhere in London. Carry a little cash for markets and small cafés." },
];

const PROMPTS_PRETRIP = [
  { icon: "🎭", category: "Day 8 · Cotswolds", text: "The Cotswolds gets busy on weekends — Day 8 is a Thursday which is ideal timing." },
  { icon: "🌤️", category: "Weather · late August", text: "Late August in the UK: expect 17–22°C, occasional showers. Pack layers and a compact umbrella." },
  { icon: "🍽️", category: "Dining · Bath", text: "Bath has excellent food — book dinner ahead for Day 9. The Sally Lunn's area is worth exploring." },
  { icon: "💊", category: "Health", text: "No vaccinations required for the UK. Tap water is safe to drink everywhere." },
];

const PROMPTS_DURING = [
  { icon: "📍", category: "You're in Burford", text: "The high street slopes steeply to the river — the walk down and back up is worth doing slowly." },
  { icon: "🍺", category: "Tomorrow · Bath", text: "The Pump Room does breakfast — worth it for the setting. Romans drank this water; you probably shouldn't." },
  { icon: "🚗", category: "Car hire tip", text: "UK roads in the Cotswolds are narrow. Pull into passing places and let oncoming traffic through first." },
  { icon: "💳", category: "Tipping", text: "10–12.5% in restaurants if service isn't included. Check the bill — some add it automatically." },
];

const SAMPLE_RESPONSES = {
  "neighbourhood": {
    q: "What neighbourhood should we stay in for London?",
    a: "For your trip, Marylebone is the right call — and it's already in your itinerary. It sits between Mayfair and Regent's Park, walkable to Hyde Park, quieter than the West End at night, and has excellent independent restaurants and cafés on the high street. You're not fighting tourists to leave your hotel door.\n\nIf you wanted alternatives: Notting Hill is prettier but slightly less central. Fitzrovia works well and is close to the British Museum. Avoid anywhere south of the river if this is your first extended London stay — the tube connections make everything harder."
  },
  "transport": {
    q: "Best way to get from Heathrow to Marylebone?",
    a: "Elizabeth line from Heathrow to Paddington — takes about 30 minutes, runs every few minutes, NZD $15 per person roughly. From Paddington it's a 10-minute taxi to your hotel or a short walk.\n\nAlternatively the Heathrow Express is faster (15 min) but more expensive. Don't get a black cab from Heathrow — you'll sit in traffic for an hour and pay NZD $120+.\n\nYour flight arrives at 06:20 so the Elizabeth line will already be running. Tap in with a contactless card — no need to buy a separate Oyster."
  },
  "cotswolds": {
    q: "Any tips for the Cotswolds day?",
    a: "A few things worth knowing:\n\nBurford is best early — the high street is genuinely lovely before 10am when the tour buses arrive. Walk down to the river and back up.\n\nBibury's Arlington Row photographs beautifully but is tiny. Worth 45 minutes, not two hours. The trout farm next door is genuinely interesting if you have kids.\n\nFor lunch, The Swan in Bibury is the obvious choice but The Lamb at Bourton works if you want to see the busier village. Both need a booking.\n\nFuel up before leaving London — Cotswolds petrol stations are infrequent and slightly more expensive."
  },
  "default": {
    q: "",
    a: "That's a good question for this trip. Based on what's in your itinerary and where you're going, here's what I'd recommend..."
  }
};

// ── PRE-UNLOCK ASK (limited — 3 questions)
const PreUnlockAsk = ({ go }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionsUsed, setQuestionsUsed] = useState(1);
  const limit = 3;
  const remaining = limit - questionsUsed;

  const send = (text) => {
    if (!text.trim() || questionsUsed >= limit) return;
    const response = text.toLowerCase().includes("neighbourhood") || text.toLowerCase().includes("stay")
      ? SAMPLE_RESPONSES.neighbourhood
      : text.toLowerCase().includes("heathrow") || text.toLowerCase().includes("transport")
      ? SAMPLE_RESPONSES.transport
      : SAMPLE_RESPONSES.default;

    setMessages(prev => [...prev, { from: "user", text }, { from: "voyager", text: response.a }]);
    setQuestionsUsed(q => q + 1);
    setInput("");
  };

  return (
    <Phone label="Screen 1 — Ask (Pre-unlock, limited)">
      {/* Header */}
      <div style={{ padding: "10px 16px 8px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Voyager Ask</div>
            <div style={{ fontSize: 10, color: C.textMid }}>London & Beyond · Planning</div>
          </div>
          <div style={{ background: questionsUsed >= limit ? "#FFF5F5" : C.amberLight, border: `1px solid ${questionsUsed >= limit ? "#FEB2B2" : "#FCD34D"}`, borderRadius: 10, padding: "4px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: questionsUsed >= limit ? "#C53030" : C.amber }}>{Math.max(0, remaining)}</div>
            <div style={{ fontSize: 8, color: questionsUsed >= limit ? "#C53030" : C.amber, fontWeight: 600 }}>left</div>
          </div>
        </div>
        {/* Usage bar */}
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 3, background: C.tag, borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${(questionsUsed / limit) * 100}%`, background: questionsUsed >= limit ? "#C53030" : C.accent, borderRadius: 2, transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 9, color: C.textLight, marginTop: 2 }}>{questionsUsed} of {limit} free questions used · Unlock trip for unlimited Ask</div>
        </div>
      </div>

      {/* Prompts or chat */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        {messages.length === 0 && (
          <>
            <div style={{ fontSize: 11, color: C.textMid, marginBottom: 10, lineHeight: 1.5 }}>
              Ask anything about your trip — destination, logistics, what to expect.
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Try asking</div>
            {PROMPTS_PRETRIPG.map((p, i) => (
              <button key={i} onClick={() => send(p.text)} style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, marginBottom: 7, cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, marginBottom: 2 }}>{p.category}</div>
                  <div style={{ fontSize: 11, color: C.text, lineHeight: 1.4 }}>{p.text}</div>
                </div>
              </button>
            ))}
          </>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            {m.from === "voyager" && (
              <div style={{ width: 24, height: 24, borderRadius: 8, background: C.accentLight, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginRight: 8, marginTop: 2 }}>V</div>
            )}
            <div style={{ maxWidth: "80%", padding: "10px 12px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.from === "user" ? C.accent : C.tag, color: m.from === "user" ? "white" : C.text, fontSize: 12, lineHeight: 1.5, whiteSpace: "pre-line" }}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Limit reached */}
        {questionsUsed >= limit && (
          <div style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: "12px 14px", marginTop: 8, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Unlock unlimited Ask</div>
            <div style={{ fontSize: 11, color: C.textMid, marginBottom: 10, lineHeight: 1.5 }}>You've used your 3 free questions. Unlock your itinerary to get unlimited Voyager Ask throughout your entire trip.</div>
            <button onClick={() => go("unlock")} style={{ width: "100%", padding: "10px", borderRadius: 10, background: C.accent, color: "white", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Unlock my itinerary →
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      {questionsUsed < limit && (
        <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask anything about your trip..." style={{ flex: 1, padding: "10px 12px", borderRadius: 20, border: `1.5px solid ${C.border}`, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
            <button onClick={() => {}} title="Voice input" style={{ width: 36, height: 36, borderRadius: "50%", background: C.accentLight, border: `1.5px solid ${C.accent}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><rect x="4" y="0" width="6" height="11" rx="3" fill="#C17B3F"/><path d="M1 8C1 11.3137 3.68629 14 7 14C10.3137 14 13 11.3137 13 8" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="14" x2="7" y2="17" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/><line x1="4.5" y1="17" x2="9.5" y2="17" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <button onClick={() => send(input)} style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, color: "white", border: "none", fontSize: 16, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
          </div>
        </div>
      )}
    </Phone>
  );
};

// ── POST-UNLOCK ASK (full, trip-aware)
const PostUnlockAsk = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activePromptSet, setActivePromptSet] = useState("pretrip");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text) => {
    if (!text.trim()) return;
    const key = text.toLowerCase().includes("cotswold") ? "cotswolds"
      : text.toLowerCase().includes("neighbourhood") || text.toLowerCase().includes("stay") ? "neighbourhood"
      : text.toLowerCase().includes("heathrow") || text.toLowerCase().includes("transport") ? "transport"
      : "default";
    const response = SAMPLE_RESPONSES[key];
    setMessages(prev => [...prev, { from: "user", text }, { from: "voyager", text: response.a }]);
    setInput("");
  };

  const prompts = activePromptSet === "pretrip" ? PROMPTS_PRETRIP : PROMPTS_DURING;

  return (
    <Phone label="Screen 2 — Ask (Post-unlock, full)">
      {/* Header */}
      <div style={{ padding: "10px 16px 8px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Voyager Ask</div>
            <div style={{ fontSize: 10, color: C.textMid }}>London & Beyond · Day 8 · Burford</div>
          </div>
          <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "4px 10px" }}>
            <div style={{ fontSize: 9, color: C.green, fontWeight: 700 }}>✓ Unlocked</div>
            <div style={{ fontSize: 8, color: C.green }}>Unlimited</div>
          </div>
        </div>
        {/* Context strip */}
        <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
          {[["pretrip", "Before travel"], ["during", "On the trip"]].map(([id, label]) => (
            <button key={id} onClick={() => setActivePromptSet(id)} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: activePromptSet === id ? C.accent : C.tag, color: activePromptSet === id ? "white" : C.textMid, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>{label}</button>
          ))}
          <div style={{ fontSize: 9, color: C.textLight, padding: "4px 6px", whiteSpace: "nowrap" }}>Prompts update with your trip stage</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        {/* Contextual feed */}
        {messages.length === 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              {activePromptSet === "during" ? "Right now · Day 8 · Burford" : "Before you go · Coming up"}
            </div>
            {prompts.map((p, i) => (
              <button key={i} onClick={() => send(p.text)} style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, marginBottom: 7, cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, marginBottom: 2 }}>{p.category}</div>
                  <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5 }}>{p.text}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Or ask anything</div>
              {["What should I know about tipping in the UK?", "Any tips for the Cotswolds day?", "What's the best way to get around Bath?"].map((q, i) => (
                <button key={i} onClick={() => send(q)} style={{ width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.tag, marginBottom: 6, cursor: "pointer", fontSize: 11, color: C.text }}>
                  "{q}"
                </button>
              ))}
            </div>
          </>
        )}

        {/* Chat messages */}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 10, alignItems: "flex-start" }}>
            {m.from === "voyager" && (
              <div style={{ width: 26, height: 26, borderRadius: 8, background: C.accentLight, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.accent, flexShrink: 0, marginRight: 8, marginTop: 2 }}>V</div>
            )}
            <div style={{ maxWidth: "82%", padding: "10px 12px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.from === "user" ? C.accent : C.tag, color: m.from === "user" ? "white" : C.text, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {m.text}
            </div>
          </div>
        ))}
        {messages.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setMessages([])} style={{ fontSize: 10, color: C.textLight, background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>← Back to prompts</button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask anything about your trip..." style={{ flex: 1, padding: "10px 12px", borderRadius: 20, border: `1.5px solid ${C.border}`, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <button title="Voice input" style={{ width: 36, height: 36, borderRadius: "50%", background: C.accentLight, border: `1.5px solid ${C.accent}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><rect x="4" y="0" width="6" height="11" rx="3" fill="#C17B3F"/><path d="M1 8C1 11.3137 3.68629 14 7 14C10.3137 14 13 11.3137 13 8" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="14" x2="7" y2="17" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/><line x1="4.5" y1="17" x2="9.5" y2="17" stroke="#C17B3F" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <button onClick={() => send(input)} style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, color: "white", border: "none", fontSize: 16, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
        </div>
        <div style={{ fontSize: 9, color: C.textLight, textAlign: "center", marginTop: 5 }}>Trip-aware · Knows your itinerary, dates, and destinations</div>
      </div>
    </Phone>
  );
};

// ── TELL ME MORE (from itinerary element)
const TellMeMoreAsk = () => {
  const [messages, setMessages] = useState([
    { from: "voyager", text: "You tapped 'Tell me more' on The Bay Tree in Burford. Here's what's worth knowing:\n\nIt's a proper Cotswolds coaching inn — stone building, low ceilings, real fireplaces. The rooms vary significantly in size so if you have a preference, call ahead and ask for one of the larger rooms on the upper floor.\n\nThe restaurant is good but pricey. The pub menu downstairs is better value and the same kitchen. Breakfast is included and generous — don't skip it.\n\nParking is in the hotel courtyard, which saves you the high street pay-and-display." }
  ]);
  const [input, setInput] = useState("");

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev,
      { from: "user", text },
      { from: "voyager", text: "Good question — based on your itinerary and what I know about Burford, here's the detail on that..." }
    ]);
    setInput("");
  };

  return (
    <Phone label="Screen 3 — Tell Me More (from itinerary)">
      {/* Context header */}
      <div style={{ padding: "10px 16px 8px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.accentLight }}>
        <div style={{ fontSize: 9, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>From your itinerary · Day 8</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>The Bay Tree, Burford</div>
        <div style={{ fontSize: 10, color: C.textMid }}>Hotel · Cotswolds · 1 night</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 10, alignItems: "flex-start" }}>
            {m.from === "voyager" && (
              <div style={{ width: 26, height: 26, borderRadius: 8, background: C.accentLight, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.accent, flexShrink: 0, marginRight: 8, marginTop: 2 }}>V</div>
            )}
            <div style={{ maxWidth: "82%", padding: "10px 12px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.from === "user" ? C.accent : C.tag, color: m.from === "user" ? "white" : C.text, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {m.text}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Follow-up questions</div>
            {["Is the location walkable to Burford village?", "Any dinner alternatives if the pub is full?", "What time is check-in?"].map((q, i) => (
              <button key={i} onClick={() => send(q)} style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, marginBottom: 5, cursor: "pointer", fontSize: 11, color: C.text }}>{q}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "8px 14px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask more about this hotel..." style={{ flex: 1, padding: "10px 12px", borderRadius: 20, border: `1.5px solid ${C.border}`, fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => send(input)} style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, color: "white", border: "none", fontSize: 16, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
        </div>
      </div>
    </Phone>
  );
};

// ── SCREENS
const SCREENS = {
  preunlock: { label: "Pre-unlock (3 questions)", component: PreUnlockAsk },
  postunlock: { label: "Post-unlock (full)", component: PostUnlockAsk },
  tellmemore: { label: "Tell Me More (from itinerary)", component: TellMeMoreAsk },
};

export default function AskWireframe() {
  const [screen, setScreen] = useState("preunlock");
  const go = (s) => setScreen(s);
  const Screen = SCREENS[screen].component;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#F0F0F0", minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>Voyager — Wireframe 05</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Voyager Ask</div>
        </div>
        <div style={{ fontSize: 11, color: C.textLight, background: "#FFFDE7", border: "1px solid #F0C040", borderRadius: 8, padding: "4px 10px" }}>📐 Wireframe — structure only</div>
      </div>

      {/* Screen nav */}
      <div style={{ maxWidth: 900, margin: "0 auto 20px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.entries(SCREENS).map(([id, { label }]) => (
          <button key={id} onClick={() => setScreen(id)} style={{ padding: "5px 14px", borderRadius: 16, fontSize: 11, fontWeight: 600, background: screen === id ? C.accent : C.surface, color: screen === id ? "white" : C.textMid, border: `1px solid ${screen === id ? C.accent : C.border}`, cursor: "pointer" }}>{label}</button>
        ))}
      </div>

      {/* Context note */}
      <div style={{ maxWidth: 900, margin: "0 auto 20px", background: C.surface, borderRadius: 12, padding: "14px 20px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Three states of Voyager Ask</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            ["Pre-unlock", "Available while building a trip, before payment. 3 free questions. Contextual prompt suggestions. Soft paywall nudge when limit reached."],
            ["Post-unlock (full)", "Unlimited after paying. Trip-aware — knows itinerary, current day, location. Proactive contextual feed updates with trip stage. Open chat always below."],
            ["Tell Me More", "Triggered from itinerary elements — hotel, activity, restaurant. Context pre-loaded. Follow-up suggestions relevant to that specific element."],
          ].map(([title, desc]) => (
            <div key={title} style={{ background: C.bg, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 10, color: C.textMid, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phone */}
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center" }}>
        <Screen go={go} />
      </div>

      {/* Design notes */}
      <div style={{ maxWidth: 900, margin: "20px auto 0", background: C.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Key design decisions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            ["3-question pre-unlock limit", "Enough to demonstrate quality and trigger conversion. After the limit a contextual unlock prompt appears — not a hard error. Cost per API call negligible against conversion value."],
            ["Contextual prompt feed", "Proactive prompts update based on trip stage — pre-trip prompts differ from on-the-trip prompts. The feed surfaces what the user doesn't know to ask, not just what they might search for."],
            ["Trip-aware responses", "Every answer references the specific itinerary — day numbers, booked hotels, actual destinations. Generic travel advice is avoided. This is the core differentiator vs a standard AI chatbot."],
            ["Voice input", "SVG mic icon consistent with conversation mode in onboarding. Tap to speak — transcript flows into chat. Works the same as the onboarding conversation mode mechanic."],
            ["Tell Me More integration", "Tapping Tell Me More on any itinerary element opens Ask with context pre-loaded. Follow-up suggestions are specific to that element. Seamless between itinerary and knowledge layer."],
            ["No AI language", "Responses are from Voyager, not from AI. The V avatar represents Voyager. Copy never says AI-generated, AI suggests, or AI-powered."],
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
