import ConceptSelector from "@/components/ConceptSelector";
import { concepts } from "@/lib/learning/concepts";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-sm text-foreground/60">Learning Debugger</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Find out what you actually misunderstand.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-foreground/70">
          Skip the generic re-explanation. Answer a few short questions and we&apos;ll
          pinpoint the specific gap in your understanding of a machine-learning
          concept, then fix that.
        </p>
      </header>

      <section aria-labelledby="pick-concept" className="flex flex-col gap-4">
        <h2 id="pick-concept" className="text-xl font-semibold">
          Pick a concept that isn&apos;t clicking
        </h2>
        <ConceptSelector concepts={concepts} />
      </section>
    </main>
  );
}
