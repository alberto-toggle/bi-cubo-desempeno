"use client";
import {
  chartStorageKey,
  restoreCharts,
} from "@/features/reporting/chart-preferences";
import { applyAppearance } from "@/theme/browser";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { setAppearance } from "@/features/appearance/appearance-slice";
import { storageKey, validateAppearance } from "@/features/appearance/config";
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());
  // Preserve the SSR snapshot while streamed children hydrate, even if
  // browser preferences have already updated the live store.
  const [serverState] = useState(() => store.getState());
  useEffect(() => {
    try {
      store.dispatch(
        setAppearance(
          validateAppearance(
            JSON.parse(localStorage.getItem(storageKey) ?? "null"),
          ),
        ),
      );
    } catch {}
    const apply = () => {
      const value = store.getState().appearance;
      applyAppearance(document.documentElement, value);
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch {}
    };
    apply();
    const unsubscribe = store.subscribe(apply);
    const sync = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      try {
        store.dispatch(
          setAppearance(
            validateAppearance(JSON.parse(event.newValue ?? "null")),
          ),
        );
      } catch {}
    };
    window.addEventListener("storage", sync);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", sync);
    };
  }, [store]);
  useEffect(() => {
    try {
      store.dispatch(
        restoreCharts(
          JSON.parse(localStorage.getItem(chartStorageKey) ?? "null"),
        ),
      );
    } catch {}
    let previous = store.getState().chartPreferences;
    const unsubscribe = store.subscribe(() => {
      const value = store.getState().chartPreferences;
      if (value === previous) return;
      previous = value;
      try {
        localStorage.setItem(chartStorageKey, JSON.stringify(value));
      } catch {}
    });
    const sync = (event: StorageEvent) => {
      if (event.key !== chartStorageKey && event.key !== null) return;
      try {
        store.dispatch(restoreCharts(JSON.parse(event.newValue ?? "null")));
      } catch {}
    };
    window.addEventListener("storage", sync);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", sync);
    };
  }, [store]);
  return (
    <Provider store={store} serverState={serverState}>
      {children}
    </Provider>
  );
}
