"use client";

import Image from "next/image";
import { ArrowUpRight, Code2, ExternalLink, ImageIcon, Lock } from "lucide-react";
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
  const hasPreviewImage = Boolean(project.previewImage);

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

          <div className="relative z-10 mt-8 overflow-hidden rounded-[1.4rem] border border-white/[0.12] bg-black/[0.18] backdrop-blur-md sm:mt-14 sm:rounded-[1.75rem]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-white/60 sm:px-5">
              <span>Demo preview</span>
              <span>{project.tags[0]}</span>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
              {hasPreviewImage ? (
                <Image
                  src={project.previewImage}
                  alt={`${project.name} demo preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                  priority
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.06]">
                    <ImageIcon className="size-5 text-primary" />
                  </div>
                  <p className="text-sm text-white/70">
                    Upload a demo screenshot in admin to show a live preview here.
                  </p>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "rounded-full border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08]",
                      })}
                    >
                      <ExternalLink className="size-4" />
                      Open demo
                    </a>
                  ) : null}
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(2,6,23,0.55))]" />
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
                target="_blank"
                rel="noreferrer"
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
