"use client";

import { useState } from "react";
import {
  goToStage,
  initialSession,
  submitAnswer as submitAnswerTo,
} from "@/lib/learning/session";
import type {
  Diagnosis,
  DiagnosticQuestion,
  Explanation,
  VerificationResult,
} from "@/lib/learning/types";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "Something went wrong. Please try again.");
  }
  return data as T;
}

export function useLearningSession(
  conceptId: string,
  questions: DiagnosticQuestion[],
) {
  const [state, setState] = useState(initialSession);
  const [selfExplanation, setSelfExplanation] = useState("");
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Runs an API step, tracking pending/error state; returns undefined on failure. */
  async function run<T>(step: () => Promise<T>): Promise<T | undefined> {
    setPending(true);
    setError(null);
    try {
      return await step();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  async function submitSelfExplanation(text: string) {
    setSelfExplanation(text);
    const result = await run(() =>
      postJson<{ diagnosis: Diagnosis | null }>("/api/diagnose", {
        conceptId,
        answers: state.answers,
        explanation: text,
      }),
    );
    if (!result) return;
    setDiagnosis(result.diagnosis);
    setState((s) => goToStage(s, "diagnosis"));
  }

  async function continueToExplanation() {
    if (!diagnosis) return;
    const result = await run(() =>
      postJson<{ explanation: Explanation }>("/api/explain", {
        conceptId,
        misconceptionId: diagnosis.primary.id,
        explanation: selfExplanation,
      }),
    );
    if (!result) return;
    setExplanation(result.explanation);
    setState((s) => goToStage(s, "explanation"));
  }

  function startVerification() {
    setError(null);
    setState((s) => goToStage(s, "verification"));
  }

  async function submitVerification(answer: string) {
    if (!diagnosis || !explanation) return;
    const result = await run(() =>
      postJson<{ result: VerificationResult }>("/api/verify", {
        conceptId,
        misconceptionId: diagnosis.primary.id,
        question: explanation.verificationQuestion,
        answer,
      }),
    );
    if (!result) return;
    setVerification(result.result);
    setState((s) => goToStage(s, "complete"));
  }

  function restart() {
    setState(initialSession());
    setSelfExplanation("");
    setDiagnosis(null);
    setExplanation(null);
    setVerification(null);
    setError(null);
  }

  return {
    stage: state.stage,
    currentIndex: state.currentIndex,
    total: questions.length,
    currentQuestion: questions[state.currentIndex],
    diagnosis,
    explanation,
    verification,
    pending,
    error,
    submitAnswer: (optionId: string) =>
      setState((s) => submitAnswerTo(s, questions, optionId)),
    submitSelfExplanation,
    continueToExplanation,
    startVerification,
    submitVerification,
    restart,
  };
}
