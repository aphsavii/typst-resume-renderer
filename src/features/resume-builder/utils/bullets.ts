/**
 * Turns a multi-line clipboard payload into resume bullets.
 *
 * Pasting a list ("• Did A\n• Did B") into one bullet textarea used to leave a
 * single bullet containing newlines. These helpers split the payload so each
 * line becomes its own bullet.
 */

/** Strips a leading bullet glyph ("•", "-", "–", "*" …) and trims the line. */
function tidyLine(line: string): string {
  return line
    .replace(/^\s*(?:[•·▪◦‣]|[-–—*](?=\s))\s*/, "")
    .trim();
}

/** Splits pasted text into bullet-sized lines, dropping blanks and bullet marks. */
export function splitPastedBullets(text: string): string[] {
  return text
    .split(/\r\n|\r|\n/)
    .map(tidyLine)
    .filter((line) => line.length > 0);
}

function sameLineJoin(left: string, right: string): string {
  if (!left) return right;
  if (!right) return left;
  const spacer = /\s$/.test(left) || /^\s/.test(right) ? "" : " ";
  return `${left}${spacer}${right}`;
}

/**
 * Merges a multi-line paste into `bullets[index]`.
 *
 * Every pasted line becomes a bullet: the text before the caret prefixes the
 * first one, the text after the selection suffixes the last one, and the
 * original bullet is replaced by that run.
 *
 * Returns `null` when the paste is single-line (let the browser handle it) or
 * when it carries no usable text, so a normal paste never destroys the bullet.
 */
export function mergePastedBullets(
  bullets: string[],
  index: number,
  selectionStart: number,
  selectionEnd: number,
  pasted: string,
): string[] | null {
  const lines = splitPastedBullets(pasted);
  if (lines.length < 2) return null;

  const current = bullets[index] ?? "";
  const before = current.slice(0, selectionStart);
  const after = current.slice(selectionEnd);

  const run = [sameLineJoin(before, lines[0]), ...lines.slice(1)];
  const last = run.length - 1;
  run[last] = sameLineJoin(run[last], after);

  const replacement = run
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (replacement.length === 0) return null;

  return [...bullets.slice(0, index), ...replacement, ...bullets.slice(index + 1)];
}
