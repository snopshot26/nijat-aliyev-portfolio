import type { ReactNode } from "react";

import { SiteCommandMenu } from "@/components/site/site-command-menu";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <div className="page-grid relative min-h-screen">
      <SiteHeader
        email={content.contact.email}
        name={content.hero.name}
        title={content.hero.title}
      />
      <main id="main-content">{children}</main>
      <SiteFooter
        description={content.hero.subtitle}
        headline={content.hero.headline}
        location={content.contact.location}
        name={content.hero.name}
        title={content.hero.title}
      />
      <SiteCommandMenu
        email={content.contact.email}
        heroLabel={content.hero.title}
        projectNames={content.projectArchive.projects.map((project) => project.name)}
      />
    </div>
  );
}
