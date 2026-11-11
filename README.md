# Muhammad Abdullah — Portfolio

Personal portfolio of Muhammad Abdullah, Full-Stack Developer and AI Automation Specialist.

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

Design tokens (ink, bone and copper colours, fonts) are CSS variables in `src/app/globals.css`.

## Design and motion

The look is a cinematic, editorial style: warm near-black stages alternate with bone-coloured panels, Cormorant Garamond headlines with italic copper accents, and Inter for body text. All animation uses Motion (no extra libraries):

- Intro loader (once per tab session), page-transition curtain (`src/app/template.tsx`) and a scroll progress bar
- Masked word-by-word headline reveals (`SplitText`), scroll-lit paragraphs (`ScrollWords`), count-up facts (`Counter`)
- Hero that settles back as you scroll, parallax project frames (`ParallaxFrame`), a "View" cursor on project covers (`ViewCursor`)
- Drifting dust canvas behind dark sections (`Background`), pausing when the tab is hidden

Everything respects `prefers-reduced-motion`: the loader, particles, marquee and scroll-linked motion switch off.
