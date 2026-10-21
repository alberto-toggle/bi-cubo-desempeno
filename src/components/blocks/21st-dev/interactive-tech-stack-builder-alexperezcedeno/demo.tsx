"use client";
import { useState } from "react";
import { MotionConfig } from "framer-motion";
import LegoOnboarding from "./component";

export default function Demo() {
  const [result, setResult] = useState("");
  const [revision, setRevision] = useState(0);
  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full rounded-xl bg-[#f8ece4] text-zinc-900">
        <LegoOnboarding
          key={revision}
          onComplete={(stack) =>
            setResult(
              "Stack seleccionado: " +
                stack.map((item) => item.name).join(" + "),
            )
          }
          onSkip={() => setResult("Selección omitida en esta demostración.")}
        />
        <div className="px-6 pb-6 text-center">
          <p role="status" className="text-sm">
            {result}
          </p>
          <button
            type="button"
            className="mt-3 rounded-lg border border-zinc-400 px-4 py-2 text-sm hover:bg-white/50"
            onClick={() => {
              setResult("");
              setRevision((v) => v + 1);
            }}
          >
            Reiniciar demo
          </button>
        </div>
      </div>
    </MotionConfig>
  );
}
