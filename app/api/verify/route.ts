import { getConcept } from "@/lib/learning/concepts";
import { getMisconception } from "@/lib/learning/misconceptions";
import { generateStructured, llmErrorResponse, parseBody } from "@/lib/llm/client";
import { checkRateLimit } from "@/lib/llm/rate-limit";
import { verificationPrompt } from "@/lib/llm/prompts";
import { verificationOutputSchema, verifyRequestSchema } from "@/lib/llm/schemas";

export async function POST(request: Request) {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  const body = await parseBody(request, verifyRequestSchema);
  if (!body.ok) return body.response;
  const { conceptId, misconceptionId, question, answer } = body.data;

  const concept = getConcept(conceptId);
  const misconception = getMisconception(misconceptionId);
  if (!concept || misconception?.conceptId !== conceptId) {
    return Response.json({ error: "Unknown concept or misconception" }, { status: 404 });
  }

  try {
    const result = await generateStructured({
      ...verificationPrompt({ concept, misconception, question, answer }),
      schema: verificationOutputSchema,
    });
    return Response.json({ result });
  } catch (error) {
    return llmErrorResponse(error);
  }
}
