import Link from "next/link";
import { ArrowUpRight, ChartNoAxesCombined } from "lucide-react";
import { groupBlocks, playgroundBlocks } from "@/lib/playground";
export default function Page() {
  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Laboratorio visual</p>
        <h1 className="page-title">Explorar. Comparar. Construir.</h1>
        <p className="page-copy">
          Una colección de gráficas y componentes para dar forma a Panorama.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        {groupBlocks(playgroundBlocks).map((g) => (
          <a key={g.category} href={"#" + g.category} className="pill">
            {g.category} · {g.blocks.length}
          </a>
        ))}
      </div>
      {groupBlocks(playgroundBlocks).map((g) => (
        <section id={g.category} key={g.category}>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-xl font-semibold">{g.category}</h2>
            <span className="text-sm text-muted-foreground">
              {g.blocks.length} bloques
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {g.blocks.map((b) => (
              <Link className="preview-card group" href={b.href} key={b.href}>
                <div className="mb-6 flex items-center justify-between">
                  <ChartNoAxesCombined className="text-primary" size={24} />
                  <ArrowUpRight
                    size={18}
                    className="text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
                <p className="eyebrow">{b.provider}</p>
                <h3 className="mt-2 font-semibold">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {b.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
