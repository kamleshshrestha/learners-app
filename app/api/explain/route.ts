import { getConcept } from "@/lib/learning/concepts";
import { getMisconception } from "@/lib/learning/misconceptions";
import { generateStructured, llmErrorResponse, parseBody } from "@/lib/llm/client";
import { checkRateLimit } from "@/lib/llm/rate-limit";
import { explanationPrompt } from "@/lib/llm/prompts";
import { explainRequestSchema, explanationOutputSchema } from "@/lib/llm/schemas";

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  const body = await parseBody(request, explainRequestSchema);
  if (!body.ok) return body.response;
  const { conceptId, misconceptionId, explanation } = body.data;

  const concept = getConcept(conceptId);
  const misconception = getMisconception(misconceptionId);
  if (!concept || misconception?.conceptId !== conceptId) {
    return Response.json({ error: "Unknown concept or misconception" }, { status: 404 });
  }

  try {
    const result = await generateStructured({
      ...explanationPrompt({ concept, misconception, explanation }),
      schema: explanationOutputSchema,
    });
    return Response.json({ explanation: result });
  } catch (error) {
    return llmErrorResponse(error);
  }
}
