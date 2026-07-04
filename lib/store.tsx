"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Activity, Booking, DecisionStyle, Expense, Pacing, PlacedActivity } from "@/types";

/**
 * TripContext — lightweight client state for the POC.
 * Persisted to localStorage so the demo survives refreshes (no database — see CLAUDE.md).
 */

interface TripState {
  unlocked: boolean;
  removedActivities: string[]; // activity ids the user removed
  swappedActivities: Record<string, Activity>; // original activity id -> replacement (id preserved)
  addedActivities: PlacedActivity[]; // brand-new activities the user added, any day
  timeOverrides: Record<string, string>; // activity id -> new time_of_day (from conflict-fix proposals)
  manualBookings: Booking[]; // hand-entered bookings (Bookings tab > Add manually)
  addons: string[]; // selected add-on keys
  extraBooked: string[]; // booking ids the user marked "booked"
  packed: string[]; // packing items ticked
  pacing: Pacing;
  decisionStyle: DecisionStyle;
  expenses: Expense[]; // group expense ledger — item 15
}

const DEFAULT_STATE: TripState = {
  unlocked: false,
  removedActivities: [],
  swappedActivities: {},
  addedActivities: [],
  timeOverrides: {},
  manualBookings: [],
  addons: [],
  extraBooked: [],
  packed: [],
  pacing: "balanced",
  decisionStyle: "show_options",
  expenses: [],
};

const STORAGE_KEY = "voyager-noosa-state-v1";

interface TripContextValue extends TripState {
  ready: boolean;
  unlock: () => void;
  reset: () => void;
  removeActivity: (id: string) => void;
  restoreActivity: (id: string) => void;
  swapActivity: (id: string, replacement: Activity) => void;
  undoSwap: (id: string) => void;
  addActivity: (activity: PlacedActivity) => void;
  removeAddedActivity: (id: string) => void;
  updateAddedActivity: (id: string, patch: Partial<Activity>) => void;
  setTimeOverride: (id: string, newTime: string) => void;
  addManualBooking: (booking: Booking) => void;
  toggleAddon: (key: string) => void;
  markBooked: (id: string) => void;
  togglePacked: (item: string) => void;
  setPacing: (p: Pacing) => void;
  setDecisionStyle: (d: DecisionStyle) => void;
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TripState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const value: TripContextValue = {
    ...state,
    ready,
    unlock: () => setState((s) => ({ ...s, unlocked: true })),
    reset: () => setState(DEFAULT_STATE),
    removeActivity: (id) =>
      setState((s) =>
        s.removedActivities.includes(id)
          ? s
          : { ...s, removedActivities: [...s.removedActivities, id] },
      ),
    restoreActivity: (id) =>
      setState((s) => ({
        ...s,
        removedActivities: s.removedActivities.filter((x) => x !== id),
      })),
    swapActivity: (id, replacement) =>
      setState((s) => ({
        ...s,
        swappedActivities: { ...s.swappedActivities, [id]: replacement },
      })),
    undoSwap: (id) =>
      setState((s) => {
        const next = { ...s.swappedActivities };
        delete next[id];
        return { ...s, swappedActivities: next };
      }),
    addActivity: (activity) =>
      setState((s) => ({ ...s, addedActivities: [...s.addedActivities, activity] })),
    removeAddedActivity: (id) =>
      setState((s) => ({
        ...s,
        addedActivities: s.addedActivities.filter((a) => a.id !== id),
      })),
    updateAddedActivity: (id, patch) =>
      setState((s) => ({
        ...s,
        addedActivities: s.addedActivities.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      })),
    setTimeOverride: (id, newTime) =>
      setState((s) => ({ ...s, timeOverrides: { ...s.timeOverrides, [id]: newTime } })),
    addManualBooking: (booking) =>
      setState((s) => ({ ...s, manualBookings: [...s.manualBookings, booking] })),
    setPacing: (p) => setState((s) => ({ ...s, pacing: p })),
    setDecisionStyle: (d) => setState((s) => ({ ...s, decisionStyle: d })),
    toggleAddon: (key) =>
      setState((s) => ({
        ...s,
        addons: s.addons.includes(key)
          ? s.addons.filter((x) => x !== key)
          : [...s.addons, key],
      })),
    markBooked: (id) =>
      setState((s) =>
        s.extraBooked.includes(id) ? s : { ...s, extraBooked: [...s.extraBooked, id] },
      ),
    togglePacked: (item) =>
      setState((s) => ({
        ...s,
        packed: s.packed.includes(item)
          ? s.packed.filter((x) => x !== item)
          : [...s.packed, item],
      })),
    addExpense: (expense) => setState((s) => ({ ...s, expenses: [...s.expenses, expense] })),
    removeExpense: (id) =>
      setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) })),
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
