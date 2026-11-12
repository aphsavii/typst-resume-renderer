import React, { useState, useEffect, useRef, useMemo } from "react";
import { ZoomIn, ZoomOut, Loader2, AlertCircle, ArrowLeft, Smartphone, FileText } from "lucide-react";

interface PreviewProps {
  svgOutput: string;
  isLoading: boolean;
  error: string | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  /** Re-runs the compile; only surfaced in the error state. */
  onRetry: () => void;
  onSwitchToEditor?: () => void;
}

export const ResumePreview: React.FC<PreviewProps> = ({
  svgOutput,
  isLoading,
  error,
  zoom,
  onZoomIn,
  onZoomOut,
  onRetry,
  onSwitchToEditor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoFitZoom, setAutoFitZoom] = useState<number | null>(null);
  const [isFitMode, setIsFitMode] = useState<boolean>(true);

  // Parse SVG to detect multipage documents and inject visual Page Break indicators
  const { enhancedSvg, pageCount } = useMemo(() => {
    if (!svgOutput) return { enhancedSvg: "", pageCount: 0 };

    const pageRegex = /<g[^>]*class="[^"]*typst-page[^"]*"[^>]*>/gi;
    const matches = [...svgOutput.matchAll(pageRegex)];
    const count = Math.max(matches.length, 1);

    if (count <= 1) {
      return { enhancedSvg: svgOutput, pageCount: 1 };
    }

    const viewBoxMatch = svgOutput.match(/viewBox="0\s+0\s+([\d.]+)\s+([\d.]+)"/i);
    const totalHeight = viewBoxMatch ? parseFloat(viewBoxMatch[2]) : 841.89 * count;
    const pageHeight = totalHeight / count;
    const pageWidth = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 595.276;

    let pageBreakElements = "";

    for (let i = 1; i < count; i++) {
      const yPos = pageHeight * i;
      pageBreakElements += `
        <g class="matchora-page-break" transform="translate(0, ${yPos})">
          <line x1="0" y1="0" x2="${pageWidth}" y2="0" stroke="#6366f1" stroke-width="2.5" stroke-dasharray="6,4" opacity="0.95" />
          <rect x="${pageWidth / 2 - 75}" y="-13" width="150" height="26" rx="13" fill="#4f46e5" />
          <text x="${pageWidth / 2}" y="4" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" letter-spacing="0.5">
            ✂ PAGE BREAK (${i} / ${count})
          </text>
        </g>
      `;
    }

    const closingSvgIndex = svgOutput.lastIndexOf("</svg>");
    if (closingSvgIndex !== -1) {
      const result = svgOutput.slice(0, closingSvgIndex) + pageBreakElements + svgOutput.slice(closingSvgIndex);
      return { enhancedSvg: result, pageCount: count };
    }

    return { enhancedSvg: svgOutput, pageCount: count };
  }, [svgOutput]);

  // Fit the page to the panel. A ResizeObserver (rather than window resize)
  // also covers the mobile editor/preview switch, where the panel is hidden
  // at mount time and only gets a width once it is shown.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateFitZoom = () => {
      const padding = window.innerWidth < 640 ? 24 : 48;
      const availableWidth = element.clientWidth - padding;
      const docWidthPx = 595.276 * (96 / 72); // ~793.7px standard A4 page width

      if (availableWidth <= 0) return;

      const calculatedZoom = Math.floor((availableWidth / docWidthPx) * 100);
      setAutoFitZoom(Math.min(Math.max(calculatedZoom, 35), 200));
    };

    updateFitZoom();
    const observer = new ResizeObserver(updateFitZoom);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Fit mode fills the panel on every breakpoint; manual zoom wins once used.
  const effectiveZoom = isFitMode && autoFitZoom ? autoFitZoom : zoom;

  const handleToggleFitMode = () => {
    setIsFitMode(!isFitMode);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden relative transition-colors">
      {/* Top Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm z-10 gap-2 transition-colors">
        <div className="flex items-center gap-2">
          {onSwitchToEditor && (
            <button
              onClick={onSwitchToEditor}
              className="lg:hidden px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition flex items-center gap-1 text-xs font-medium border border-indigo-200 dark:border-indigo-800/60"
              title="Back to Form Editor"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px] sm:max-w-none">
            Document Preview
          </span>

          {/* Multipage Badge */}
          {pageCount > 1 && (
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1">
              <FileText className="w-3 h-3 text-indigo-500" />
              {pageCount} Pages
            </span>
          )}

          {isLoading && (
            <span className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              <Loader2 className="w-3 h-3 animate-spin" />
              Rendering...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Fit page width to the panel */}
          <button
            onClick={handleToggleFitMode}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
              isFitMode
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
            title="Fit the page to the panel width"
            aria-pressed={isFitMode}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit Width</span>
          </button>

          <button
            onClick={() => {
              setIsFitMode(false);
              onZoomOut();
            }}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono w-10 text-center">
            {effectiveZoom}%
          </span>
          <button
            onClick={() => {
              setIsFitMode(false);
              onZoomIn();
            }}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Render Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto p-3 sm:p-6 bg-slate-100/80 dark:bg-slate-950/80 pb-24 lg:pb-6 transition-colors"
      >
        <div className="min-h-full w-full flex items-start justify-center">
          {error ? (
            <div className="max-w-md my-auto p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-800 dark:text-red-200 space-y-2 shadow-md">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                Document Rendering Warning
              </div>
              <p className="text-xs text-red-700 dark:text-red-300/90 leading-relaxed font-mono">{error}</p>
              <button
                onClick={onRetry}
                className="text-xs bg-red-600 hover:bg-red-700 dark:bg-red-800/40 dark:hover:bg-red-800/60 px-3 py-1 rounded-md text-white mt-2 transition cursor-pointer"
              >
                Retry Render
              </button>
            </div>
          ) : enhancedSvg ? (
            <div
              className="bg-white rounded-md shadow-2xl transition-all duration-150 border border-slate-300 dark:border-slate-700/50 shrink-0 [&>svg]:w-full [&>svg]:h-auto [&>svg]:block [&>svg]:max-w-full"
              style={{
                width: `${(effectiveZoom / 100) * (595.276 * (96 / 72))}px`,
                maxWidth: "100%",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
              }}
              dangerouslySetInnerHTML={{ __html: enhancedSvg }}
            />
          ) : (
            <div className="my-auto text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Rendering Matchora document...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
