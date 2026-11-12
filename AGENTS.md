# Frontend Development Guide

## Purpose

This package is the **Resume Studio**: a browser-side editor and Typst renderer for the resume model produced by the backend engine.

All editing, previewing, PDF export and resume storage happen locally in the browser. The only server interaction is resume *import*: a file or pasted text is sent to the backend parser, which returns structured sections.

Resumes live in `localStorage` as a library of versions. There is no account, no cloud sync, and no backend persistence — do not add any.

## Structure

```text
src/
  app/providers/        # ThemeProvider, ThemeContext, useTheme
  features/resume-builder/
    api/                # parse-resume-api.ts (the only network call)
    components/         # Header, editor, preview, library + import modals
    data/               # Sample resume seed
    hooks/              # useResumeBuilder (state), useResumeLibrary (versions, autosave), useTypstRender (compilation)
    rendering/
      typst-compiler.ts # WASM init, virtual filesystem, SVG/PDF output
      templates/        # basic/ and modern/ Typst templates
    storage/            # resume-library.ts (localStorage read/write + helpers)
    utils/              # document-parser.ts (file → plain text)
  pages/                # ResumeBuilderPage only
  types/                # Zod-backed resume schema
  index.css             # Tailwind entry + tokens
```

Add a directory only when a feature needs it.

## Architecture rules

- **One network call.** Only `features/resume-builder/api/parse-resume-api.ts` may use `fetch`. It talks to `POST /api/v1/resumes/parse`. Do not add other endpoints or client SDKs.
- **Pages stay thin.** `ResumeBuilderPage` composes components and owns layout state; it does not hold resume logic.
- **State lives in `useResumeBuilder`.** Section updates are immutable spreads. Do not duplicate resume data in component state.
- **Persistence stays in `storage/resume-library.ts`.** All `localStorage` access is wrapped there and returns `false`/`[]` on failure instead of throwing; components never touch `localStorage` directly. Stored documents are re-validated with `ResumeSchema` on read so older entries gain new defaults (and corrupt ones are dropped).
- **Rendering is single-instance.** The Typst WASM compiler is shared, so every compile must go through `runWithTypstLock`.
- **Template parity.** `rendering/templates/{basic,modern}` are byte-identical to `backend/core/domains/resume/rendering/templates/{basic,modern}`. A template change must be applied to both, or browser output will diverge from CLI PDF output.
- **Validate untrusted input.** Anything imported (JSON, PDF text, API response) must pass `ResumeSchema.safeParse` before it enters state.
- **Do not ship large parsers eagerly.** `pdf.js` is loaded with a dynamic `import()` inside the import modal so it stays out of the initial bundle.

## Local resume library

`useResumeLibrary(boot, resume, setFullResume)` owns the version list, the open
version id, and the save status.

1. `loadResumeLibrary()` reads storage **synchronously** before the first render,
   so a reload opens the last edited document without a flash. A first visit
   seeds one version from `SAMPLE_RESUME`.
2. The open version autosaves 600 ms after the last change. Each version is a
   full snapshot, so editing one never touches the others.
3. A save is skipped when the editor content still matches what is stored, so
   loading or switching versions does not fabricate an edit timestamp.
4. `openVersion` / `saveAsNewVersion` / `deleteVersion` flush a pending edit
   first. Without that, switching inside the debounce window would drop the
   last keystrokes.
5. Deleting the last version leaves the editor unsaved (`activeId === null`,
   status `unsaved`) rather than re-seeding; saving it creates a version again.

Keys: `matchora.resumes.v1`, `matchora.activeResume.v1`.

## Import flow

`ImportResumeModal` is the single entry point (header → **Import**):

1. `.json` → parsed and validated locally, no network call.
2. `.pdf` / `.txt` / `.md` → `utils/document-parser.ts` extracts text (pdf.js for PDFs).
3. Text (extracted or pasted) → `parseResumeText()` → response re-validated → added as a **new version** via `saveVersion()`.

## TypeScript and React

- Strict TypeScript. Avoid `any`; narrow `unknown` instead.
- Named exports for components, hooks, and helpers. Only page modules may default-export.
- The resume type is inferred from Zod schemas in `types/resume.ts`. Never hand-write a parallel interface.
- Do not store derived data in state; compute it during render — **except** free-text fields over a `string[]` (skills, technologies). Those must use `CommaSeparatedInput`, which keeps the typed text locally. Binding `<input value={items.join(", ")}>` and re-splitting on change normalises the text under the caret: typed spaces vanish and edits in the middle jump to the end.
- Bullet lists (experience, projects, leadership) are edited with `BulletListEditor`. Pasting several lines into one bullet is split by `utils/bullets.ts` into one bullet per line — bullet glyphs and blank lines are stripped — while a single-line paste keeps the native behaviour.

## Adding a new resume section

1. Add the Zod schema and field in `frontend/src/types/resume.ts`.
2. Mirror it in `backend/core/domains/resume/schemas/resume/`.
3. Run `npm run check:schema` from the repo root.
4. Add editor UI in `ResumeEditor.tsx` and an entry to the section order list.
5. Add a `sections/<name>.typ` file to **both** template directories and import it in `typst-compiler.ts`.
6. Add the section to `parse-resume.prompt.md` so imports populate it.

## Styling

- Tailwind utilities only; global CSS is limited to tokens, resets, and base typography.
- Dark mode is class-based (`dark:`), driven by `ThemeProvider`.
- Mobile-first. Below `lg`, the studio switches between an editor panel and a preview panel via the floating bar.

## Quality bar

- `npm run build` must pass (it type-checks before bundling).
- `npm run lint` must be clean.
- Do not commit `dist/`, `node_modules/`, `.env`, or generated artifacts.
