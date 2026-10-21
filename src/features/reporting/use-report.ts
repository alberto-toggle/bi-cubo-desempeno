"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadReport } from "./report-slice";
export function useReport() {
  const dispatch = useAppDispatch(),
    report = useAppSelector((s) => s.report);
  useEffect(() => {
    const task = dispatch(loadReport());
    return () => task.abort();
  }, [dispatch]);
  return { ...report, reload: () => dispatch(loadReport()) };
}
