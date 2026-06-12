import { z } from "zod";

const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const heroSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  headline: z.string().min(1),
  subtitle: z.string().min(1),
  availability: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  primaryCtaHref: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaHref: z.string().min(1),
  metrics: z.array(metricSchema).min(1),
});

const aboutSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});

const skillGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
});

const skillsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  groups: z.array(skillGroupSchema).min(1),
});

const expertiseAreaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
});

const technicalExpertiseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  areas: z.array(expertiseAreaSchema).min(1),
});

const educationSchema = z.object({
  title: z.string().min(1),
  institution: z.string().min(1),
  summary: z.string().min(1),
  topics: z.array(z.string().min(1)).min(1),
});

const contactLinkSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  href: z.string(),
});

const contactSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  email: z.email(),
  location: z.string().min(1),
  focus: z.string().min(1),
  links: z.array(contactLinkSchema).min(1),
});

const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).min(1),
  status: z.string().min(1),
  accent: z.string().min(1),
  githubUrl: z.string(),
  demoUrl: z.string(),
  previewImage: z.string(),
  visible: z.boolean(),
});

const featuredProjectsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  projectSlugs: z.array(z.string().min(1)),
});

const cvSchema = z.object({
  label: z.string().min(1),
  fileName: z.string(),
  enabled: z.boolean(),
});

const projectArchiveSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  searchPlaceholder: z.string().min(1),
  projects: z.array(projectSchema),
});

export const siteContentSchema = z.object({
  hero: heroSchema,
  about: aboutSchema,
  skills: skillsSchema,
  technicalExpertise: technicalExpertiseSchema,
  education: educationSchema,
  contact: contactSchema,
  featuredProjects: featuredProjectsSchema,
  projectArchive: projectArchiveSchema,
  cv: cvSchema,
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type SiteProject = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
