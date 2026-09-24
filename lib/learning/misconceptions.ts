import type { Misconception } from "./types";

export const misconceptions: Misconception[] = [
  {
    id: "gd-one-step",
    conceptId: "gradient-descent",
    title: "Thinks it jumps straight to the minimum",
    belief: "Gradient descent computes the best parameters in a single update.",
    correction:
      "Each update only takes a small step downhill using local slope information. Reaching a minimum takes many repeated steps.",
  },
  {
    id: "gd-gradient-direction",
    conceptId: "gradient-descent",
    title: "Thinks the gradient points downhill",
    belief:
      "The gradient points toward lower loss, so you move in the gradient's direction.",
    correction:
      "The gradient points in the direction of steepest increase in loss. Gradient descent subtracts it, moving the opposite way.",
  },
  {
    id: "gd-bigger-lr-better",
    conceptId: "gradient-descent",
    title: "Thinks a bigger learning rate is always faster",
    belief:
      "Raising the learning rate always makes training converge sooner, with no downside.",
    correction:
      "A learning rate that is too large overshoots the minimum and can make the loss oscillate or blow up. It has to be tuned.",
  },
  {
    id: "gd-global-minimum",
    conceptId: "gradient-descent",
    title: "Thinks it always finds the global minimum",
    belief:
      "Once the loss stops decreasing, gradient descent has found the best possible parameters.",
    correction:
      "On non-convex losses it can stall at a local minimum, saddle point or plateau. A flat loss curve does not prove the parameters are optimal.",
  },
];

export function getMisconception(id: string): Misconception | undefined {
  return misconceptions.find((m) => m.id === id);
}

export function getMisconceptionsForConcept(
  conceptId: string,
): Misconception[] {
  return misconceptions.filter((m) => m.conceptId === conceptId);
}
