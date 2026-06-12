"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  FolderKanban,
  Home,
  Mail,
  Search,
} from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const navigateToSection = (href: string) => {
  if (typeof window !== "undefined") {
    window.location.href = href;
  }
};

type SiteCommandMenuProps = {
  email: string;
  heroLabel: string;
  projectNames: string[];
};

export function SiteCommandMenu({
  email,
  heroLabel,
  projectNames,
}: SiteCommandMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const commandGroups = useMemo(
    () => [
      {
        heading: "Navigate",
        items: [
          {
            label: "Home",
            shortcut: "H",
            icon: Home,
            action: () => router.push("/"),
          },
          {
            label: "About",
            shortcut: "B",
            icon: Search,
            action: () => navigateToSection("/#about"),
          },
          {
            label: "Skills",
            shortcut: "S",
            icon: Search,
            action: () => navigateToSection("/#skills"),
          },
          {
            label: "Projects",
            shortcut: "P",
            icon: FolderKanban,
            action: () => navigateToSection("/#projects"),
          },
          {
            label: "Contact",
            shortcut: "C",
            icon: Mail,
            action: () => navigateToSection("/#contact"),
          },
        ],
      },
      {
        heading: "Actions",
        items: [
          {
            label: "Email Nijat",
            shortcut: "M",
            icon: Mail,
            action: () => {
              window.location.href = `mailto:${email}`;
            },
          },
          {
            label: "Explore hero CTA",
            shortcut: "E",
            icon: ArrowUpRight,
            action: () => navigateToSection("/#projects"),
          },
        ],
      },
      {
        heading: "Archive",
        items: projectNames.slice(0, 8).map((name) => ({
          label: name,
          shortcut: "",
          icon: Search,
          action: () => navigateToSection("/#projects"),
        })),
      },
    ],
    [email, projectNames, router],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "/") {
        const target = event.target as HTMLElement | null;
        const tagName = target?.tagName?.toLowerCase();
        const isTypingTarget =
          tagName === "input" || tagName === "textarea" || target?.isContentEditable;

        if (!isTypingTarget) {
          event.preventDefault();
          setOpen(true);
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Open command menu"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full border border-white/[0.12] bg-[#0a1022]/90 px-4 py-3 text-sm text-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.75)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#10172e] md:flex"
      >
        <Search className="size-4 text-primary" />
        <span>Command</span>
        <span className="rounded-md border border-white/[0.12] bg-white/[0.05] px-1.5 py-0.5 text-xs text-muted-foreground">
          Cmd+K
        </span>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command menu"
        description={`Quickly navigate the ${heroLabel} portfolio.`}
        className="max-w-2xl border border-white/[0.08] bg-[#0a1022]/95 p-0 text-white shadow-[0_32px_120px_-36px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
      >
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search pages, actions, or projects..."
            aria-label="Search commands"
          />
          <CommandList className="max-h-[26rem]">
            <CommandEmpty>No command found.</CommandEmpty>
            {commandGroups.map((group, groupIndex) => (
              <div key={group.heading}>
                <CommandGroup heading={group.heading}>
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <CommandItem
                        key={`${group.heading}-${item.label}`}
                        onSelect={() => {
                          setOpen(false);
                          item.action();
                        }}
                        className="rounded-xl text-white"
                      >
                        <Icon className="size-4 text-primary" />
                        <span>{item.label}</span>
                        {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {groupIndex < commandGroups.length - 1 ? <CommandSeparator /> : null}
              </div>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
