import { describe, expect, it } from "vitest";
import {
  goToStage,
  initialSession,
  submitAnswer,
} from "@/lib/learning/session";
import type { DiagnosticQuestion } from "@/lib/learning/types";

const questions: DiagnosticQuestion[] = ["q1", "q2", "q3"].map((id) => ({
  id,
  conceptId: "gradient-descent",
  prompt: id,
  options: [{ id: `${id}-a`, text: "a", correct: true }],
}));

describe("submitAnswer", () => {
  it("records the answer and advances to the next question", () => {
    const next = submitAnswer(initialSession(), questions, "q1-a");
    expect(next).toEqual({
      stage: "diagnostic",
      currentIndex: 1,
      answers: { q1: "q1-a" },
    });
  });

  it("moves to explain-back after the last question", () => {
    let state = initialSession();
    for (const q of questions) state = submitAnswer(state, questions, `${q.id}-a`);
    expect(state.stage).toBe("explain-back");
    expect(state.answers).toEqual({ q1: "q1-a", q2: "q2-a", q3: "q3-a" });
  });

  it("does not mutate the previous state", () => {
    const before = initialSession();
    submitAnswer(before, questions, "q1-a");
    expect(before.answers).toEqual({});
    expect(before.currentIndex).toBe(0);
  });

  it("ignores answers outside the diagnostic stage", () => {
    const state = goToStage(initialSession(), "diagnosis");
    expect(submitAnswer(state, questions, "q1-a")).toBe(state);
  });

  it("ignores answers when there is no current question", () => {
    const state = initialSession();
    expect(submitAnswer(state, [], "x")).toBe(state);
  });
});

describe("goToStage", () => {
  it("changes only the stage", () => {
    const state = submitAnswer(initialSession(), questions, "q1-a");
    expect(goToStage(state, "verification")).toEqual({
      ...state,
      stage: "verification",
    });
  });
});
