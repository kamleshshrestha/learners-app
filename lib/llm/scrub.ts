import type { Misconception } from "@/lib/learning/types";

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Removes internal misconception ids from model text that is shown to the
 * learner. The diagnosis prompt has to show the model the ids, and it
 * sometimes quotes them. An id in brackets is dropped, since it is an aside;
 * any other mention is replaced with the misconception's title so the
 * sentence still reads.
 */
export function scrubMisconceptionIds(
  text: string,
  misconceptions: Misconception[],
): string {
  // Longest first, so an id that contains another id is matched whole.
  const byLength = [...misconceptions].sort((a, b) => b.id.length - a.id.length);
  let result = text;

  for (const { id, title } of byLength) {
    const escaped = escapeRegExp(id);
    // Not part of a longer identifier.
    const bare = `(?<![\\w-])${escaped}(?![\\w-])`;

    result = result
      .replace(new RegExp(`\\s*[(\\[]\\s*${bare}\\s*[)\\]]`, "g"), "")
      .replace(new RegExp(`([\`"'])${bare}\\1|${bare}`, "g"), () => `"${title}"`);
  }

  return result.trim();
}
