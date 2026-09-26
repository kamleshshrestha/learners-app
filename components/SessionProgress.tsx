export default function SessionProgress({
  current,
  total,
}: {
  /** Zero-based index of the current step. */
  current: number;
  total: number;
}) {
  const step = Math.min(current + 1, total);
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-sm text-foreground/60">
        Question {step} of {total}
      </p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="Diagnostic progress"
        className="h-1.5 overflow-hidden rounded-full bg-primary/10"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
