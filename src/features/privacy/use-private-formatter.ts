"use client";
import { useFinancialPrivacy } from "./use-financial-privacy";
/** Mask in render output, including accessible text; never just blur with CSS. */
export function usePrivateFormatter(format: (value: number) => string) {
  const { hidden } = useFinancialPrivacy();
  return hidden ? () => "••••" : format;
}
