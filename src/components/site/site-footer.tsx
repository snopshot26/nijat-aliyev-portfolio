import Link from "next/link";

type SiteFooterProps = {
  description: string;
  headline: string;
  location: string;
  name: string;
  title: string;
};

export function SiteFooter({
  description,
  headline,
  location,
  name,
  title,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-white/[0.08] py-10">
      <div className="container-shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-lg font-medium text-white">{name}</p>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{headline}</p>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground md:text-right">
          <div className="flex flex-wrap gap-4 md:justify-end">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/#about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/#projects" className="transition hover:text-white">
              Projects
            </Link>
            <Link href="/#contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
          <p>{location}</p>
          <p>{title}</p>
        </div>
      </div>
    </footer>
  );
}
