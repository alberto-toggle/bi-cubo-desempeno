import {
  Bone,
  LoadingFrame,
  HeadingSkeleton,
  FiltersSkeleton,
} from "@/features/loading/skeleton-parts";
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
      <Bone className="h-12 w-full rounded-xl" />
      <div className="flex justify-end">
        <Bone className="h-10 w-44" />
      </div>
      <div className={reportLayout.cards}>
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-28" />
        ))}
      </div>
      <ReportPanel title="Histórico mensual">
        <ChartPlaceholder />
      </ReportPanel>
    </div>
  );
}
export function ReportScreenSkeleton() {
  return (
    <LoadingFrame>
      <HeadingSkeleton />
      <FiltersSkeleton count={3} />
      <Bone className="h-14" />
      <Bone className="h-12 rounded-xl" />
      <div className={reportLayout.pair}>
        <ReportPanel title="Utilidades por giro comercial">
          <ChartPlaceholder />
        </ReportPanel>
        <ReportPanel title="Avance contra meta anual">
          <ChartPlaceholder />
          <Bone className="mt-5 h-20" />
        </ReportPanel>
      </div>
      <ReportPanel title="Programas productivos">
        <ChartPlaceholder />
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
