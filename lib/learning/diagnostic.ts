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
        text: "Adds the gradient to the parameters.",
        correct: false,
        misconceptionId: "gd-gradient-direction",
      },
      {
        id: "c",
        text: "Nudges the parameters a small step in the direction that reduces the loss.",
        correct: true,
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
        text: "Decrease w, because the gradient points toward higher loss.",
        correct: true,
      },
      {
        id: "b",
        text: "Increase w, because the gradient points toward lower loss.",
        correct: false,
        misconceptionId: "gd-gradient-direction",
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
        text: "Gradient descent cannot work with numbers that large.",
        correct: false,
      },
      {
        id: "c",
        text: "The steps are so large they overshoot the minimum and the loss diverges.",
        correct: true,
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
        text: "Not necessarily; it may have stalled at a local minimum, saddle point or plateau.",
        correct: true,
      },
      {
        id: "b",
        text: "Yes, gradient descent always finds the global minimum.",
        correct: false,
        misconceptionId: "gd-global-minimum",
      },
      {
        id: "c",
        text: "No, it would keep improving if you used a larger learning rate.",
        correct: false,
        misconceptionId: "gd-bigger-lr-better",
      },
    ],
  },
  {
    id: "bp-q1-what-it-computes",
    conceptId: "backpropagation",
    prompt: "In one training step, what does backpropagation itself compute?",
    options: [
      {
        id: "a",
        text: "The new values of the weights after the step.",
        correct: false,
        misconceptionId: "bp-updates-weights",
      },
      {
        id: "b",
        text: "The network's prediction for the input.",
        correct: false,
      },
      {
        id: "c",
        text: "How much the loss changes with respect to each weight (the gradients).",
        correct: true,
      },
    ],
  },
  {
    id: "bp-q2-who-updates",
    conceptId: "backpropagation",
    prompt: "During training, which step is responsible for actually changing the weights?",
    options: [
      {
        id: "a",
        text: "An optimizer such as gradient descent, which applies an update rule to the weights.",
        correct: true,
      },
      {
        id: "b",
        text: "Backpropagation, which rewrites each weight as it passes backward through the network.",
        correct: false,
        misconceptionId: "bp-updates-weights",
      },
      {
        id: "c",
        text: "The forward pass, which adjusts the weights while it computes predictions.",
        correct: false,
      },
    ],
  },
  {
    id: "bp-q3-which-layers",
    conceptId: "backpropagation",
    prompt:
      "A network has an input layer, two hidden layers and an output layer, and the loss is measured at the output. Which weights get a gradient from backpropagation?",
    options: [
      {
        id: "a",
        text: "Only the output layer's weights, since that is where the loss is measured.",
        correct: false,
        misconceptionId: "bp-last-layer-only",
      },
      {
        id: "b",
        text: "Weights in every layer, because the chain rule carries each weight's effect on the loss back through the network.",
        correct: true,
      },
      {
        id: "c",
        text: "Every weight gets the same gradient, since they all share the blame for one loss value.",
        correct: false,
        misconceptionId: "bp-same-blame",
      },
    ],
  },
  {
    id: "bp-q4-cost",
    conceptId: "backpropagation",
    prompt:
      "A network has 1,000,000 weights. To get the gradient of the loss for every weight on one example, how many passes does backpropagation need?",
    options: [
      {
        id: "a",
        text: "About one per layer, each pass handling one layer's weights.",
        correct: false,
      },
      {
        id: "b",
        text: "About one million, one per weight: nudge the weight, re-run the network and see how the loss changes.",
        correct: false,
        misconceptionId: "bp-per-weight-rerun",
      },
      {
        id: "c",
        text: "One forward pass and one backward pass, which together give every gradient.",
        correct: true,
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
