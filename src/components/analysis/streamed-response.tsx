"use client";
import { motion, useReducedMotion } from "motion/react";
export function StreamedResponse({
  paragraphs,
  visibleWords,
  streaming,
}: {
  paragraphs: string[];
  visibleWords: number;
  streaming: boolean;
}) {
  const reduced = useReducedMotion();
  let remaining = visibleWords;
  return (
    <div className="space-y-4" aria-busy={streaming}>
      {paragraphs.map((p, index) => {
        const words = p.split(/\s+/);
        const count = Math.min(words.length, Math.max(0, remaining));
        remaining -= words.length;
        if (!count) return null;
        const active = streaming && remaining <= 0;
        return (
          <p key={index} className="text-sm leading-7">
            {Array.from({ length: Math.ceil(count / 3) }, (_, chunk) => {
              const text = words
                .slice(chunk * 3, Math.min(count, chunk * 3 + 3))
                .join(" ");
              return (
                <motion.span
                  key={chunk}
                  initial={
                    reduced ? false : { opacity: 0, filter: "blur(3px)" }
                  }
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.2 }}
                >
                  {text}{" "}
                </motion.span>
              );
            })}
            {active && (
              <span
                aria-hidden="true"
                className="ml-1 inline-block h-4 w-1.5 translate-y-0.5 rounded-sm bg-primary motion-safe:animate-pulse"
              />
            )}
          </p>
        );
      })}
    </div>
  );
}
