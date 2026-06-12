"use client";

import { ArrowUpRight, Code2, ExternalLink, Lock } from "lucide-react";
import { motion } from "framer-motion";

import { GlassPanel } from "@/components/shared/glass-panel";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { SiteProject } from "@/lib/site-content-schema";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: SiteProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      <GlassPanel className="group relative flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:border-white/[0.16]">
        <div className="relative overflow-hidden border-b border-white/[0.08] p-4 sm:p-6">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-100 transition duration-500 group-hover:scale-105",
              project.accent,
            )}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_38%)]" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <Badge className="rounded-full border border-white/[0.12] bg-black/[0.25] text-white hover:bg-black/[0.25]">
              {project.status}
            </Badge>
            <span className="rounded-full border border-white/[0.12] bg-white/[0.08] p-2 text-white/80 transition group-hover:text-white">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <div className="relative z-10 mt-8 rounded-[1.4rem] border border-white/[0.12] bg-black/[0.18] p-3 backdrop-blur-md sm:mt-14 sm:rounded-[1.75rem] sm:p-5">
            <div className="rounded-[1.1rem] border border-white/[0.08] bg-black/[0.32] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:rounded-[1.25rem] sm:p-4">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/60">
                <span>Preview</span>
                <span>{project.tags[0]}</span>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="relative h-20 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.06] sm:h-24 sm:rounded-2xl">
                  <div className={cn("absolute inset-0 bg-gradient-to-br", project.accent)} />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-70" />
                </div>
                <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
                  <div className="h-8 rounded-lg border border-white/[0.08] bg-white/[0.05] sm:h-10 sm:rounded-xl" />
                  <div className="h-8 rounded-lg border border-white/[0.08] bg-white/[0.05] sm:h-10 sm:rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-6">
          <div>
            <h3 className="text-lg font-semibold text-white sm:text-xl">{project.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-3 sm:leading-7">
              {project.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <Badge key={technology} variant="secondary" className="rounded-full">
                  {technology}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="rounded-full border border-white/[0.1] bg-white/[0.05] text-white/80 hover:bg-white/[0.05]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "h-10 flex-1 rounded-full border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08] sm:h-9",
                })}
              >
                <Code2 className="size-4" />
                GitHub
              </a>
            ) : (
              <span
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "pointer-events-none h-10 flex-1 rounded-full border-white/[0.12] bg-white/[0.04] text-white/70 opacity-80 sm:h-9",
                })}
              >
                <Lock className="size-4" />
                GitHub
              </span>
            )}

            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                className={buttonVariants({
                  className: "h-10 flex-1 rounded-full sm:h-9",
                })}
              >
                <ExternalLink className="size-4" />
                Demo
              </a>
            ) : (
              <span
                className={buttonVariants({
                  className: "pointer-events-none h-10 flex-1 rounded-full opacity-90 sm:h-9",
                })}
              >
                <Lock className="size-4" />
                Demo
              </span>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
