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
      <HeadingSkeleton />
      <div className={reportLayout.detail}>
        <Bone className="h-[480px]" />
        <div className="space-y-5">
          <Bone className="h-12" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <Bone key={i} className="h-20" />
            ))}
          </div>
          <ReportPanel title="Utilidades mensuales">
            <ChartPlaceholder />
          </ReportPanel>
          <div className={reportLayout.pair}>
            {[0, 1].map((i) => (
              <Bone key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export function ReportScreenSkeleton() {
  return (
    <LoadingFrame>
      <HeadingSkeleton />
      <FiltersSkeleton count={2} />
      <div className={reportLayout.story}>
        <Bone className="h-[620px]" />
        <div className="space-y-5">
          <Bone className="h-10" />
          <ReportPanel title="Utilidades por giro comercial">
            <Bone className="h-[650px]" />
          </ReportPanel>
        </div>
      </div>
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
