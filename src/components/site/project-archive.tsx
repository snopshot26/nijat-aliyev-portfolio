"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/site/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SiteProject } from "@/lib/site-content-schema";

type ProjectArchiveProps = {
  projects: SiteProject[];
};

export function ProjectArchive({ projects }: ProjectArchiveProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const filteredProjects = projects;

  useEffect(() => {
    setActiveIndex(0);
  }, [projects]);

  useEffect(() => {
    if (activeIndex >= filteredProjects.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, filteredProjects.length]);

  const activeProject = filteredProjects[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) =>
      filteredProjects.length === 0
        ? 0
        : (current - 1 + filteredProjects.length) % filteredProjects.length,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      filteredProjects.length === 0 ? 0 : (current + 1) % filteredProjects.length,
    );
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      {filteredProjects.length > 0 ? (
        <div className="space-y-5 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Badge className="rounded-full border border-white/10 bg-white/6 text-white hover:bg-white/6">
                Slide {activeIndex + 1} / {filteredProjects.length}
              </Badge>
              <p className="max-w-md text-xs leading-6 text-muted-foreground sm:text-sm">
                Swipe through every project in one focused flow.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Previous project"
                onClick={goToPrevious}
                className="size-10 rounded-full border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08]"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Next project"
                onClick={goToNext}
                className="size-10 rounded-full border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08]"
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.slug}
                initial={{ opacity: 0, x: 34, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -34, scale: 0.985 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={activeProject} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            <div className="flex gap-3 sm:grid sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
            {filteredProjects.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`min-w-[16rem] rounded-2xl border px-4 py-4 text-left transition sm:min-w-0 ${
                  index === activeIndex
                    ? "border-primary/35 bg-primary/10 text-white"
                    : "border-white/[0.08] bg-white/[0.04] text-muted-foreground hover:border-white/[0.14] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{project.name}</p>
                  <span className="text-xs text-white/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-6">
                  {project.summary}
                </p>
              </button>
            ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filteredProjects.map((project, index) => (
              <button
                key={`${project.slug}-dot`}
                type="button"
                aria-label={`Go to project ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition ${
                  index === activeIndex ? "w-10 bg-primary" : "w-2.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="premium-card p-8 text-sm text-muted-foreground">
          No projects match the current search and filters.
        </div>
      )}
    </div>
  );
}
