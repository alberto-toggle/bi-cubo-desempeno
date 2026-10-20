"use client";
import { useEffect, useState } from "react";
export function VerificationTimer({ expiresAt }: { expiresAt: number }) {
  const [now, setNow] = useState(() => Date.now());
  const seconds = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);
  return seconds ? (
    <p className="text-xs text-muted-foreground tabular-nums">
      El código expira en {Math.floor(seconds / 60)}:
      {String(seconds % 60).padStart(2, "0")}
    </p>
  ) : (
    <p role="alert" className="text-sm text-destructive">
      El código expiró. Solicita uno nuevo para continuar.
    </p>
  );
}
