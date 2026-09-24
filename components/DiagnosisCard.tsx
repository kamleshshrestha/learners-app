import type { Diagnosis } from "@/lib/learning/types";

export default function DiagnosisCard({
  diagnosis,
}: {
  diagnosis: Diagnosis | null;
}) {
  if (!diagnosis) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-foreground/10 p-6">
        <h2 className="text-xl font-semibold">No misconception detected</h2>
        <p className="leading-7 text-foreground/70">
          Every answer matched the correct idea, so nothing here needs fixing.
        </p>
      </div>
    );
  }

  const { primary, secondary } = diagnosis;
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-foreground/10 p-6">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-sm text-foreground/60">Your diagnosis</p>
        <h2 className="text-2xl font-semibold">{primary.title}</h2>
      </div>
      <dl className="flex flex-col gap-4 leading-7">
        <div>
          <dt className="text-sm font-medium text-foreground/60">
            What you seem to believe
          </dt>
          <dd>{primary.belief}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-foreground/60">
            What&apos;s actually true
          </dt>
          <dd>{primary.correction}</dd>
        </div>
      </dl>
      {secondary.length > 0 && (
        <div className="border-t border-foreground/10 pt-4">
          <p className="text-sm font-medium text-foreground/60">
            Also worth checking
          </p>
          <ul className="mt-1 list-disc pl-5 leading-7">
            {secondary.map((m) => (
              <li key={m.id}>{m.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
