export type Concept = {
  id: string;
  title: string;
  summary: string;
};

/** A specific, named wrong belief a learner can hold about a concept. */
export type Misconception = {
  id: string;
  conceptId: string;
  title: string;
  /** What the learner believes, phrased from their point of view. */
  belief: string;
  /** What is actually true. */
  correction: string;
};

export type DiagnosticOption = {
  id: string;
  text: string;
  correct: boolean;
  /** Set on wrong options that reveal a specific misconception. */
  misconceptionId?: string;
};

export type DiagnosticQuestion = {
  id: string;
  conceptId: string;
  prompt: string;
  options: DiagnosticOption[];
};

/** Selected option id per question id. */
export type DiagnosticAnswers = Record<string, string>;

export type Diagnosis = {
  conceptId: string;
  /** The misconception revealed most often. */
  primary: Misconception;
  /** Any other misconceptions revealed, most frequent first. */
  secondary: Misconception[];
  /** Ids of the questions whose answers revealed `primary`. */
  evidence: string[];
  /** Short explanation, addressed to the learner, of why this was chosen. */
  reasoning?: string;
};

export type Explanation = {
  /** Targeted explanation aimed at the diagnosed misconception. */
  explanation: string;
  /** A small concrete example that makes the correction tangible. */
  example: string;
  takeaway: string;
  /** A new scenario that tests whether the misconception is gone. */
  verificationQuestion: string;
};

export type VerificationVerdict = "resolved" | "partial" | "unresolved";

export type VerificationResult = {
  verdict: VerificationVerdict;
  feedback: string;
};

export type SessionStage =
  | "diagnostic"
  | "explain-back"
  | "diagnosis"
  | "explanation"
  | "verification"
  | "complete";
