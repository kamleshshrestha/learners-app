import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/llm/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/llm/client")>()),
  generateStructured: vi.fn(),
}));

import { POST } from "@/app/api/diagnose/route";
import { generateStructured } from "@/lib/llm/client";
import { diagnosisPrompt } from "@/lib/llm/prompts";
import { getConcept } from "@/lib/learning/concepts";
import { getMisconceptionsForConcept } from "@/lib/learning/misconceptions";

const mockedGenerate = vi.mocked(generateStructured);

function request(ip: string) {
  return new Request("http://localhost/api/diagnose", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({
      conceptId: "overfitting",
      answers: { "of-q1-train-vs-test": "a" },
      explanation: "The training score is the one that matters.",
    }),
  });
}

describe("POST /api/diagnose", () => {
  beforeEach(() => mockedGenerate.mockReset());

  it("never shows internal misconception ids in the learner-facing reasoning", async () => {
    mockedGenerate.mockResolvedValue({
      primaryMisconceptionId: "of-train-accuracy-proves",
      secondaryMisconceptionIds: [],
      reasoning:
        "You said the training score is what matters, which matches the belief that good training performance proves learning (of-train-accuracy-proves).",
    });

    const response = await POST(request("192.0.2.1"));
    const { diagnosis } = await response.json();

    expect(response.status).toBe(200);
    expect(diagnosis.primary.id).toBe("of-train-accuracy-proves");
    expect(diagnosis.reasoning).toBe(
      "You said the training score is what matters, which matches the belief that good training performance proves learning.",
    );
  });

  it("scrubs a bare id anywhere in the reasoning", async () => {
    mockedGenerate.mockResolvedValue({
      primaryMisconceptionId: "of-any-gap-is-overfit",
      secondaryMisconceptionIds: [],
      reasoning: "This is of-any-gap-is-overfit, since you called any gap overfitting.",
    });

    const { diagnosis } = await (await POST(request("192.0.2.2"))).json();
    expect(diagnosis.reasoning).not.toMatch(/of-[a-z-]+-/);
    expect(diagnosis.reasoning).toContain("Thinks any train-test gap means overfitting");
  });
});

describe("diagnosisPrompt", () => {
  it("tells the model to keep catalog ids out of the reasoning", () => {
    const { system } = diagnosisPrompt({
      concept: getConcept("overfitting")!,
      misconceptions: getMisconceptionsForConcept("overfitting"),
      answers: {},
      explanation: "x",
    });
    expect(system).toMatch(/never mention its ids/i);
  });
});
