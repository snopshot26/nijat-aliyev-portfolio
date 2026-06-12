export const siteShell = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#skills", label: "Skills" },
    { href: "/#projects", label: "Projects" },
    { href: "/#technical-expertise", label: "Expertise" },
    { href: "/#education", label: "Education" },
    { href: "/#contact", label: "Contact" },
  ],
} as const;
