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
  {
    id: "bp-updates-weights",
    conceptId: "backpropagation",
    title: "Thinks backpropagation updates the weights",
    belief: "Backpropagation is the step that changes the weights during training.",
    correction:
      "Backpropagation only computes the gradient of the loss with respect to each weight. A separate optimizer step, such as gradient descent, uses those gradients to update the weights.",
  },
  {
    id: "bp-same-blame",
    conceptId: "backpropagation",
    title: "Thinks every weight gets the same blame",
    belief:
      "The loss is passed back unchanged, so every weight receives the same error signal.",
    correction:
      "Each weight gets its own gradient. The chain rule multiplies local derivatives along the path from that weight to the loss, so weights with more influence on the loss get larger gradients and some get almost none.",
  },
  {
    id: "bp-last-layer-only",
    conceptId: "backpropagation",
    title: "Thinks only the last layer learns",
    belief:
      "The loss is measured at the output, so only the output layer's weights receive gradients.",
    correction:
      "The chain rule carries the loss's sensitivity back through every layer, so every weight, including those in early hidden layers, receives a gradient. The gradients can shrink on the way back, but they are still computed for all layers.",
  },
  {
    id: "bp-per-weight-rerun",
    conceptId: "backpropagation",
    title: "Thinks it needs a separate pass for every weight",
    belief:
      "To get a weight's gradient you nudge that weight and re-run the network to see how the loss changes.",
    correction:
      "That is numerical differentiation, and it would be far too slow for millions of weights. Backpropagation reuses values saved during the forward pass and applies the chain rule, so one backward pass gives every gradient at roughly the cost of the forward pass.",
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
