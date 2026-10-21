"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadPortfolio } from "./portfolio-slice";
import { effectiveIdentity } from "./model";
export function usePortfolio() {
  const dispatch = useAppDispatch(),
    portfolio = useAppSelector((s) => s.portfolio),
    mode = useAppSelector((s) =>
      effectiveIdentity(s.auth.session?.role ?? null),
    );
  useEffect(() => {
    const request = dispatch(loadPortfolio());
    return () => request.abort();
  }, [dispatch]);
  return { ...portfolio, mode, reload: () => dispatch(loadPortfolio()) };
}
