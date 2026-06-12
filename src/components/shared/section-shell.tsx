import * as React from "react";

import { cn } from "@/lib/utils";

export function SectionShell({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_30px_100px_-50px_rgba(0,0,0,0.75)] md:p-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
      <div className="pointer-events-none absolute -right-24 top-8 h-48 w-48 rounded-full bg-primary/[0.08] blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
