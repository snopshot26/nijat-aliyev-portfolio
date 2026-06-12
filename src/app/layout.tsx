import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SonnerToaster } from "@/components/providers/sonner-toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getSiteContent } from "@/lib/site-content";
import { siteShell } from "@/lib/site-shell";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    metadataBase: new URL(siteShell.siteUrl),
    title: {
      default: `${content.hero.name} | ${content.hero.title}`,
      template: `%s | ${content.hero.name}`,
    },
    description: content.hero.subtitle,
    applicationName: content.hero.name,
    keywords: [
      "Nijat Aliyev",
      "portfolio",
      "full-stack developer",
      "software engineer",
      "Next.js portfolio",
    ],
    authors: [{ name: content.hero.name }],
    creator: content.hero.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteShell.siteUrl,
      title: `${content.hero.name} | ${content.hero.title}`,
      description: content.hero.subtitle,
      siteName: content.hero.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.hero.name} | ${content.hero.title}`,
      description: content.hero.subtitle,
    },
    category: "technology",
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#060816",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
