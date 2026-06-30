"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * TripContext — lightweight client state for the POC.
 * Persisted to localStorage so the demo survives refreshes (no database — see CLAUDE.md).
 */

interface TripState {
  unlocked: boolean;
  removedActivities: string[]; // activity ids the user removed/swapped
  addons: string[]; // selected add-on keys
  extraBooked: string[]; // booking ids the user marked "booked"
  packed: string[]; // packing items ticked
}

const DEFAULT_STATE: TripState = {
  unlocked: false,
  removedActivities: [],
  addons: [],
  extraBooked: [],
  packed: [],
};

const STORAGE_KEY = "voyager-noosa-state-v1";

interface TripContextValue extends TripState {
  ready: boolean;
  unlock: () => void;
  reset: () => void;
  removeActivity: (id: string) => void;
  restoreActivity: (id: string) => void;
  toggleAddon: (key: string) => void;
  markBooked: (id: string) => void;
  togglePacked: (item: string) => void;
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
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
