import React, { useRef, useState } from "react";
import {
  AlertCircle,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { ResumeSchema, type Resume } from "../../../types/resume";
import { ParseResumeError, parseResumeText } from "../api/parse-resume-api";

interface ImportResumeModalProps {
  onClose: () => void;
  onImported: (resume: Resume) => void;
}

type Status = "idle" | "extracting" | "parsing";

const ACCEPTED_RESUME_FILES = ".pdf,.txt,.md,.json";
const MIN_TEXT_LENGTH = 40;

export const ImportResumeModal: React.FC<ImportResumeModalProps> = ({
  onClose,
  onImported,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const isBusy = status !== "idle";

  const importJson = async (file: File) => {
    const parsed = ResumeSchema.safeParse(
      JSON.parse(await file.text()) as unknown,
    );

    if (!parsed.success) {
      throw new Error(
        "That JSON file does not match the resume schema. Fix the file or import it as text instead.",
      );
    }

    onImported(parsed.data);
  };

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    setStatus("extracting");

    try {
      if (file.name.toLowerCase().endsWith(".json")) {
        await importJson(file);
        return;
      }

      // pdf.js is ~1 MB, so it is only fetched when a PDF is actually imported.
      const { extractTextFromFile } = await import("../utils/document-parser");
      const extracted = await extractTextFromFile(file);
      if (extracted.trim().length < MIN_TEXT_LENGTH) {
        throw new Error(
          "That file contains almost no readable text. Try a different file or paste the resume text.",
        );
      }
      setText(extracted);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not read that file.");
    } finally {
      setStatus("idle");
    }
  };

  const handleParse = async () => {
    setError(null);

    if (text.trim().length < MIN_TEXT_LENGTH) {
      setError("Paste a little more resume text before importing.");
      return;
    }

    setStatus("parsing");
    try {
      onImported(await parseResumeText(text));
    } catch (err: unknown) {
      setError(
        err instanceof ParseResumeError || err instanceof Error
          ? err.message
          : "The resume could not be parsed.",
      );
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Import Resume
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload a file or paste text — every section is filled in for you.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4 overflow-y-auto">
          {/* Drop zone */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const file = event.dataTransfer.files?.[0];
              if (file && !isBusy) void handleFile(file);
            }}
            disabled={isBusy}
            className={`w-full rounded-2xl border-2 border-dashed px-4 py-6 text-center transition cursor-pointer disabled:cursor-not-allowed ${
              isDragging
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-950/40"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_RESUME_FILES}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void handleFile(file);
              }}
            />

            <div className="flex flex-col items-center gap-1.5">
              {status === "extracting" ? (
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-indigo-500" />
              )}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {status === "extracting"
                  ? "Reading file..."
                  : "Drop your resume here or click to browse"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                PDF, TXT, MD or an exported resume JSON
              </span>
              {fileName && (
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 max-w-full">
                  <FileText className="w-3 h-3 shrink-0" />
                  <span className="truncate">{fileName}</span>
                </span>
              )}
            </div>
          </button>

          {/* Pasted text */}
          <div className="space-y-1.5">
            <label
              htmlFor="import-resume-text"
              className="text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              ...or paste the resume text
            </label>
            <textarea
              id="import-resume-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={isBusy}
              rows={7}
              placeholder="Paste your full resume here. Keep the section headings — name, contact details, summary, skills, experience, projects, education, certifications."
              className="w-full resize-y rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 text-xs leading-relaxed text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 disabled:opacity-60"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/40 px-3 py-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            disabled={isBusy}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleParse()}
            disabled={isBusy || text.trim().length < MIN_TEXT_LENGTH}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "parsing" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {status === "parsing" ? "Extracting..." : "Extract sections"}
          </button>
        </div>
      </div>
    </div>
  );
};
