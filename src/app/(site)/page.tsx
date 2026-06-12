import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileDown,
  Database,
  GraduationCap,
  Mail,
  ServerCog,
  Sparkles,
} from "lucide-react";

import { GlassPanel } from "@/components/shared/glass-panel";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SectionShell } from "@/components/shared/section-shell";
import { AnimatedCounter } from "@/components/site/animated-counter";
import { HeroOrbit } from "@/components/site/hero-orbit";
import { ProjectArchive } from "@/components/site/project-archive";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cvFileExists, getSiteContent } from "@/lib/site-content";

const expertiseIcons = [ServerCog, BriefcaseBusiness, Database];

export default async function HomePage() {
  const [content, hasCv] = await Promise.all([getSiteContent(), cvFileExists()]);
  const visibleProjects = content.projectArchive.projects.filter((project) => project.visible);
  const showCvDownload = content.cv.enabled && hasCv;

  const resolveInternalHref = (href: string) => {
    if (href === "/projects") {
      return "/#projects" as const;
    }

    return href;
  };

  return (
    <div className="relative overflow-hidden pb-24">
      <section className="container-shell relative pt-10 md:pt-16">
        <HeroOrbit />
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal className="space-y-8 pt-14 md:pt-24" delay={0.05}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-primary">
              <Sparkles className="size-4" />
              {content.hero.availability}
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.34em] text-white/55">
                {content.hero.title}
              </p>
              <h1 className="text-balance max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                {content.hero.headline}
              </h1>
              <p className="text-balance max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                {content.hero.subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {content.hero.primaryCtaHref.startsWith("/") ? (
                <Link
                  href={
                    resolveInternalHref(content.hero.primaryCtaHref) as
                      | "/"
                      | "/#projects"
                      | "/admin"
                      | "/admin/login"
                  }
                  className={buttonVariants({
                    size: "lg",
                    className: "rounded-full px-7",
                  })}
                >
                  {content.hero.primaryCtaLabel}
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <a
                  href={content.hero.primaryCtaHref}
                  className={buttonVariants({
                    size: "lg",
                    className: "rounded-full px-7",
                  })}
                >
                  {content.hero.primaryCtaLabel}
                  <ArrowRight className="size-4" />
                </a>
              )}
              {content.hero.secondaryCtaHref.startsWith("/") ? (
                <Link
                  href={
                    resolveInternalHref(content.hero.secondaryCtaHref) as
                      | "/"
                      | "/#projects"
                      | "/admin"
                      | "/admin/login"
                  }
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "rounded-full border-white/[0.12] bg-white/[0.06] px-7 text-white hover:bg-white/[0.1]",
                  })}
                >
                  {content.hero.secondaryCtaLabel}
                </Link>
              ) : (
                <a
                  href={content.hero.secondaryCtaHref}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "rounded-full border-white/[0.12] bg-white/[0.06] px-7 text-white hover:bg-white/[0.1]",
                  })}
                >
                  {content.hero.secondaryCtaLabel}
                </a>
              )}
              {showCvDownload ? (
                <a
                  href="/api/cv"
                  download="Nijat Aliyev CV.pdf"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "rounded-full border-white/[0.12] bg-white/[0.06] px-7 text-white hover:bg-white/[0.1]",
                  })}
                >
                  <FileDown className="size-4" />
                  {content.cv.label}
                </a>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <GlassPanel className="relative overflow-hidden p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary/[0.85]">
                    Snapshot
                  </p>
                  <p className="mt-4 text-2xl font-semibold text-white">
                    Backend-minded engineering with a product-aware execution style.
                  </p>
                </div>
                <div className="grid gap-4">
                  {content.hero.metrics.map((metric) => (
                    <AnimatedCounter
                      key={metric.label}
                      label={metric.label}
                      value={metric.value}
                    />
                  ))}
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      <section id="about" className="container-shell mt-24">
        <Reveal>
          <SectionShell className="grid gap-8 md:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <SectionHeading
                eyebrow="About"
                title={content.about.title}
                description={content.about.description}
              />
            </div>
            <div className="grid gap-3">
              {content.about.highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/[0.08] bg-black/[0.12] px-4 py-4 text-sm leading-7 text-white/90"
                >
                  {item}
                </div>
              ))}
            </div>
          </SectionShell>
        </Reveal>
      </section>

      <section id="skills" className="container-shell mt-24 space-y-12">
        <SectionHeading
          eyebrow="Skills"
          title={content.skills.title}
          description={content.skills.description}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.skills.groups.map((group, index) => (
            <Reveal key={group.id} delay={0.05 * index}>
              <GlassPanel className="h-full p-6 transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.07]">
                <p className="text-lg font-semibold text-white">{group.title}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="rounded-full">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="projects" className="container-shell mt-24 space-y-12">
        <Reveal>
          <ProjectArchive projects={visibleProjects} />
        </Reveal>
      </section>

      <section id="technical-expertise" className="container-shell mt-24 space-y-12">
        <SectionHeading
          eyebrow="Technical Expertise"
          title={content.technicalExpertise.title}
          description={content.technicalExpertise.description}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {content.technicalExpertise.areas.map((area, index) => {
            const Icon = expertiseIcons[index];

            return (
              <Reveal key={area.title} delay={0.05 * index}>
                <GlassPanel className="h-full p-6 transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">{area.title}</p>
                    <Icon className="size-5 text-primary" />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {area.description}
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-6 text-white/85">
                    {area.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="rounded-2xl border border-white/[0.08] bg-black/[0.12] px-4 py-3"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </GlassPanel>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="education" className="container-shell mt-24">
        <Reveal>
          <SectionShell className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.06]">
                <GraduationCap className="size-5 text-primary" />
              </div>
              <SectionHeading
                eyebrow={content.education.title}
                title={content.education.institution}
                description={content.education.summary}
              />
            </div>
            <div className="grid gap-3">
              {content.education.topics.map((topic) => (
                <div
                  key={topic}
                  className="rounded-2xl border border-white/[0.08] bg-black/[0.12] px-4 py-4 text-sm leading-7 text-white/90"
                >
                  {topic}
                </div>
              ))}
            </div>
          </SectionShell>
        </Reveal>
      </section>

      <section id="contact" className="container-shell mt-24">
        <Reveal>
          <SectionShell>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-5">
                <SectionHeading
                  eyebrow="Contact"
                  title={content.contact.title}
                  description={content.contact.description}
                />
                <Link
                  href={`mailto:${content.contact.email}`}
                  className={buttonVariants({
                    size: "lg",
                    className: "rounded-full px-7",
                  })}
                >
                  <Mail className="size-4" />
                  Email {content.hero.name}
                </Link>
              </div>
              <div className="grid gap-4">
                {content.contact.links.map((item) => {
                  const contentBlock = (
                    <div className="rounded-2xl border border-white/[0.08] bg-black/[0.12] p-5 transition hover:border-white/[0.14] hover:bg-black/[0.16]">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
                    </div>
                  );

                  return item.href ? (
                    <a key={item.label} href={item.href}>
                      {contentBlock}
                    </a>
                  ) : (
                    <div key={item.label}>{contentBlock}</div>
                  );
                })}
              </div>
            </div>
          </SectionShell>
        </Reveal>
      </section>
    </div>
  );
}
