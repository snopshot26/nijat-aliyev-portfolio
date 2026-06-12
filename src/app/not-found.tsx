import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <span className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-primary">
        404
      </span>
      <h1 className="text-balance text-4xl font-semibold text-white md:text-5xl">
        This page drifted out of the portfolio orbit.
      </h1>
      <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
        The route you requested does not exist yet or may have moved during the buildout.
      </p>
      <Link href="/" className={buttonVariants({ className: "rounded-full px-6" })}>
        Back to home
      </Link>
    </div>
  );
}
