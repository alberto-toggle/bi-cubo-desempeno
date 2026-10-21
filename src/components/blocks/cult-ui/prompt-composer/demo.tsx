"use client";
import { useState } from "react";
import { PromptComposer } from "./prompt-composer";
export default function Demo() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState("");
  return (
    <div className="mx-auto min-h-96 max-w-2xl space-y-6 py-16">
      <PromptComposer
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSend={() => {
          setSent(value);
          setValue("");
        }}
        placeholder="Escribe una consulta de demostración…"
      />
      <p role="status" className="text-sm text-muted-foreground">
        {sent ? `Envío simulado: ${sent}` : "Sin conexión a un servicio de IA."}
      </p>
    </div>
  );
}
