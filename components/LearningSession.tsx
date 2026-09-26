"use client";

import Link from "next/link";
import { useLearningSession } from "@/hooks/useLearningSession";
import type { Concept, DiagnosticQuestion as Question } from "@/lib/learning/types";
import DiagnosisCard from "./DiagnosisCard";
import DiagnosticQuestion from "./DiagnosticQuestion";
import ExplanationCard from "./ExplanationCard";
import FreeTextAnswer from "./FreeTextAnswer";
import SessionProgress from "./SessionProgress";
import VerificationQuestion from "./VerificationQuestion";

const primaryButton =
  "h-12 self-start rounded-full bg-primary px-6 font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40";

export default function LearningSession({
  concept,
  questions,
}: {
  concept: Concept;
  questions: Question[];
}) {
  const session = useLearningSession(concept.id, questions);

  switch (session.stage) {
    case "diagnostic":
      return session.currentQuestion ? (
        <div className="flex flex-col gap-8">
          <SessionProgress current={session.currentIndex} total={session.total} />
          <DiagnosticQuestion
            key={session.currentQuestion.id}
            question={session.currentQuestion}
            isLast={session.currentIndex === session.total - 1}
            onSubmit={session.submitAnswer}
          />
        </div>
      ) : null;

    case "explain-back":
      return (
        <FreeTextAnswer
          prompt={`In your own words, how does ${concept.title.toLowerCase()} work?`}
          hint="Don't look anything up. Your own wording is what lets us find the specific gap."
          submitLabel="Diagnose my understanding"
          pending={session.pending}
          error={session.error}
          onSubmit={session.submitSelfExplanation}
        />
      );

    case "diagnosis":
      return (
        <div className="flex flex-col gap-8">
          <DiagnosisCard diagnosis={session.diagnosis} />
          {session.error && (
            <p role="alert" className="text-red-600 dark:text-red-400">
              {session.error}
            </p>
          )}
          {session.diagnosis ? (
            <button
              type="button"
              onClick={session.continueToExplanation}
              disabled={session.pending}
              className={primaryButton}
            >
              {session.pending ? "Preparing explanation…" : "Explain it to me"}
            </button>
          ) : (
            <SessionActions onRestart={session.restart} />
          )}
        </div>
      );

    case "explanation":
      return session.explanation ? (
        <div className="flex flex-col gap-8">
          <ExplanationCard explanation={session.explanation} />
          <button
            type="button"
            onClick={session.startVerification}
            className={primaryButton}
          >
            Test my understanding
          </button>
        </div>
      ) : null;

    case "verification":
    case "complete":
      return session.explanation ? (
        <div className="flex flex-col gap-8">
          <VerificationQuestion
            question={session.explanation.verificationQuestion}
            result={session.verification}
            pending={session.pending}
            error={session.error}
            onSubmit={session.submitVerification}
          />
          {session.stage === "complete" && (
            <SessionActions onRestart={session.restart} />
          )}
        </div>
      ) : null;
  }
}

function SessionActions({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        type="button"
        onClick={onRestart}
        className="h-12 rounded-full border border-foreground/20 px-6 font-medium transition-colors hover:bg-foreground/[.04]"
      >
        Start over
      </button>
      <Link
        href="/"
        className="flex h-12 items-center rounded-full px-6 font-medium text-foreground/70 hover:text-foreground"
      >
        Pick another concept
      </Link>
    </div>
  );
}
