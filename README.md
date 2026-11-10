# Muhammad Abdullah: Portfolio

Personal portfolio of Muhammad Abdullah, junior full-stack web developer in Karachi.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4 and Motion. Fully static, deployed on Vercel.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Editing content

All text lives in `src/content/`:

- `site.ts`: profile, about, stack, contact, freelance note, certifications
- `projects.ts`: projects and their case-study pages (`/projects/[slug]`)

Anything wrapped in `ph("...")` is a placeholder and shows with a dashed red outline. See `PLACEHOLDERS.md`.

## Structure

```
src/app/            pages, SEO (sitemap, robots, Open Graph image)
src/components/     layout, sections, shared UI
src/content/        all site content (shaped like the future admin database)
```

Design tokens (colors, glass) are CSS variables in `src/app/globals.css`.

## Design rules

- Three colours only: ink `#121110`, paper `#ECE6DA`, signal `#FF5A36` (see `src/app/globals.css`). No gradients, no glass, no glow.
- Fonts: Bricolage Grotesque for text, IBM Plex Mono only for data (dates, statuses, stack names).
- Sections use the `Section` component: numbered label on the left, content on the right.
- Copy: say what was built and when, in plain words. No buzzwords, no invented numbers.
