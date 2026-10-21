import {
  Bone,
  LoadingFrame,
  HeadingSkeleton,
  FiltersSkeleton,
} from "@/features/loading/skeleton-parts";
import { cubeLayout } from "./layout";
export function CubeSkeleton({
  geographyAllowed = true,
}: {
  geographyAllowed?: boolean;
}) {
  return (
    <LoadingFrame className={cubeLayout.page}>
      <HeadingSkeleton />
      <FiltersSkeleton count={geographyAllowed ? 4 : 3} />
      <Bone className="h-12" />
      <div className={cubeLayout.metrics}>
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-32" />
        ))}
      </div>
      <div className={cubeLayout.hero}>
        <div className={cubeLayout.visual}>
          <Bone className="h-[450px]" />
        </div>
        <Bone className="min-h-[450px]" />
      </div>
      <div className={cubeLayout.pair}>
        <Bone className="h-96" />
        <Bone className="h-96" />
      </div>
      <Bone className={geographyAllowed ? "h-[520px]" : "h-20"} />
    </LoadingFrame>
  );
}
