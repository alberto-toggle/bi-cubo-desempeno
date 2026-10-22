import { ReportDetailSkeleton } from "@/features/reporting/report-skeleton";
import { GeographyLayout } from "@/features/intelligence/geography/geography-layout";
import { intelligenceLayout } from "@/features/intelligence/layout";
import {
  Bone,
  ChartSkeleton,
  MetricsSkeleton,
  RankingSkeleton,
  TableSkeleton,
} from "./skeleton-parts";

export function GeographySkeleton({
  geographyAllowed,
}: {
  geographyAllowed: boolean;
}) {
  if (!geographyAllowed)
    return (
      <section className="surface flex items-center gap-4 p-5">
        <Bone className="h-6 w-6 shrink-0" />
        <div className="flex-1 space-y-2">
          <Bone className="h-5 w-56 max-w-full" />
          <Bone className="h-4 w-4/5" />
        </div>
      </section>
    );
  return (
    <GeographyLayout
      header={
        <>
          <div className="space-y-2">
            <Bone className="h-6 w-44" />
            <Bone className="h-4 w-64 max-w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Bone className="h-9 w-40" />
            <Bone className="h-9 w-40" />
          </div>
        </>
      }
      map={
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Bone className="h-3 w-48" />
            <Bone className="h-9 w-36" />
          </div>
          <Bone className="h-[var(--geography-map-height)] w-full rounded-xl" />
          <Bone className="mt-2 h-12 w-full" />
          <Bone className="mt-3 h-3 w-4/5" />
        </>
      }
      ranking={
        <>
          <Bone className="h-3 w-32" />
          <div className="mt-4 space-y-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-3">
                <Bone className="h-4 w-4" />
                <div className="flex-1 space-y-2">
                  <Bone className="h-4 w-4/5" />
                  <Bone className="h-3 w-16" />
                </div>
                <Bone className="h-4 w-20" />
              </div>
            ))}
          </div>
          <Bone className="mt-5 h-10 w-full" />
        </>
      }
    />
  );
}
export function PortfolioBodySkeleton({
  directory,
  geographyAllowed,
}: {
  directory: boolean;
  geographyAllowed: boolean;
}) {
  return (
    <>
      <GeographySkeleton geographyAllowed={geographyAllowed} />
      <div className="space-y-4">
        <MetricsSkeleton />
        {!directory && (
          <div className={intelligenceLayout.bento}>
            <ChartSkeleton />
            <RankingSkeleton />
            <section className={intelligenceLayout.bentoCard}>
              <Bone className="h-5 w-40" />
              <div className={intelligenceLayout.workspaceLinks}>
                {Array.from({ length: geographyAllowed ? 4 : 2 }, (_, i) => (
                  <Bone key={i} className="h-16 rounded-xl" />
                ))}
              </div>
              <Bone className="mt-4 h-4 w-48" />
            </section>
            <section className={intelligenceLayout.bentoCard}>
              <Bone className="h-5 w-44" />
              <div className="mt-4 grid grid-cols-2 gap-5">
                {[0, 1].map((i) => (
                  <div key={i}>
                    <Bone className="h-8 w-16" />
                    <Bone className="mt-1 h-4 w-24" />
                  </div>
                ))}
              </div>
              <Bone className="mt-4 h-4 w-4/5" />
            </section>
          </div>
        )}
      </div>
      <TableSkeleton />
    </>
  );
}
export function DetailBodySkeleton() {
  return <><ReportDetailSkeleton /><Bone className="h-16" /></>;
}
