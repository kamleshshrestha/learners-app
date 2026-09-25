import { getConcept } from "@/lib/learning/concepts";
import { evidenceFor, getQuestionsForConcept } from "@/lib/learning/diagnostic";
import {
  getMisconception,
  getMisconceptionsForConcept,
} from "@/lib/learning/misconceptions";
import type { Diagnosis, Misconception } from "@/lib/learning/types";
import { generateStructured, llmErrorResponse, parseBody } from "@/lib/llm/client";
import { checkRateLimit } from "@/lib/llm/rate-limit";
import { diagnosisPrompt } from "@/lib/llm/prompts";
import { scrubMisconceptionIds } from "@/lib/llm/scrub";
import { diagnoseRequestSchema, diagnosisOutputSchema } from "@/lib/llm/schemas";

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  const body = await parseBody(request, diagnoseRequestSchema);
  if (!body.ok) return body.response;
  const { conceptId, answers, explanation } = body.data;

  const concept = getConcept(conceptId);
  const misconceptions = getMisconceptionsForConcept(conceptId);
  if (!concept || misconceptions.length === 0 || getQuestionsForConcept(conceptId).length === 0) {
    return Response.json({ error: "Unknown concept" }, { status: 404 });
  }

  try {
    const result = await generateStructured({
      ...diagnosisPrompt({ concept, misconceptions, answers, explanation }),
      schema: diagnosisOutputSchema(misconceptions.map((m) => m.id)),
    });

    const primary = result.primaryMisconceptionId
      ? getMisconception(result.primaryMisconceptionId)
      : undefined;
    if (!primary) return Response.json({ diagnosis: null });

    const diagnosis: Diagnosis = {
      conceptId,
      primary,
      secondary: result.secondaryMisconceptionIds
        .filter((id) => id !== primary.id)
        .map(getMisconception)
        .filter((m): m is Misconception => m !== undefined),
      evidence: evidenceFor(conceptId, answers, primary.id),
      reasoning: scrubMisconceptionIds(result.reasoning, misconceptions),
    };
    return Response.json({ diagnosis });
  } catch (error) {
    return llmErrorResponse(error);
  }
}
