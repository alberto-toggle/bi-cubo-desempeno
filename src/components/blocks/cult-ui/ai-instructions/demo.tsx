"use client";
import { useState } from "react";
import {
  Instructions,
  InstructionsTrigger,
  InstructionsContent,
  InstructionsSearch,
  InstructionsList,
  InstructionsEmpty,
  InstructionsGroup,
  InstructionsItem,
  InstructionsFooter,
  InstructionsCreateTrigger,
  InstructionsCreateDialog,
  type Instruction,
} from "./ai-instructions";
const initial: Instruction[] = [
  {
    id: "summary",
    title: "Resumen ejecutivo",
    description: "Síntesis breve del contenido",
    content:
      "Resume la información en tres puntos y distingue hechos de supuestos.",
  },
  {
    id: "compare",
    title: "Comparativo",
    description: "Diferencias entre periodos",
    content:
      "Compara ambos periodos e indica las diferencias absolutas y porcentuales.",
  },
];
export default function Demo() {
  const [items, setItems] = useState(initial);
  const [result, setResult] = useState("");
  return (
    <div className="mx-auto min-h-96 max-w-xl space-y-6 py-12">
      <Instructions
        instructions={items}
        onInstructionsChange={setItems}
        onValueChange={(ids) =>
          setResult(
            ids
              .map((id) => items.find((item) => item.id === id)?.title)
              .join(", "),
          )
        }
      >
        <InstructionsTrigger />
        <InstructionsContent>
          <InstructionsSearch />
          <InstructionsList>
            <InstructionsEmpty />
            <InstructionsGroup>
              {items.map((item) => (
                <InstructionsItem key={item.id} instruction={item} />
              ))}
            </InstructionsGroup>
          </InstructionsList>
          <InstructionsFooter>
            <InstructionsCreateTrigger />
          </InstructionsFooter>
        </InstructionsContent>
        <InstructionsCreateDialog />
      </Instructions>
      <p
        className="rounded-xl border border-border p-5 text-sm text-muted-foreground"
        role="status"
      >
        {result ||
          "Selecciona una entrada o crea una nueva. Los cambios son locales a esta vista."}
      </p>
    </div>
  );
}
