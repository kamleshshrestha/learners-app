import { describe, expect, it } from "vitest";
import { getMisconceptionsForConcept } from "@/lib/learning/misconceptions";
import { scrubMisconceptionIds } from "@/lib/llm/scrub";
import type { Misconception } from "@/lib/learning/types";

const catalog = getMisconceptionsForConcept("overfitting");
const scrub = (text: string) => scrubMisconceptionIds(text, catalog);

describe("scrubMisconceptionIds", () => {
  it("leaves text without ids untouched", () => {
    const text = "You said the training score is the one that matters.";
    expect(scrub(text)).toBe(text);
  });

  it("drops an id in parentheses along with the space before it", () => {
    expect(
      scrub("This matches the belief that good training scores prove learning (of-train-accuracy-proves)."),
    ).toBe("This matches the belief that good training scores prove learning.");
  });

  it("drops an id in square brackets", () => {
    expect(scrub("You trusted training results [of-train-accuracy-proves] over test results.")).toBe(
      "You trusted training results over test results.",
    );
  });

  it("replaces a bare id with the misconception title so the sentence still reads", () => {
    expect(scrub("You seem to hold of-any-gap-is-overfit here.")).toBe(
      'You seem to hold "Thinks any train-test gap means overfitting" here.',
    );
  });

  it.each(["`", '"', "'"])("replaces an id wrapped in %s quotes", (quote) => {
    expect(scrub(`This is ${quote}of-confused-with-underfit${quote}.`)).toBe(
      'This is "Confuses overfitting with underfitting".',
    );
  });

  it("does not eat an apostrophe that is not a matching quote", () => {
    expect(scrub("of-any-gap-is-overfit's effect")).toBe(
      '"Thinks any train-test gap means overfitting"\'s effect',
    );
  });

  it("scrubs every occurrence and several different ids", () => {
    const out = scrub(
      "Both of-train-accuracy-proves (of-train-accuracy-proves) and of-more-complexity-always-better apply.",
    );
    expect(out).not.toMatch(/\bof-[a-z-]+/);
    expect(out).toContain("Thinks high training accuracy means a good model");
    expect(out).toContain("Thinks a more complex model is always better");
  });

  it("matches an id whole when another id is a prefix of it", () => {
    const nested: Misconception[] = [
      { id: "x-a", conceptId: "c", title: "Short", belief: "", correction: "" },
      { id: "x-a-long", conceptId: "c", title: "Long", belief: "", correction: "" },
    ];
    expect(scrubMisconceptionIds("see x-a-long and x-a", nested)).toBe('see "Long" and "Short"');
  });

  it("does not touch a longer word that merely contains an id", () => {
    const nested: Misconception[] = [
      { id: "x-a", conceptId: "c", title: "Short", belief: "", correction: "" },
    ];
    expect(scrubMisconceptionIds("x-abc and pre-x-a", nested)).toBe("x-abc and pre-x-a");
  });

  it("ignores ids from other concepts", () => {
    expect(scrub("gd-one-step is not in this catalog")).toBe("gd-one-step is not in this catalog");
  });
});
