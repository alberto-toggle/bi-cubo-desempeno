"use client";
import { useSyncExternalStore } from "react";
import { validateProposals, type CatalogProposal } from "./catalog-model";
const key = "gtyg.catalog-proposals.v1",
  event = "gtyg:catalog-proposals";
let fallback = "[]";
function snapshot() {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return fallback;
  }
}
function subscribe(notify: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === key || e.key === null) notify();
  };
  window.addEventListener("storage", handler);
  window.addEventListener(event, notify);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(event, notify);
  };
}
function serverSnapshot() {
  return "[]";
}
export function useCatalogProposals() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  let proposals: CatalogProposal[] = [];
  try {
    proposals = validateProposals(JSON.parse(raw));
  } catch {}
  function add(proposal: CatalogProposal) {
    let current: CatalogProposal[] = [];
    try {
      current = validateProposals(JSON.parse(snapshot()));
    } catch {}
    fallback = JSON.stringify([proposal, ...current]);
    try {
      localStorage.setItem(key, fallback);
    } catch {}
    window.dispatchEvent(new Event(event));
  }
  return { proposals, add };
}
