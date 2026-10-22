import { Bone } from "@/features/loading/skeleton-parts";
export const performanceLayout = {
  cards: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
  page: "space-y-6",
};
export function PerformanceSkeleton() {
  return (
    <div className={performanceLayout.page} aria-label="Cargando indicadores">
      <Bone className="h-10 w-64" />
      <Bone className="h-10 w-full" />
      <div className={performanceLayout.cards}>
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-32" />
        ))}
      </div>
      <Bone className="h-80" />
    </div>
  );
}
