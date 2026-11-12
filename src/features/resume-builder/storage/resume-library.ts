import { ResumeSchema, type Resume } from "../../../types/resume";

/**
 * Browser-local resume library.
 *
 * Everything lives in `localStorage`: no account, no server. Each entry is a
 * full resume snapshot, so saving a "version" never mutates the others.
 * Stored documents are re-validated with `ResumeSchema` on read, which also
 * applies defaults for fields added after the document was saved.
 */

const LIBRARY_KEY = "matchora.resumes.v1";
const ACTIVE_KEY = "matchora.activeResume.v1";
const PROBE_KEY = "matchora.storage-probe";

export interface SavedResume {
  id: string;
  createdAt: number;
  updatedAt: number;
  resume: Resume;
}

function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isStorageAvailable(): boolean {
  try {
    window.localStorage.setItem(PROBE_KEY, "1");
    window.localStorage.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function sortByRecency(versions: SavedResume[]): SavedResume[] {
  return [...versions].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function readLibrary(): SavedResume[] {
  let raw: string | null = null;

  try {
    raw = window.localStorage.getItem(LIBRARY_KEY);
  } catch {
    return [];
  }

  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const versions: SavedResume[] = [];

  for (const entry of parsed) {
    if (!entry || typeof entry !== "object") continue;

    const { id, createdAt, updatedAt, resume } = entry as Record<string, unknown>;
    if (
      typeof id !== "string" ||
      typeof createdAt !== "number" ||
      typeof updatedAt !== "number"
    ) {
      continue;
    }

    const validated = ResumeSchema.safeParse(resume);
    if (!validated.success) continue;

    versions.push({ id, createdAt, updatedAt, resume: validated.data });
  }

  return sortByRecency(versions);
}

/** Returns false when the write failed (private mode, quota, disabled storage). */
export function writeLibrary(versions: SavedResume[]): boolean {
  try {
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(versions));
    return true;
  } catch {
    return false;
  }
}

export function readActiveId(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function writeActiveId(id: string | null): void {
  try {
    if (id === null) window.localStorage.removeItem(ACTIVE_KEY);
    else window.localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // Non-fatal: the library itself still loads, only the "last opened" hint is lost.
  }
}

/** True once the library key exists, even if it holds an empty list. */
export function hasStoredLibrary(): boolean {
  try {
    return window.localStorage.getItem(LIBRARY_KEY) !== null;
  } catch {
    return true;
  }
}

export function createVersion(resume: Resume, now: number = Date.now()): SavedResume {
  return { id: createId(), createdAt: now, updatedAt: now, resume };
}

export function formatSavedAt(timestamp: number, now: number = Date.now()): string {
  const seconds = Math.round((now - timestamp) / 1000);

  if (seconds < 45) return "just now";

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  return new Date(timestamp).toLocaleDateString();
}

/** "Alex Morgan v2" → "Alex Morgan v3"; anything else → "<name> v2". */
export function suggestVersionName(title: string): string {
  const base = (title || "Untitled Resume").trim();
  const match = /^(.*?)\s+v(\d+)$/i.exec(base);

  if (match) return `${match[1]} v${Number(match[2]) + 1}`;

  return `${base} v2`;
}

/**
 * Keeps the library readable when several versions share a name: "Resume" →
 * "Resume (2)" → "Resume (3)". Only used when a version is created; renames stay
 * exactly as typed.
 */
export function uniqueVersionTitle(title: string, existing: SavedResume[]): string {
  const base = title.trim() || "Untitled Resume";
  const taken = new Set(existing.map((version) => version.resume.title));

  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base} (${suffix})`)) suffix += 1;

  return `${base} (${suffix})`;
}
