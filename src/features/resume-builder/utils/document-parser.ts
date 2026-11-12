import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extracts plain text from an uploaded resume so it can be handed to the
 * parsing API. PDFs are read with pdf.js; plain text formats are read directly.
 * `.docx` is deliberately rejected: it is a ZIP archive, and raw extraction
 * produces garbage that degrades the model's output.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "pdf") {
    return extractTextFromPdf(file);
  }

  if (extension === "txt" || extension === "md" || extension === "json") {
    return sanitizeText(await file.text());
  }

  throw new Error(
    "Unsupported file type. Upload a PDF, TXT, MD, or JSON file — export Word documents to PDF first.",
  );
}

async function extractTextFromPdf(file: File): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  });

  try {
    const pdfDoc = await loadingTask.promise;

    let fullText = "";

    for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
      const page = await pdfDoc.getPage(pageNumber);
      const textContent = await page.getTextContent();

      let pageText = "";
      let lastY: number | null = null;

      for (const item of textContent.items) {
        if (!("str" in item) || !item.str) continue;

        const currentY = item.transform[5];
        const hasY = typeof currentY === "number";

        if (lastY !== null && hasY) {
          const yDiff = Math.abs(lastY - currentY);

          if (yDiff > 12) {
            // Distinct section gap or paragraph break
            if (!pageText.endsWith("\n\n")) pageText += "\n\n";
          } else if (yDiff > 4) {
            // New line within a section
            if (!pageText.endsWith("\n")) pageText += "\n";
          } else if (
            !pageText.endsWith(" ") &&
            !pageText.endsWith("\n") &&
            !item.str.startsWith(" ")
          ) {
            pageText += " ";
          }
        }

        pageText += item.str;

        if (item.hasEOL && !pageText.endsWith("\n")) pageText += "\n";
        if (hasY) lastY = currentY;
      }

      fullText += pageText + "\n\n";
    }

    const sanitized = sanitizeText(fullText);

    if (!sanitized) {
      throw new Error(
        "No readable text found in this PDF. It may be a scanned image — paste the text instead.",
      );
    }

    return sanitized;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to read the PDF.";
    throw new Error(message);
  } finally {
    await loadingTask.destroy();
  }
}

function sanitizeText(text: string): string {
  return (
    text
      // Remove binary non-printable control characters
      // eslint-disable-next-line no-control-regex -- stripping them is the point
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
      // Normalize spaces on each line while preserving line breaks
      .split("\n")
      .map((line) => line.replace(/[ \t]+/g, " ").trim())
      .join("\n")
      // Collapse runs of blank lines
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
