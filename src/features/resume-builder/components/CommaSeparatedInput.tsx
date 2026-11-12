import React, { useEffect, useRef, useState } from "react";

interface CommaSeparatedInputProps {
  /** Items the field edits. Order and content are kept as typed. */
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

/** "React, Vue ,, " → ["React", "Vue"] */
function parseItems(text: string): string[] {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function sameItems(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

/**
 * Free-text input backed by a `string[]` (skills, technologies, …).
 *
 * The visible text is local state instead of `value.join(", ")`. Re-deriving it
 * from the array on every keystroke normalises the text under the caret — a
 * typed space disappears ("React, T" → "React,T") and deleting a character in
 * the middle snaps the caret to the end. Here the browser owns the text and the
 * array is just parsed out of it.
 *
 * The field re-syncs only when the array changes from outside (opening another
 * version, importing, an AI edit), not from its own emissions.
 */
export const CommaSeparatedInput: React.FC<CommaSeparatedInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  "aria-label": ariaLabel,
}) => {
  const [text, setText] = useState<string>(() => value.join(", "));

  // Last array this field reported upwards, so its own edits are not mistaken
  // for an external change.
  const emittedRef = useRef<string[]>(value);

  useEffect(() => {
    if (sameItems(value, emittedRef.current)) return;
    emittedRef.current = value;
    setText(value.join(", "));
  }, [value]);

  return (
    <input
      type="text"
      value={text}
      aria-label={ariaLabel}
      placeholder={placeholder}
      className={className}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);
        const items = parseItems(next);
        emittedRef.current = items;
        onChange(items);
      }}
      onBlur={() => {
        // Tidy "react,vue" → "react, vue" once the field loses focus.
        setText(parseItems(text).join(", "));
      }}
    />
  );
};

export default CommaSeparatedInput;
