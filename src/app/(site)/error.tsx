"use client";

import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-shell flex min-h-[70vh] flex-col items-center justify-center gap-5 py-16 text-center">
      <span className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-primary">
        Public site error
      </span>
      <h1 className="text-balance text-4xl font-semibold text-white">
        A section failed to load cleanly.
      </h1>
      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
        The content source is still intact, but the current route needs another attempt.
      </p>
      <button type="button" onClick={reset} className={buttonVariants({ className: "rounded-full px-6" })}>
        Retry section
      </button>
    </div>
  );
}
