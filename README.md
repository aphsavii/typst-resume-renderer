# Frontend — Resume Studio

Browser-side editor and Typst renderer for the resume model produced by `../backend`.

Live SVG preview, manual editing of every section, template switching, PDF export, and AI-powered import of an existing resume from a PDF/TXT/MD file or pasted text.

Resumes are stored **in the browser** (`localStorage`). You can keep several versions side by side, switch between them, rename them, and delete them — no account, no server storage.

## Run

The studio runs on its own for editing, but **Import Resume** needs the parser API:

```bash
# terminal 1 — repo root
npm run api            # http://localhost:5000

# terminal 2
npm run install:all    # first time only
npm run dev:frontend   # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:5000`. Set `VITE_API_BASE_URL` (see `.env.example`) only if the API lives on another origin.

```bash
npm run build    # type-check + production bundle
npm run lint
```

## How it works

- `hooks/useResumeBuilder.ts` holds the resume state and section mutators.
- `hooks/useResumeLibrary.ts` + `storage/resume-library.ts` persist the open resume as a version and keep the library in `localStorage`.
- `hooks/useTypstRender.ts` debounces edits and compiles SVG for the preview.
- `rendering/typst-compiler.ts` maps the selected template's `.typ` files plus the resume JSON into the Typst virtual filesystem, then renders.
- `components/ImportResumeModal.tsx` + `api/parse-resume-api.ts` + `utils/document-parser.ts` implement import:
  - `.json` → validated locally, no network call
  - `.pdf`/`.txt`/`.md` → text extraction (pdf.js, loaded on demand)
  - text → `POST /api/v1/resumes/parse` → sections autofilled

Resumes can also be loaded from `data/sample-resume.ts`, built from scratch, exported as JSON, or exported as PDF.

## Resume library

`Resumes` in the header opens `components/ResumeLibraryModal.tsx`.

- A version is a **full snapshot** of the resume; its name is the resume `title`, which the header title field also edits.
- The open version autosaves ~600 ms after the last edit. The header pill shows `Saved` / `Saving` / `Not saved`.
- **Save current as new version** duplicates the open resume and makes the copy active, so later edits never touch the original.
- **New blank resume** starts an empty version. Imports always arrive as a new version too.
- Switching, renaming or deleting flushes any edit still inside the debounce window, so keystrokes are never lost.
- Storage keys: `matchora.resumes.v1` (the versions) and `matchora.activeResume.v1` (last opened). Documents are re-validated with `ResumeSchema` on read, so fields added later get their defaults.
- If `localStorage` is unavailable (private mode), the modal says so and editing still works, just unsaved.

## Schema

`src/types/resume.ts` mirrors the backend Zod schemas exactly. Run `npm run check:schema` from the repo root after changing either side.
