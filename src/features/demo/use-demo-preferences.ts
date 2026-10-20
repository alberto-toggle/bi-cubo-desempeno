"use client";
import { useSyncExternalStore } from "react";
import {
  demoPreferencesKey,
  validateDemoPreferences,
  type DemoPreferences,
} from "./preferences";
const changeEvent = "gtyg:demo-preferences";
let memoryValue = "{}";
function subscribe(notify: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === demoPreferencesKey || event.key === null) notify();
  };
  window.addEventListener("storage", storage);
  window.addEventListener(changeEvent, notify);
  return () => {
    window.removeEventListener("storage", storage);
    window.removeEventListener(changeEvent, notify);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(demoPreferencesKey) ?? "{}";
  } catch {
    return memoryValue;
  }
}
function serverSnapshot() {
  return null;
}
export function useDemoPreferences() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  let preferences: DemoPreferences;
  try {
    preferences = validateDemoPreferences(JSON.parse(raw ?? "{}"));
  } catch {
    preferences = validateDemoPreferences(null);
  }
  function update(value: Partial<DemoPreferences>) {
    memoryValue = JSON.stringify({ ...preferences, ...value });
    try {
      localStorage.setItem(demoPreferencesKey, memoryValue);
    } catch {}
    window.dispatchEvent(new Event(changeEvent));
  }
  return { preferences, ready: raw !== null, update };
}
