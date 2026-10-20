"use client";
import { AccessLayout } from "./access-layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { LoginSkeleton } from "@/features/loading/skeletons";
import { useDemoPreferences } from "@/features/demo/use-demo-preferences";
import { DemoHelp } from "@/features/demo/demo-controls";
import { VerificationTimer } from "./verification-timer";
import { LoginDemoWidget } from "./login-demo-widget";
import { useLoginFlow } from "./use-login-flow";
export function LoginScreen() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [visible, setVisible] = useState(false),
    [code, setCode] = useState(""),
    [initialReady, setInitialReady] = useState(false);
  const router = useRouter(),
    auth = useAppSelector((s) => s.auth),
    { preferences, ready, update } = useDemoPreferences(),
    flow = useLoginFlow();
  useEffect(() => {
    const timer = setTimeout(() => setInitialReady(true), 450);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (auth.ready && auth.session) router.replace("/");
  }, [auth, router]);
  const loading =
    !initialReady || !auth.ready || !ready || Boolean(auth.session);
  return (
    <AccessLayout
      controls={
        <LoginDemoWidget
          onAdvance={flow.challenge && !flow.busy ? flow.advance : undefined}
          twoFactor={preferences.twoFactor}
          onToggle={(twoFactor) => update({ twoFactor })}
          disabled={loading || flow.busy || Boolean(flow.challenge)}
          onFill={(nextEmail, nextPassword) => {
            flow.back();
            setEmail(nextEmail);
            setPassword(nextPassword);
            setCode("");
          }}
        />
      }
    >
      {loading ? (
        <LoginSkeleton />
      ) : (
        <div className="login-content">
          <span className="inline-flex rounded-2xl border border-border p-3 text-primary">
            <ShieldCheck size={22} />
          </span>
          <h1 className="login-title">
            {flow.challenge
              ? "Verificación en dos pasos"
              : "Acceso a la plataforma"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {flow.challenge
              ? "Captura el código de seis dígitos para continuar."
              : "Ingresa con el correo y la contraseña asignados."}
          </p>
          {flow.challenge ? (
            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                void flow.verify(code);
              }}
              aria-busy={flow.busy}
            >
              <label className="block text-sm font-medium">
                Código de verificación
                <input
                  autoFocus
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="field mt-2 text-center text-2xl tracking-[.45em]"
                  disabled={flow.busy}
                  aria-invalid={Boolean(flow.error)}
                  aria-describedby={flow.error ? "login-error" : undefined}
                />
              </label>
              <VerificationTimer
                key={flow.challenge.expiresAt}
                expiresAt={flow.challenge.expiresAt}
              />
              {flow.error && (
                <p
                  id="login-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {flow.error}
                </p>
              )}
              <button
                disabled={flow.busy}
                className="primary-button login-submit w-full justify-center"
              >
                {flow.busy ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Verificando…
                  </>
                ) : (
                  "Verificar y entrar"
                )}
              </button>
              <div className="flex justify-between gap-4 text-xs">
                <button
                  type="button"
                  className="text-primary underline disabled:opacity-50"
                  disabled={flow.busy || flow.challenge.attempts >= 5}
                  onClick={() => {
                    setCode("");
                    void flow.resend();
                  }}
                >
                  Reenviar código
                </button>
                <button
                  type="button"
                  className="text-muted-foreground underline"
                  onClick={() => {
                    flow.back();
                    setCode("");
                  }}
                >
                  Volver al acceso
                </button>
              </div>
              <p role="status" className="text-xs text-muted-foreground">
                {flow.notice}
              </p>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void flow.credentials(email, password, preferences.twoFactor);
              }}
              className="mt-8 space-y-5"
              aria-busy={flow.busy}
            >
              <label className="block text-sm font-medium">
                Correo electrónico
                <input
                  required
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={flow.busy}
                  className="field mt-2"
                  placeholder="tu@correo.com"
                />
              </label>
              <label className="block text-sm font-medium">
                Contraseña
                <span className="relative mt-2 block">
                  <input
                    required
                    type={visible ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={flow.busy}
                    className="field pr-12"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground"
                    aria-label={
                      visible ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
              {flow.error && (
                <p role="alert" className="text-sm text-destructive">
                  {flow.error}
                </p>
              )}
              <button
                disabled={flow.busy}
                className="primary-button login-submit w-full justify-center"
              >
                {flow.busy ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Validando acceso…
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              {preferences.twoFactor && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck size={14} />
                  Verificación en dos pasos activada.
                </p>
              )}
            </form>
          )}
          <DemoHelp className="mt-7">
            Abre el widget Demo para completar los accesos de prueba y
            configurar la verificación en dos pasos.
          </DemoHelp>
        </div>
      )}
    </AccessLayout>
  );
}
