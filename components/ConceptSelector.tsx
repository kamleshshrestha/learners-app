import Link from "next/link";
import type { Concept } from "@/lib/learning/types";

export default function ConceptSelector({ concepts }: { concepts: Concept[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {concepts.map((concept) => (
        <li key={concept.id}>
          <Link
            href={`/learn?concept=${concept.id}`}
            className="group flex h-full flex-col gap-1 rounded-xl border border-foreground/10 p-5 transition-colors hover:border-foreground/40 hover:bg-foreground/[.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <span className="flex items-center justify-between font-medium">
              {concept.title}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
            <span className="text-sm text-foreground/60">{concept.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
