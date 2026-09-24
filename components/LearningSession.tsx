"use client";

import Link from "next/link";
import { useLearningSession } from "@/hooks/useLearningSession";
import type { Concept, DiagnosticQuestion as Question } from "@/lib/learning/types";
import DiagnosisCard from "./DiagnosisCard";
import DiagnosticQuestion from "./DiagnosticQuestion";
import SessionProgress from "./SessionProgress";

export default function LearningSession({
  concept,
  questions,
}: {
  concept: Concept;
  questions: Question[];
}) {
  const session = useLearningSession(concept.id, questions);

  if (session.stage === "diagnostic" && session.currentQuestion) {
    return (
      <div className="flex flex-col gap-8">
        <SessionProgress current={session.currentIndex} total={session.total} />
        <DiagnosticQuestion
          key={session.currentQuestion.id}
          question={session.currentQuestion}
          isLast={session.currentIndex === session.total - 1}
          onSubmit={session.submitAnswer}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <DiagnosisCard diagnosis={session.diagnosis} />
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={session.restart}
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
    </div>
  );
}
