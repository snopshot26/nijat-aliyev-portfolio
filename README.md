# Nijat Aliyev Portfolio

A premium, dark-first personal portfolio built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, Lucide React, React Hook Form, Zod, and `next-themes`.

The app includes a polished public website, a searchable project archive, and a private admin dashboard that edits live site content stored in `data/site-content.json`.

## Features

- Premium responsive UI with glassmorphism, gradients, motion, and section reveals
- Public portfolio pages at `/` and `/projects`
- Private admin dashboard at `/admin` with login at `/admin/login`
- File-backed content management through `data/site-content.json`
- Search, technology filters, and status filters for project archive growth
- SEO support with metadata, Open Graph, Twitter cards, `robots.txt`, `sitemap.xml`, and web manifest
- Loading states, skeletons, command menu, error boundaries, and accessible keyboard navigation

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui
- Lucide React
- React Hook Form
- Zod
- next-themes
- Sonner

## Project Structure

```text
src/
  app/
    (site)/
    admin/
    api/
  components/
    admin/
    shared/
    site/
    ui/
  lib/
data/
  site-content.json
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not present yet, create `.env.local` manually and add:

```bash
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Local Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

```bash
npm run lint
npm run typecheck
npm run build
```

## Admin Setup

The admin panel is protected by a password stored in `.env.local`.

Required variable:

```bash
ADMIN_PASSWORD=your-secure-password
```

How it works:

- `/admin/login` submits the password to the admin auth API
- a secure cookie is set after successful authentication
- `/admin` checks authentication server-side before rendering
- protected admin APIs reject unauthenticated requests

## Content Editing Guide

All public content is loaded from:

```text
data/site-content.json
```

You can update content in two ways:

1. Use the admin dashboard at `/admin`
2. Edit `data/site-content.json` directly

Editable sections include:

- Hero
- About
- Skills
- Education
- Contact
- Featured Projects
- Project Archive

When editing project data, keep these fields accurate:

- `slug`: unique project identifier
- `name`: display title
- `summary`: short card summary
- `description`: detailed project description
- `technologies`: array used in filters
- `tags`: project labels
- `status`: drives status badges and filtering
- `githubUrl`: repository link
- `demoUrl`: live demo link
- `visible`: controls whether the project appears publicly

## Deployment on Vercel

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Configure environment variables in the Vercel dashboard:

```bash
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

4. Deploy.

Recommended production notes:

- keep `ADMIN_PASSWORD` strong and unique
- set `NEXT_PUBLIC_SITE_URL` to the final canonical domain
- review generated metadata and OG output after deployment
- if multiple people manage content, coordinate edits to `data/site-content.json`

## SEO

The project includes:

- route metadata in the App Router
- Open Graph image generation
- Twitter card metadata
- `robots.txt`
- `sitemap.xml`
- `manifest.webmanifest`

For best results in production, set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Accessibility

The UI includes:

- skip link support
- keyboard-friendly navigation
- command menu shortcut support
- semantic headings and labels
- visible focus states
- contrast-aware dark UI styling

## Production Checklist

Before shipping, run:

```bash
npm run lint
npm run typecheck
npm run build
```

Also verify:

- admin login works with your production password
- project edits persist correctly
- sitemap and robots endpoints resolve
- metadata uses the correct site URL

## Routes

- `/`
- `/projects`
- `/admin`
- `/admin/login`
