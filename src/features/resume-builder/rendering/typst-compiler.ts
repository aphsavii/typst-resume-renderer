import { $typst } from "@myriaddreamin/typst.ts";
import type { Resume } from "../../../types/resume";
import compilerWasmUrl from "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url";
import rendererWasmUrl from "@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url";

// 1. BASIC TEMPLATE FOLDER FILES
import basicResumeTyp from "./templates/basic/resume.typ?raw";
import basicLibTyp from "./templates/basic/lib.typ?raw";
import basicAdapterTyp from "./templates/basic/adapter.typ?raw";
import basicComponentsTyp from "./templates/basic/components.typ?raw";
import basicHelpersTyp from "./templates/basic/helpers.typ?raw";
import basicHeaderTyp from "./templates/basic/sections/header.typ?raw";
import basicSummaryTyp from "./templates/basic/sections/summary.typ?raw";
import basicSkillsTyp from "./templates/basic/sections/skills.typ?raw";
import basicExperienceTyp from "./templates/basic/sections/experience.typ?raw";
import basicProjectsTyp from "./templates/basic/sections/projects.typ?raw";
import basicEducationTyp from "./templates/basic/sections/education.typ?raw";
import basicCertificationsTyp from "./templates/basic/sections/certifications.typ?raw";
import basicAchievementsTyp from "./templates/basic/sections/achievements.typ?raw";
import basicLeadershipTyp from "./templates/basic/sections/leadership.typ?raw";
import basicPublicationsTyp from "./templates/basic/sections/publications.typ?raw";
import basicCustomTyp from "./templates/basic/sections/custom.typ?raw";

// 2. MODERN TEMPLATE FOLDER FILES
import modernResumeTyp from "./templates/modern/resume.typ?raw";
import modernLibTyp from "./templates/modern/lib.typ?raw";
import modernAdapterTyp from "./templates/modern/adapter.typ?raw";
import modernComponentsTyp from "./templates/modern/components.typ?raw";
import modernHelpersTyp from "./templates/modern/helpers.typ?raw";
import modernHeaderTyp from "./templates/modern/sections/header.typ?raw";
import modernSummaryTyp from "./templates/modern/sections/summary.typ?raw";
import modernSkillsTyp from "./templates/modern/sections/skills.typ?raw";
import modernExperienceTyp from "./templates/modern/sections/experience.typ?raw";
import modernProjectsTyp from "./templates/modern/sections/projects.typ?raw";
import modernEducationTyp from "./templates/modern/sections/education.typ?raw";
import modernCertificationsTyp from "./templates/modern/sections/certifications.typ?raw";
import modernAchievementsTyp from "./templates/modern/sections/achievements.typ?raw";
import modernLeadershipTyp from "./templates/modern/sections/leadership.typ?raw";
import modernPublicationsTyp from "./templates/modern/sections/publications.typ?raw";
import modernCustomTyp from "./templates/modern/sections/custom.typ?raw";

const encoder = new TextEncoder();
let isInitialized = false;
let typstLock: Promise<unknown> = Promise.resolve();

async function runWithTypstLock<T>(task: () => Promise<T>): Promise<T> {
  const nextLock = typstLock.then(async () => {
    return await task();
  });
  typstLock = nextLock.catch(() => {});
  return nextLock;
}

export function initTypstWasm() {
  if (isInitialized) return;
  try {
    $typst.setCompilerInitOptions({
      getModule: () => compilerWasmUrl,
    });
    $typst.setRendererInitOptions({
      getModule: () => rendererWasmUrl,
    });
    isInitialized = true;
  } catch (err) {
    console.warn("Typst WASM init warning:", err);
  }
}

/**
 * Dynamic Template Loader: Resolves template files from specific folder based on templateId
 */
export function getTemplateFiles(templateId: string = "basic") {
  if (templateId === "modern") {
    return {
      resumeTyp: modernResumeTyp,
      libTyp: modernLibTyp,
      adapterTyp: modernAdapterTyp,
      componentsTyp: modernComponentsTyp,
      helpersTyp: modernHelpersTyp,
      headerTyp: modernHeaderTyp,
      summaryTyp: modernSummaryTyp,
      skillsTyp: modernSkillsTyp,
      experienceTyp: modernExperienceTyp,
      projectsTyp: modernProjectsTyp,
      educationTyp: modernEducationTyp,
      certificationsTyp: modernCertificationsTyp,
      achievementsTyp: modernAchievementsTyp,
      leadershipTyp: modernLeadershipTyp,
      publicationsTyp: modernPublicationsTyp,
      customTyp: modernCustomTyp,
    };
  }

  // Fallback to basic folder
  return {
    resumeTyp: basicResumeTyp,
    libTyp: basicLibTyp,
    adapterTyp: basicAdapterTyp,
    componentsTyp: basicComponentsTyp,
    helpersTyp: basicHelpersTyp,
    headerTyp: basicHeaderTyp,
    summaryTyp: basicSummaryTyp,
    skillsTyp: basicSkillsTyp,
    experienceTyp: basicExperienceTyp,
    projectsTyp: basicProjectsTyp,
    educationTyp: basicEducationTyp,
    certificationsTyp: basicCertificationsTyp,
    achievementsTyp: basicAchievementsTyp,
    leadershipTyp: basicLeadershipTyp,
    publicationsTyp: basicPublicationsTyp,
    customTyp: basicCustomTyp,
  };
}

