# Content still to replace before sharing the link

Placeholders show on the site with a dashed amber outline. Edit the files below.

| Where on the site | File | What to change |
| --- | --- | --- |
| Hero card: location | `src/content/site.ts` → `profile.location` | Your city and country |
| About: second paragraph | `src/content/site.ts` → `profile.about` | 2-3 sentences about your background |
| Hero + About: photo | `public/profile.jpg`, then `profile.photo = "/profile.jpg"` | Square photo, good light |
| Hero + Contact: CV button | `public/cv.pdf`, then `profile.cv = "/cv.pdf"` | Your CV as PDF (button appears automatically) |
| Skills | `src/content/site.ts` → `skillGroups` | Remove anything you don't use, add what's missing |
| Services | `src/content/site.ts` → `services` | Confirm the 4 services |
| Education | `src/content/site.ts` → `education` | Degree, institution, years, details |
| Certifications (hidden while empty) | `src/content/site.ts` → `certifications` | Name, issuer, year, verify link |
| Contact: email | `src/content/site.ts` → `contact.email` | Email to show publicly |
| Contact: WhatsApp | `contact.whatsapp` and `contact.whatsappLink` (digits only, e.g. `923001234567`) | Number |
| Contact: LinkedIn | `contact.linkedin` | Full profile URL |
| Site address for SEO | Automatic on Vercel; set env var `NEXT_PUBLIC_SITE_URL` only if you add a custom domain | e.g. `https://yourname.dev` |
