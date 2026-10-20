import "./loading.css";
function Bone({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={"skeleton-bone " + className} />;
}
export function LoginSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando formulario de acceso"
      className="space-y-6"
    >
      <Bone className="h-12 w-12 rounded-2xl" />
      <Bone className="h-12 w-3/4" />
      <Bone className="h-4 w-full" />
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <Bone className="h-3 w-32" />
          <Bone className="h-14 w-full rounded-2xl" />
        </div>
      ))}
      <Bone className="h-14 w-full rounded-2xl" />
      <Bone className="h-16 w-full" />
      <span className="sr-only">Cargando formulario de acceso</span>
    </div>
  );
}
export type ViewKind =
  "overview" | "directory" | "detail" | "catalogs" | "appearance";
export function viewKind(path: string): ViewKind {
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
export function ViewSkeleton({
  kind = "overview",
  bodyOnly = false,
}: {
  kind?: ViewKind;
  bodyOnly?: boolean;
}) {
  return (
    <div role="status" aria-label="Cargando vista" className="space-y-7">
      <span className="sr-only">Cargando vista</span>
      {!bodyOnly && (
        <header className="space-y-3">
          <Bone className="h-3 w-36" />
          <Bone className="h-9 w-2/3 max-w-md" />
          <Bone className="h-4 w-3/4 max-w-xl" />
        </header>
      )}
      {kind === "overview" && !bodyOnly && (
        <div className="surface flex min-h-72 items-center justify-between gap-8 p-8">
          <div className="w-2/3 space-y-5">
            <Bone className="h-6 w-28" />
            <Bone className="h-16 w-full" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-40" />
          </div>
          <Bone className="hidden h-44 w-44 rounded-3xl md:block" />
        </div>
      )}
      {kind === "appearance" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="surface space-y-4 p-5">
                <Bone className="h-24" />
                <Bone className="h-4 w-20" />
                <Bone className="h-3" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Bone key={i} className="h-44" />
            ))}
          </div>
          <Bone className="h-48" />
        </>
      ) : kind === "catalogs" ? (
        <>
          <Bone className="h-52" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="surface space-y-5 p-6">
                <Bone className="h-5 w-1/2" />
                <Bone className="h-4" />
                <Bone className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {kind === "detail" ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Bone key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="flex gap-3">
              <Bone className="h-8 w-40" />
              <Bone className="h-8 w-48" />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="surface space-y-4 p-5">
                <Bone className="h-3 w-24" />
                <Bone className="h-7 w-32" />
                <Bone className="h-3 w-3/4" />
              </div>
            ))}
          </div>
          {kind !== "directory" && (
            <div
              className={
                "grid gap-5 " +
                (kind === "overview" ? "xl:grid-cols-[1.6fr_1fr]" : "")
              }
            >
              <div className="surface p-6">
                <Bone className="mb-8 h-5 w-40" />
                <div className="flex h-60 items-end gap-5 border-b border-border">
                  {["h-24", "h-36", "h-28", "h-44", "h-40", "h-52"].map(
                    (height, i) => (
                      <Bone key={i} className={"flex-1 " + height} />
                    ),
                  )}
                </div>
              </div>
              {kind === "overview" && (
                <div className="surface space-y-7 p-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Bone key={i} className="h-5 w-full" />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="surface space-y-6 p-5">
            <Bone className="h-6 w-48" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-3 gap-8">
                <Bone className="h-8" />
                <Bone className="h-8" />
                <Bone className="h-8" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
