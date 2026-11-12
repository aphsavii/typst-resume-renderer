import { z } from "zod";

/**
 * Canonical resume contract.
 *
 * This file must stay semantically identical to
 * `backend/core/domains/resume/schemas/resume/*.schema.ts`.
 * `npm run check:schema` (from the repo root) compares both definitions and
 * fails on any drift in fields, defaults, or nullability.
 */

export const CustomLinkSchema = z.object({
  label: z.string().default(""),
  url: z.string().default(""),
});

export type CustomLink = z.infer<typeof CustomLinkSchema>;

export const PersonalSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
  website: z.string().default(""),
  location: z.string().default(""),
  customLinks: z.array(CustomLinkSchema).default([]),
});

export type Personal = z.infer<typeof PersonalSchema>;

export const SingleSkillCategorySchema = z.object({
  category: z.string().default("Technical Skills"),
  items: z.array(z.string()).default([]),
});

export const SkillsSchema = z.array(SingleSkillCategorySchema).default([]);

export type Skills = z.infer<typeof SkillsSchema>;

export const ExperienceSchema = z.object({
  company: z.string().default(""),
  position: z.string().default(""),
  employmentType: z.string().nullable().default(null),
  location: z.string().nullable().default(null),

  startDate: z.string().default(""),
  endDate: z.string().nullable().default(null),

  technologies: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const ProjectDurationSchema = z.object({
  start: z.string().default(""),
  end: z.string().nullable().default(null),
});

export const ProjectSchema = z.object({
  name: z.string().default(""),
  duration: ProjectDurationSchema.nullable().default(null),
  description: z.string().nullable().default(null),
  technologies: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  github: z.string().nullable().default(null),
  demo: z.string().nullable().default(null),
});

export type Project = z.infer<typeof ProjectSchema>;

export const EducationSchema = z.object({
  institution: z.string().default(""),
  degree: z.string().default(""),
  field: z.string().nullable().default(null),
  startDate: z.string().default(""),
  endDate: z.string().nullable().default(null),
  cgpa: z.string().nullable().default(null),
  percentage: z.string().nullable().default(null),
  location: z.string().nullable().default(null),
});

export type Education = z.infer<typeof EducationSchema>;

export const CertificationSchema = z.object({
  name: z.string().default(""),
  issuer: z.string().nullable().default(null),
  issueDate: z.string().nullable().default(null),
  expiryDate: z.string().nullable().default(null),
  credentialId: z.string().nullable().default(null),
  credentialUrl: z.string().nullable().default(null),
});

export type Certification = z.infer<typeof CertificationSchema>;

export const AchievementSchema = z.object({
  title: z.string().default(""),
  issuer: z.string().nullable().default(null),
  date: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
});

export type Achievement = z.infer<typeof AchievementSchema>;

export const LeadershipSchema = z.object({
  title: z.string().default(""),
  organization: z.string().default(""),
  location: z.string().nullable().default(null),
  startDate: z.string().nullable().default(null),
  endDate: z.string().nullable().default(null),
  highlights: z.array(z.string()).default([]),
});

export type Leadership = z.infer<typeof LeadershipSchema>;

export const PublicationSchema = z.object({
  title: z.string().default(""),
  publisher: z.string().nullable().default(null),
  date: z.string().nullable().default(null),
  url: z.string().nullable().default(null),
  summary: z.string().nullable().default(null),
});

export type Publication = z.infer<typeof PublicationSchema>;

export const CustomSectionItemSchema = z.object({
  title: z.string().default(""),
  subtitle: z.string().nullable().default(null),
  date: z.string().nullable().default(null),
  location: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
});

export const CustomSectionSchema = z.object({
  id: z.string().default("custom-1"),
  title: z.string().default("Custom Section"),
  items: z.array(CustomSectionItemSchema).default([]),
});

export type CustomSection = z.infer<typeof CustomSectionSchema>;

export const ResumeSchema = z.object({
  id: z.string().nullable().default(null),
  title: z.string().default("Untitled Resume"),
  templateId: z.string().default("basic"),

  personal: PersonalSchema,
  summary: z.string().default(""),
  skills: SkillsSchema,
  experience: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  education: z.array(EducationSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  achievements: z.array(AchievementSchema).nullable().default([]),
  leadership: z.array(LeadershipSchema).nullable().default([]),
  publications: z.array(PublicationSchema).nullable().default([]),
  customSections: z.array(CustomSectionSchema).nullable().default([]),

  sectionOrder: z
    .array(z.string())
    .nullable()
    .default([
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
    ]),
});

export type Resume = z.infer<typeof ResumeSchema>;

export const TailoredResumeSchema = ResumeSchema;
export type TailoredResume = z.infer<typeof TailoredResumeSchema>;
