import React, { useState, useEffect } from "react";
import { useResumeBuilder } from "../features/resume-builder/hooks/useResumeBuilder";
import { useTypstRender } from "../features/resume-builder/hooks/useTypstRender";
import {
  loadResumeLibrary,
  useResumeLibrary,
} from "../features/resume-builder/hooks/useResumeLibrary";
import { ResumeBuilderHeader } from "../features/resume-builder/components/ResumeBuilderHeader";
import { ResumeEditor } from "../features/resume-builder/components/ResumeEditor";
import { ResumePreview } from "../features/resume-builder/components/ResumePreview";
import { ResumeLibraryModal } from "../features/resume-builder/components/ResumeLibraryModal";
import { ImportResumeModal } from "../features/resume-builder/components/ImportResumeModal";
import { SAMPLE_RESUME } from "../features/resume-builder/data/sample-resume";
import { Edit3, Eye, Monitor, Laptop, Smartphone, X } from "lucide-react";
import type { Resume } from "../types/resume";

export type MobileView = "editor" | "preview";

export const ResumeBuilderPage: React.FC = () => {
  const [mobileView, setMobileView] = useState<MobileView>("editor");
  const [showMobileNotice, setShowMobileNotice] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  // Read the stored library once, synchronously, so a reload opens the last
  // document the user was editing instead of flashing the sample.
  const [libraryBoot] = useState(() => loadResumeLibrary());

  const {
    resume,
    activeTab,
    setActiveTab,
    updatePersonal,
    updateTitle,
    updateSummary,
    updateSkills,
    updateTemplateId,
    updateExperience,
    updateProjects,
    updateEducation,
    updateCertifications,
    updateAchievements,
    updateLeadership,
    updatePublications,
    updateCustomSections,
    moveSectionUp,
    moveSectionDown,
    setFullResume,
  } = useResumeBuilder(libraryBoot.initialResume ?? SAMPLE_RESUME);

  const library = useResumeLibrary(libraryBoot, resume, setFullResume);

  useEffect(() => {
    // Check if on a mobile screen (< 768px) and notice hasn't been dismissed in this session
    const isMobile = window.innerWidth < 768;
    const hasDismissed = sessionStorage.getItem("matchora_mobile_notice_dismissed");
    if (isMobile && !hasDismissed) {
      setShowMobileNotice(true);
    }
  }, []);

  const handleDismissMobileNotice = () => {
    sessionStorage.setItem("matchora_mobile_notice_dismissed", "true");
    setShowMobileNotice(false);
  };

  const {
    svgOutput,
    isLoading,
    error,
    zoom,
    zoomIn,
    zoomOut,
    refresh,
    downloadPdf,
  } = useTypstRender(resume);

  const handleImported = (imported: Resume) => {
    // Imports always land as their own version, so the resume that was open
    // is never overwritten by the autosave.
    library.saveVersion(imported);
    setActiveTab("personal");
    setMobileView("editor");
    setIsImportOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased relative transition-colors">
      {/* Top Navigation / Action Bar */}
      <ResumeBuilderHeader
        resume={resume}
        saveStatus={library.status}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onNewDemoResume={() => library.saveVersion(SAMPLE_RESUME)}
        onDownloadPdf={downloadPdf}
        onOpenImport={() => setIsImportOpen(true)}
        onRename={updateTitle}
        onSelectTemplate={updateTemplateId}
      />

      {/* Main Workspace Split View Grid (Responsive 12 Cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        {/* Left Side: Form Editor Panel */}
        <div
          className={`h-full overflow-hidden lg:col-span-5 ${
            mobileView === "editor" ? "block" : "hidden lg:block"
          }`}
        >
          <ResumeEditor
            resume={resume}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            updatePersonal={updatePersonal}
            updateSummary={updateSummary}
            updateSkills={updateSkills}
            updateExperience={updateExperience}
            updateProjects={updateProjects}
            updateEducation={updateEducation}
            updateCertifications={updateCertifications}
            updateAchievements={updateAchievements}
            updateLeadership={updateLeadership}
            updatePublications={updatePublications}
            updateCustomSections={updateCustomSections}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
          />
        </div>

        {/* Right Side: Document Preview Panel */}
        <div
          className={`h-full overflow-hidden lg:col-span-7 ${
            mobileView === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <ResumePreview
            svgOutput={svgOutput}
            isLoading={isLoading}
            error={error}
            zoom={zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onRetry={refresh}
            onSwitchToEditor={() => setMobileView("editor")}
          />
        </div>
      </div>

      {/* Persistent Floating Bottom Bar for Mobile Navigation */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-lg rounded-full p-1.5 shadow-2xl flex items-center gap-1">
        <button
          onClick={() => setMobileView("editor")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
            mobileView === "editor"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Content
        </button>

        <button
          onClick={() => setMobileView("preview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
            mobileView === "preview"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          View Document
        </button>
      </div>

      {/* User-Friendly Mobile Desktop Recommendation Notice Modal */}
      {showMobileNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header & Title */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Optimal Experience
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    Best Viewed on PC
                  </h3>
                </div>
              </div>

              <button
                onClick={handleDismissMobileNotice}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Body */}
            <div className="space-y-2.5">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Matchora Studio features side-by-side live PDF compilation and drag-and-drop section ordering.
              </p>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-indigo-50/70 dark:bg-indigo-950/40 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 flex items-center gap-2.5">
                <Laptop className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Open on a PC or Laptop for maximum clarity & effortless editing!</span>
              </div>
            </div>

            {/* Dismiss & Action */}
            <div className="pt-1">
              <button
                onClick={handleDismissMobileNotice}
                className="w-full py-2.5 text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Continue on Mobile</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Saved resumes: versions live in this browser's localStorage */}
      {isLibraryOpen && (
        <ResumeLibraryModal
          versions={library.versions}
          activeId={library.activeId}
          currentTitle={resume.title}
          storageAvailable={library.storageAvailable}
          onClose={() => setIsLibraryOpen(false)}
          onOpen={library.openVersion}
          onSaveAsNew={library.saveAsNewVersion}
          onCreateBlank={library.createBlankResume}
          onRename={library.renameVersion}
          onDelete={library.deleteVersion}
        />
      )}

      {/* Import Resume (file upload or pasted text → AI section extraction) */}
      {isImportOpen && (
        <ImportResumeModal
          onClose={() => setIsImportOpen(false)}
          onImported={handleImported}
        />
      )}
    </div>
  );
};

export default ResumeBuilderPage;
