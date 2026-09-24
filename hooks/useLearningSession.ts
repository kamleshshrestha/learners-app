"use client";

import { useMemo, useState } from "react";
import { diagnose } from "@/lib/learning/diagnostic";
import {
  initialSession,
  submitAnswer as submitAnswerTo,
} from "@/lib/learning/session";
import type { DiagnosticQuestion } from "@/lib/learning/types";

export function useLearningSession(
  conceptId: string,
  questions: DiagnosticQuestion[],
) {
  const [state, setState] = useState(initialSession);

  const diagnosis = useMemo(
    () => (state.stage === "diagnosis" ? diagnose(conceptId, state.answers) : null),
    [conceptId, state.stage, state.answers],
  );

  return {
    stage: state.stage,
    currentIndex: state.currentIndex,
    total: questions.length,
    currentQuestion: questions[state.currentIndex],
    diagnosis,
    submitAnswer: (optionId: string) =>
      setState((s) => submitAnswerTo(s, questions, optionId)),
    restart: () => setState(initialSession()),
  };
}
