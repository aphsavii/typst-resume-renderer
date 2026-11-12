import React from "react";
import { Plus, Trash2 } from "lucide-react";

import { mergePastedBullets } from "../utils/bullets";

interface BulletListEditorProps {
  label: string;
  bullets: string[];
  /** Text inserted when "Add Bullet" is pressed. */
  newBulletText: string;
  placeholder?: string;
  onChange: (bullets: string[]) => void;
}

/**
 * Editable bullet list (experience, projects, leadership).
 *
 * Pasting several lines into one bullet splits them into separate bullets
 * instead of storing a multi-line string in a single one.
 */
export const BulletListEditor: React.FC<BulletListEditorProps> = ({
  label,
  bullets,
  newBulletText,
  placeholder,
  onChange,
}) => {
  const replaceBullet = (index: number, text: string) =>
    onChange(bullets.map((bullet, i) => (i === index ? text : bullet)));

  return (
    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
        <button
          onClick={() => onChange([newBulletText, ...bullets])}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Add Bullet</span>
        </button>
      </div>

      {bullets.map((bullet, index) => (
        <div key={index} className="flex items-start gap-2">
          <textarea
            rows={2}
            value={bullet}
            placeholder={placeholder}
            onChange={(event) => replaceBullet(index, event.target.value)}
            onPaste={(event) => {
              const merged = mergePastedBullets(
                bullets,
                index,
                event.currentTarget.selectionStart ?? 0,
                event.currentTarget.selectionEnd ?? 0,
                event.clipboardData.getData("text"),
              );

              // Single-line paste: keep the browser's default behaviour.
              if (!merged) return;

              event.preventDefault();
              onChange(merged);
            }}
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl leading-normal"
          />
          <button
            onClick={() =>
              onChange(bullets.filter((_, i) => i !== index))
            }
            className="p-1.5 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
            title="Remove bullet"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default BulletListEditor;
