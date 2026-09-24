import Link from "next/link";
import { notFound } from "next/navigation";
import LearningSession from "@/components/LearningSession";
import { getQuestionsForConcept } from "@/lib/learning/diagnostic";
import { getConcept } from "@/lib/learning/concepts";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { concept: conceptParam } = await searchParams;
  const concept =
    typeof conceptParam === "string" ? getConcept(conceptParam) : undefined;
  if (!concept) notFound();

  const questions = getQuestionsForConcept(concept.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-12 sm:py-20">
      <header className="flex flex-col gap-3">
        <Link
          href="/"
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          ← All concepts
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">
          {concept.title}
        </h1>
      </header>

      {questions.length > 0 ? (
        <LearningSession concept={concept} questions={questions} />
      ) : (
        <p className="rounded-xl border border-foreground/10 p-6 leading-7 text-foreground/70">
          Diagnostic questions for {concept.title} are coming soon. Try{" "}
          <Link
            href="/learn?concept=gradient-descent"
            className="font-medium text-foreground underline"
          >
            Gradient descent
          </Link>{" "}
          in the meantime.
        </p>
      )}
    </main>
  );
}
