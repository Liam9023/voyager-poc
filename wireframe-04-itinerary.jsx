import { useState } from "react";

const C = {
  bg: "#F7F7F7", surface: "#FFFFFF", border: "#E0E0E0", borderDark: "#BDBDBD",
  text: "#1C1C1E", textMid: "#555555", textLight: "#999999",
  accent: "#C17B3F", accentLight: "#F5EDE3", tag: "#EFEFEF",
  green: "#38A169", greenLight: "#EDFAF3", greenBorder: "#9AE6B4",
  amber: "#F0A500", amberLight: "#FFFBEB",
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

const WF = ({ text }) => (
  <div style={{ background: "#FFFDE7", border: "1px dashed #F0C040", borderRadius: 8, padding: "6px 10px", margin: "4px 0" }}>
    <span style={{ fontSize: 10, color: "#7A6000", fontWeight: 600 }}>📐 {text}</span>
  </div>
);

// HOME SCREEN
const HomeScreen = ({ go }) => {
  const [notif, setNotif] = useState(false);
  return (
    <Phone label="Screen 1 — Home">
      <div style={{ padding: "10px 18px 8px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Voyager</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Good evening, Liam</div>
        </div>
        <button onClick={() => setNotif(!notif)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C7.5 2 5 4.5 5 8v5l-2 2v1h16v-1l-2-2V8c0-3.5-2.5-6-6-6z" stroke={C.text} strokeWidth="1.5" fill="none"/><path d="M9 18c0 1.1.9 2 2 2s2-.9 2-2" stroke={C.text} strokeWidth="1.5" fill="none"/></svg>
          <div style={{ position: "absolute", top: 0, right: 0, width: 14, height: 14, borderRadius: "50%", background: C.amber, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 7, color: "white", fontWeight: 800 }}>4</span>
          </div>
        </button>
      </div>
      {notif && (
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "8px 16px", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Alerts across all trips</div>
          {[
            { trip: "London", msg: "Thermae Bath Spa — book today, Day 9 is tomorrow", urgent: true },
            { trip: "London", msg: "Day-ahead: Bath — Roman Baths tips ready", urgent: false },
            { trip: "Japan", msg: "Cherry blossom dates confirmed — adjust itinerary?", urgent: false },
            { trip: "Japan", msg: "Shinkansen passes available to book now", urgent: false },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.urgent ? C.amber : C.accent, flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: C.accent, fontWeight: 700 }}>{n.trip}</div>
                <div style={{ fontSize: 11, color: C.text }}>{n.msg}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {/* ACTIVE */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>On your trip</div>
          <div onClick={() => go("active")} style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <div style={{ background: "linear-gradient(140deg, #1C1C1E, #2C2010)", padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(193,123,63,0.8)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Active · Day 8 of 28</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 1 }}>London & Beyond</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>27 Aug — 24 Sep 2026</div>
                  <div style={{ fontSize: 10, color: "rgba(193,123,63,0.9)", fontWeight: 600 }}>📍 Burford, Cotswolds</div>
                </div>
                <div style={{ background: C.amber, borderRadius: 12, padding: "3px 7px" }}>
                  <span style={{ fontSize: 9, color: "white", fontWeight: 800 }}>3 alerts</span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Booking progress</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>14/28 nights</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: "50%", background: "linear-gradient(90deg, #38A169, #F0A500)", borderRadius: 2 }} />
                </div>
              </div>
            </div>
            <div style={{ background: C.accentLight, padding: "8px 14px", display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "7px", borderRadius: 8, background: C.accent, color: "white", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Open trip</button>
              <button style={{ padding: "7px 10px", borderRadius: 8, background: "white", color: C.accent, border: `1px solid ${C.accent}`, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Ask Voyager</button>
            </div>
          </div>
        </div>

        {/* UPCOMING */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Upcoming</div>
          <div onClick={() => go("upcoming")} style={{ borderRadius: 12, border: `1.5px solid ${C.border}`, padding: "12px 14px", marginBottom: 8, cursor: "pointer", background: C.surface }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Japan</div>
                <div style={{ fontSize: 11, color: C.textMid }}>Mar — Apr 2027 · 21 nights</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>247</div>
                <div style={{ fontSize: 9, color: C.textLight }}>days away</div>
              </div>
            </div>
            <div style={{ height: 3, background: C.tag, borderRadius: 2, marginBottom: 4 }}>
              <div style={{ height: "100%", width: "29%", background: C.accent, borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: C.textLight }}>6 of 21 nights booked · 1 alert</div>
          </div>
        </div>

        {/* PLAN NEW */}
        <button onClick={() => go("new")} style={{ width: "100%", padding: "13px", borderRadius: 14, background: C.accent, color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>+</span> Plan a new trip
        </button>

        {/* PAST */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>Past trips</div>
            <button style={{ fontSize: 10, color: C.accent, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all</button>
          </div>
          {[
            { id: "italy", flag: "🇮🇹", title: "Italy", dates: "Jun 2025 · 14 nights", highlight: "Rome, Florence, Amalfi Coast" },
            { id: "usa", flag: "🇺🇸", title: "USA Road Trip", dates: "Oct 2024 · 18 nights", highlight: "NYC, Nashville, New Orleans" },
            { id: "bali", flag: "🇮🇩", title: "Bali", dates: "Jan 2024 · 10 nights", highlight: "Ubud, Seminyak, Nusa Penida" },
          ].map(t => (
            <div key={t.id} onClick={() => go("past")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: C.tag, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{t.flag}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{t.title}</div>
                <div style={{ fontSize: 10, color: C.textLight }}>{t.dates}</div>
                <div style={{ fontSize: 10, color: C.textMid }}>{t.highlight}</div>
              </div>
              <span style={{ fontSize: 16, color: C.textLight }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
};

// NEW TRIP
const NewTripScreen = ({ go }) => (
  <Phone label="Screen 2 — New Trip">
    <div style={{ padding: "10px 18px 8px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
      <button onClick={() => go("home")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.textMid }}>‹</button>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Plan a new trip</div>
    </div>
    <div style={{ flex: 1, padding: "20px 18px" }}>
      <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6, marginBottom: 20 }}>Tell us about your trip and we'll build a complete expert itinerary — ready to book.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[["📋", "Quick form", "Fill in your trip details — under 2 minutes"],["🎯", "Detailed planner", "Full control over every preference"],["💬", "Chat with Voyager", "Describe your trip — type or speak"]].map(([icon, title, desc]) => (
          <button key={title} style={{ padding: "16px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.surface, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 11, color: C.textMid }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 20, fontSize: 11, color: C.textLight, textAlign: "center" }}>→ Leads to Wireframe 01 — Onboarding flow</div>
    </div>
  </Phone>
);

// FULL TRIP TAB COMPONENT
const FullTripTab = () => {
  const [section, setSection] = useState("alerts");
  const [packed, setPacked] = useState({});
  const togglePack = (k) => setPacked(p => ({ ...p, [k]: !p[k] }));

  const alerts = [
    { icon: "🎭", title: "Thermae Bath Spa — book now", detail: "Day 9 is tomorrow. Sells out weeks in advance — last chance.", urgent: true },
    { icon: "🍽️", title: "Dinner Day 9 still unbooked", detail: "Bath restaurants fill up on weekends. A few good options still available.", urgent: false },
    { icon: "✈️", title: "Return flight not yet booked", detail: "24 Sep departure — prices currently reasonable.", urgent: false },
  ];

  const packingList = [
    { cat: "Clothing", items: ["Waterproof jacket", "Layers — evenings get cool", "Comfortable walking shoes", "Smart casual for dinners", "Swimwear for Thermae Bath Spa"] },
    { cat: "Documents", items: ["Passport", "Travel insurance docs", "Booking confirmations (in app)", "International driving permit — car hire"] },
    { cat: "Tech & Money", items: ["Universal UK adapter (Type G)", "eSIM activated before departure", "GBP loaded on travel card", "Portable charger"] },
    { cat: "Health", items: ["Prescription medication", "Basic first aid", "Sunscreen — for warm days"] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Sub-tab bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.surface }}>
        {[["alerts","🔔 Alerts"],["packing","🧳 Packing"],["tools","🛠️ Tools"],["settings","⚙️ Settings"]].map(([id, label]) => (
          <button key={id} onClick={() => setSection(id)} style={{
            flex: 1, padding: "7px 2px", fontSize: 9, fontWeight: section === id ? 700 : 500,
            color: section === id ? C.accent : C.textLight,
            background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${section === id ? C.accent : "transparent"}`,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>

        {/* ALERTS */}
        {section === "alerts" && (
          <>
            <div style={{ fontSize: 11, color: C.textMid, marginBottom: 10, lineHeight: 1.5 }}>
              Time-sensitive items — Voyager alerts you when booking windows open.
            </div>
            {alerts.map((a, i) => (
              <div key={i} style={{ borderRadius: 10, border: `1.5px solid ${a.urgent ? "#FCD34D" : C.border}`, background: a.urgent ? C.amberLight : C.surface, padding: "10px 12px", marginBottom: 8, display: "flex", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: a.urgent ? C.amber : C.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: C.textMid, lineHeight: 1.4 }}>{a.detail}</div>
                </div>
                {a.urgent && <button style={{ padding: "5px 8px", borderRadius: 7, background: C.accent, color: "white", border: "none", fontSize: 10, fontWeight: 700, cursor: "pointer", flexShrink: 0, alignSelf: "center" }}>Book</button>}
              </div>
            ))}
            <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: "9px 12px" }}>
              <div style={{ fontSize: 11, color: "#1A6B8A", lineHeight: 1.5 }}>
                💡 More alerts will surface as your departure date approaches — Voyager tracks booking windows for you.
              </div>
            </div>
          </>
        )}

        {/* PACKING */}
        {section === "packing" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: C.textMid }}>UK · Late August · 28 nights</div>
              <button style={{ fontSize: 10, color: C.accent, fontWeight: 600, background: "none", border: `1px solid ${C.accent}`, borderRadius: 8, padding: "3px 8px", cursor: "pointer" }}>+ Add item</button>
            </div>
            {packingList.map(cat => (
              <div key={cat.cat} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{cat.cat}</div>
                {cat.items.map(item => (
                  <div key={item} onClick={() => togglePack(item)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${packed[item] ? C.green : C.border}`, background: packed[item] ? C.green : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {packed[item] && <span style={{ fontSize: 10, color: "white" }}>✓</span>}
                    </div>
                    <div style={{ fontSize: 12, color: packed[item] ? C.textLight : C.text, textDecoration: packed[item] ? "line-through" : "none" }}>{item}</div>
                  </div>
                ))}
              </div>
            ))}
            <button style={{ width: "100%", padding: "9px", borderRadius: 10, background: C.tag, border: "none", fontSize: 11, color: C.textMid, cursor: "pointer", fontWeight: 600 }}>
              📱 Share list with travel companion
            </button>
          </>
        )}

        {/* TOOLS */}
        {section === "tools" && (
          <>
            {/* Currency */}
            <div style={{ background: C.tag, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Currency · NZD → GBP</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1, background: C.surface, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: C.textLight }}>NZD</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>100</div>
                </div>
                <div style={{ fontSize: 16, color: C.textMid }}>→</div>
                <div style={{ flex: 1, background: C.surface, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: C.textLight }}>GBP</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>47.20</div>
                </div>
              </div>
            </div>

            {/* Weather */}
            <div style={{ background: C.tag, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Weather · London, next 5 days</div>
              <div style={{ display: "flex", gap: 5 }}>
                {[["Mon","⛅","19°"],["Tue","🌧️","15°"],["Wed","🌤️","20°"],["Thu","☀️","22°"],["Fri","⛅","18°"]].map(([d, icon, temp]) => (
                  <div key={d} style={{ flex: 1, background: C.surface, borderRadius: 8, padding: "6px 3px", textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: C.textLight, marginBottom: 2 }}>{d}</div>
                    <div style={{ fontSize: 15 }}>{icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{temp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency */}
            <div style={{ background: C.tag, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Emergency info · UK</div>
              {[["Emergency services","999"],["Non-emergency police","101"],["NHS helpline","111"],["NZ Embassy London","+44 20 7930 8422"]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, color: C.textMid }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Time zones */}
            <div style={{ background: C.tag, borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Time zones</div>
              {[["Auckland (home)","NZST","UTC+12"],["London (current)","BST","UTC+1"],["Dublin (Day 18)","IST","UTC+1"]].map(([city, zone, utc]) => (
                <div key={city} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{city}</div>
                    <div style={{ fontSize: 9, color: C.textLight }}>{zone} · {utc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SETTINGS */}
        {section === "settings" && (
          <>
            {[
              ["👥", "Travellers", "Liam Stuart (owner) · Sarah Stuart · 2 on this trip"],
              ["📤", "Import booking", "Share a confirmation to update your trip"],
              ["📱", "Invite to trip", "Add a travel companion — they see the shared itinerary"],
              ["🔔", "Notifications", "Manage alert preferences"],
              ["💱", "Currency display", "NZD"],
              ["✏️", "Edit itinerary", "Add, remove or swap any element"],
              ["👤", "Profile", "Account details"],
              ["❓", "Help & support", ""],
              ["Sign out", "", ""],
            ].map(([icon, title, desc]) => (
              <div key={title || icon} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                {icon && icon.length <= 2 && <div style={{ width: 30, height: 30, borderRadius: 8, background: C.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{icon}</div>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: (title || icon) === "Sign out" ? "#C53030" : C.text }}>{title || icon}</div>
                  {desc && <div style={{ fontSize: 10, color: C.textMid }}>{desc}</div>}
                </div>
                <span style={{ fontSize: 16, color: C.textLight }}>›</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// FULL BOOKINGS TAB COMPONENT
const FullBookingsTab = () => {
  const [view, setView] = useState("day");
  const [filter, setFilter] = useState("all");
  const [selectedDay, setSelectedDay] = useState(8);

  const allBookings = [
    { type: "flight", icon: "✈️", title: "AKL → LHR", detail: "Air New Zealand · NZ1 · 21:20", status: "confirmed", ref: "NZ-ABC123", day: 1 },
    { type: "hotel", icon: "🏨", title: "The Marylebone Hotel", detail: "London · 8 nights", status: "confirmed", ref: "BK-XY9871", day: 2 },
    { type: "rail", icon: "🚂", title: "London → Bath Spa", detail: "GWR · 09:15", status: "confirmed", ref: "TL-223441", day: 8 },
    { type: "car", icon: "🚗", title: "Car hire — Cotswolds", detail: "Enterprise · 3 days", status: "confirmed", ref: "EN-774412", day: 8 },
    { type: "hotel", icon: "🏨", title: "The Bay Tree, Burford", detail: "1 night", status: "confirmed", ref: "BK-YZ1234", day: 8 },
    { type: "activity", icon: "🍺", title: "Lunch — The Swan, Bibury", detail: "13:00 · booked ahead", status: "confirmed", ref: "SW-001", day: 8, who: "shared" },
    { type: "activity", icon: "🎭", title: "Roman Baths — entry", detail: "Bath · 10:00am · Liam", status: "to book", ref: null, day: 9, who: "liam" },
    { type: "activity", icon: "🧖", title: "Thermae Bath Spa", detail: "Afternoon · Sarah", status: "to book", ref: null, day: 9, who: "sarah" },
    { type: "hotel", icon: "🏨", title: "Bath accommodation", detail: "1 night", status: "to book", ref: null, day: 9, who: "shared" },
    { type: "flight", icon: "✈️", title: "LHR → AKL", detail: "Return flight", status: "to book", ref: null, day: 28 },
  ];

  const dayGroups = [
    { day: 1, date: "27 Aug", label: "Departure" },
    { day: 2, date: "28 Aug", label: "London" },
    { day: 8, date: "4 Sep", label: "Cotswolds" },
    { day: 9, date: "5 Sep", label: "Bath" },
    { day: 28, date: "24 Sep", label: "Home" },
  ];

  const types = ["all", "flight", "hotel", "rail", "car", "activity"];
  const typeIcons = { all: "All", flight: "✈️", hotel: "🏨", rail: "🚂", car: "🚗", activity: "🎭" };
  const listFiltered = filter === "all" ? allBookings : allBookings.filter(b => b.type === filter);
  const dayBookings = allBookings.filter(b => b.day === selectedDay);
  const confirmed = allBookings.filter(b => b.status === "confirmed").length;
  const toBook = allBookings.filter(b => b.status === "to book").length;

  const whoConfig = { shared: { label: "👥 Shared", color: "#7C3AED", bg: "#F3F0FF" }, liam: { label: "👤 Liam", color: "#1A6B8A", bg: "#F0F9FF" }, sarah: { label: "👤 Sarah", color: "#276749", bg: "#EDFAF3" } };

  const BookingCard = ({ b }) => (
    <div style={{ borderRadius: 10, border: `1px solid ${b.status === "confirmed" ? C.greenBorder : C.border}`, background: b.status === "confirmed" ? C.greenLight : C.surface, padding: "9px 11px", marginBottom: 7, display: "flex", gap: 9, alignItems: "flex-start" }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: b.status === "confirmed" ? C.green : C.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: b.status === "confirmed" ? 12 : 14, flexShrink: 0 }}>
        {b.status === "confirmed" ? <span style={{ color: "white" }}>✓</span> : b.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{b.title}</div>
          {b.who && whoConfig[b.who] && (
            <div style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8, background: whoConfig[b.who].bg, color: whoConfig[b.who].color }}>{whoConfig[b.who].label}</div>
          )}
        </div>
        <div style={{ fontSize: 10, color: C.textMid, marginBottom: b.ref ? 2 : 0 }}>{b.detail}</div>
        {b.ref && <div style={{ fontSize: 9, color: C.textLight, fontFamily: "monospace" }}>Ref: {b.ref}</div>}
      </div>
      {b.status === "to book" && (
        <button style={{ padding: "4px 8px", borderRadius: 7, background: C.accent, color: "white", border: "none", fontSize: 10, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Book</button>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "8px 14px 8px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: "5px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.green }}>{confirmed}</div>
              <div style={{ fontSize: 9, color: C.green, fontWeight: 600 }}>Confirmed</div>
            </div>
            <div style={{ background: C.amberLight, border: "1px solid #FCD34D", borderRadius: 8, padding: "5px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.amber }}>{toBook}</div>
              <div style={{ fontSize: 9, color: C.amber, fontWeight: 600 }}>To book</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["day", "By day"], ["list", "All"]].map(([v, l]) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "4px 9px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: view === v ? C.accent : C.tag, color: view === v ? "white" : C.textMid, border: "none", cursor: "pointer" }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Day strip */}
        {view === "day" && (
          <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
            {dayGroups.map(dg => {
              const hasUnbooked = allBookings.some(b => b.day === dg.day && b.status === "to book");
              const isSel = selectedDay === dg.day;
              return (
                <button key={dg.day} onClick={() => setSelectedDay(dg.day)} style={{ flexShrink: 0, padding: "4px 7px", borderRadius: 9, cursor: "pointer", minWidth: 42, textAlign: "center", background: isSel ? C.accent : C.tag, border: `1.5px solid ${isSel ? C.accent : hasUnbooked ? C.amber : C.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: isSel ? "white" : C.text }}>{dg.day}</div>
                  <div style={{ fontSize: 8, color: isSel ? "rgba(255,255,255,0.6)" : C.textLight }}>{dg.date}</div>
                  {hasUnbooked && !isSel && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.amber, margin: "2px auto 0" }} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Type filter */}
        {view === "list" && (
          <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: filter === t ? C.accent : C.tag, color: filter === t ? "white" : C.textMid, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                {typeIcons[t]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px" }}>
        {view === "day" && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 2 }}>
              Day {selectedDay} · {dayGroups.find(d => d.day === selectedDay)?.date} · {dayGroups.find(d => d.day === selectedDay)?.label}
            </div>
            <div style={{ marginBottom: 8 }}>
              {dayBookings.length === 0
                ? <div style={{ padding: "16px", textAlign: "center", color: C.textLight, fontSize: 11 }}>No bookings on this day</div>
                : dayBookings.map((b, i) => <BookingCard key={i} b={b} />)
              }
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => { const idx = dayGroups.findIndex(d => d.day === selectedDay); if (idx > 0) setSelectedDay(dayGroups[idx-1].day); }} style={{ flex: 1, padding: "7px", borderRadius: 8, background: C.tag, border: "none", fontSize: 10, color: C.textMid, cursor: "pointer", fontWeight: 600 }}>‹ Previous day</button>
              <button onClick={() => { const idx = dayGroups.findIndex(d => d.day === selectedDay); if (idx < dayGroups.length-1) setSelectedDay(dayGroups[idx+1].day); }} style={{ flex: 1, padding: "7px", borderRadius: 8, background: C.tag, border: "none", fontSize: 10, color: C.textMid, cursor: "pointer", fontWeight: 600 }}>Next day ›</button>
            </div>
          </>
        )}
        {view === "list" && (
          <>
            {listFiltered.map((b, i) => (
              <div key={i}>
                {(i === 0 || listFiltered[i-1].day !== b.day) && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, marginTop: i > 0 ? 8 : 0 }}>
                    Day {b.day} · {dayGroups.find(d => d.day === b.day)?.date || ""}
                  </div>
                )}
                <BookingCard b={b} />
              </div>
            ))}
          </>
        )}

        {/* Add-ons nudge */}
        <div style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: "9px 12px", marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 2 }}>Complete your trip</div>
          <div style={{ fontSize: 10, color: C.textMid, marginBottom: 7 }}>eSIM and travel insurance not yet sorted</div>
          <button style={{ fontSize: 10, fontWeight: 700, color: C.accent, background: "none", border: `1px solid ${C.accent}`, borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>View add-ons</button>
        </div>
      </div>
    </div>
  );
};

// ACTIVE TRIP
const ActiveTripScreen = ({ go }) => {
  const [tab, setTab] = useState("itinerary");
  return (
    <Phone label="Screen 3 — Active Trip">
      <div style={{ background: "linear-gradient(140deg, #1C1C1E, #2C2010)", padding: "8px 16px 10px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <button onClick={() => go("home")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "3px 8px", color: "white", fontSize: 11, cursor: "pointer" }}>‹ Trips</button>
          <div style={{ fontSize: 9, color: "rgba(193,123,63,0.8)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Active · Day 8</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>London & Beyond</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>📍 Burford, Cotswolds</div>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.surface }}>
        {[["itinerary","📅 Itinerary"],["bookings","✓ Bookings"],["ask","💬 Ask"],["trip","⚙️ Trip"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "8px 2px", fontSize: 9.5, fontWeight: tab === id ? 700 : 500, color: tab === id ? C.accent : C.textLight, background: "none", border: "none", cursor: "pointer", borderBottom: `2px solid ${tab === id ? C.accent : "transparent"}` }}>{label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        {tab === "itinerary" && (
          <>
            <div style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Tomorrow · Day 9 · Bath</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 3 }}>Roman Baths open at 9am — arrive early</div>
              <div style={{ fontSize: 11, color: C.textMid, marginBottom: 6 }}>Queues build by 10:30. Book Thermae Spa before it sells out.</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ fontSize: 10, fontWeight: 700, color: C.accent, background: "none", border: `1px solid ${C.accent}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Book Roman Baths</button>
                <button style={{ fontSize: 10, color: C.textLight, background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Dismiss</button>
              </div>
            </div>
            {[{day:8,date:"Thu 4 Sep",title:"The Cotswolds",status:"partial",current:true,split:true},{day:9,date:"Fri 5 Sep",title:"Bath",status:"unbooked",split:true},{day:10,date:"Sat 6 Sep",title:"Back to London",status:"booked",split:false}].map(d => (
              <div key={d.day} style={{ borderRadius: 12, border: `1.5px solid ${d.current ? C.accent : d.status==="booked" ? C.greenBorder : C.border}`, background: d.current ? C.accentLight : d.status==="booked" ? C.greenLight : C.surface, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 9, color: d.current ? C.accent : C.textLight, fontWeight: 700 }}>Day {d.day} · {d.date}{d.current?" · Today":""}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{d.title}</div>
                    {d.split && (
                      <div style={{ fontSize: 9, color: "#7C3AED", fontWeight: 600, marginTop: 2 }}>
                        👥 Split activities — shared + individual
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: d.status==="booked"?C.green:d.status==="partial"?C.amber:C.textLight, fontWeight: 700 }}>{d.status==="booked"?"✓ Booked":d.status==="partial"?"Partial":"To book"}</div>
                </div>
              </div>
            ))}
          </>
        )}
        {tab === "bookings" && <FullBookingsTab />}
        {tab === "ask" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
            <div><div style={{ fontSize: 28, marginBottom: 8 }}>💬</div><div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Voyager Ask</div><div style={{ fontSize: 11, color: C.textMid, marginTop: 4 }}>Detailed in Wireframe 05</div></div>
          </div>
        )}
        {tab === "trip" && <FullTripTab />}
      </div>
    </Phone>
  );
};

// PAST TRIP
const PastTripScreen = ({ go }) => (
  <Phone label="Screen 4 — Past Trip">
    <div style={{ background: "linear-gradient(140deg, #1C1C1E, #2C2010)", padding: "10px 16px 14px", flexShrink: 0 }}>
      <button onClick={() => go("home")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "3px 8px", color: "white", fontSize: 11, cursor: "pointer", marginBottom: 8 }}>‹ Trips</button>
      <div style={{ fontSize: 9, color: "rgba(193,123,63,0.8)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Past trip · Jun 2025</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 2 }}>Italy</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>14 nights · Rome, Florence, Amalfi Coast</div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
      <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, padding: "7px 12px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>✓ Completed · Read-only travel archive</div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Your itinerary</div>
      {[{day:"1–3",title:"Rome",detail:"Colosseum, Vatican, Trastevere"},{day:"4–7",title:"Florence",detail:"Uffizi, Oltrarno, day trip to Siena"},{day:"8–11",title:"Amalfi Coast",detail:"Positano, Ravello, boat day"},{day:"12–14",title:"Back to Rome",detail:"Final days, departure"}].map(d => (
        <div key={d.day} style={{ borderRadius: 10, border: `1px solid ${C.border}`, padding: "9px 12px", marginBottom: 8, background: C.surface, display: "flex", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.tag, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.textMid, flexShrink: 0 }}>{d.day}</div>
          <div><div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 1 }}>{d.title}</div><div style={{ fontSize: 11, color: C.textMid }}>{d.detail}</div></div>
        </div>
      ))}
      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, marginTop: 4 }}>Highlights</div>
      {[["🍽️","Best meal","Da Enzo al 29 — cacio e pepe, queue worth it"],["🏨","Favourite stay","Villa Cimbrone, Ravello — terrace over the coast"],["📍","Hidden gem","Oltrarno, Florence — skip the Duomo crowds"]].map(([icon,label,detail]) => (
        <div key={label} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
          <div><div style={{ fontSize: 10, fontWeight: 700, color: C.accent }}>{label}</div><div style={{ fontSize: 11, color: C.text }}>{detail}</div></div>
        </div>
      ))}
      <button style={{ width: "100%", padding: "10px", borderRadius: 10, background: C.surface, border: `1.5px solid ${C.accent}`, color: C.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 12 }}>📤 Share this itinerary</button>
    </div>
  </Phone>
);

// UPCOMING TRIP
const UpcomingTripScreen = ({ go }) => (
  <Phone label="Screen 5 — Upcoming Trip">
    <div style={{ background: "linear-gradient(140deg, #1C1C2E, #0D1020)", padding: "10px 16px 14px", flexShrink: 0 }}>
      <button onClick={() => go("home")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "3px 8px", color: "white", fontSize: 11, cursor: "pointer", marginBottom: 8 }}>‹ Trips</button>
      <div style={{ fontSize: 9, color: "rgba(120,160,255,0.8)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Upcoming · 247 days away</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 2 }}>Japan</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Mar — Apr 2027 · 21 nights</div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
      <div style={{ background: C.amberLight, border: "1px solid #FCD34D", borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.amber, fontWeight: 600 }}>⚠️ Cherry blossom dates confirmed — itinerary may need adjusting</div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Booking progress — 6 of 21 nights</div>
      <div style={{ height: 5, background: C.tag, borderRadius: 3, marginBottom: 12 }}>
        <div style={{ height: "100%", width: "29%", background: C.accent, borderRadius: 3 }} />
      </div>
      {[{day:"1–3",title:"Tokyo",s:"booked"},{day:"4–7",title:"Kyoto & Nara",s:"booked"},{day:"8–10",title:"Osaka",s:"unbooked"},{day:"11–14",title:"Hiroshima & Miyajima",s:"unbooked"},{day:"15–21",title:"Back to Tokyo & departure",s:"unbooked"}].map(d => (
        <div key={d.day} style={{ borderRadius: 10, border: `1px solid ${d.s==="booked"?C.greenBorder:C.border}`, background: d.s==="booked"?C.greenLight:C.surface, padding: "9px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 9, color: C.textLight }}>Days {d.day}</div><div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{d.title}</div></div>
          <div style={{ fontSize: 10, fontWeight: 700, color: d.s==="booked"?C.green:C.textLight }}>{d.s==="booked"?"✓ Booked":"To book"}</div>
        </div>
      ))}
    </div>
  </Phone>
);

// NOTIFICATIONS
const NotifScreen = ({ go }) => (
  <Phone label="Screen 6 — Push Notifications">
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: C.accentLight, border: `2px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 18 }}>🔔</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 8 }}>Stay ahead of your trip</div>
      <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6, marginBottom: 20 }}>Voyager can notify you when booking windows open, brief you the evening before each travel day, and confirm when bookings are imported.</div>
      <div style={{ width: "100%", marginBottom: 16 }}>
        {[["⏰","Booking window alerts","Know when popular tours and restaurants open for your dates"],["🌅","Day-ahead summaries","Evening briefing — what to expect and what to sort"],["✅","Booking confirmations","Instant confirmation when share sheet imports are processed"]].map(([icon,title,desc]) => (
          <div key={title} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}`, textAlign: "left" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{title}</div><div style={{ fontSize: 10, color: C.textMid }}>{desc}</div></div>
          </div>
        ))}
      </div>
      <WF text="Web Push API — single permission prompt. Works when app is closed." />
      <button onClick={() => go("home")} style={{ width: "100%", padding: "12px", borderRadius: 12, background: C.accent, color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 12, marginBottom: 8 }}>Enable notifications</button>
      <button onClick={() => go("home")} style={{ width: "100%", padding: "9px", borderRadius: 12, background: "none", color: C.textLight, border: "none", fontSize: 12, cursor: "pointer" }}>Not now</button>
    </div>
  </Phone>
);

const SCREENS = { home: HomeScreen, new: NewTripScreen, active: ActiveTripScreen, past: PastTripScreen, upcoming: UpcomingTripScreen, notif: NotifScreen };
const NAV = [["home","Home"],["active","Active Trip"],["upcoming","Upcoming Trip"],["past","Past Trip"],["new","New Trip"],["notif","Push Notifications"]];

export default function WF04() {
  const [screen, setScreen] = useState("home");
  const go = (s) => setScreen(s);
  const Screen = SCREENS[screen] || HomeScreen;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#F0F0F0", minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>Voyager — Wireframe 04 (Rebuilt)</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Home Screen & Multi-Trip Management</div>
        </div>
        <div style={{ fontSize: 11, color: C.textLight, background: "#FFFDE7", border: "1px solid #F0C040", borderRadius: 8, padding: "4px 10px" }}>📐 Wireframe — structure only</div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto 20px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {NAV.map(([id, label]) => (
          <button key={id} onClick={() => go(id)} style={{ padding: "5px 12px", borderRadius: 16, fontSize: 11, fontWeight: 600, background: screen === id ? C.accent : C.surface, color: screen === id ? "white" : C.textMid, border: `1px solid ${screen === id ? C.accent : C.border}`, cursor: "pointer" }}>{label}</button>
        ))}
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center" }}>
        <Screen go={go} />
      </div>
      <div style={{ maxWidth: 900, margin: "20px auto 0", background: C.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Key decisions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Home screen","Active trip hero → Upcoming → Plan new trip button → Past trips. Bell icon with badge count for cross-trip alerts."],["Multi-trip","Home → tap any trip → enters trip context. Back button returns to home. Current trip always labelled in header."],["Past trips","Read-only archive. Full itinerary, hotels, highlights preserved. Shareable. Feels like a travel journal."],["Push notifications","Web Push API — single permission prompt after first unlock. Booking alerts, day-ahead, confirmations. Works when app is closed."],["Plan new trip","Always accessible from home. Leads to Wireframe 01 onboarding. Can start new trip while mid-existing trip."],["Trip tab","4 sub-tabs: Alerts, Packing, Tools, Settings. Keeps bottom nav clean — settings not a primary navigation item."]].map(([title, desc]) => (
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
