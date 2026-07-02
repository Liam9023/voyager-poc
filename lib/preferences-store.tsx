"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Preferences } from "@/types";

/**
 * PreferencesContext — persistent traveller preferences, separate from trip state
 * (see lib/store.tsx) so "Reset demo" never wipes what the user told Voyager about themselves.
 */

const DEFAULT_PREFERENCES: Preferences = {
  homeAirport: "",
  preferredAirlines: "",
  dietary: [],
  allergies: "",
  foodDislikes: "",
  accessibilityNeeds: "",
  generalNotes: "",
};

const STORAGE_KEY = "voyager-preferences-v1";

interface PreferencesContextValue {
  preferences: Preferences;
  ready: boolean;
  updatePreferences: (patch: Partial<Preferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      /* ignore */
    }
  }, [preferences, ready]);

  const updatePreferences = useCallback((patch: Partial<Preferences>) => {
    setPreferences((p) => ({ ...p, ...patch }));
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, ready, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

/** True if any preference field has been filled in — used to decide whether to inject context. */
export function hasAnyPreferences(p: Preferences): boolean {
  return (
    p.homeAirport.trim() !== "" ||
    p.preferredAirlines.trim() !== "" ||
    p.dietary.length > 0 ||
    p.allergies.trim() !== "" ||
    p.foodDislikes.trim() !== "" ||
    p.accessibilityNeeds.trim() !== "" ||
    p.generalNotes.trim() !== ""
  );
}
