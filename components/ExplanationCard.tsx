import type { Explanation } from "@/lib/learning/types";

export default function ExplanationCard({
  explanation,
}: {
  explanation: Explanation;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-foreground/10 p-6">
      <p className="font-mono text-sm text-foreground/60">Let&apos;s fix that</p>
      <p className="whitespace-pre-line leading-7">{explanation.explanation}</p>
      <div className="rounded-lg bg-foreground/[.04] p-4">
        <p className="mb-1 text-sm font-medium text-foreground/60">Example</p>
        <p className="whitespace-pre-line leading-7">{explanation.example}</p>
      </div>
      <p className="font-medium leading-7">
        <span className="text-foreground/60">Remember: </span>
        {explanation.takeaway}
      </p>
    </div>
  );
}
