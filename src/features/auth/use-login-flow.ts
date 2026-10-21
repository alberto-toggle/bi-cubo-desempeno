"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { authenticateDemo, type DemoRole } from "./access";
import { setSession } from "./auth-slice";
import {
  checkChallenge,
  createChallenge,
  type DemoChallenge,
} from "./two-factor";
export function useLoginFlow() {
  const [challenge, setChallenge] = useState<DemoChallenge | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const generation = useRef(0),
    busyRef = useRef(false),
    dispatch = useAppDispatch(),
    router = useRouter();
  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  async function delay() {
    const token = ++generation.current;
    await new Promise((r) => setTimeout(r, 600));
    return token === generation.current;
  }
  function finish(role: DemoRole) {
    setChallenge(null);
    setNotice("");
    dispatch(setSession({ role, expiresAt: Date.now() + 8 * 60 * 60 * 1000 }));
    router.replace("/");
  }
  async function credentials(
    email: string,
    password: string,
    twoFactor: boolean,
  ) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    if (!(await delay())) return;
    const role = authenticateDemo(email, password);
    if (!role)
      setError(
        "El correo o la contraseña no coinciden con un acceso de demostración.",
      );
    else if (twoFactor) {
      setChallenge(createChallenge(role, email, Date.now()));
      setNotice("Código disponible. Captúralo para continuar.");
    } else finish(role);
    busyRef.current = false;
    setBusy(false);
  }
  async function verify(code: string) {
    if (!challenge || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    if (!(await delay())) return;
    const result = checkChallenge(challenge, code, Date.now());
    if (result === "valid") finish(challenge.role);
    else {
      setError(
        result === "expired"
          ? "El código expiró. Solicita uno nuevo."
          : result === "locked"
            ? "Se alcanzó el límite de intentos. Vuelve al inicio de sesión."
            : "Código incorrecto. Revisa los seis dígitos.",
      );
      if (result === "invalid")
        setChallenge({ ...challenge, attempts: challenge.attempts + 1 });
    }
    busyRef.current = false;
    setBusy(false);
  }
  async function resend() {
    if (!challenge || busyRef.current || challenge.attempts >= 5) return;
    busyRef.current = true;
    setBusy(true);
    if (!(await delay())) return;
    setChallenge({ ...challenge, expiresAt: Date.now() + 120000 });
    setError("");
    setNotice("Se generó un nuevo código. Vigencia: 2 minutos.");
    busyRef.current = false;
    setBusy(false);
  }
  function advance() {
    if (!challenge || busyRef.current) return;
    setChallenge({
      ...challenge,
      expiresAt: Math.min(challenge.expiresAt, Date.now() + 10000),
    });
  }
  function back() {
    generation.current++;
    busyRef.current = false;
    setBusy(false);
    setChallenge(null);
    setError("");
    setNotice("");
  }
  return {
    challenge,
    error,
    busy,
    notice,
    credentials,
    verify,
    resend,
    back,
    advance,
  };
}
