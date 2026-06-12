"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  GraduationCap,
  Home,
  Layers2,
  LogOut,
  Mail,
  PencilLine,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CvUploadPanel } from "@/components/admin/cv-upload-panel";
import { ProjectImageUpload } from "@/components/admin/project-image-upload";
import type { SiteContent, SiteProject } from "@/lib/site-content-schema";
import { cn } from "@/lib/utils";

type AdminSectionId =
  | "overview"
  | "hero"
  | "about"
  | "skills"
  | "education"
  | "contact"
  | "cv"
  | "featured-projects"
  | "project-archive";

type AdminDashboardProps = {
  initialContent: SiteContent;
  initialHasCvFile: boolean;
};

const sections: Array<{
  id: AdminSectionId;
  label: string;
  icon: typeof Home;
}> = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "hero", label: "Hero", icon: Sparkles },
  { id: "about", label: "About", icon: PencilLine },
  { id: "skills", label: "Skills", icon: Layers2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "cv", label: "CV / Resume", icon: FileText },
  { id: "featured-projects", label: "Featured Projects", icon: FolderKanban },
  { id: "project-archive", label: "Project Archive", icon: FolderKanban },
];

const newProject = (): SiteProject => ({
  slug: `project-${Date.now()}`,
  name: "New Project",
  summary: "Short summary",
  description: "Project description",
  technologies: ["TypeScript"],
  tags: ["Internal"],
  status: "Draft",
  accent: "from-sky-500/30 via-cyan-400/10 to-transparent",
  githubUrl: "",
  demoUrl: "",
  previewImage: "",
  visible: true,
});

