"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { restoreSession, sessionKey } from "./access";
import { setSession } from "./auth-slice";
export function SessionLifecycle() {
  const dispatch = useAppDispatch(),
    { session, ready } = useAppSelector((s) => s.auth);
  useEffect(() => {
    try {
      dispatch(
        setSession(
          restoreSession(
            JSON.parse(sessionStorage.getItem(sessionKey) ?? "null"),
            Date.now(),
          ),
        ),
      );
    } catch {
      dispatch(setSession(null));
    }
  }, [dispatch]);
  useEffect(() => {
    if (!ready) return;
    try {
      if (session) sessionStorage.setItem(sessionKey, JSON.stringify(session));
      else sessionStorage.removeItem(sessionKey);
    } catch {}
    if (!session) return;
    const expire = () => {
      if (Date.now() >= session.expiresAt) dispatch(setSession(null));
    };
    const timer = setTimeout(
      expire,
      Math.max(0, session.expiresAt - Date.now()),
    );
    window.addEventListener("focus", expire);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", expire);
    };
  }, [dispatch, session, ready]);
  return null;
}
