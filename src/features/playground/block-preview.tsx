import Link from "next/link";
import type { PlaygroundBlock } from "@/lib/playground";
export function BlockPreview({
  block,
  children,
}: {
  block: PlaygroundBlock;
  children: React.ReactNode;
}) {
  return (
    <>
      <Link
        href="/playground"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Todos los componentes
      </Link>
      <header className="mt-7 mb-7">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {block.category} / {block.provider}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {block.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {block.description}
        </p>
        {block.sourceUrl && (
          <p className="mt-2 text-sm text-muted-foreground">
            Descargado de {block.provider}:{" "}
            <a
              className="underline underline-offset-4 break-all"
              href={block.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Ver registro original ↗
            </a>
          </p>
        )}
      </header>
      <section
        aria-label={`Vista previa de ${block.title}`}
        className="rounded-xl border border-border bg-background p-6 sm:p-10"
      >
        {children}
      </section>
    </>
  );
}
