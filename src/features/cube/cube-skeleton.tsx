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
      <Bone className="h-12 rounded-xl" />
      <div className={cubeLayout.hero}>
        <div className={cubeLayout.visual}>
          <Bone className="h-[450px]" />
        </div>
        <Bone className="min-h-[450px]" />
      </div>
    </LoadingFrame>
  );
}
