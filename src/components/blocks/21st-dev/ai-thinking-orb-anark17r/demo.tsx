"use client";
import MorphOrb from "./component";
export default function Demo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Escribe y envía para probar la animación. Respuesta simulada; no se
        envían datos a una IA. Escape cancela.
      </p>
      <MorphOrb
        onSubmit={() =>
          "Demostración lista. No se consultó ningún servicio externo."
        }
      />
    </div>
  );
}
