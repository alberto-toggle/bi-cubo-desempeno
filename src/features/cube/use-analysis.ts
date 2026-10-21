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
    const timer = setInterval(
      () => setVisibleWords((n) => Math.min(wordCount, n + 3)),
      45,
    );
    return () => clearInterval(timer);
  }, [streaming, wordCount]);
  const cancel = () => {
    controller.current?.abort();
    setBusy(false);
    setStopped(true);
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
