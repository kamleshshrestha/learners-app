import { describe, expect, it } from "vitest";
import { concepts, getConcept } from "@/lib/learning/concepts";
import {
  diagnose,
  diagnosticQuestions,
  evidenceFor,
  getQuestionsForConcept,
} from "@/lib/learning/diagnostic";
import {
  getMisconception,
  getMisconceptionsForConcept,
  misconceptions,
} from "@/lib/learning/misconceptions";
import type { DiagnosticQuestion } from "@/lib/learning/types";

const CONCEPT = "gradient-descent";
const questions = getQuestionsForConcept(CONCEPT);

/** The option in `question` that reveals `misconceptionId`, if any. */
function optionFor(question: DiagnosticQuestion, misconceptionId: string) {
  return question.options.find((o) => o.misconceptionId === misconceptionId);
}

/** Answers that pick the correct option for every question. */
function allCorrect() {
  return Object.fromEntries(
    questions.map((q) => [q.id, q.options.find((o) => o.correct)!.id]),
  );
}

describe("catalog integrity", () => {
  it("has unique ids in each catalog", () => {
    for (const ids of [
      concepts.map((c) => c.id),
      misconceptions.map((m) => m.id),
      diagnosticQuestions.map((q) => q.id),
    ]) {
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("only references concepts that exist", () => {
    for (const m of misconceptions) expect(getConcept(m.conceptId)).toBeDefined();
    for (const q of diagnosticQuestions) {
      expect(getConcept(q.conceptId)).toBeDefined();
    }
  });

  it("gives every question exactly one correct option and unique option ids", () => {
    for (const q of diagnosticQuestions) {
      expect(q.options.filter((o) => o.correct)).toHaveLength(1);
      expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
    }
  });

  it("links wrong options to real misconceptions of the same concept", () => {
    for (const q of diagnosticQuestions) {
      for (const o of q.options) {
        if (o.correct) expect(o.misconceptionId).toBeUndefined();
        if (!o.misconceptionId) continue;
        expect(getMisconception(o.misconceptionId)?.conceptId).toBe(q.conceptId);
      }
    }
  });

  it("has a question that can reveal each misconception", () => {
    for (const m of misconceptions) {
      expect(
        diagnosticQuestions.some((q) => optionFor(q, m.id)),
        m.id,
      ).toBe(true);
    }
  });
});

describe("lookups", () => {
  it("returns undefined for unknown ids", () => {
    expect(getConcept("nope")).toBeUndefined();
    expect(getMisconception("nope")).toBeUndefined();
  });

  it("filters by concept", () => {
    expect(getQuestionsForConcept("nope")).toEqual([]);
    expect(getMisconceptionsForConcept(CONCEPT).length).toBeGreaterThan(0);
  });
});

describe("diagnose", () => {
  it("returns null when every answer is correct", () => {
    expect(diagnose(CONCEPT, allCorrect())).toBeNull();
  });

  it("returns null when nothing has been answered", () => {
    expect(diagnose(CONCEPT, {})).toBeNull();
  });

  it("picks the misconception revealed by the most wrong answers", () => {
    // Choose the misconception that appears in the most questions.
    const counts = new Map<string, number>();
    for (const q of questions) {
      for (const o of q.options) {
        if (o.misconceptionId) {
          counts.set(o.misconceptionId, (counts.get(o.misconceptionId) ?? 0) + 1);
        }
      }
    }
    const [target] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

    const answers = allCorrect();
    for (const q of questions) {
      const option = optionFor(q, target);
      if (option) answers[q.id] = option.id;
    }

    const diagnosis = diagnose(CONCEPT, answers);
    expect(diagnosis?.primary.id).toBe(target);
    expect(diagnosis?.evidence).toEqual(evidenceFor(CONCEPT, answers, target));
    expect(diagnosis?.conceptId).toBe(CONCEPT);
  });

  it("ranks a repeated misconception above single-hit ones", () => {
    // gd-bigger-lr-better is revealed twice (q3, q4); the others once each.
    const answers = allCorrect();
    const picks: Record<string, string> = {
      "gd-q1-single-update": "gd-one-step",
      "gd-q2-gradient-sign": "gd-gradient-direction",
      "gd-q3-learning-rate": "gd-bigger-lr-better",
      "gd-q4-convergence": "gd-bigger-lr-better",
    };
    for (const q of questions) answers[q.id] = optionFor(q, picks[q.id])!.id;

    const diagnosis = diagnose(CONCEPT, answers)!;
    expect(diagnosis.primary.id).toBe("gd-bigger-lr-better");
    expect(diagnosis.evidence).toEqual(["gd-q3-learning-rate", "gd-q4-convergence"]);
    // Ties among the single hits keep first-revealed order.
    expect(diagnosis.secondary.map((m) => m.id)).toEqual([
      "gd-one-step",
      "gd-gradient-direction",
    ]);
  });

  it("lists other revealed misconceptions as secondary", () => {
    // One wrong answer per distinct misconception, in question order.
    const answers = allCorrect();
    const seen: string[] = [];
    for (const q of questions) {
      const wrong = q.options.find(
        (o) => o.misconceptionId && !seen.includes(o.misconceptionId),
      );
      if (!wrong) continue;
      answers[q.id] = wrong.id;
      seen.push(wrong.misconceptionId!);
    }

    const diagnosis = diagnose(CONCEPT, answers)!;
    // All counts tie at 1, so the first-revealed misconception wins.
    expect(diagnosis.primary.id).toBe(seen[0]);
    expect(diagnosis.secondary.map((m) => m.id)).toEqual(seen.slice(1));
  });

  it("ignores answer ids that match no option", () => {
    const answers = Object.fromEntries(questions.map((q) => [q.id, "bogus"]));
    expect(diagnose(CONCEPT, answers)).toBeNull();
  });
});

describe("evidenceFor", () => {
  it("returns the questions whose chosen option revealed the misconception", () => {
    const q = questions.find((q) => q.options.some((o) => o.misconceptionId))!;
    const option = q.options.find((o) => o.misconceptionId)!;
    expect(
      evidenceFor(CONCEPT, { [q.id]: option.id }, option.misconceptionId!),
    ).toEqual([q.id]);
  });

  it("returns nothing for unanswered or correct questions", () => {
    expect(evidenceFor(CONCEPT, {}, "gd-one-step")).toEqual([]);
    expect(evidenceFor(CONCEPT, allCorrect(), "gd-one-step")).toEqual([]);
  });
});
