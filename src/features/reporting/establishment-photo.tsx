import Image from "next/image";

export function EstablishmentPhoto({ src, kind }: { src?: string; kind: string }) {
  if (!src) return null;
  return (
    <figure className="w-full max-w-lg">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src={src}
          alt={`Fotografía ilustrativa: ${kind.toLowerCase()}`}
          fill
          sizes="(max-width: 639px) 100vw, 512px"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-2 text-xs text-muted-foreground">
        Imagen de referencia del establecimiento
      </figcaption>
    </figure>
  );
}
