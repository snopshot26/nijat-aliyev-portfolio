import { Skeleton } from "@/components/ui/skeleton";

export function AdminSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <Skeleton className="h-[28rem] rounded-[2rem] bg-white/[0.06]" />
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-[2rem] bg-white/[0.06]" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28 rounded-[2rem] bg-white/[0.06]" />
          <Skeleton className="h-28 rounded-[2rem] bg-white/[0.06]" />
          <Skeleton className="h-28 rounded-[2rem] bg-white/[0.06]" />
          <Skeleton className="h-28 rounded-[2rem] bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}
