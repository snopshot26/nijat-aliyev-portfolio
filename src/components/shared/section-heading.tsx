import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-4",
        align === "center" && "mx-auto text-center",
      )}
    >
      <span className="inline-flex rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-primary/[0.9]">
        {eyebrow}
      </span>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="text-balance text-sm leading-7 text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  );
}
