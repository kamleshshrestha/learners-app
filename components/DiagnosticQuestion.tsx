"use client";

import { useState } from "react";
import type { DiagnosticQuestion as Question } from "@/lib/learning/types";
import AnswerInput from "./AnswerInput";

export default function DiagnosticQuestion({
  question,
  isLast,
  onSubmit,
}: {
  question: Question;
  isLast: boolean;
  onSubmit: (optionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (selected) onSubmit(selected);
      }}
    >
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 text-xl font-semibold leading-8">
          {question.prompt}
        </legend>
        <AnswerInput
          name={question.id}
          options={question.options}
          value={selected}
          onChange={setSelected}
        />
      </fieldset>
      <button
        type="submit"
        disabled={!selected}
        className="h-12 self-start rounded-full bg-foreground px-6 font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLast ? "See diagnosis" : "Next question"}
      </button>
    </form>
  );
}
