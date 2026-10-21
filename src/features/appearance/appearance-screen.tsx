"use client";
import { appearanceLayout } from "@/features/appearance/layout";
import { Check, RotateCcw } from "lucide-react";
import { themes, fonts, finishes, defaults } from "./config";
import { setAppearance } from "./appearance-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
export function AppearanceScreen() {
  const value = useAppSelector((s) => s.appearance),
    dispatch = useAppDispatch();
  return (
    <div className={appearanceLayout.page}>
      <header>
        <p className="eyebrow">Configuración / Identidad visual</p>
        <h1 className="page-title">Apariencia de la plataforma</h1>
        <p className="page-copy">
          Configura la paleta de colores y la tipografía de la interfaz.
        </p>
      </header>
      <section>
        <h2 className="text-lg font-semibold">Paleta de colores</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">
          Cambia los colores de la plataforma sin modificar la tipografía.
        </p>
        <div className={appearanceLayout.palettes}>
          {themes.map((t) => (
            <button
              key={t.id}
              aria-pressed={value.theme === t.id}
              onClick={() => dispatch(setAppearance({ ...value, theme: t.id }))}
              className="theme-option"
            >
              <div
                className="flex h-24 items-end gap-2 rounded-lg bg-background p-3"
                data-theme={t.id}
              >
                {[1, 0.65, 0.3].map((n) => (
                  <span
                    key={n}
                    className="h-12 flex-1 rounded-md bg-primary"
                    style={{ opacity: n }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-sm font-semibold">
                {t.name}
                {value.theme === t.id && <Check size={16} />}
              </div>
              <p className="mt-1 text-left text-xs text-muted-foreground">
                {t.description}
              </p>
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Acabado</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">
          Combina cualquier paleta con el acabado que prefieras. La tipografía
          se conserva.
        </p>
        <div className={appearanceLayout.finishes}>
          {finishes.map((finish) => (
            <button
              key={finish.id}
              className="theme-option text-left"
              aria-pressed={value.finish === finish.id}
              onClick={() =>
                dispatch(setAppearance({ ...value, finish: finish.id }))
              }
            >
              <div
                className={`finish-swatch ${appearanceLayout.finishPreview}`}
                data-preview-finish={finish.id}
                aria-hidden="true"
              >
                <span />
                <span />
              </div>
              <span className="mt-4 flex items-center justify-between text-sm font-semibold">
                {finish.name}
                {value.finish === finish.id && <Check size={16} />}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                {finish.description}
              </p>
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-5 text-lg font-semibold">Tipografía</h2>
        <div className={appearanceLayout.fonts}>
          {fonts.map((f) => (
            <button
              key={f.id}
              aria-pressed={value.font === f.id}
              onClick={() => dispatch(setAppearance({ ...value, font: f.id }))}
              className="theme-option text-left"
              data-font={f.id}
              style={{ fontFamily: "var(--app-font)" }}
            >
              <span className="font-display text-4xl">Aa</span>
              <p className="mt-3 font-semibold">{f.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Información que se entiende.
                <br />
                0123456789
              </p>
            </button>
          ))}
        </div>
      </section>
      <section className={appearanceLayout.preview}>
        <p className="eyebrow">Vista previa en tiempo real</p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight">
          Vista previa de contenido
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Los ajustes se aplican a las pantallas y componentes de la plataforma.
        </p>
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className="h-8 w-12 rounded-lg"
              style={{ background: "var(--chart-" + n + ")" }}
            />
          ))}
        </div>
      </section>
      <div className={appearanceLayout.footer}>
        <p role="status" className="text-xs text-muted-foreground">
          Se aplica al instante y se guarda en este navegador. Configuración
          local de demostración.
        </p>
        <button
          className="secondary-button"
          onClick={() => dispatch(setAppearance(defaults))}
        >
          <RotateCcw size={14} /> Restablecer
        </button>
      </div>
    </div>
  );
}
