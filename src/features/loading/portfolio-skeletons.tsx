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
    <section className="surface overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="space-y-2">
          <Bone className="h-6 w-44" />
          <Bone className="h-4 w-64 max-w-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Bone className="h-9 w-40" />
          <Bone className="h-9 w-40" />
        </div>
      </header>
      <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="min-w-0 p-5 sm:px-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Bone className="h-3 w-48" />
            <Bone className="h-9 w-36" />
          </div>
          <Bone className="h-[clamp(240px,30vw,380px)] w-full rounded-xl" />
          <Bone className="mt-2 h-12 w-full" />
          <Bone className="mt-3 h-3 w-4/5" />
        </div>
        <div className="border-t border-border p-5 lg:border-t-0 lg:border-l">
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
        </div>
      </div>
    </section>
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
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
            <ChartSkeleton />
            <RankingSkeleton />
            <section className="surface p-5 sm:p-6">
              <Bone className="h-5 w-40" />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {Array.from({ length: geographyAllowed ? 4 : 2 }, (_, i) => (
                  <Bone key={i} className="h-16 rounded-xl" />
                ))}
              </div>
              <Bone className="mt-4 h-4 w-48" />
            </section>
            <section className="surface p-5 sm:p-6">
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
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <article key={i} className="surface p-5">
            <Bone className="h-5 w-5" />
            <Bone className="mt-3 h-4 w-36" />
            <Bone className="mt-2 h-5 w-4/5" />
          </article>
        ))}
      </div>
      <Bone className="h-9 w-40" />
      <MetricsSkeleton />
      <section className="surface p-5">
        <Bone className="h-5 w-56 max-w-full" />
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Bone className="h-4 w-32" />
              <Bone className="mt-2 h-8 w-24" />
            </div>
          ))}
        </div>
        <Bone className="mt-4 h-4 w-4/5" />
      </section>
      <ChartSkeleton />
      <section className="surface p-6">
        <Bone className="h-6 w-40" />
        <Bone className="mt-2 h-5 w-4/5" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="space-y-4 rounded-xl border border-border p-4"
            >
              <Bone className="h-5 w-36" />
              <Bone className="h-3 w-4/5" />
              <div className="grid grid-cols-2 gap-3">
                <Bone className="h-12" />
                <Bone className="h-12" />
              </div>
              {[0, 1, 2].map((j) => (
                <div key={j} className="space-y-2">
                  <Bone className="h-3 w-28" />
                  <Bone className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
