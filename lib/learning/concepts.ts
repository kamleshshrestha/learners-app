import type { Concept } from "./types";

export const concepts: Concept[] = [
  {
    id: "linear-regression",
    title: "Linear regression",
    summary: "Fitting a line to data to predict a number.",
  },
  {
    id: "gradient-descent",
    title: "Gradient descent",
    summary: "How models learn by stepping downhill on a loss.",
  },
  {
    id: "overfitting",
    title: "Overfitting",
    summary: "When a model memorizes training data instead of learning.",
  },
  {
    id: "train-test-split",
    title: "Train/test split",
    summary: "Why we hold data back to judge a model honestly.",
  },
  {
    id: "logistic-regression",
    title: "Logistic regression",
    summary: "Predicting probabilities and classes with a sigmoid.",
  },
  {
    id: "backpropagation",
    title: "Backpropagation",
    summary: "How neural networks assign blame to each weight.",
  },
];

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}
