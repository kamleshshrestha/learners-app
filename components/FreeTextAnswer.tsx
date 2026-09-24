"use client";

import { useState } from "react";

const MAX_LENGTH = 2000;

export default function FreeTextAnswer({
  prompt,
  hint,
  submitLabel,
  pending,
  error,
  onSubmit,
}: {
  prompt: string;
  hint?: string;
  submitLabel: string;
  pending: boolean;
  error: string | null;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const trimmed = text.trim();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (trimmed && !pending) onSubmit(trimmed);
      }}
    >
      <label htmlFor="free-text" className="text-xl font-semibold leading-8">
        {prompt}
      </label>
      {hint && <p className="-mt-2 text-foreground/60">{hint}</p>}
      <textarea
        id="free-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_LENGTH}
        rows={6}
        disabled={pending}
        className="w-full resize-y rounded-xl border border-foreground/20 bg-transparent p-4 leading-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-60"
      />
      {error && (
        <p role="alert" className="text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!trimmed || pending}
        className="h-12 self-start rounded-full bg-foreground px-6 font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Thinking…" : submitLabel}
      </button>
    </form>
  );
}
