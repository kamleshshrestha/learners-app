"use client";

type Option = { id: string; text: string };

export default function AnswerInput({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: Option[];
  value: string | null;
  onChange: (optionId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option.id}
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-foreground/10 p-4 transition-colors hover:border-foreground/40 has-checked:border-foreground has-checked:bg-foreground/[.04] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground"
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            className="mt-1 accent-foreground"
          />
          <span className="leading-6">{option.text}</span>
        </label>
      ))}
    </div>
  );
}
