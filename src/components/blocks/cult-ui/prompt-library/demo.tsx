"use client";
import { useState } from "react";
import {
  PromptLibrary,
  PromptLibraryTrigger,
  PromptLibraryContent,
  PromptLibrarySearch,
  PromptLibraryList,
  PromptLibraryEmpty,
  PromptLibraryGroup,
  PromptLibraryItem,
  PromptLibraryFooter,
  PromptLibraryCreateTrigger,
  PromptLibraryCreateDialog,
  type Prompt,
} from "./prompt-library";
const initial: Prompt[] = [
  {
    id: "summary",
    title: "Resumen ejecutivo",
    description: "Síntesis breve del contenido",
    prompt:
      "Resume la información en tres puntos y distingue hechos de supuestos.",
  },
  {
    id: "compare",
    title: "Comparativo",
    description: "Diferencias entre periodos",
    prompt:
      "Compara ambos periodos e indica las diferencias absolutas y porcentuales.",
  },
];
export default function Demo() {
  const [items, setItems] = useState(initial);
  const [result, setResult] = useState("");
  return (
    <div className="mx-auto min-h-96 max-w-xl space-y-6 py-12">
      <PromptLibrary
        prompts={items}
        onPromptsChange={setItems}
        onInsert={setResult}
      >
        <PromptLibraryTrigger />
        <PromptLibraryContent>
          <PromptLibrarySearch />
          <PromptLibraryList>
            <PromptLibraryEmpty />
            <PromptLibraryGroup>
              {items.map((item) => (
                <PromptLibraryItem key={item.id} prompt={item} />
              ))}
            </PromptLibraryGroup>
          </PromptLibraryList>
          <PromptLibraryFooter>
            <PromptLibraryCreateTrigger />
          </PromptLibraryFooter>
        </PromptLibraryContent>
        <PromptLibraryCreateDialog />
      </PromptLibrary>
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
