import {
  Bone,
  LoadingFrame,
  HeadingSkeleton,
  FiltersSkeleton,
} from "@/features/loading/skeleton-parts";
import { DataTableLayout } from "@/components/layout/data-table-layout";
import { reportUnitColumns, reportTableClass } from "./report-table-layout";
import { reportLayout, ReportPanel } from "./report-layout";
function ChartPlaceholder() {
  return (
    <>
      <div className={reportLayout.plot}>
        <Bone className="h-80 w-full" />
      </div>
      <Bone className="mt-4 h-4 w-40" />
    </>
  );
}
export function ReportDetailSkeleton() {
  return (
    <div className={reportLayout.page}>
      <div className="flex flex-wrap justify-between gap-3">
        <Bone className="h-7 w-48" />
        <Bone className="h-9 w-64" />
      </div>
      <div className={reportLayout.cards}>
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-36" />
        ))}
      </div>
      <ReportPanel title="Histórico mensual">
        <ChartPlaceholder />
      </ReportPanel>
      <div className={reportLayout.pair}>
        <ReportPanel title="Avance contra meta anual">
          <ChartPlaceholder />
        </ReportPanel>
        <ReportPanel title="Comparativo al mismo corte">
          <ChartPlaceholder />
        </ReportPanel>
      </div>
      <ReportPanel title="Comparativo por ejercicio">
        <ChartPlaceholder />
      </ReportPanel>
      <Bone className="h-24" />
    </div>
  );
}
export function ReportScreenSkeleton() {
  return (
    <LoadingFrame>
      <HeadingSkeleton />
      <FiltersSkeleton count={3} />
      <Bone className="h-14" />
      <div className={reportLayout.cards}>
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-36" />
        ))}
      </div>
      <div className={reportLayout.pair}>
        <ReportPanel title="Resultado por giro comercial">
          <ChartPlaceholder />
        </ReportPanel>
        <ReportPanel title="Avance contra meta anual">
          <ChartPlaceholder />
        </ReportPanel>
      </div>
      <ReportPanel title="Programas productivos">
        <ChartPlaceholder />
      </ReportPanel>
      <ReportPanel title="Resultados por establecimiento">
        <DataTableLayout columns={reportUnitColumns} className={reportTableClass}>
          <thead>
            <tr>
              {reportUnitColumns.map((column) => (
                <th key={column.key} className="px-3 py-4">
                  <Bone className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, row) => (
              <tr key={row} className="border-t border-border">
                {reportUnitColumns.map((column) => (
                  <td key={column.key} className="px-3 py-4">
                    <Bone className="h-4 w-4/5" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </DataTableLayout>
        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <Bone className="h-9 w-40" />
          <Bone className="h-9 w-44" />
        </div>
      </ReportPanel>
    </LoadingFrame>
  );
}
export function ChartSettingsSkeleton() {
  return (
    <LoadingFrame>
      <HeadingSkeleton />
      {[0, 1, 2].map((i) => (
        <Bone key={i} className="h-40" />
      ))}
      <Bone className="h-10 w-52" />
    </LoadingFrame>
  );
}
