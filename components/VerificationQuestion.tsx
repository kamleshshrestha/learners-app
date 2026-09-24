import type { VerificationResult } from "@/lib/learning/types";
import FreeTextAnswer from "./FreeTextAnswer";

const VERDICT_LABEL: Record<VerificationResult["verdict"], string> = {
  resolved: "You've got it",
  partial: "Almost there",
  unresolved: "Not quite yet",
};

export default function VerificationQuestion({
  question,
  result,
  pending,
  error,
  onSubmit,
}: {
  question: string;
  result: VerificationResult | null;
  pending: boolean;
  error: string | null;
  onSubmit: (answer: string) => void;
}) {
  if (result) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-foreground/10 p-6">
        <p className="font-mono text-sm text-foreground/60">Check-in result</p>
        <h2 className="text-2xl font-semibold">{VERDICT_LABEL[result.verdict]}</h2>
        <p className="leading-7">{result.feedback}</p>
      </div>
    );
  }

  return (
    <FreeTextAnswer
      prompt={question}
      hint="Answer in a few sentences, in your own words."
      submitLabel="Check my answer"
      pending={pending}
      error={error}
      onSubmit={onSubmit}
    />
  );
}
