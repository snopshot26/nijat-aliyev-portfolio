"use client";

import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";

export default function AdminError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <span className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-primary">
        Admin error
      </span>
      <h1 className="text-balance text-4xl font-semibold text-white">
        The dashboard couldn&apos;t finish loading.
      </h1>
      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
        Your content file is still safe. Retry the dashboard to continue editing.
      </p>
      <button type="button" onClick={reset} className={buttonVariants({ className: "rounded-full px-6" })}>
        Reload dashboard
      </button>
    </div>
  );
}
