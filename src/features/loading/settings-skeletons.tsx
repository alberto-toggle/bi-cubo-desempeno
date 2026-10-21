import { appearanceLayout } from "@/features/appearance/layout";
import { themes, fonts, finishes } from "@/theme/config";
import { Bone, TableSkeleton } from "./skeleton-parts";

export function AppearanceBodySkeleton() {
  return (
    <>
      <section>
        <Bone className="h-7 w-40" />
        <Bone className="mt-1 mb-5 h-5 w-3/4" />
        <div className={appearanceLayout.palettes}>
          {themes.map((t) => (
            <div key={t.id} className="theme-option">
              <Bone className="h-24 rounded-lg" />
              <Bone className="mt-4 h-5 w-24" />
              <Bone className="mt-1 h-4 w-full" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <Bone className="h-7 w-24" />
        <Bone className="mt-1 mb-5 h-5 w-4/5" />
        <div className={appearanceLayout.finishes}>
          {finishes.map((f) => (
            <div key={f.id} className="theme-option">
              <Bone
                className={`${appearanceLayout.finishPreview} rounded-lg`}
              />
              <Bone className="mt-4 h-5 w-24" />
              <Bone className="mt-1 h-4" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <Bone className="mb-5 h-7 w-32" />
        <div className={appearanceLayout.fonts}>
          {fonts.map((f) => (
            <div key={f.id} className="theme-option">
              <Bone className="h-10 w-14" />
              <Bone className="mt-3 h-6 w-24" />
              <Bone className="mt-2 h-10 w-full" />
            </div>
          ))}
        </div>
      </section>
      <section className={appearanceLayout.preview}>
        <Bone className="h-3 w-44" />
        <Bone className="mt-3 h-9 w-3/5" />
        <Bone className="mt-3 h-6 w-4/5" />
        <div className="mt-6 flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Bone key={i} className="h-8 w-12" />
          ))}
        </div>
      </section>
      <div className={appearanceLayout.footer}>
        <Bone className="h-4 w-3/5" />
        <Bone className="h-9 w-32" />
      </div>
    </>
  );
}
export function CatalogsBodySkeleton() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Bone className="h-9 w-40" />
        <Bone className="h-10 w-60" />
      </div>
      <TableSkeleton catalog />
      <section className="surface p-5">
        <Bone className="h-6 w-44" />
        <Bone className="mt-1 h-4 w-4/5" />
        <Bone className="mt-5 h-5 w-52" />
      </section>
      <div className="surface p-5">
        <Bone className="h-5 w-64 max-w-full" />
      </div>
    </>
  );
}
