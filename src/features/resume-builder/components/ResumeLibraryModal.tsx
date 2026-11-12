import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Clock,
  FilePlus2,
  FolderOpen,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import type { SavedResume } from "../storage/resume-library";
import { formatSavedAt, suggestVersionName } from "../storage/resume-library";

interface ResumeLibraryModalProps {
  versions: SavedResume[];
  activeId: string | null;
  currentTitle: string;
  storageAvailable: boolean;
  onClose: () => void;
  onOpen: (id: string) => void;
  onSaveAsNew: (name: string) => void;
  onCreateBlank: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const ResumeLibraryModal: React.FC<ResumeLibraryModalProps> = ({
  versions,
  activeId,
  currentTitle,
  storageAvailable,
  onClose,
  onOpen,
  onSaveAsNew,
  onCreateBlank,
  onRename,
  onDelete,
}) => {
  const [isSavingNew, setIsSavingNew] = useState<boolean>(false);
  const [draftName, setDraftName] = useState<string>("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const startSavingNew = () => {
    setDraftName(suggestVersionName(currentTitle));
    setIsSavingNew(true);
    setRenamingId(null);
    setConfirmDeleteId(null);
  };

  const submitNewVersion = () => {
    if (!draftName.trim()) return;
    onSaveAsNew(draftName);
    setIsSavingNew(false);
  };

  const startRename = (version: SavedResume) => {
    setRenamingId(version.id);
    setRenameDraft(version.resume.title || "Untitled Resume");
    setConfirmDeleteId(null);
    setIsSavingNew(false);
  };

  const submitRename = () => {
    if (!renamingId || !renameDraft.trim()) return;
    onRename(renamingId, renameDraft);
    setRenamingId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-library-title"
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="resume-library-title"
                className="text-base font-extrabold text-slate-900 dark:text-white leading-tight"
              >
                My Resumes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Saved in this browser. Switch between versions any time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!storageAvailable && (
          <div className="mx-5 mb-3 flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-3 py-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">
              This browser is blocking local storage (private mode or a site
              setting), so versions cannot be saved.
            </p>
          </div>
        )}

        <div className="px-5 pb-5 space-y-3 overflow-y-auto">
          {/* Save current as a new version */}
          {isSavingNew ? (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/30 p-3 space-y-2">
              <label
                htmlFor="new-version-name"
                className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300"
              >
                Name this version
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="new-version-name"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitNewVersion();
                  }}
                  autoFocus
                  className="flex-1 min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
                />
                <button
                  onClick={submitNewVersion}
                  disabled={!draftName.trim()}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsSavingNew(false)}
                  className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={startSavingNew}
              className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 px-3 py-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Save current as new version
            </button>
          )}

          {/* Version list */}
          {versions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 px-4 py-8 text-center space-y-1">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                No saved resumes yet
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Save the one you are editing to start a library.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {versions.map((version) => {
                const isActive = version.id === activeId;
                const isRenaming = version.id === renamingId;
                const isConfirmingDelete = version.id === confirmDeleteId;

                return (
                  <li
                    key={version.id}
                    className={`rounded-2xl border transition ${
                      isActive
                        ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/30"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 p-2 pl-3">
                      {isRenaming ? (
                        <div className="flex flex-1 items-center gap-1.5 min-w-0">
                          <input
                            value={renameDraft}
                            onChange={(event) => setRenameDraft(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") submitRename();
                              if (event.key === "Escape") setRenamingId(null);
                            }}
                            autoFocus
                            className="flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
                          />
                          <button
                            onClick={submitRename}
                            disabled={!renameDraft.trim()}
                            className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition cursor-pointer disabled:opacity-40"
                            title="Save name"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRenamingId(null)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : isConfirmingDelete ? (
                        <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                            Delete “{version.resume.title || "Untitled Resume"}”?
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                onDelete(version.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => onOpen(version.id)}
                            disabled={isActive}
                            className="flex-1 min-w-0 text-left disabled:cursor-default group"
                            title={isActive ? "Currently open" : "Open this version"}
                          >
                            <span className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`truncate text-xs font-semibold ${
                                  isActive
                                    ? "text-indigo-700 dark:text-indigo-300"
                                    : "text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                }`}
                              >
                                {version.resume.title || "Untitled Resume"}
                              </span>
                              {isActive && (
                                <span className="shrink-0 inline-flex items-center gap-0.5 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                  <Check className="w-2.5 h-2.5" />
                                  Open
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                              <Clock className="w-2.5 h-2.5" />
                              Edited {formatSavedAt(version.updatedAt)}
                            </span>
                          </button>

                          <button
                            onClick={() => startRename(version)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Rename version"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDeleteId(version.id);
                              setRenamingId(null);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                            title="Delete version"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {activeId === null && (
            <p className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-3 h-3" />
              The editor is not backed by a saved version yet — save it to keep
              your changes.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={onCreateBlank}
            disabled={!storageAvailable}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            New blank resume
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeLibraryModal;
