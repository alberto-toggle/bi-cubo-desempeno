"use client";
import { useAppSelector } from "@/store/hooks";
export function useFinancialPrivacy() {
  const role = useAppSelector((s) => s.auth.session?.role);
  const concealed = useAppSelector((s) => s.privacy.concealed);
  return {
    hidden: role !== "admin" || concealed,
    canViewAmounts: role === "admin",
  };
}
