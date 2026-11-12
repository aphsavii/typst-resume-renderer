import { useState, useEffect, useCallback } from "react";
import type { Resume } from "../../../types/resume";
import { renderResumeToSvg, renderResumeToPdf } from "../rendering/typst-compiler";

export function useTypstRender(resume: Resume) {
  const [svgOutput, setSvgOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);

  const renderSvg = useCallback(async (data: Resume) => {
    setIsLoading(true);
    setError(null);
    try {
      const svg = await renderResumeToSvg(data);
      setSvgOutput(svg);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to compile Typst document";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      renderSvg(resume);
    }, 300);

    return () => clearTimeout(timer);
  }, [resume, renderSvg]);

  const downloadPdf = useCallback(async (filename = "resume.pdf") => {
    try {
      const pdfBytes = await renderResumeToPdf(resume);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error("PDF Download failed:", err);
      alert("Failed to generate PDF. Please check your data input.");
    }
  }, [resume]);

  const zoomIn = () => setZoom((z) => Math.min(z + 15, 200));
  const zoomOut = () => setZoom((z) => Math.max(z - 15, 50));

  return {
    svgOutput,
    isLoading,
    error,
    zoom,
    zoomIn,
    zoomOut,
    downloadPdf,
    refresh: () => renderSvg(resume),
  };
}
