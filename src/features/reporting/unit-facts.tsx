import { reportLayout, ReportPanel } from "./report-layout";

export type UnitFactsData = {
  responsible: string;
  appointed: string;
  officers: number;
  troops: number;
  civilians: number;
};
export function UnitFacts({ data }: { data: UnitFactsData }) {
  return (
    <ReportPanel title="Responsable y personal" description="Ficha de referencia · Datos ficticios para demostración">
      <dl className={reportLayout.cards}>
        {[
          ["Gerente / responsable", data.responsible],
          ["Fecha de alta del responsable", data.appointed],
          ["Personal militar", `${data.officers} oficiales · ${data.troops} de tropa`],
          ["Personal civil", `${data.civilians} personas`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </ReportPanel>
  );
}
