import type {
  DiagnosticAnswers,
  DiagnosticQuestion,
  SessionStage,
} from "./types";

export type SessionState = {
  stage: SessionStage;
  /** Index of the diagnostic question currently shown. */
  currentIndex: number;
  answers: DiagnosticAnswers;
};

export function initialSession(): SessionState {
  return { stage: "diagnostic", currentIndex: 0, answers: {} };
}

/**
 * Records the answer to the current question and advances. Answering the
 * last question moves the session on to the diagnosis stage.
 */
export function submitAnswer(
  state: SessionState,
  questions: DiagnosticQuestion[],
  optionId: string,
): SessionState {
  const question = questions[state.currentIndex];
  if (state.stage !== "diagnostic" || !question) return state;

  const answers = { ...state.answers, [question.id]: optionId };
  const isLast = state.currentIndex >= questions.length - 1;

  return isLast
    ? { stage: "diagnosis", currentIndex: state.currentIndex, answers }
    : { stage: "diagnostic", currentIndex: state.currentIndex + 1, answers };
}
