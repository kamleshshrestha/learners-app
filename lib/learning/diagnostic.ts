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
  {
    id: "of-q1-train-vs-test",
    conceptId: "overfitting",
    prompt:
      "A model gets 99% accuracy on its training data but only 70% on new data. What does this most likely mean?",
    options: [
      {
        id: "a",
        text: "It is a strong model, and the lower score on new data is just noise.",
        correct: false,
        misconceptionId: "of-train-accuracy-proves",
      },
      {
        id: "b",
        text: "It has memorized details specific to the training data instead of learning patterns that generalize.",
        correct: true,
      },
      {
        id: "c",
        text: "It has not been trained for long enough yet.",
        correct: false,
        misconceptionId: "of-confused-with-underfit",
      },
    ],
  },
  {
    id: "of-q2-complexity",
    conceptId: "overfitting",
    prompt:
      "You have a small dataset. You swap a simple model for one with 100 times more parameters, and its training error drops to zero. What should you expect on new data?",
    options: [
      {
        id: "a",
        text: "Possibly worse performance, because the extra capacity may be fitting noise in the small dataset.",
        correct: true,
      },
      {
        id: "b",
        text: "Better performance, because a more complex model can capture the pattern more precisely.",
        correct: false,
        misconceptionId: "of-more-complexity-always-better",
      },
      {
        id: "c",
        text: "The same performance, because new data comes from the same source.",
        correct: false,
      },
    ],
  },
  {
    id: "of-q3-validation-rising",
    conceptId: "overfitting",
    prompt:
      "During training, the loss on the training set keeps falling, but the loss on a held-out validation set has started to rise. What is the most sensible response?",
    options: [
      {
        id: "a",
        text: "Keep training, because the validation loss will come back down once the model has learned enough.",
        correct: false,
        misconceptionId: "of-confused-with-underfit",
      },
      {
        id: "b",
        text: "Trust the training loss, because that is the data the model actually learns from.",
        correct: false,
        misconceptionId: "of-train-accuracy-proves",
      },
      {
        id: "c",
        text: "Stop earlier or add regularization, because the model has started fitting the training data too closely.",
        correct: true,
      },
    ],
  },
  {
    id: "of-q4-small-gap",
    conceptId: "overfitting",
    prompt: "A model scores 96% on training data and 94% on test data. What is the best reading?",
    options: [
      {
        id: "a",
        text: "Overfitting, because test accuracy is lower than training accuracy.",
        correct: false,
        misconceptionId: "of-any-gap-is-overfit",
      },
      {
        id: "b",
        text: "Healthy generalization; a small gap between training and test scores is normal.",
        correct: true,
      },
      {
        id: "c",
        text: "Underfitting, because neither score is 100%.",
        correct: false,
      },
    ],
  },
  {
    id: "tts-q1-why-holdout",
    conceptId: "train-test-split",
    prompt: "Why do we evaluate a model on data it was not trained on?",
    options: [
      {
        id: "a",
        text: "We don't really need to: the training score already shows how good the model is, and holding data back only wastes it.",
        correct: false,
        misconceptionId: "tts-waste-of-data",
      },
      {
        id: "b",
        text: "Performance on data the model has never seen estimates how it will do on new data in real use.",
        correct: true,
      },
      {
        id: "c",
        text: "Training finishes faster when the model sees less data, which saves compute.",
        correct: false,
      },
    ],
  },
  {
    id: "tts-q2-tuning",
    conceptId: "train-test-split",
    prompt:
      "You try 20 hyperparameter settings, keep the one with the best score on the test set, and report that score as the model's expected performance. What is wrong with this?",
    options: [
      {
        id: "a",
        text: "Nothing: the test set was never used to train the weights, so the score is an honest estimate of real performance.",
        correct: false,
        misconceptionId: "tts-tune-on-test",
      },
      {
        id: "b",
        text: "The model would have scored higher if it had also been trained on the test data, so holding it back was a mistake.",
        correct: false,
        misconceptionId: "tts-waste-of-data",
      },
      {
        id: "c",
        text: "Picking the best of 20 by test score lets the test set influence the result; tune on a separate validation set instead.",
        correct: true,
      },
    ],
  },
  {
    id: "tts-q3-scaling",
    conceptId: "train-test-split",
    prompt:
      "Before splitting, you standardize every feature using the mean and standard deviation of the whole dataset, then split into train and test sets. Is that a problem?",
    options: [
      {
        id: "a",
        text: "Yes: the test rows helped set the mean and standard deviation, which leaks information; fit it on the training set only.",
        correct: true,
      },
      {
        id: "b",
        text: "No: scaling only changes units, so it cannot affect the evaluation, as long as the split happens before training.",
        correct: false,
        misconceptionId: "tts-preprocess-before-split",
      },
      {
        id: "c",
        text: "Yes, because features should never be standardized when the model will be trained on the result.",
        correct: false,
      },
    ],
  },
  {
    id: "tts-q4-time-order",
    conceptId: "train-test-split",
    prompt:
      "You want to predict next month's sales from three years of monthly records. You shuffle all the rows, use 80% for training and 20% for testing, and get a great test score. What should you conclude?",
    options: [
      {
        id: "a",
        text: "It is a trustworthy estimate, because a random split is always the fairest way to build a test set, whatever the data.",
        correct: false,
        misconceptionId: "tts-random-always-fine",
      },
      {
        id: "b",
        text: "The shuffle lets the model train on months after the ones it is tested on, which leaks the future; split by time.",
        correct: true,
      },
      {
        id: "c",
        text: "The test set is too small; a test set should be at least half of the data so the estimate is stable.",
        correct: false,
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
