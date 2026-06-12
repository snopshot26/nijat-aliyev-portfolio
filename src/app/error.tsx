"use client";

import { useEffect } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function RootError({
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
    <div className="container-shell flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <span className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-primary">
        Unexpected issue
      </span>
      <h1 className="text-balance text-4xl font-semibold text-white md:text-5xl">
        The portfolio hit a runtime problem.
      </h1>
      <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
        A recoverable error interrupted the current view. You can retry the route or go back
        to the homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className={buttonVariants({ className: "rounded-full px-6" })}
        >
          Try again
        </button>
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            className:
              "rounded-full border-white/[0.12] bg-white/[0.04] px-6 text-white hover:bg-white/[0.08]",
          })}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
