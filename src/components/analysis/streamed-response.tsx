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

  return (
    <div className="space-y-4" aria-busy={streaming}>
      {paragraphs.map((p, index) => {
        const words = p.split(/\s+/);
        const preceding = paragraphs.slice(0, index).reduce((sum, text) => sum + text.split(/\s+/).length, 0);
        const count = Math.min(words.length, Math.max(0, visibleWords - preceding));
        if (!count) return null;
        const active = streaming && visibleWords <= preceding + words.length;
        return (
          <p key={index} className="text-sm leading-7">
            {Array.from({ length: count }, (_, chunk) => {
              const text = words
                .slice(chunk, chunk + 1)
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
