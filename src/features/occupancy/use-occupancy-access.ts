"use client";
import { useAppSelector } from "@/store/hooks";
import { usePrivateFormatter } from "@/features/privacy/use-private-formatter";
const tariffFormat = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});
const formatTariff = (cents: number) => tariffFormat.format(cents / 100);
// Demo policy is applied before passing identities to presentational components.
export function useOccupancyAccess() {
  const role = useAppSelector((s) => s.auth.session?.role);
  const money = usePrivateFormatter(formatTariff);
  return {
    money,
    person: (name: string, alias: string) =>
      role === "admin" ? name : `•••• ${alias}`,
  };
}
