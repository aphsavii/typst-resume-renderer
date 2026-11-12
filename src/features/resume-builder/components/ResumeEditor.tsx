import React, { useState } from "react";
import type { Resume, CustomSection } from "../../../types/resume";
import type { ActiveTab } from "../hooks/useResumeBuilder";
import {
  User,
  FileText,
  Code2,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Trophy,
  Users,
  BookOpen,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";

interface ResumeEditorProps {
  resume: Resume;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  updatePersonal: (personal: Partial<Resume["personal"]>) => void;
  updateSummary: (summary: string) => void;
  updateSkills: (skills: Resume["skills"]) => void;
  updateExperience: (experience: Resume["experience"]) => void;
  updateProjects: (projects: Resume["projects"]) => void;
  updateEducation: (education: Resume["education"]) => void;
  updateCertifications: (certifications: Resume["certifications"]) => void;
  updateAchievements: (achievements: Resume["achievements"]) => void;
  updateLeadership?: (leadership: Resume["leadership"]) => void;
  updatePublications?: (publications: Resume["publications"]) => void;
  updateCustomSections?: (customSections: Resume["customSections"]) => void;
  moveSectionUp: (index: number) => void;
  moveSectionDown: (index: number) => void;
}

const TABS: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "leadership", label: "Leadership", icon: Users },
  { id: "publications", label: "Publications", icon: BookOpen },
  { id: "customSections", label: "Custom Sections", icon: Layers },
  { id: "reorder", label: "Section Order", icon: ListOrdered },
];