/**
 * Maps the template files from the selected template folder and input JSON into WASM memory.
 */
export function prepareTypstVirtualFiles(resume: Resume) {
  const jsonBytes = encoder.encode(JSON.stringify(resume));
  const files = getTemplateFiles(resume.templateId);

  // Data payload
  $typst.mapShadow("resume/resume.json", jsonBytes);
  $typst.mapShadow("/resume/resume.json", jsonBytes);

  // Template libraries & components
  $typst.mapShadow("resume/lib.typ", encoder.encode(files.libTyp));
  $typst.mapShadow("/resume/lib.typ", encoder.encode(files.libTyp));

  $typst.mapShadow("resume/adapter.typ", encoder.encode(files.adapterTyp));
  $typst.mapShadow("/resume/adapter.typ", encoder.encode(files.adapterTyp));

  $typst.mapShadow("resume/components.typ", encoder.encode(files.componentsTyp));
  $typst.mapShadow("/resume/components.typ", encoder.encode(files.componentsTyp));

  $typst.mapShadow("resume/helpers.typ", encoder.encode(files.helpersTyp));
  $typst.mapShadow("/resume/helpers.typ", encoder.encode(files.helpersTyp));

  // Sections
  $typst.mapShadow("resume/sections/header.typ", encoder.encode(files.headerTyp));
  $typst.mapShadow("/resume/sections/header.typ", encoder.encode(files.headerTyp));

  $typst.mapShadow("resume/sections/summary.typ", encoder.encode(files.summaryTyp));
  $typst.mapShadow("/resume/sections/summary.typ", encoder.encode(files.summaryTyp));

  $typst.mapShadow("resume/sections/skills.typ", encoder.encode(files.skillsTyp));
  $typst.mapShadow("/resume/sections/skills.typ", encoder.encode(files.skillsTyp));

  $typst.mapShadow("resume/sections/experience.typ", encoder.encode(files.experienceTyp));
  $typst.mapShadow("/resume/sections/experience.typ", encoder.encode(files.experienceTyp));

  $typst.mapShadow("resume/sections/projects.typ", encoder.encode(files.projectsTyp));
  $typst.mapShadow("/resume/sections/projects.typ", encoder.encode(files.projectsTyp));

  $typst.mapShadow("resume/sections/education.typ", encoder.encode(files.educationTyp));
  $typst.mapShadow("/resume/sections/education.typ", encoder.encode(files.educationTyp));

  $typst.mapShadow("resume/sections/certifications.typ", encoder.encode(files.certificationsTyp));
  $typst.mapShadow("/resume/sections/certifications.typ", encoder.encode(files.certificationsTyp));

  $typst.mapShadow("resume/sections/achievements.typ", encoder.encode(files.achievementsTyp));
  $typst.mapShadow("/resume/sections/achievements.typ", encoder.encode(files.achievementsTyp));

  $typst.mapShadow("resume/sections/leadership.typ", encoder.encode(files.leadershipTyp));
  $typst.mapShadow("/resume/sections/leadership.typ", encoder.encode(files.leadershipTyp));

  $typst.mapShadow("resume/sections/publications.typ", encoder.encode(files.publicationsTyp));
  $typst.mapShadow("/resume/sections/publications.typ", encoder.encode(files.publicationsTyp));

  $typst.mapShadow("resume/sections/custom.typ", encoder.encode(files.customTyp));
  $typst.mapShadow("/resume/sections/custom.typ", encoder.encode(files.customTyp));

  // Entrypoint
  $typst.mapShadow("resume/resume.typ", encoder.encode(files.resumeTyp));
  $typst.mapShadow("/resume/resume.typ", encoder.encode(files.resumeTyp));
}

/**
 * Renders a Resume object into SVG string format using client-side Typst compiler
 */
export async function renderResumeToSvg(resume: Resume): Promise<string> {
  return runWithTypstLock(async () => {
    initTypstWasm();
    prepareTypstVirtualFiles(resume);
    try {
      const svg = await $typst.svg({ mainFilePath: "/resume/resume.typ" });
      if (!svg) throw new Error("Document rendering returned empty SVG output.");
      return svg;
    } catch (error) {
      console.error("Document SVG render error:", error);
      throw error;
    }
  });
}

/**
 * Renders a Resume object into PDF Uint8Array blob using client-side Typst compiler
 */
export async function renderResumeToPdf(resume: Resume): Promise<Uint8Array> {
  return runWithTypstLock(async () => {
    initTypstWasm();
    prepareTypstVirtualFiles(resume);
    try {
      const pdfBytes = await $typst.pdf({ mainFilePath: "/resume/resume.typ" });
      if (!pdfBytes) throw new Error("Document rendering returned empty PDF output.");
      return pdfBytes;
    } catch (error) {
      console.error("Document PDF render error:", error);
      throw error;
    }
  });
}
