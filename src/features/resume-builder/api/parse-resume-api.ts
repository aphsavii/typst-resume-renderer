import { ResumeSchema, type Resume } from "../../../types/resume";

/**
 * Empty by default so the browser talks to the same origin and Vite's dev
 * proxy forwards `/api` to the backend. Set `VITE_API_BASE_URL` when the API
 * is served from a different host.
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export class ParseResumeError extends Error {}

export async function parseResumeText(resumeText: string): Promise<Resume> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/v1/resumes/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: resumeText }),
    });
  } catch {
    throw new ParseResumeError(
      "Could not reach the resume API. Start it with `npm run api` in the backend.",
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error: unknown }).error)
        : `Resume parsing failed (${response.status}).`;
    throw new ParseResumeError(message);
  }

  if (!payload || typeof payload !== "object" || !("resume" in payload)) {
    throw new ParseResumeError("The resume API returned an unexpected response.");
  }

  // Validate at the boundary: the API is untrusted input as far as the
  // browser is concerned, and this applies every schema default.
  const parsed = ResumeSchema.safeParse((payload as { resume: unknown }).resume);

  if (!parsed.success) {
    throw new ParseResumeError(
      "The resume API returned a document that does not match the resume schema.",
    );
  }

  return parsed.data;
}
