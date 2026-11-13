# Content still to add

Last checked against the live site on 13 Nov 2026. There is no `[PLACEHOLDER]` text left on the site.

## Already live

Name, title, bio, location, photo, CV download (updated 13 Nov 2026), skills, services, education (DIT and SSC/Matric),
the three projects, email, phone, LinkedIn, GitHub, Facebook and Instagram.

## Where to edit

The admin panel is connected, so edit everything in `/admin`. The site reads from the database;
the files in `src/content/` and `src/lib/content/defaults.ts` are only the starting content that
was copied in when the database was set up, so changing them now does not change the live site.

## Optional items still empty

Each of these stays hidden on the site until you fill it in, so nothing looks broken meanwhile.

| Item | Where in admin | Notes |
| --- | --- | --- |
| Project screenshots and links | Projects | Only the Premium AI Website Studio has an image (a concept diagram). Add real screenshots and live/GitHub links for TaskFloe AI when you have them. |
| WhatsApp | Contact | Type `923042621504` in the WhatsApp box and publish (same number as your phone). |
| Contact form | Contact > Form settings | Off. The database is connected, so you can switch it on whenever you like; messages land in the admin Inbox. |
| Certifications | About & education | Add your DIT certificate here once you receive it. Section stays hidden while empty. |
| Testimonials | Testimonials | Only add real quotes from real people. Section stays hidden while empty. |
| Custom domain | Vercel env var `NEXT_PUBLIC_SITE_URL` | Only if you buy one. |

## Rule

Never add made-up jobs, testimonials, certificates, results or skills. If something is not real yet,
leave it empty (it stays hidden) rather than filling it with placeholder text.
