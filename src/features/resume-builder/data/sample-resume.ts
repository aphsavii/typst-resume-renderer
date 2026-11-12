import type { Resume } from "../../../types/resume";

export const EMPTY_RESUME: Resume = {
  id: null,
  title: "Untitled Resume",
  templateId: "basic",
  personal: {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    location: "",
    customLinks: [],
  },
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  achievements: [],
  leadership: [],
  publications: [],
  customSections: [],
  sectionOrder: [
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
  ],
};

export function isResumeEmpty(resume: Resume | null | undefined): boolean {
  if (!resume) return true;
  const hasSummary = Boolean(resume.summary && resume.summary.trim() !== "");
  const hasSkills = Boolean(resume.skills && resume.skills.length > 0 && resume.skills.some(cat => cat.items && cat.items.length > 0));
  const hasExp = Boolean(resume.experience && resume.experience.length > 0);
  const hasProj = Boolean(resume.projects && resume.projects.length > 0);
  const hasEdu = Boolean(resume.education && resume.education.length > 0);
  const hasCert = Boolean(resume.certifications && resume.certifications.length > 0);
  const hasAchievements = Boolean(resume.achievements && resume.achievements.length > 0);
  const hasLeadership = Boolean(resume.leadership && resume.leadership.length > 0);
  const hasPublications = Boolean(resume.publications && resume.publications.length > 0);
  const hasCustom = Boolean(resume.customSections && resume.customSections.length > 0);
  const hasPersonalDetails = Boolean(
    resume.personal?.phone || resume.personal?.linkedin || resume.personal?.github || resume.personal?.location || resume.personal?.website
  );
  return !(hasSummary || hasSkills || hasExp || hasProj || hasEdu || hasCert || hasAchievements || hasLeadership || hasPublications || hasCustom || hasPersonalDetails);
}

export const SAMPLE_RESUME: Resume = {
  id: null,
  title: "Alex Morgan - Senior SDE",
  templateId: "basic",
  personal: {
    name: "Alex Morgan",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 234-5678",
    linkedin: "https://linkedin.com/in/alexmorgan",
    github: "https://github.com/alexmorgan",
    website: "https://alexmorgan.dev",
    location: "San Francisco, CA",
    customLinks: [
      { label: "Portfolio", url: "https://alexmorgan.dev" }
    ]
  },
  summary: "Senior Software Engineer with 6+ years of experience designing scalable microservices and cloud infrastructure. Specialized in React, Node.js, and TypeScript with a track record of improving system uptime to 99.99%.",
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["TypeScript", "JavaScript", "Python", "Go", "React", "Next.js", "Node.js", "Express"]
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS (S3 / EC2 / ECS)", "Docker", "Kubernetes", "PostgreSQL", "Redis", "CI/CD (GitHub Actions)"]
    }
  ],
  experience: [
    {
      company: "TechCorp Solutions",
      position: "Senior Full Stack Engineer",
      employmentType: "Full-Time",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      technologies: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
      highlights: [
        "Architected scalable backend microservices serving 2M+ active daily users with 99.99% uptime.",
        "Mentored a team of 5 junior engineers, driving code quality standards and reducing PR review latency by 40%.",
        "Optimized frontend bundle size by 35% using code-splitting and dynamic imports in Vite."
      ]
    },
    {
      company: "CloudScale Inc.",
      position: "Software Engineer",
      employmentType: "Full-Time",
      location: "San Jose, CA",
      startDate: "2019",
      endDate: "2022",
      technologies: ["Node.js", "Python", "Docker", "Redis"],
      highlights: [
        "Built distributed caching layer using Redis, cutting API latency by 60ms.",
        "Implemented automated CI/CD pipeline using GitHub Actions, reducing deployment time from 45 mins to 8 mins."
      ]
    }
  ],
  projects: [
    {
      name: "Pulse Analytics Engine",
      duration: { start: "2023", end: "2024" },
      description: "Real-time web analytics application processing 10k events/sec.",
      technologies: ["React", "Node.js", "Kafka", "ClickHouse"],
      highlights: [
        "Designed real-time dashboard UI rendered via HTML5 WebSockets.",
        "Handled 10,000 events/second using Apache Kafka and ClickHouse storage."
      ],
      github: "https://github.com/alexmorgan/pulse-analytics",
      demo: "https://pulse.alexmorgan.dev"
    }
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "B.S. Computer Science",
      field: "Computer Science",
      startDate: "2015",
      endDate: "2019",
      cgpa: "3.85 / 4.0",
      percentage: null,
      location: "Berkeley, CA"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2024",
      expiryDate: "2027",
      credentialId: "AWS-789012",
      credentialUrl: ""
    }
  ],
  achievements: [
    {
      title: "1st Place Winner - CalHacks 2023",
      issuer: "UC Berkeley",
      date: "2023",
      description: "Awarded 1st place out of 250+ teams for building a real-time accessibility translation tool."
    }
  ],
  leadership: [
    {
      title: "President & Lead Coordinator",
      organization: "ACM Student Chapter - UC Berkeley",
      location: "Berkeley, CA",
      startDate: "2018",
      endDate: "2019",
      highlights: [
        "Organized 12 tech workshops and 2 hackathons with over 500+ student attendees.",
        "Secured $15,000 in corporate sponsorship from top Silicon Valley tech companies."
      ]
    }
  ],
  publications: [
    {
      title: "Efficient Microservice Caching Patterns in Cloud Environments",
      publisher: "IEEE Software Engineering Journal",
      date: "2022",
      url: "https://doi.org/10.1109/SE.2022.987654",
      summary: "Published paper detailing distributed cache invalidation strategies for low-latency web services."
    }
  ],
  customSections: [],
  sectionOrder: [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "leadership",
    "publications",
    "customSections"
  ]
};
