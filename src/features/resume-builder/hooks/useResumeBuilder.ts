import { useState, useCallback } from "react";
import type { Resume } from "../../../types/resume";
import { SAMPLE_RESUME, EMPTY_RESUME } from "../data/sample-resume";

const DEFAULT_ORDER = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "achievements",
  "leadership",
  "publications",
  "customSections",
];

export type ActiveTab =
  | "personal"
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "achievements"
  | "leadership"
  | "publications"
  | "customSections"
  | "reorder";

export function useResumeBuilder(initialResume?: Resume) {
  const [resume, setResume] = useState<Resume>(() => initialResume || SAMPLE_RESUME);
  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");

  const loadDemoProfile = useCallback(() => {
    setResume(SAMPLE_RESUME);
  }, []);

  const updatePersonal = useCallback((personal: Partial<Resume["personal"]>) => {
    setResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...personal },
    }));
  }, []);

  const updateTitle = useCallback((title: string) => {
    setResume((prev) => ({ ...prev, title }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResume((prev) => ({ ...prev, summary }));
  }, []);

  const updateSkills = useCallback((skills: Resume["skills"]) => {
    setResume((prev) => ({ ...prev, skills }));
  }, []);

  const updateTemplateId = useCallback((templateId: string) => {
    setResume((prev) => ({ ...prev, templateId }));
  }, []);

  const updateExperience = useCallback((experience: Resume["experience"]) => {
    setResume((prev) => ({ ...prev, experience }));
  }, []);

  const updateProjects = useCallback((projects: Resume["projects"]) => {
    setResume((prev) => ({ ...prev, projects }));
  }, []);

  const updateEducation = useCallback((education: Resume["education"]) => {
    setResume((prev) => ({ ...prev, education }));
  }, []);

  const updateCertifications = useCallback((certifications: Resume["certifications"]) => {
    setResume((prev) => ({ ...prev, certifications }));
  }, []);

  const updateAchievements = useCallback((achievements: Resume["achievements"]) => {
    setResume((prev) => ({ ...prev, achievements }));
  }, []);

  const updateLeadership = useCallback((leadership: Resume["leadership"]) => {
    setResume((prev) => ({ ...prev, leadership }));
  }, []);

  const updatePublications = useCallback((publications: Resume["publications"]) => {
    setResume((prev) => ({ ...prev, publications }));
  }, []);

  const updateCustomSections = useCallback((customSections: Resume["customSections"]) => {
    setResume((prev) => ({ ...prev, customSections }));
  }, []);

  const updateSectionOrder = useCallback((sectionOrder: string[]) => {
    setResume((prev) => ({ ...prev, sectionOrder }));
  }, []);

  const moveSectionUp = useCallback((index: number) => {
    setResume((prev) => {
      const currentOrder = prev.sectionOrder || DEFAULT_ORDER;
      if (index <= 0) return prev;
      const newOrder = [...currentOrder];
      const temp = newOrder[index - 1];
      newOrder[index - 1] = newOrder[index];
      newOrder[index] = temp;
      return { ...prev, sectionOrder: newOrder };
    });
  }, []);

  const moveSectionDown = useCallback((index: number) => {
    setResume((prev) => {
      const currentOrder = prev.sectionOrder || DEFAULT_ORDER;
      if (index >= currentOrder.length - 1) return prev;
      const newOrder = [...currentOrder];
      const temp = newOrder[index + 1];
      newOrder[index + 1] = newOrder[index];
      newOrder[index] = temp;
      return { ...prev, sectionOrder: newOrder };
    });
  }, []);

  const loadSampleData = useCallback(() => {
    setResume(SAMPLE_RESUME);
  }, []);

  const clearResume = useCallback(() => {
    setResume(EMPTY_RESUME);
  }, []);

  const setFullResume = useCallback((newResume: Resume) => {
    setResume({
      ...newResume,
      sectionOrder: newResume.sectionOrder || DEFAULT_ORDER,
    });
  }, []);

  return {
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
    updateSectionOrder,
    moveSectionUp,
    moveSectionDown,
    loadSampleData,
    loadDemoProfile,
    clearResume,
    setFullResume,
  };
}
