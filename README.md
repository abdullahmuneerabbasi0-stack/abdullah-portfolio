# Abdullah Abbasi — Portfolio

Personal portfolio of Abdullah Abbasi, Full-Stack Developer and AI Automation Specialist.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4 and Motion. Fully static, deployed on Vercel.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Editing content

All text lives in `src/content/`:

- `site.ts`: profile, about, skills, services, education, certifications, contact
- `projects.ts`: projects and their case-study pages (`/projects/[slug]`)

Anything wrapped in `ph("...")` is a placeholder and shows with a dashed amber outline. See `PLACEHOLDERS.md`.

## Structure

```
src/app/            pages, SEO (sitemap, robots, Open Graph image)
src/components/     layout, sections, shared UI
src/content/        all site content (shaped like the future admin database)
```

Design tokens (colors, glass) are CSS variables in `src/app/globals.css`.
