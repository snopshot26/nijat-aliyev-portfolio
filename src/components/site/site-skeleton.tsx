import { Skeleton } from "@/components/ui/skeleton";

export function SiteSkeleton() {
  return (
    <div className="container-shell space-y-8 py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Skeleton className="h-8 w-44 rounded-full bg-white/[0.08]" />
          <Skeleton className="h-18 w-full max-w-4xl rounded-[2rem] bg-white/[0.08]" />
          <Skeleton className="h-28 w-full max-w-3xl rounded-[2rem] bg-white/[0.06]" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-40 rounded-full bg-white/[0.08]" />
            <Skeleton className="h-12 w-40 rounded-full bg-white/[0.06]" />
          </div>
        </div>
        <Skeleton className="min-h-[22rem] rounded-[2rem] bg-white/[0.06]" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-48 rounded-[2rem] bg-white/[0.06]" />
        <Skeleton className="h-48 rounded-[2rem] bg-white/[0.06]" />
        <Skeleton className="h-48 rounded-[2rem] bg-white/[0.06]" />
      </div>
    </div>
  );
}
