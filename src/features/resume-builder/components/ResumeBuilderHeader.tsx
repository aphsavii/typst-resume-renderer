import React, { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileJson,
  FolderOpen,
  Loader2,
  RefreshCw,
  Sparkles,
  Upload,
  Edit3,
  MoreVertical,
  Layout,
} from "lucide-react";
import type { Resume } from "../../../types/resume";
import type { SaveStatus } from "../hooks/useResumeLibrary";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  resume: Resume;
  saveStatus: SaveStatus;
  onOpenLibrary: () => void;
  onNewDemoResume: () => void;
  onDownloadPdf: () => void;
  onOpenImport: () => void;
  onRename: (title: string) => void;
  onSelectTemplate?: (templateId: string) => void;
}

const TEMPLATES = [
  { id: "basic", name: "Classic Clean" },
  { id: "modern", name: "Modern Executive" },
];

const SAVE_STATUS_UI: Record<
  SaveStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  saved: {
    label: "Saved",
    className: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  saving: {
    label: "Saving",
    className: "text-slate-500 dark:text-slate-400",
    icon: Loader2,
  },
  unsaved: {
    label: "Not saved",
    className: "text-amber-600 dark:text-amber-400",
    icon: AlertCircle,
  },
  error: {
    label: "Save failed",
    className: "text-red-600 dark:text-red-400",
    icon: AlertCircle,
  },
};

export const ResumeBuilderHeader: React.FC<HeaderProps> = ({
  resume,
  saveStatus,
  onOpenLibrary,
  onNewDemoResume,
  onDownloadPdf,
  onOpenImport,
  onRename,
  onSelectTemplate,
}) => {
  const activeTemplate = resume.templateId || "basic";
  const statusUi = SAVE_STATUS_UI[saveStatus];
  const StatusIcon = statusUi.icon;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [draftTitle, setDraftTitle] = useState<string>(resume.title || "Untitled Resume");

  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraftTitle(resume.title || "Untitled Resume");
  }, [resume.title]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitTitle = () => {
    const next = draftTitle.trim() || "Untitled Resume";
    setDraftTitle(next);
    setIsEditingTitle(false);
    if (next !== resume.title) onRename(next);
  };

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${draftTitle.replace(/\s+/g, "_") || "resume"}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-2 sm:px-6 py-2 sticky top-0 z-50 flex items-center justify-between gap-1.5 sm:gap-3 shadow-xs transition-colors overflow-visible">
      {/* Left: Brand & Editable Resume Title */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-1.5 rounded-xl text-white shadow-md shadow-indigo-500/20 shrink-0">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 truncate">
            Matchora
          </span>

          <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
            {isEditingTitle ? (
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => e.key === "Enter" && commitTitle()}
                autoFocus
                className="text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-indigo-400 rounded-md px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-indigo-500 max-w-[100px] xs:max-w-[140px] sm:max-w-[200px]"
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition group cursor-pointer min-w-0"
                title="Click to rename resume"
              >
                <span className="truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[180px]">
                  {draftTitle}
                </span>
                <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition shrink-0" />
              </button>
            )}

            {/* Autosave indicator */}
            <span
              className={`flex items-center gap-1 text-[10px] font-medium shrink-0 ${statusUi.className}`}
              title={
                saveStatus === "saved"
                  ? "All changes are saved in this browser"
                  : saveStatus === "saving"
                    ? "Saving your changes..."
                    : saveStatus === "error"
                      ? "This browser refused the save — check storage settings"
                      : "Save this resume to keep your changes"
              }
            >
              <StatusIcon
                className={`w-3 h-3 ${saveStatus === "saving" ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">{statusUi.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Action Buttons Cluster */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Template Selector Dropdown */}
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 shrink-0">
          <Layout className="w-3.5 h-3.5 text-indigo-500 ml-1 hidden md:block shrink-0" />
          <select
            value={activeTemplate}
            onChange={(e) => onSelectTemplate && onSelectTemplate(e.target.value)}
            className="text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-200 border-none outline-none py-1 px-1.5 cursor-pointer focus:ring-0"
            title="Switch Resume Typst Template"
          >
            {TEMPLATES.map((tmpl) => (
              <option
                key={tmpl.id}
                value={tmpl.id}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {tmpl.name}
              </option>
            ))}
          </select>
        </div>

        {/* Saved resumes */}
        <button
          onClick={onOpenLibrary}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0"
          title="Open your saved resumes"
        >
          <FolderOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden lg:inline">Resumes</span>
        </button>

        {/* Import Resume */}
        <button
          onClick={onOpenImport}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0"
          title="Import a resume file or pasted text"
        >
          <Upload className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">Import</span>
        </button>

        {/* Export PDF */}
        <button
          onClick={onDownloadPdf}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition cursor-pointer shrink-0"
          title="Export PDF Document"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>

        <ThemeToggle />

        {/* More Options Dropdown Menu */}
        <div className="relative shrink-0" ref={moreMenuRef}>
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Mobile-only Template Switcher */}
              <div className="sm:hidden px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Select Template
                </p>
                <select
                  value={activeTemplate}
                  onChange={(e) => {
                    if (onSelectTemplate) onSelectTemplate(e.target.value);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 px-2"
                >
                  {TEMPLATES.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  onNewDemoResume();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                <span>New demo resume</span>
              </button>

              <button
                onClick={() => {
                  handleExportJson();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5 text-slate-500" />
                <span>Export JSON</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