const SECTION_LABELS: Record<string, string> = {
  summary: "Professional Summary",
  skills: "Technical Skills",
  experience: "Work Experience",
  projects: "Key Projects",
  education: "Education",
  certifications: "Certifications",
  achievements: "Achievements & Honors",
  leadership: "Leadership & Responsibility",
  publications: "Publications & Research",
  customSections: "Custom Sections",
};

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume,
  activeTab,
  setActiveTab,
  updatePersonal,
  updateSummary,
  updateSkills,
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
}) => {
  const [newCustomTitle, setNewCustomTitle] = useState<string>("");

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors overflow-hidden">
      {/* Scrollable Horizontal Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-2 sm:p-3 border-b border-slate-200 dark:border-slate-800 shrink-0 no-scrollbar bg-slate-50/50 dark:bg-slate-950/30">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* 1. PERSONAL INFO TAB */}
        {activeTab === "personal" && (
          <div className="space-y-6 max-w-xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Personal Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.personal.name}
                  onChange={(e) => updatePersonal({ name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={resume.personal.email}
                  onChange={(e) => updatePersonal({ email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resume.personal.phone}
                  onChange={(e) => updatePersonal({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={resume.personal.location}
                  onChange={(e) => updatePersonal({ location: e.target.value })}
                  placeholder="San Francisco, CA"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={resume.personal.linkedin}
                  onChange={(e) => updatePersonal({ linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/alex"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={resume.personal.github}
                  onChange={(e) => updatePersonal({ github: e.target.value })}
                  placeholder="https://github.com/alex"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Personal Website / Portfolio</label>
                <input
                  type="text"
                  value={resume.personal.website || ""}
                  onChange={(e) => updatePersonal({ website: e.target.value })}
                  placeholder="https://alexmorgan.dev"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Custom Links Sub-section */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                  Custom Portfolio Links / Profiles
                </label>
                <button
                  onClick={() =>
                    updatePersonal({
                      customLinks: [{ label: "LeetCode", url: "" }, ...(resume.personal.customLinks || [])],
                    })
                  }
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 transition cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Link</span>
                </button>
              </div>

              {(resume.personal.customLinks || []).map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...(resume.personal.customLinks || [])];
                      updated[idx].label = e.target.value;
                      updatePersonal({ customLinks: updated });
                    }}
                    placeholder="Label (e.g. Portfolio)"
                    className="w-1/3 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...(resume.personal.customLinks || [])];
                      updated[idx].url = e.target.value;
                      updatePersonal({ customLinks: updated });
                    }}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <button
                    onClick={() => {
                      const updated = (resume.personal.customLinks || []).filter((_, i) => i !== idx);
                      updatePersonal({ customLinks: updated });
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Professional Summary</h3>
            <textarea
              rows={6}
              value={resume.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Write a concise overview of your background, key achievements, and technical expertise..."
              className="w-full px-3.5 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium leading-relaxed"
            />
          </div>
        )}

        {/* 3. SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Technical & Soft Skills</h3>
              <button
                onClick={() => updateSkills([{ category: "New Category", items: ["Skill 1"] }, ...resume.skills])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-3">
              {resume.skills.map((skillGroup, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={skillGroup.category}
                      onChange={(e) => {
                        const updated = [...resume.skills];
                        updated[index].category = e.target.value;
                        updateSkills(updated);
                      }}
                      className="text-xs font-bold bg-transparent border-b border-indigo-400 focus:outline-none px-1 py-0.5 text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => updateSkills(resume.skills.filter((_, i) => i !== index))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Comma separated skills
                    </label>
                    <input
                      type="text"
                      value={skillGroup.items.join(", ")}
                      onChange={(e) => {
                        const updated = [...resume.skills];
                        updated[index].items = e.target.value.split(",").map((s) => s.trim());
                        updateSkills(updated);
                      }}
                      placeholder="React, TypeScript, Node.js"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Work Experience</h3>
              <button
                onClick={() =>
                  updateExperience([
                    {
                      company: "Company Name",
                      position: "Role Title",
                      employmentType: "Full-Time",
                      location: "City, State",
                      startDate: "2023",
                      endDate: "Present",
                      technologies: ["TypeScript", "Node.js"],
                      highlights: ["Architected scalable backend microservices serving 1M+ active users."],
                    },
                    ...resume.experience,
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {resume.experience.map((exp, index) => (
                <div key={index} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {exp.position || "Position Title"} {exp.company ? `at ${exp.company}` : ""}
                    </span>
                    <button
                      onClick={() => updateExperience(resume.experience.filter((_, i) => i !== index))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[index].company = e.target.value;
                          updateExperience(updated);
                        }}
                        placeholder="Google / TechCorp"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Job Title / Role</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[index].position = e.target.value;
                          updateExperience(updated);
                        }}
                        placeholder="Senior Software Engineer"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Employment Type</label>
                      <input
                        type="text"
                        value={exp.employmentType || ""}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[index].employmentType = e.target.value;
                          updateExperience(updated);
                        }}
                        placeholder="Full-Time / Contract / Internship"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location || ""}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[index].location = e.target.value;
                          updateExperience(updated);
                        }}
                        placeholder="San Francisco, CA"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[index].startDate = e.target.value;
                          updateExperience(updated);
                        }}
                        placeholder="2022"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate || ""}
                        onChange={(e) => {
                          const updated = [...resume.experience];
                          updated[index].endDate = e.target.value;
                          updateExperience(updated);
                        }}
                        placeholder="Present"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Technologies Used (Comma separated)</label>
                    <input
                      type="text"
                      value={(exp.technologies || []).join(", ")}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[index].technologies = e.target.value.split(",").map((s) => s.trim());
                        updateExperience(updated);
                      }}
                      placeholder="React, TypeScript, Node.js, AWS"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  {/* Experience Bullet Highlights List Editor */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Key Accomplishments & Bullet Highlights</label>
                      <button
                        onClick={() => {
                          const updated = [...resume.experience];
                          updated[index].highlights = ["Accomplished [X] by measuring [Y] leading to [Z].", ...(updated[index].highlights || [])];
                          updateExperience(updated);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    {(exp.highlights || []).map((bullet, hIdx) => (
                      <div key={hIdx} className="space-y-1">
                        <div className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...resume.experience];
                              updated[index].highlights[hIdx] = e.target.value;
                              updateExperience(updated);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl leading-normal"
                          />
                          <button
                            onClick={() => {
                              const updated = [...resume.experience];
                              updated[index].highlights = updated[index].highlights.filter((_, i) => i !== hIdx);
                              updateExperience(updated);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Key Projects</h3>
              <button
                onClick={() =>
                  updateProjects([
                    {
                      name: "Project Name",
                      duration: { start: "2024", end: "Present" },
                      description: "Brief overview of what the project achieves.",
                      technologies: ["React", "Node.js"],
                      highlights: ["Designed real-time interactive user features."],
                      github: "",
                      demo: "",
                    },
                    ...resume.projects,
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {resume.projects.map((proj, index) => (
                <div key={index} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {proj.name || "Untitled Project"}
                    </span>
                    <button
                      onClick={() => updateProjects(resume.projects.filter((_, i) => i !== index))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[index].name = e.target.value;
                          updateProjects(updated);
                        }}
                        placeholder="Pulse Analytics Engine"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={proj.duration?.start || ""}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[index].duration = {
                            start: e.target.value,
                            end: updated[index].duration?.end || null,
                          };
                          updateProjects(updated);
                        }}
                        placeholder="2023"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">End Date</label>
                      <input
                        type="text"
                        value={proj.duration?.end || ""}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[index].duration = {
                            start: updated[index].duration?.start || "",
                            end: e.target.value,
                          };
                          updateProjects(updated);
                        }}
                        placeholder="2024 / Present"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={proj.github || ""}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[index].github = e.target.value;
                          updateProjects(updated);
                        }}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={proj.demo || ""}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[index].demo = e.target.value;
                          updateProjects(updated);
                        }}
                        placeholder="https://demo.example.com"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Description Overview</label>
                    <input
                      type="text"
                      value={proj.description || ""}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[index].description = e.target.value;
                        updateProjects(updated);
                      }}
                      placeholder="Real-time analytics engine handling 10k events/sec..."
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Technologies Used (Comma separated)</label>
                    <input
                      type="text"
                      value={(proj.technologies || []).join(", ")}
                      onChange={(e) => {
                        const updated = [...resume.projects];
                        updated[index].technologies = e.target.value.split(",").map((s) => s.trim());
                        updateProjects(updated);
                      }}
                      placeholder="React, TypeScript, Node.js, Kafka"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  {/* Project Highlights List */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Bullet Highlights & Features</label>
                      <button
                        onClick={() => {
                          const updated = [...resume.projects];
                          updated[index].highlights = ["Implemented core pipeline reducing latency.", ...(updated[index].highlights || [])];
                          updateProjects(updated);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    {(proj.highlights || []).map((bullet, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[index].highlights[hIdx] = e.target.value;
                            updateProjects(updated);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                        <button
                          onClick={() => {
                            const updated = [...resume.projects];
                            updated[index].highlights = updated[index].highlights.filter((_, i) => i !== hIdx);
                            updateProjects(updated);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. EDUCATION TAB */}
        {activeTab === "education" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Education History</h3>
              <button
                onClick={() =>
                  updateEducation([
                    {
                      institution: "University Name",
                      degree: "B.S. Computer Science",
                      field: "Computer Science",
                      startDate: "2020",
                      endDate: "2024",
                      cgpa: "3.8 / 4.0",
                      percentage: null,
                      location: "City, State",
                    },
                    ...resume.education,
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            <div className="space-y-4">
              {resume.education.map((edu, index) => (
                <div key={index} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {edu.degree} {edu.institution ? `at ${edu.institution}` : ""}
                    </span>
                    <button
                      onClick={() => updateEducation(resume.education.filter((_, i) => i !== index))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">University / School</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[index].institution = e.target.value;
                          updateEducation(updated);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Degree Title</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[index].degree = e.target.value;
                          updateEducation(updated);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field || ""}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[index].field = e.target.value;
                          updateEducation(updated);
                        }}
                        placeholder="Computer Science"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Location</label>
                      <input
                        type="text"
                        value={edu.location || ""}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[index].location = e.target.value;
                          updateEducation(updated);
                        }}
                        placeholder="Berkeley, CA"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[index].startDate = e.target.value;
                          updateEducation(updated);
                        }}
                        placeholder="2020"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate || ""}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[index].endDate = e.target.value;
                          updateEducation(updated);
                        }}
                        placeholder="2024"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">CGPA / GPA</label>
                      <input
                        type="text"
                        value={edu.cgpa || ""}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[index].cgpa = e.target.value;
                          updateEducation(updated);
                        }}
                        placeholder="3.85 / 4.0"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Percentage (if applicable)</label>
                      <input
                        type="text"
                        value={edu.percentage || ""}
                        onChange={(e) => {
                          const updated = [...resume.education];
                          updated[index].percentage = e.target.value;
                          updateEducation(updated);
                        }}
                        placeholder="85%"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. CERTIFICATIONS TAB */}
        {activeTab === "certifications" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Licenses & Certifications</h3>
              <button
                onClick={() =>
                  updateCertifications([
                    {
                      name: "Certification Name",
                      issuer: "Issuing Organization",
                      issueDate: "2024",
                      expiryDate: "2027",
                      credentialId: "",
                      credentialUrl: "",
                    },
                    ...resume.certifications,
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
              </button>
            </div>

            <div className="space-y-4">
              {resume.certifications.map((cert, index) => (
                <div key={index} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {cert.name || "Untitled Certification"}
                    </span>
                    <button
                      onClick={() => updateCertifications(resume.certifications.filter((_, i) => i !== index))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Certification Name</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const updated = [...resume.certifications];
                          updated[index].name = e.target.value;
                          updateCertifications(updated);
                        }}
                        placeholder="AWS Certified Solutions Architect"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Issuing Organization</label>
                      <input
                        type="text"
                        value={cert.issuer || ""}
                        onChange={(e) => {
                          const updated = [...resume.certifications];
                          updated[index].issuer = e.target.value;
                          updateCertifications(updated);
                        }}
                        placeholder="Amazon Web Services"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Issue Date</label>
                      <input
                        type="text"
                        value={cert.issueDate || ""}
                        onChange={(e) => {
                          const updated = [...resume.certifications];
                          updated[index].issueDate = e.target.value;
                          updateCertifications(updated);
                        }}
                        placeholder="2024"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Credential ID</label>
                      <input
                        type="text"
                        value={cert.credentialId || ""}
                        onChange={(e) => {
                          const updated = [...resume.certifications];
                          updated[index].credentialId = e.target.value;
                          updateCertifications(updated);
                        }}
                        placeholder="AWS-123456"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Credential URL</label>
                      <input
                        type="text"
                        value={cert.credentialUrl || ""}
                        onChange={(e) => {
                          const updated = [...resume.certifications];
                          updated[index].credentialUrl = e.target.value;
                          updateCertifications(updated);
                        }}
                        placeholder="https://credly.com/..."
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. ACHIEVEMENTS TAB */}
        {activeTab === "achievements" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Honors & Achievements</h3>
              <button
                onClick={() =>
                  updateAchievements([
                    {
                      title: "Achievement Title",
                      issuer: "Organization / Event",
                      date: "2024",
                      description: "Brief summary of key achievement or award won.",
                    },
                    ...(resume.achievements || []),
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className="space-y-4">
              {(resume.achievements || []).map((ach, index) => (
                <div key={index} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {ach.title || "Untitled Achievement"}
                    </span>
                    <button
                      onClick={() => updateAchievements((resume.achievements || []).filter((_, i) => i !== index))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Title / Award</label>
                      <input
                        type="text"
                        value={ach.title}
                        onChange={(e) => {
                          const updated = [...(resume.achievements || [])];
                          updated[index].title = e.target.value;
                          updateAchievements(updated);
                        }}
                        placeholder="1st Place Winner - Hackathon 2024"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Issuer / Host Organization</label>
                      <input
                        type="text"
                        value={ach.issuer || ""}
                        onChange={(e) => {
                          const updated = [...(resume.achievements || [])];
                          updated[index].issuer = e.target.value;
                          updateAchievements(updated);
                        }}
                        placeholder="UC Berkeley"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Date</label>
                      <input
                        type="text"
                        value={ach.date || ""}
                        onChange={(e) => {
                          const updated = [...(resume.achievements || [])];
                          updated[index].date = e.target.value;
                          updateAchievements(updated);
                        }}
                        placeholder="2024"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Description Note</label>
                      <input
                        type="text"
                        value={ach.description || ""}
                        onChange={(e) => {
                          const updated = [...(resume.achievements || [])];
                          updated[index].description = e.target.value;
                          updateAchievements(updated);
                        }}
                        placeholder="Awarded 1st place out of 200+ teams for building..."
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. LEADERSHIP TAB */}
        {activeTab === "leadership" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Leadership & Responsibilities</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Position of responsibility in clubs, committees, or engineering teams</p>
              </div>
              <button
                onClick={() =>
                  updateLeadership &&
                  updateLeadership([
                    {
                      title: "Team Lead / Coordinator",
                      organization: "Organization Name",
                      location: "City, State",
                      startDate: "2023",
                      endDate: "Present",
                      highlights: ["Led community initiatives and technical workshops."],
                    },
                    ...(resume.leadership || []),
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Leadership Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {(resume.leadership || []).map((lead, index) => (
                <div key={index} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {lead.title} {lead.organization ? `• ${lead.organization}` : ""}
                    </span>
                    <button
                      onClick={() => updateLeadership && updateLeadership((resume.leadership || []).filter((_, i) => i !== index))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Role Title / Position</label>
                      <input
                        type="text"
                        value={lead.title}
                        onChange={(e) => {
                          if (!updateLeadership) return;
                          const updated = [...(resume.leadership || [])];
                          updated[index].title = e.target.value;
                          updateLeadership(updated);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Organization / Club</label>
                      <input
                        type="text"
                        value={lead.organization}
                        onChange={(e) => {
                          if (!updateLeadership) return;
                          const updated = [...(resume.leadership || [])];
                          updated[index].organization = e.target.value;
                          updateLeadership(updated);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={lead.startDate || ""}
                        onChange={(e) => {
                          if (!updateLeadership) return;
                          const updated = [...(resume.leadership || [])];
                          updated[index].startDate = e.target.value;
                          updateLeadership(updated);
                        }}
                        placeholder="2023"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">End Date</label>
                      <input
                        type="text"
                        value={lead.endDate || ""}
                        onChange={(e) => {
                          if (!updateLeadership) return;
                          const updated = [...(resume.leadership || [])];
                          updated[index].endDate = e.target.value;
                          updateLeadership(updated);
                        }}
                        placeholder="Present"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Responsibilities & Bullet Highlights</label>
                      <button
                        onClick={() => {
                          if (!updateLeadership) return;
                          const updated = [...(resume.leadership || [])];
                          updated[index].highlights = ["Organized technical workshops and led team meetings.", ...(updated[index].highlights || [])];
                          updateLeadership(updated);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    {(lead.highlights || []).map((bullet, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            if (!updateLeadership) return;
                            const updated = [...(resume.leadership || [])];
                            updated[index].highlights[hIdx] = e.target.value;
                            updateLeadership(updated);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                        <button
                          onClick={() => {
                            if (!updateLeadership) return;
                            const updated = [...(resume.leadership || [])];
                            updated[index].highlights = updated[index].highlights.filter((_, i) => i !== hIdx);
                            updateLeadership(updated);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. PUBLICATIONS TAB */}
        {activeTab === "publications" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Publications & Research</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Research papers, IEEE/ACM publications, journals, or patents</p>
              </div>
              <button
                onClick={() =>
                  updatePublications &&
                  updatePublications([
                    {
                      title: "Publication Title",
                      publisher: "IEEE / ACM / Springer",
                      date: "2024",
                      url: "",
                      summary: "Brief overview of research findings.",
                    },
                    ...(resume.publications || []),
                  ])
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Publication</span>
              </button>
            </div>

            <div className="space-y-4">
              {(resume.publications || []).map((pub, index) => (
                <div key={index} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[300px]">
                      {pub.title}
                    </span>
                    <button
                      onClick={() => updatePublications && updatePublications((resume.publications || []).filter((_, i) => i !== index))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Paper Title</label>
                      <input
                        type="text"
                        value={pub.title}
                        onChange={(e) => {
                          if (!updatePublications) return;
                          const updated = [...(resume.publications || [])];
                          updated[index].title = e.target.value;
                          updatePublications(updated);
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Publisher / Journal / Conference</label>
                        <input
                          type="text"
                          value={pub.publisher || ""}
                          onChange={(e) => {
                            if (!updatePublications) return;
                            const updated = [...(resume.publications || [])];
                            updated[index].publisher = e.target.value;
                            updatePublications(updated);
                          }}
                          placeholder="IEEE / ACM / Springer"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Publication Date</label>
                        <input
                          type="text"
                          value={pub.date || ""}
                          onChange={(e) => {
                            if (!updatePublications) return;
                            const updated = [...(resume.publications || [])];
                            updated[index].date = e.target.value;
                            updatePublications(updated);
                          }}
                          placeholder="2024"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Publication URL / DOI</label>
                        <input
                          type="text"
                          value={pub.url || ""}
                          onChange={(e) => {
                            if (!updatePublications) return;
                            const updated = [...(resume.publications || [])];
                            updated[index].url = e.target.value;
                            updatePublications(updated);
                          }}
                          placeholder="https://doi.org/..."
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Summary / Abstract Note</label>
                      <textarea
                        rows={2}
                        value={pub.summary || ""}
                        onChange={(e) => {
                          if (!updatePublications) return;
                          const updated = [...(resume.publications || [])];
                          updated[index].summary = e.target.value;
                          updatePublications(updated);
                        }}
                        placeholder="Brief summary of research findings..."
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. CUSTOM SECTIONS TAB */}
        {activeTab === "customSections" && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Custom Additional Sections</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create user-defined custom sections (e.g. "Volunteering & Community", "Patents", "Languages Spoken")
              </p>
            </div>

            {/* Add Custom Section Controls */}
            <div className="flex items-center gap-2 p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl">
              <input
                type="text"
                value={newCustomTitle}
                onChange={(e) => setNewCustomTitle(e.target.value)}
                placeholder="New Section Title (e.g. Volunteering)"
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              />
              <button
                onClick={() => {
                  if (!updateCustomSections || !newCustomTitle.trim()) return;
                  const current = resume.customSections || [];
                  const newSection: CustomSection = {
                    id: "sec_" + Date.now(),
                    title: newCustomTitle.trim(),
                    items: [
                      {
                        title: "Item Title",
                        subtitle: "Subtitle / Role",
                        date: "2024",
                        location: "",
                        description: "Details for this custom section item.",
                      },
                    ],
                  };
                  updateCustomSections([newSection, ...current]);
                  setNewCustomTitle("");
                }}
                disabled={!newCustomTitle.trim()}
                className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Section</span>
              </button>
            </div>

            {/* Existing Custom Sections List */}
            <div className="space-y-4">
              {(resume.customSections || []).map((sec, secIndex) => (
                <div key={sec.id || secIndex} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => {
                        if (!updateCustomSections) return;
                        const updated = [...(resume.customSections || [])];
                        updated[secIndex].title = e.target.value;
                        updateCustomSections(updated);
                      }}
                      className="text-xs font-bold bg-transparent border-b border-indigo-400 text-slate-900 dark:text-white px-1 py-0.5"
                    />
                    <button
                      onClick={() => updateCustomSections && updateCustomSections((resume.customSections || []).filter((_, i) => i !== secIndex))}
                      className="p-1 text-slate-400 hover:text-red-500 transition rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {sec.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              if (!updateCustomSections) return;
                              const updated = [...(resume.customSections || [])];
                              updated[secIndex].items[itemIndex].title = e.target.value;
                              updateCustomSections(updated);
                            }}
                            placeholder="Item Title"
                            className="text-xs font-semibold bg-transparent text-slate-900 dark:text-white outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!updateCustomSections) return;
                              const updated = [...(resume.customSections || [])];
                              updated[secIndex].items = updated[secIndex].items.filter((_, i) => i !== itemIndex);
                              updateCustomSections(updated);
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={item.subtitle || ""}
                            onChange={(e) => {
                              if (!updateCustomSections) return;
                              const updated = [...(resume.customSections || [])];
                              updated[secIndex].items[itemIndex].subtitle = e.target.value;
                              updateCustomSections(updated);
                            }}
                            placeholder="Subtitle / Role"
                            className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                          />
                          <input
                            type="text"
                            value={item.date || ""}
                            onChange={(e) => {
                              if (!updateCustomSections) return;
                              const updated = [...(resume.customSections || [])];
                              updated[secIndex].items[itemIndex].date = e.target.value;
                              updateCustomSections(updated);
                            }}
                            placeholder="Date"
                            className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                          />
                          <input
                            type="text"
                            value={item.location || ""}
                            onChange={(e) => {
                              if (!updateCustomSections) return;
                              const updated = [...(resume.customSections || [])];
                              updated[secIndex].items[itemIndex].location = e.target.value;
                              updateCustomSections(updated);
                            }}
                            placeholder="Location"
                            className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.description || ""}
                          onChange={(e) => {
                            if (!updateCustomSections) return;
                            const updated = [...(resume.customSections || [])];
                            updated[secIndex].items[itemIndex].description = e.target.value;
                            updateCustomSections(updated);
                          }}
                          placeholder="Item Description / Details..."
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        if (!updateCustomSections) return;
                        const updated = [...(resume.customSections || [])];
                        updated[secIndex].items = [
                          {
                            title: "New Item",
                            subtitle: "",
                            date: "",
                            location: "",
                            description: "",
                          },
                          ...(updated[secIndex].items || []),
                        ];
                        updateCustomSections(updated);
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Item to {sec.title}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. SECTION ORDER TAB */}
        {activeTab === "reorder" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Arrange Section Order</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize the vertical position of each section in your rendered document.
              </p>
            </div>

            <div className="space-y-2">
              {(
                resume.sectionOrder || [
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
                ]
              ).map((secKey, index, array) => (
                <div
                  key={secKey}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 shadow-xs hover:border-indigo-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {SECTION_LABELS[secKey] || secKey}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveSectionDown(index)}
                      disabled={index === array.length - 1}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
