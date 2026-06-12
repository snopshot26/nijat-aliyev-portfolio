"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { siteShell } from "@/lib/site-shell";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type SiteHeaderProps = {
  email: string;
  name: string;
  title: string;
};

export function SiteHeader({ email, name, title }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="container-shell pt-3 sm:pt-4">
        <div className="glass-panel flex items-center justify-between rounded-full px-3 py-2.5 sm:px-4 sm:py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm">
              NA
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {siteShell.nav.map((item) => {
              const isActive = item.href === "/" && pathname === "/";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-white",
                    isActive && "bg-white/10 text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Link
                href={`mailto:${email}`}
                className={buttonVariants({
                  className: "rounded-full",
                })}
              >
                Start a project
              </Link>
            </div>
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-full md:hidden"
                    aria-label="Open navigation"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-white/10 bg-[#090c1d]/95 text-white backdrop-blur-xl"
              >
                <SheetHeader>
                  <SheetTitle>{name}</SheetTitle>
                  <SheetDescription className="text-muted-foreground">
                    Premium portfolio navigation
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-2">
                  {siteShell.nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm transition hover:bg-white/[0.08] hover:text-white",
                        item.href === "/" && pathname === "/" && "bg-white/10 text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href={`mailto:${email}`}
                    className={buttonVariants({ className: "mt-4 rounded-2xl" })}
                  >
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
