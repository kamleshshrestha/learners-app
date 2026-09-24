import { getMisconception } from "./misconceptions";
import type {
  Diagnosis,
  DiagnosticAnswers,
  DiagnosticQuestion,
  Misconception,
} from "./types";

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "gd-q1-single-update",
    conceptId: "gradient-descent",
    prompt: "What does a single gradient descent update do?",
    options: [
      {
        id: "a",
        text: "Moves the parameters directly to the values that minimize the loss.",
        correct: false,
        misconceptionId: "gd-one-step",
      },
      {
        id: "b",
        text: "Nudges the parameters a small step in the direction that reduces the loss.",
        correct: true,
      },
      {
        id: "c",
        text: "Adds the gradient to the parameters.",
        correct: false,
        misconceptionId: "gd-gradient-direction",
      },
    ],
  },
  {
    id: "gd-q2-gradient-sign",
    conceptId: "gradient-descent",
    prompt:
      "The gradient of the loss with respect to a weight w is +3. What should the update do to w?",
    options: [
      {
        id: "a",
        text: "Increase w, because the gradient points toward lower loss.",
        correct: false,
        misconceptionId: "gd-gradient-direction",
      },
      {
        id: "b",
        text: "Decrease w, because the gradient points toward higher loss.",
        correct: true,
      },
      {
        id: "c",
        text: "Leave w alone, because a positive gradient means the loss is already minimal.",
        correct: false,
      },
    ],
  },
  {
    id: "gd-q3-learning-rate",
    conceptId: "gradient-descent",
    prompt:
      "You raise the learning rate from 0.01 to 10 and the loss shoots up to NaN. What is the most likely explanation?",
    options: [
      {
        id: "a",
        text: "A larger learning rate always converges faster, so the bug must be somewhere else.",
        correct: false,
        misconceptionId: "gd-bigger-lr-better",
      },
      {
        id: "b",
        text: "The steps are so large they overshoot the minimum and the loss diverges.",
        correct: true,
      },
      {
        id: "c",
        text: "Gradient descent cannot work with numbers that large.",
        correct: false,
      },
    ],
  },
  {
    id: "gd-q4-convergence",
    conceptId: "gradient-descent",
    prompt:
      "Training has run long enough that the loss has stopped decreasing. Have you found the best possible parameters?",
    options: [
      {
        id: "a",
        text: "Yes, gradient descent always finds the global minimum.",
        correct: false,
        misconceptionId: "gd-global-minimum",
      },
      {
        id: "b",
        text: "Not necessarily; it may have stalled at a local minimum, saddle point or plateau.",
        correct: true,
      },
      {
        id: "c",
        text: "No, it would keep improving if you used a larger learning rate.",
        correct: false,
        misconceptionId: "gd-bigger-lr-better",
      },
    ],
  },
];

export function getQuestionsForConcept(
  conceptId: string,
): DiagnosticQuestion[] {
  return diagnosticQuestions.filter((q) => q.conceptId === conceptId);
}

/**
 * Turns a learner's answers into a diagnosis: the misconception revealed by
 * the most wrong answers. Ties go to whichever was revealed first. Returns
 * null when no answer revealed a known misconception.
 */
export function diagnose(
  conceptId: string,
  answers: DiagnosticAnswers,
): Diagnosis | null {
  const hits = new Map<string, string[]>();

  for (const question of getQuestionsForConcept(conceptId)) {
    const option = question.options.find((o) => o.id === answers[question.id]);
    if (!option?.misconceptionId) continue;
    const evidence = hits.get(option.misconceptionId) ?? [];
    evidence.push(question.id);
    hits.set(option.misconceptionId, evidence);
  }

  // Array.prototype.sort is stable, so ties keep first-revealed order.
  const ranked = [...hits.entries()]
    .map(([id, evidence]) => ({ misconception: getMisconception(id), evidence }))
    .filter(
      (r): r is { misconception: Misconception; evidence: string[] } =>
        r.misconception !== undefined,
    )
    .sort((a, b) => b.evidence.length - a.evidence.length);

  if (ranked.length === 0) return null;

  const [top, ...rest] = ranked;
  return {
    conceptId,
    primary: top.misconception,
    secondary: rest.map((r) => r.misconception),
    evidence: top.evidence,
  };
}

/** Ids of the questions whose selected option revealed `misconceptionId`. */
export function evidenceFor(
  conceptId: string,
  answers: DiagnosticAnswers,
  misconceptionId: string,
): string[] {
  return getQuestionsForConcept(conceptId)
    .filter((q) =>
      q.options.some(
        (o) =>
          o.id === answers[q.id] && o.misconceptionId === misconceptionId,
      ),
    )
    .map((q) => q.id);
}
