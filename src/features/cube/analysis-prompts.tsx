"use client";
import {
  PromptLibrary,
  PromptLibraryTrigger,
  PromptLibraryContent,
  PromptLibrarySearch,
  PromptLibraryList,
  PromptLibraryEmpty,
  PromptLibraryGroup,
  PromptLibraryItem,
  type Prompt,
} from "@/components/analysis/prompt-library";
const prompts: Prompt[] = [
  {
    id: "summary",
    title: "Resumen de resultados",
    description: "Importes y concentración de la selección",
    prompt: "Resume los resultados de esta selección.",
  },
  {
    id: "compare",
    title: "Comparar periodos",
    description: "Variación respecto al mismo corte anterior",
    prompt: "Compara las cifras con el mismo corte del año anterior.",
  },
  {
    id: "goals",
    title: "Revisar metas",
    description: "Avance y establecimientos por revisar",
    prompt: "Revisa el avance de metas de esta selección.",
  },
  {
    id: "report",
    title: "Reporte ejecutivo",
    description: "Borrador con cifras y referencias",
    prompt: "Prepara un reporte ejecutivo con los datos actuales.",
  },
];
export function AnalysisPrompts({
  onInsert,
  disabled,
}: {
  onInsert: (text: string) => void;
  disabled: boolean;
}) {
  return (
    <PromptLibrary prompts={prompts} onInsert={onInsert}>
      <PromptLibraryTrigger disabled={disabled}>
        Consultas sugeridas
      </PromptLibraryTrigger>
      <PromptLibraryContent>
        <PromptLibrarySearch placeholder="Buscar consulta…" />
        <PromptLibraryList>
          <PromptLibraryEmpty>Sin coincidencias.</PromptLibraryEmpty>
          <PromptLibraryGroup>
            {prompts.map((p) => (
              <PromptLibraryItem key={p.id} prompt={p} />
            ))}
          </PromptLibraryGroup>
        </PromptLibraryList>
      </PromptLibraryContent>
    </PromptLibrary>
  );
}