export function AdminDashboard({
  initialContent,
  initialHasCvFile,
}: AdminDashboardProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialContent);
  const [activeSection, setActiveSection] = useState<AdminSectionId>("overview");
  const [selectedProjectSlug, setSelectedProjectSlug] = useState(
    initialContent.projectArchive.projects[0]?.slug ?? "",
  );
  const [isSaving, startSaving] = useTransition();
  const [isLoggingOut, startLoggingOut] = useTransition();

  const selectedProject = useMemo(
    () =>
      draft.projectArchive.projects.find(
        (project) => project.slug === selectedProjectSlug,
      ) ?? draft.projectArchive.projects[0],
    [draft.projectArchive.projects, selectedProjectSlug],
  );

  const summary = useMemo(
    () => ({
      projectCount: draft.projectArchive.projects.length,
      visibleProjects: draft.projectArchive.projects.filter((project) => project.visible)
        .length,
      featuredProjects: draft.featuredProjects.projectSlugs.length,
      skillGroups: draft.skills.groups.length,
    }),
    [draft],
  );

  const updateDraft = (updater: (current: SiteContent) => SiteContent) => {
    setDraft((current) => updater(current));
  };

  const saveContent = () => {
    startSaving(async () => {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        toast.error("Unable to save site content.");
        return;
      }

      toast.success("Site content saved.");
      router.refresh();
    });
  };

  const logout = () => {
    startLoggingOut(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Signed out.");
      router.push("/admin/login");
      router.refresh();
    });
  };

  const reorderProjects = (slug: string, direction: "up" | "down") => {
    updateDraft((current) => {
      const projects = [...current.projectArchive.projects];
      const index = projects.findIndex((project) => project.slug === slug);
      const swapIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || swapIndex < 0 || swapIndex >= projects.length) {
        return current;
      }

      [projects[index], projects[swapIndex]] = [projects[swapIndex], projects[index]];

      return {
        ...current,
        projectArchive: { ...current.projectArchive, projects },
      };
    });
  };

  const toggleFeatured = (slug: string) => {
    updateDraft((current) => {
      const exists = current.featuredProjects.projectSlugs.includes(slug);
      return {
        ...current,
        featuredProjects: {
          ...current.featuredProjects,
          projectSlugs: exists
            ? current.featuredProjects.projectSlugs.filter((item) => item !== slug)
            : [...current.featuredProjects.projectSlugs, slug],
        },
      };
    });
  };

  const reorderFeatured = (slug: string, direction: "up" | "down") => {
    updateDraft((current) => {
      const slugs = [...current.featuredProjects.projectSlugs];
      const index = slugs.indexOf(slug);
      const swapIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || swapIndex < 0 || swapIndex >= slugs.length) {
        return current;
      }

      [slugs[index], slugs[swapIndex]] = [slugs[swapIndex], slugs[index]];

      return {
        ...current,
        featuredProjects: { ...current.featuredProjects, projectSlugs: slugs },
      };
    });
  };

  const upsertSelectedProject = (updater: (project: SiteProject) => SiteProject) => {
    if (!selectedProject) {
      return;
    }

    updateDraft((current) => ({
      ...current,
      projectArchive: {
        ...current.projectArchive,
        projects: current.projectArchive.projects.map((project) =>
          project.slug === selectedProject.slug ? updater(project) : project,
        ),
      },
    }));
  };

  const archiveStatusOptions = useMemo(
    () =>
      Array.from(
        new Set(draft.projectArchive.projects.map((project) => project.status)),
      ),
    [draft.projectArchive.projects],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-4">
        <div className="mb-6 rounded-2xl border border-white/[0.08] bg-black/[0.16] p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-primary/[0.85]">
            Dashboard
          </p>
          <p className="mt-2 text-lg font-semibold text-white">Content controls</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Edit the public portfolio, manage the archive, and publish updates from one source.
          </p>
        </div>
        <nav className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
                  activeSection === section.id
                    ? "bg-white/[0.08] text-white"
                    : "text-muted-foreground hover:bg-white/[0.05] hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="space-y-6">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary/[0.85]">
                Private Admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Manage live portfolio content
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={saveContent}
                className="rounded-full"
                disabled={isSaving}
              >
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={logout}
                className="rounded-full border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08]"
                disabled={isLoggingOut}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {activeSection === "overview" ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Projects" value={String(summary.projectCount)} />
            <SummaryCard label="Visible" value={String(summary.visibleProjects)} />
            <SummaryCard label="Featured" value={String(summary.featuredProjects)} />
            <SummaryCard label="Skill Groups" value={String(summary.skillGroups)} />
          </div>
        ) : null}

        {activeSection === "hero" ? (
          <EditorPanel title="Hero">
            <Field
              label="Name"
              value={draft.hero.name}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  hero: { ...current.hero, name: value },
                }))
              }
            />
            <Field
              label="Title"
              value={draft.hero.title}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  hero: { ...current.hero, title: value },
                }))
              }
            />
            <TextField
              label="Headline"
              value={draft.hero.headline}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  hero: { ...current.hero, headline: value },
                }))
              }
            />
            <TextField
              label="Subtitle"
              value={draft.hero.subtitle}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  hero: { ...current.hero, subtitle: value },
                }))
              }
            />
            <Field
              label="Availability"
              value={draft.hero.availability}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  hero: { ...current.hero, availability: value },
                }))
              }
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Primary CTA Label"
                value={draft.hero.primaryCtaLabel}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    hero: { ...current.hero, primaryCtaLabel: value },
                  }))
                }
              />
              <Field
                label="Primary CTA Link"
                value={draft.hero.primaryCtaHref}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    hero: { ...current.hero, primaryCtaHref: value },
                  }))
                }
              />
              <Field
                label="Secondary CTA Label"
                value={draft.hero.secondaryCtaLabel}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    hero: { ...current.hero, secondaryCtaLabel: value },
                  }))
                }
              />
              <Field
                label="Secondary CTA Link"
                value={draft.hero.secondaryCtaHref}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    hero: { ...current.hero, secondaryCtaHref: value },
                  }))
                }
              />
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-white">Hero metrics</p>
              {draft.hero.metrics.map((metric, index) => (
                <div key={`${metric.value}-${index}`} className="grid gap-4 md:grid-cols-2">
                  <Field
                    label={`Metric ${index + 1} Value`}
                    value={metric.value}
                    onChange={(value) =>
                      updateDraft((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          metrics: current.hero.metrics.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, value } : item,
                          ),
                        },
                      }))
                    }
                  />
                  <Field
                    label={`Metric ${index + 1} Label`}
                    value={metric.label}
                    onChange={(value) =>
                      updateDraft((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          metrics: current.hero.metrics.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, label: value } : item,
                          ),
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </EditorPanel>
        ) : null}

        {activeSection === "about" ? (
          <EditorPanel title="About">
            <Field
              label="Section title"
              value={draft.about.title}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  about: { ...current.about, title: value },
                }))
              }
            />
            <TextField
              label="Description"
              value={draft.about.description}
              rows={6}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  about: { ...current.about, description: value },
                }))
              }
            />
            <ListEditor
              label="Highlights"
              items={draft.about.highlights}
              onChange={(items) =>
                updateDraft((current) => ({
                  ...current,
                  about: { ...current.about, highlights: items },
                }))
              }
            />
          </EditorPanel>
        ) : null}

        {activeSection === "skills" ? (
          <EditorPanel title="Skills">
            <Field
              label="Section title"
              value={draft.skills.title}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  skills: { ...current.skills, title: value },
                }))
              }
            />
            <TextField
              label="Description"
              value={draft.skills.description}
              rows={5}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  skills: { ...current.skills, description: value },
                }))
              }
            />
            <div className="space-y-5">
              {draft.skills.groups.map((group, index) => (
                <div
                  key={group.id}
                  className="rounded-2xl border border-white/[0.08] bg-black/[0.12] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-white">Group {index + 1}</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-white/[0.12] bg-transparent text-white hover:bg-white/[0.08]"
                      onClick={() =>
                        updateDraft((current) => ({
                          ...current,
                          skills: {
                            ...current.skills,
                            groups: current.skills.groups.filter((item) => item.id !== group.id),
                          },
                        }))
                      }
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>
                  <Field
                    label="Group title"
                    value={group.title}
                    onChange={(value) =>
                      updateDraft((current) => ({
                        ...current,
                        skills: {
                          ...current.skills,
                          groups: current.skills.groups.map((item) =>
                            item.id === group.id ? { ...item, title: value } : item,
                          ),
                        },
                      }))
                    }
                  />
                  <TextField
                    label="Comma-separated skills"
                    value={group.skills.join(", ")}
                    rows={4}
                    onChange={(value) =>
                      updateDraft((current) => ({
                        ...current,
                        skills: {
                          ...current.skills,
                          groups: current.skills.groups.map((item) =>
                            item.id === group.id
                              ? {
                                  ...item,
                                  skills: value
                                    .split(",")
                                    .map((skill) => skill.trim())
                                    .filter(Boolean),
                                }
                              : item,
                          ),
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/[0.12] bg-transparent text-white hover:bg-white/[0.08]"
              onClick={() =>
                updateDraft((current) => ({
                  ...current,
                  skills: {
                    ...current.skills,
                    groups: [
                      ...current.skills.groups,
                      {
                        id: `group-${Date.now()}`,
                        title: "New Group",
                        skills: ["New Skill"],
                      },
                    ],
                  },
                }))
              }
            >
              <Plus className="size-4" />
              Add skill group
            </Button>
          </EditorPanel>
        ) : null}

        {activeSection === "education" ? (
          <EditorPanel title="Education">
            <Field
              label="Section label"
              value={draft.education.title}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  education: { ...current.education, title: value },
                }))
              }
            />
            <Field
              label="Institution / focus"
              value={draft.education.institution}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  education: { ...current.education, institution: value },
                }))
              }
            />
            <TextField
              label="Summary"
              value={draft.education.summary}
              rows={5}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  education: { ...current.education, summary: value },
                }))
              }
            />
            <ListEditor
              label="Topics"
              items={draft.education.topics}
              onChange={(items) =>
                updateDraft((current) => ({
                  ...current,
                  education: { ...current.education, topics: items },
                }))
              }
            />
          </EditorPanel>
        ) : null}

        {activeSection === "cv" ? (
          <EditorPanel title="CV / Resume">
            <CvUploadPanel
              label={draft.cv.label}
              onLabelChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  cv: { ...current.cv, label: value },
                }))
              }
              initialFileName={draft.cv.fileName}
              initialEnabled={draft.cv.enabled}
              initialHasFile={initialHasCvFile}
            />
          </EditorPanel>
        ) : null}

        {activeSection === "contact" ? (
          <EditorPanel title="Contact">
            <Field
              label="Section title"
              value={draft.contact.title}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, title: value },
                }))
              }
            />
            <TextField
              label="Description"
              value={draft.contact.description}
              rows={4}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, description: value },
                }))
              }
            />
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Email"
                value={draft.contact.email}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    contact: {
                      ...current.contact,
                      email: value,
                      links: current.contact.links.map((item) =>
                        item.label === "Email"
                          ? { ...item, value, href: `mailto:${value}` }
                          : item,
                      ),
                    },
                  }))
                }
              />
              <Field
                label="Location"
                value={draft.contact.location}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    contact: {
                      ...current.contact,
                      location: value,
                      links: current.contact.links.map((item) =>
                        item.label === "Location" ? { ...item, value } : item,
                      ),
                    },
                  }))
                }
              />
              <Field
                label="Focus"
                value={draft.contact.focus}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    contact: {
                      ...current.contact,
                      focus: value,
                      links: current.contact.links.map((item) =>
                        item.label === "Focus" ? { ...item, value } : item,
                      ),
                    },
                  }))
                }
              />
            </div>
          </EditorPanel>
        ) : null}

        {activeSection === "featured-projects" ? (
          <EditorPanel title="Featured Projects">
            <Field
              label="Section title"
              value={draft.featuredProjects.title}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  featuredProjects: { ...current.featuredProjects, title: value },
                }))
              }
            />
            <TextField
              label="Description"
              value={draft.featuredProjects.description}
              rows={4}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  featuredProjects: { ...current.featuredProjects, description: value },
                }))
              }
            />
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-white/[0.08] bg-black/[0.12] p-4">
                <p className="text-sm font-medium text-white">Featured order</p>
                <div className="mt-4 space-y-3">
                  {draft.featuredProjects.projectSlugs.map((slug) => {
                    const project = draft.projectArchive.projects.find(
                      (item) => item.slug === slug,
                    );
                    if (!project) return null;

                    return (
                      <div
                        key={slug}
                        className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{project.name}</p>
                          <p className="text-xs text-muted-foreground">{project.status}</p>
                        </div>
                        <div className="flex gap-2">
                          <SmallIconButton
                            ariaLabel={`Move ${project.name} up in featured projects`}
                            onClick={() => reorderFeatured(slug, "up")}
                          >
                            <ArrowUp className="size-4" />
                          </SmallIconButton>
                          <SmallIconButton
                            ariaLabel={`Move ${project.name} down in featured projects`}
                            onClick={() => reorderFeatured(slug, "down")}
                          >
                            <ArrowDown className="size-4" />
                          </SmallIconButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/[0.12] p-4">
                <p className="text-sm font-medium text-white">Choose featured projects</p>
                <div className="mt-4 grid gap-3">
                  {draft.projectArchive.projects.map((project) => {
                    const active = draft.featuredProjects.projectSlugs.includes(project.slug);

                    return (
                      <button
                        key={project.slug}
                        type="button"
                        onClick={() => toggleFeatured(project.slug)}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left transition",
                          active
                            ? "border-primary/35 bg-primary/10 text-white"
                            : "border-white/[0.08] bg-white/[0.04] text-muted-foreground hover:text-white",
                        )}
                      >
                        <p className="font-medium">{project.name}</p>
                        <p className="mt-1 text-xs">{project.status}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </EditorPanel>
        ) : null}

        {activeSection === "project-archive" ? (
          <EditorPanel title="Project Archive">
            <Field
              label="Section title"
              value={draft.projectArchive.title}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  projectArchive: { ...current.projectArchive, title: value },
                }))
              }
            />
            <TextField
              label="Description"
              value={draft.projectArchive.description}
              rows={4}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  projectArchive: { ...current.projectArchive, description: value },
                }))
              }
            />
            <Field
              label="Search placeholder"
              value={draft.projectArchive.searchPlaceholder}
              onChange={(value) =>
                updateDraft((current) => ({
                  ...current,
                  projectArchive: { ...current.projectArchive, searchPlaceholder: value },
                }))
              }
            />

            <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
              <div className="rounded-2xl border border-white/[0.08] bg-black/[0.12] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-white">Projects</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/[0.12] bg-transparent text-white hover:bg-white/[0.08]"
                    onClick={() => {
                      const project = newProject();
                      updateDraft((current) => ({
                        ...current,
                        projectArchive: {
                          ...current.projectArchive,
                          projects: [...current.projectArchive.projects, project],
                        },
                      }));
                      setSelectedProjectSlug(project.slug);
                    }}
                  >
                    <Plus className="size-4" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {draft.projectArchive.projects.map((project) => (
                    <button
                      key={project.slug}
                      type="button"
                      onClick={() => setSelectedProjectSlug(project.slug)}
                      className={cn(
                        "w-full rounded-2xl border px-4 py-3 text-left transition",
                        selectedProject?.slug === project.slug
                          ? "border-primary/35 bg-primary/10 text-white"
                          : "border-white/[0.08] bg-white/[0.04] text-muted-foreground hover:text-white",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="mt-1 text-xs">{project.status}</p>
                        </div>
                        <Badge variant="secondary" className="rounded-full">
                          {project.visible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedProject ? (
                <div className="rounded-2xl border border-white/[0.08] bg-black/[0.12] p-4">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <SmallActionButton
                      label="Move up"
                      onClick={() => reorderProjects(selectedProject.slug, "up")}
                    >
                      <ArrowUp className="size-4" />
                    </SmallActionButton>
                    <SmallActionButton
                      label="Move down"
                      onClick={() => reorderProjects(selectedProject.slug, "down")}
                    >
                      <ArrowDown className="size-4" />
                    </SmallActionButton>
                    <SmallActionButton
                      label={selectedProject.visible ? "Hide" : "Show"}
                      onClick={() =>
                        upsertSelectedProject((project) => ({
                          ...project,
                          visible: !project.visible,
                        }))
                      }
                    >
                      {selectedProject.visible ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </SmallActionButton>
                    <SmallActionButton
                      label="Delete"
                      onClick={() => {
                        const slug = selectedProject.slug;
                        updateDraft((current) => ({
                          ...current,
                          featuredProjects: {
                            ...current.featuredProjects,
                            projectSlugs: current.featuredProjects.projectSlugs.filter(
                              (item) => item !== slug,
                            ),
                          },
                          projectArchive: {
                            ...current.projectArchive,
                            projects: current.projectArchive.projects.filter(
                              (item) => item.slug !== slug,
                            ),
                          },
                        }));
                        setSelectedProjectSlug(
                          draft.projectArchive.projects.find((item) => item.slug !== slug)?.slug ??
                            "",
                        );
                      }}
                    >
                      <Trash2 className="size-4" />
                    </SmallActionButton>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Slug"
                      value={selectedProject.slug}
                      onChange={(value) => {
                        const previousSlug = selectedProject.slug;
                        setSelectedProjectSlug(value);
                        updateDraft((current) => ({
                          ...current,
                          featuredProjects: {
                            ...current.featuredProjects,
                            projectSlugs: current.featuredProjects.projectSlugs.map((slug) =>
                              slug === previousSlug ? value : slug,
                            ),
                          },
                          projectArchive: {
                            ...current.projectArchive,
                            projects: current.projectArchive.projects.map((project) =>
                              project.slug === previousSlug
                                ? { ...project, slug: value }
                                : project,
                            ),
                          },
                        }));
                      }}
                    />
                    <Field
                      label="Status"
                      value={selectedProject.status}
                      onChange={(value) =>
                        upsertSelectedProject((project) => ({ ...project, status: value }))
                      }
                    />
                    <Field
                      label="Name"
                      value={selectedProject.name}
                      onChange={(value) =>
                        upsertSelectedProject((project) => ({ ...project, name: value }))
                      }
                    />
                    <Field
                      label="Accent gradient"
                      value={selectedProject.accent}
                      onChange={(value) =>
                        upsertSelectedProject((project) => ({ ...project, accent: value }))
                      }
                    />
                  </div>
                  <TextField
                    label="Summary"
                    value={selectedProject.summary}
                    rows={3}
                    onChange={(value) =>
                      upsertSelectedProject((project) => ({ ...project, summary: value }))
                    }
                  />
                  <TextField
                    label="Description"
                    value={selectedProject.description}
                    rows={5}
                    onChange={(value) =>
                      upsertSelectedProject((project) => ({ ...project, description: value }))
                    }
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                      label="Technologies"
                      value={selectedProject.technologies.join(", ")}
                      rows={3}
                      onChange={(value) =>
                        upsertSelectedProject((project) => ({
                          ...project,
                          technologies: splitList(value),
                        }))
                      }
                    />
                    <TextField
                      label="Tags"
                      value={selectedProject.tags.join(", ")}
                      rows={3}
                      onChange={(value) =>
                        upsertSelectedProject((project) => ({
                          ...project,
                          tags: splitList(value),
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="GitHub link"
                      value={selectedProject.githubUrl}
                      onChange={(value) =>
                        upsertSelectedProject((project) => ({
                          ...project,
                          githubUrl: value,
                        }))
                      }
                    />
                    <Field
                      label="Demo link"
                      value={selectedProject.demoUrl}
                      onChange={(value) =>
                        upsertSelectedProject((project) => ({
                          ...project,
                          demoUrl: value,
                        }))
                      }
                    />
                  </div>
                  <ProjectImageUpload
                    slug={selectedProject.slug}
                    previewImage={selectedProject.previewImage}
                    onPreviewImageChange={(value) =>
                      upsertSelectedProject((project) => ({
                        ...project,
                        previewImage: value,
                      }))
                    }
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {archiveStatusOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          upsertSelectedProject((project) => ({
                            ...project,
                            status: option,
                          }))
                        }
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            className:
                              "rounded-full border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08]",
                          }),
                          selectedProject.status === option && "border-primary/35 bg-primary/10",
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.08] bg-black/[0.12] p-6 text-sm text-muted-foreground">
                  Create or select a project to edit it.
                </div>
              )}
            </div>
          </EditorPanel>
        ) : null}
      </div>
    </div>
  );
}

function EditorPanel({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TextField({
  label,
  onChange,
  rows = 4,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  rows?: number;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function ListEditor({
  items,
  label,
  onChange,
}: {
  items: string[];
  label: string;
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {items.map((item, index) => (
        <div key={`${label}-${index}`} className="flex gap-3">
          <Input
            value={item}
            onChange={(event) =>
              onChange(
                items.map((currentItem, currentIndex) =>
                  currentIndex === index ? event.target.value : currentItem,
                ),
              )
            }
          />
          <Button
            type="button"
            variant="outline"
            aria-label={`Remove ${label} item ${index + 1}`}
            className="rounded-full border-white/[0.12] bg-transparent text-white hover:bg-white/[0.08]"
            onClick={() => onChange(items.filter((_, currentIndex) => currentIndex !== index))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-white/[0.12] bg-transparent text-white hover:bg-white/[0.08]"
        onClick={() => onChange([...items, "New item"])}
      >
        <Plus className="size-4" />
        Add item
      </Button>
    </div>
  );
}

function SmallIconButton({
  ariaLabel,
  children,
  onClick,
}: {
  ariaLabel: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
    >
      {children}
    </button>
  );
}

function SmallActionButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-sm text-white transition hover:bg-white/[0.08]"
    >
      {children}
      {label}
    </button>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
