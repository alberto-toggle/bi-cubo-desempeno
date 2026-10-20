"use client";
import { Popover } from "@base-ui/react/popover";
import { DemoControls } from "@/features/demo/demo-controls";
import { demoAccounts } from "./access";
import { demoVerificationCode } from "./two-factor";
export function LoginDemoWidget({
  twoFactor,
  onToggle,
  onFill,
  disabled,
  onAdvance,
}: {
  twoFactor: boolean;
  onToggle: (value: boolean) => void;
  onFill: (email: string, password: string) => void;
  disabled: boolean;
  onAdvance?: () => void;
}) {
  return (
    <DemoControls>
      <div className="space-y-2">
        {demoAccounts.map((account) => (
          <Popover.Close
            key={account.role}
            disabled={disabled}
            onClick={() => onFill(account.email, account.password)}
            className="demo-action"
          >
            <span className="block text-sm font-semibold">{account.label}</span>
            <span className="block text-xs opacity-85">{account.email}</span>
            <span className="mt-1 block text-xs">
              Contraseña: <code>{account.password}</code>
            </span>
          </Popover.Close>
        ))}
      </div>
      <label className="demo-option">
        <input
          type="checkbox"
          checked={twoFactor}
          disabled={disabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span>Simular verificación en dos pasos</span>
      </label>
      {twoFactor && (
        <p className="text-xs">
          Código demo:{" "}
          <code className="font-semibold">{demoVerificationCode}</code>. No se
          envía un correo real.
        </p>
      )}
      {onAdvance && (
        <Popover.Close className="demo-action text-sm" onClick={onAdvance}>
          Dejar 10 segundos para expirar
        </Popover.Close>
      )}
    </DemoControls>
  );
}
