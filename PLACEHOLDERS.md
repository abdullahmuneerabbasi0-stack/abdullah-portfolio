# Content still to add

The site currently has no visible placeholders. These optional items appear automatically once filled in `src/content/site.ts`:

| Item | Where | Notes |
| --- | --- | --- |
| Public email | `contact.email` | Shows an Email button in Contact |
| WhatsApp | `contact.whatsapp` | Digits only with country code, e.g. `923001234567` |
| LinkedIn | `contact.linkedin` | Full profile URL |
| Photo | `public/profile.jpg`, then `profile.photo = "/profile.jpg"` | Replaces the "MA" monogram |
| CV | `public/cv.pdf`, then `profile.cv = "/cv.pdf"` | Adds Download CV buttons |
| Certifications | `certifications` | Hidden while empty |
| Custom domain | Vercel env var `NEXT_PUBLIC_SITE_URL` | Only if you add one |

Any text wrapped in `ph("...")` shows on the site with a dashed amber outline as a placeholder.
