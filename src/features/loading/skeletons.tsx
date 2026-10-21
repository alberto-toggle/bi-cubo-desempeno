"use client";
import { CubeSkeleton } from "@/features/cube/cube-skeleton";

import {
  ReportScreenSkeleton,
  ChartSettingsSkeleton,
} from "@/features/reporting/report-skeleton";
import { appearanceLayout } from "@/features/appearance/layout";
import { intelligenceLayout } from "@/features/intelligence/layout";
import { useAppSelector } from "@/store/hooks";
import { useDemoPreferences } from "@/features/demo/use-demo-preferences";
import {
  Bone,
  LoadingFrame,
  HeadingSkeleton,
  HelpSkeleton,
  FiltersSkeleton,
} from "./skeleton-parts";
import {
  PortfolioBodySkeleton,
  DetailBodySkeleton,
} from "./portfolio-skeletons";
import {
  AppearanceBodySkeleton,
  CatalogsBodySkeleton,
} from "./settings-skeletons";
import "./loading.css";

export function LoginSkeleton() {
  const { preferences } = useDemoPreferences();
  return (
    <LoadingFrame className="">
      <Bone className="h-[48px] w-[48px] rounded-2xl" />
      <Bone className="mt-6 h-[2.24em] w-4/5 text-[clamp(2rem,3.2vw,3rem)]" />
      <Bone className="mt-2 h-5 w-full" />
      <div className="mt-8 space-y-5">
        {[0, 1].map((i) => (
          <div key={i}>
            <Bone className="h-5 w-32" />
            <Bone className="mt-2 h-[54px] w-full rounded-full" />
          </div>
        ))}
        <Bone className="h-[54px] w-full rounded-full" />
        {preferences.twoFactor && <Bone className="h-4 w-3/4" />}
      </div>
      {preferences.showHelp && (
        <div className="mt-7">
          <HelpSkeleton />
        </div>
      )}
    </LoadingFrame>
  );
}
export type ViewKind =
  | "overview"
  | "directory"
  | "detail"
  | "catalogs"
  | "appearance"
  | "cube"
  | "reports"
  | "charts";
export function viewKind(path: string): ViewKind {
  if (path === "/cube") return "cube";
  if (path === "/reports") return "reports";
  if (path === "/settings/charts") return "charts";
  return path.includes("/settings")
    ? "appearance"
    : path.includes("/catalogs")
      ? "catalogs"
      : path.startsWith("/establishments/")
        ? "detail"
        : path === "/establishments"
          ? "directory"
          : "overview";
}

/** Shared adapter for route transitions, Suspense fallbacks and data loading. */
export function ViewSkeleton({
  kind = "overview",
  bodyOnly = false,
}: {
  kind?: ViewKind;
  bodyOnly?: boolean;
}) {
  const role = useAppSelector((s) => s.auth.session?.role);
  const { preferences } = useDemoPreferences();
  if (!role)
    return (
      <LoadingFrame>
        <HeadingSkeleton />
        <Bone className="h-20 w-full" />
      </LoadingFrame>
    );
  const admin = role === "admin";
  if (
    !admin &&
    (kind === "catalogs" || kind === "appearance" || kind === "charts")
  )
    return (
      <LoadingFrame>
        <div className="surface space-y-4 p-8">
          <Bone className="h-6 w-6" />
          <Bone className="h-9 w-3/5" />
          <Bone className="h-5 w-4/5" />
        </div>
      </LoadingFrame>
    );
  if (kind === "cube") return <CubeSkeleton geographyAllowed={admin} />;
  if (kind === "reports") return <ReportScreenSkeleton />;
  if (kind === "charts") return <ChartSettingsSkeleton />;
  const portfolio = kind === "overview" || kind === "directory";
  return (
    <LoadingFrame
      className={
        kind === "appearance"
          ? appearanceLayout.page
          : kind === "catalogs"
            ? "space-y-6"
            : intelligenceLayout.page
      }
    >
      {!bodyOnly && (
        <>
          {kind === "detail" && <Bone className="h-5 w-40" />}
          <HeadingSkeleton action={portfolio || kind === "catalogs"} />
          {portfolio && <FiltersSkeleton count={admin ? 4 : 3} />}
          {(portfolio || kind === "catalogs") && preferences.showHelp && (
            <HelpSkeleton />
          )}
        </>
      )}
      {portfolio ? (
        <PortfolioBodySkeleton
          directory={kind === "directory"}
          geographyAllowed={admin}
        />
      ) : kind === "detail" ? (
        <>
          <DetailBodySkeleton />
          {admin && <Bone className="h-4 w-3/4" />}
          {preferences.showHelp && <HelpSkeleton />}
        </>
      ) : kind === "catalogs" ? (
        <CatalogsBodySkeleton />
      ) : (
        <AppearanceBodySkeleton />
      )}
    </LoadingFrame>
  );
}
