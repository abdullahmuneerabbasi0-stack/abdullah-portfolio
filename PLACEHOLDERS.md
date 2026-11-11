# Content still to add

Email, phone, LinkedIn, GitHub, Facebook, Instagram, the profile photo and the CV are all live.
These optional items are still empty. Once the admin panel is connected (see [ADMIN.md](ADMIN.md)),
edit them in `/admin`; until then, edit `src/content/site.ts`.

| Item | Where in admin | Notes |
| --- | --- | --- |
| WhatsApp | Contact | Digits only with country code, e.g. `923001234567` |
| Certifications | About & education | Section stays hidden while empty |
| Testimonials | Testimonials | Section stays hidden until you add real ones |
| Contact form | Contact > Form settings | Off by default; turn on after the database is connected |
| Custom domain | Vercel env var `NEXT_PUBLIC_SITE_URL` | Only if you buy one |
