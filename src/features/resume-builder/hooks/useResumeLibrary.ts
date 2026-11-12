import { useCallback, useEffect, useRef, useState } from "react";

import type { Resume } from "../../../types/resume";
import { EMPTY_RESUME, SAMPLE_RESUME } from "../data/sample-resume";
import {
  createVersion,
  hasStoredLibrary,
  isStorageAvailable,
  readActiveId,
  readLibrary,
  sortByRecency,
  writeActiveId,
  writeLibrary,
  uniqueVersionTitle,
  type SavedResume,
} from "../storage/resume-library";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

const AUTOSAVE_DELAY_MS = 600;

export interface ResumeLibraryBoot {
  versions: SavedResume[];
  activeId: string | null;
  initialResume: Resume | null;
}

/**
 * Synchronous read of the stored library, used to seed the first render so a
 * reload lands on the document the user was last editing without a flash.
 *
 * On a genuinely first visit the sample resume is written as version 1, so the
 * app starts as a documents app rather than an unsaved scratch pad.
 */
export function loadResumeLibrary(): ResumeLibraryBoot {
  const versions = readLibrary();

  if (versions.length === 0 && !hasStoredLibrary()) {
    const seeded = createVersion(SAMPLE_RESUME);
    if (writeLibrary([seeded])) {
      writeActiveId(seeded.id);
      return { versions: [seeded], activeId: seeded.id, initialResume: seeded.resume };
    }
  }

  const storedActiveId = readActiveId();
  const active =
    versions.find((version) => version.id === storedActiveId) ?? versions[0] ?? null;

  if (!active) {
    return { versions, activeId: null, initialResume: null };
  }

  if (active.id !== storedActiveId) writeActiveId(active.id);

  return { versions, activeId: active.id, initialResume: active.resume };
}

export function useResumeLibrary(
  boot: ResumeLibraryBoot,
  resume: Resume,
  replaceResume: (resume: Resume) => void,
) {
  const [versions, setVersions] = useState<SavedResume[]>(boot.versions);
  const [activeId, setActiveId] = useState<string | null>(boot.activeId);
  const [status, setStatus] = useState<SaveStatus>(
    boot.activeId ? "saved" : "unsaved",
  );
  const [storageAvailable] = useState<boolean>(() => isStorageAvailable());

  // Mirrors `versions` for callbacks and the autosave timer, which must not
  // re-subscribe on every save.
  const versionsRef = useRef<SavedResume[]>(boot.versions);

  // Serialized content that is currently persisted for the open document.
  // Saving is skipped while the editor still matches it, so loading, opening
  // or renaming a version does not fabricate an "edited" timestamp.
  const savedContentRef = useRef<string>(
    boot.initialResume ? JSON.stringify(boot.initialResume) : "",
  );

  useEffect(() => {
    versionsRef.current = versions;
  }, [versions]);

  /** Writes `content` into version `targetId` and records it as the saved state. */
  const writeVersion = useCallback((targetId: string, content: Resume): boolean => {
    const next = versionsRef.current.map((version) =>
      version.id === targetId
        ? { ...version, resume: content, updatedAt: Date.now() }
        : version,
    );

    if (!writeLibrary(next)) {
      setStatus("error");
      return false;
    }

    versionsRef.current = next;
    setVersions(next);
    savedContentRef.current = JSON.stringify(content);
    return true;
  }, []);

  // Autosave the open document. Debounced so typing does not hit storage on
  // every keystroke.
  useEffect(() => {
    if (!activeId) {
      setStatus("unsaved");
      return;
    }

    const serialized = JSON.stringify(resume);
    if (serialized === savedContentRef.current) return;

    setStatus("saving");
    const timer = setTimeout(() => {
      if (writeVersion(activeId, resume)) setStatus("saved");
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [resume, activeId, writeVersion]);

  /**
   * Persist an edit that is still inside the debounce window, so switching or
   * duplicating a version can never drop the last keystrokes.
   */
  const flushPendingEdit = useCallback(() => {
    if (!activeId) return;
    if (JSON.stringify(resume) === savedContentRef.current) return;
    writeVersion(activeId, resume);
  }, [activeId, resume, writeVersion]);

  const openVersion = useCallback(
    (id: string) => {
      flushPendingEdit();

      const version = versionsRef.current.find((item) => item.id === id);
      if (!version) return;

      savedContentRef.current = JSON.stringify(version.resume);
      setActiveId(id);
      writeActiveId(id);
      replaceResume(version.resume);
      setStatus("saved");
    },
    [flushPendingEdit, replaceResume],
  );

  const addVersion = useCallback(
    (nextResume: Resume): boolean => {
      flushPendingEdit();

      const stored: Resume = {
        ...nextResume,
        title: uniqueVersionTitle(nextResume.title, versionsRef.current),
      };
      const version = createVersion(stored);
      const next = sortByRecency([version, ...versionsRef.current]);

      if (!writeLibrary(next)) {
        setStatus("error");
        return false;
      }

      versionsRef.current = next;
      setVersions(next);
      setActiveId(version.id);
      writeActiveId(version.id);
      savedContentRef.current = JSON.stringify(stored);
      replaceResume(stored);
      setStatus("saved");
      return true;
    },
    [flushPendingEdit, replaceResume],
  );

  /** Snapshot the open resume under a new name; later edits only touch the copy. */
  const saveAsNewVersion = useCallback(
    (name: string) =>
      addVersion({
        ...resume,
        title: name.trim() || resume.title || "Untitled Resume",
      }),
    [addVersion, resume],
  );

  const createBlankResume = useCallback(
    () =>
      addVersion({
        ...EMPTY_RESUME,
        sectionOrder: EMPTY_RESUME.sectionOrder ? [...EMPTY_RESUME.sectionOrder] : [],
      }),
    [addVersion],
  );

  const renameVersion = useCallback(
    (id: string, name: string) => {
      const title = name.trim() || "Untitled Resume";

      // The open document is renamed through the editor state so the change is
      // autosaved like any other edit.
      if (id === activeId) {
        replaceResume({ ...resume, title });
        return;
      }

      const next = versionsRef.current.map((version) =>
        version.id === id
          ? {
              ...version,
              updatedAt: Date.now(),
              resume: { ...version.resume, title },
            }
          : version,
      );

      if (!writeLibrary(next)) {
        setStatus("error");
        return;
      }

      versionsRef.current = next;
      setVersions(next);
    },
    [activeId, replaceResume, resume],
  );

  const deleteVersion = useCallback(
    (id: string) => {
      // Keep the open document's in-flight keystrokes when another version is removed.
      if (id !== activeId) flushPendingEdit();

      const next = versionsRef.current.filter((version) => version.id !== id);

      if (!writeLibrary(next)) {
        setStatus("error");
        return;
      }

      versionsRef.current = next;
      setVersions(next);

      if (id !== activeId) return;

      const fallback = next[0];

      if (!fallback) {
        setActiveId(null);
        writeActiveId(null);
        savedContentRef.current = "";
        replaceResume(EMPTY_RESUME);
        setStatus("unsaved");
        return;
      }

      savedContentRef.current = JSON.stringify(fallback.resume);
      setActiveId(fallback.id);
      writeActiveId(fallback.id);
      replaceResume(fallback.resume);
      setStatus("saved");
    },
    [activeId, flushPendingEdit, replaceResume],
  );

  return {
    versions,
    activeId,
    status,
    storageAvailable,
    openVersion,
    saveVersion: addVersion,
    saveAsNewVersion,
    createBlankResume,
    renameVersion,
    deleteVersion,
  };
}
