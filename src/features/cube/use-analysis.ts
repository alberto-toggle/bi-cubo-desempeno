"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  requestCubeAnalysis,
  type AnalysisIntent,
  type AnalysisResult,
} from "@/services/demo-cube-analysis";
import type { CubeSnapshot } from "./model";
export function useAnalysis(snapshot: CubeSnapshot) {
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState<AnalysisResult | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [visibleWords, setVisibleWords] = useState(0),
    [stopped, setStopped] = useState(false);
  const [requestId, setRequestId] = useState(0),
    [question, setQuestion] = useState("");
  const reduced = useReducedMotion();
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const wordCount =
    answer?.paragraphs.reduce((n, p) => n + p.split(/\s+/).length, 0) ?? 0;
  const displayedWords = reduced && answer && !stopped ? wordCount : visibleWords;
  const complete = !!answer && displayedWords >= wordCount;
  const streaming = !!answer && !complete && !stopped;
  useEffect(() => {
    if (!streaming) return;
    const paragraphs = answer?.paragraphs ?? [];
    const words = paragraphs.flatMap(p => p.split(/\s+/));
    const ends = new Set<number>();
    let count = 0;
    for (const p of paragraphs) { count += p.split(/\s+/).length; ends.add(count); }
    const previous = words[visibleWords - 1] ?? "";
    const delay = ends.has(visibleWords) ? 650 : /[.!?]$/.test(previous) ? 380 : /[,;:]$/.test(previous) ? 210 : 115;
    const timer = setTimeout(() => setVisibleWords(n => Math.min(wordCount, n + 1)), delay);
    return () => clearTimeout(timer);
  }, [streaming, wordCount, visibleWords, answer]);
  const cancel = () => {
    controller.current?.abort();
    setBusy(false);
    setStopped(true);
  };
  const reset = () => {
    controller.current?.abort();
    controller.current = null;
    setAnswer(null);
    setBusy(false);
    setError("");
    setProgress(0);
    setVisibleWords(0);
    setStopped(false);
    setQuestion("");
    setRequestId(n => n + 1);
  };
  const run = async (intent: AnalysisIntent, questionText = "") => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setRequestId((n) => n + 1);
    setQuestion(questionText);
    setBusy(true);
    setProgress(0);
    setError("");
    setAnswer(null);
    setVisibleWords(0);
    setStopped(false);
    try {
      const result = await requestCubeAnalysis(
        snapshot,
        intent,
        request.signal,
        (value) => { if (!request.signal.aborted) setProgress(value); },
      );
      if (!request.signal.aborted) {
        setAnswer(result);
      }
    } catch (e) {
      if (!request.signal.aborted)
        setError(
          e instanceof Error ? e.message : "No se pudo preparar el análisis.",
        );
    } finally {
      if (!request.signal.aborted) setBusy(false);
    }
  };
  const finish = () => {
    setVisibleWords(wordCount);
    setStopped(false);
  };
  return {
    answer,
    progress,
    busy,
    error,
    run,
    cancel,
    reset,
    streaming,
    visibleWords: displayedWords,
    complete,
    stopped,
    finish,
    requestId,
    question,
    working: busy || streaming,
  };
}
