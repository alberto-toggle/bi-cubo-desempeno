/** Layout contracts shared by live content and its loading composition. */
export const intelligenceLayout = {
  page: "space-y-7",
  metrics: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
  metricCard: "surface p-5",
  bento: "grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]",
  bentoCard: "surface min-w-0 p-5 sm:p-6",
  workspaceLinks: "mt-4 grid gap-2 sm:grid-cols-2",
  chartCard: "surface p-6",
  chartHeader: "mb-6 flex flex-wrap justify-between gap-3",
  chartPlot: "h-64 min-w-0",
  detailIdentity: "grid gap-4 md:grid-cols-3",
  operations: "mt-5 grid gap-5 sm:grid-cols-3",
  centers: "mt-6 grid gap-4 sm:grid-cols-2",
  directoryHeader:
    "flex flex-wrap items-center justify-between gap-3 border-b border-border p-5",
} as const;
