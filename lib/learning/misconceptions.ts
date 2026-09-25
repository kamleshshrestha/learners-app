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
  {
    id: "of-train-accuracy-proves",
    conceptId: "overfitting",
    title: "Thinks high training accuracy means a good model",
    belief:
      "If a model scores very well on its training data, it has learned the task well.",
    correction:
      "A model can reach near-perfect training accuracy by memorizing the training examples, noise included. Only performance on data it has not seen shows whether it generalizes.",
  },
  {
    id: "of-more-complexity-always-better",
    conceptId: "overfitting",
    title: "Thinks a more complex model is always better",
    belief:
      "More parameters means more power, so a bigger model will always do better on new data too.",
    correction:
      "Extra capacity lets a model fit the noise in a limited dataset, which usually makes it worse on new data. The right complexity depends on how much data you have and how noisy it is.",
  },
  {
    id: "of-confused-with-underfit",
    conceptId: "overfitting",
    title: "Confuses overfitting with underfitting",
    belief:
      "If a model does badly on new data, it just has not learned enough yet, so it needs more training.",
    correction:
      "Underfitting is doing badly everywhere because the model has not captured the pattern. Overfitting is doing well on training data but badly on new data, and training longer on the same data usually makes it worse, not better.",
  },
  {
    id: "of-any-gap-is-overfit",
    conceptId: "overfitting",
    title: "Thinks any train-test gap means overfitting",
    belief:
      "If test accuracy is lower than training accuracy at all, the model is overfitting.",
    correction:
      "Some gap is normal, because a model always fits the data it trained on slightly better. Overfitting is a large gap, or test performance getting worse while training performance keeps improving.",
  },
  {
    id: "tts-waste-of-data",
    conceptId: "train-test-split",
    title: "Thinks holding data back is a waste",
    belief:
      "A model's training score already shows how good it is, and setting data aside only gives it less to learn from.",
    correction:
      "A model's score on data it trained on is optimistic, so it cannot show how the model will do on new data. Held-out data is what lets you measure that. Once you have your estimate, you can retrain on all the data if you want.",
  },
  {
    id: "tts-tune-on-test",
    conceptId: "train-test-split",
    title: "Thinks it's fine to tune on the test set",
    belief:
      "You can check and adjust against the test set as often as you like, since the model was never trained on it.",
    correction:
      "Each time you pick a setting because it scored better on the test set, the test set influences the model and the final score becomes optimistic. Tune on a separate validation set (or with cross-validation) and use the test set once, at the end.",
  },
  {
    id: "tts-preprocess-before-split",
    conceptId: "train-test-split",
    title: "Thinks preprocessing can use all the data before splitting",
    belief:
      "Scaling or filling in missing values using the whole dataset is harmless, as long as you split afterwards.",
    correction:
      "Statistics such as the mean or standard deviation computed from all rows include the test rows, so information about the test set leaks into training. Fit preprocessing on the training set only, then apply it to the test set.",
  },
  {
    id: "tts-random-always-fine",
    conceptId: "train-test-split",
    title: "Thinks a random split is always the right split",
    belief:
      "Shuffling the rows and splitting them randomly gives a fair test set for any dataset.",
    correction:
      "The split has to match how the model will be used. With time-ordered data a random split lets the model train on the future, so split by time. Rows from the same person or group should stay together, and rare classes may need a stratified split.",
  },
  {
    id: "lr-hit-every-point",
    conceptId: "linear-regression",
    title: "Thinks the line should pass through every point",
    belief:
      "A good best-fit line goes through all the data points, and one that misses points is a poor fit.",
    correction:
      "Real data is noisy, so a straight line cannot hit every point. Linear regression picks the line that makes the overall squared error as small as possible, which usually leaves most points slightly off the line.",
  },
  {
    id: "lr-extrapolate-freely",
    conceptId: "linear-regression",
    title: "Thinks the line holds far outside the data",
    belief:
      "Once a line fits the data well, its predictions are just as reliable for any input, however far away.",
    correction:
      "The line only describes the relationship where there was data. Far outside that range the true relationship may bend, level off or change entirely, so predictions there (extrapolation) are much less trustworthy.",
  },
  {
    id: "lr-big-coef-important",
    conceptId: "linear-regression",
    title: "Thinks a bigger coefficient always means a more important feature",
    belief: "The feature with the larger coefficient matters more to the prediction.",
    correction:
      "A coefficient depends on the units of its feature: a feature measured in small units needs a large coefficient to have the same effect. To compare importance, put the features on the same scale first, for example by standardizing them.",
  },
  {
    id: "lr-outlier-harmless",
    conceptId: "linear-regression",
    title: "Thinks one outlier barely affects the line",
    belief:
      "With enough points, a single unusual point has little say in where the line goes.",
    correction:
      "Least squares squares each error, so a point far from the trend contributes a very large error and pulls the line toward it. One outlier can noticeably tilt the line, especially when there are few points.",
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
