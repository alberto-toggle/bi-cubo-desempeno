"use client";
import AiMascotInput from "./component";
export default function Demo() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Demostración local: modelos y búsqueda ilustrativos, sin conexión a IA.
        Los archivos no se suben. Dictado desactivado en esta vista.
      </p>
      <div className="flex min-h-[500px] items-center justify-center p-2 sm:p-8">
        <div className="w-full max-w-3xl">
          <AiMascotInput enableVoice={false} />
        </div>
      </div>
    </div>
  );
}
