# Admin panel

The site has a built-in admin panel at `/admin` for editing every part of the
website without touching code: hero, about, projects, services, skills,
testimonials, contact details, colours and fonts, navigation, images and
contact-form messages.

Until a database is connected, the public site keeps working exactly as before,
using the files in `src/content/`.

## One-time setup (about 10 minutes)

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (the free plan is enough).
   Save the database password it asks you for.
2. **Create the tables.** In Supabase, open **SQL Editor > New query**, paste the whole of
   [`db/schema.sql`](db/schema.sql) and press **Run**. It's safe to run again later.
3. **Copy the connection string.** In Supabase, click **Connect**, choose **Session pooler**
   (or Transaction pooler; the site switches it to the session pooler automatically, because the
   transaction pooler can leave admin pages hanging) and copy the URI. Replace `[YOUR-PASSWORD]`
   with your database password. Paste the whole `postgresql://...` link, not just the password.
4. **Add two environment variables in Vercel** (Project > Settings > Environment Variables,
   for Production, Preview and Development):
   - `DATABASE_URL`: the connection string from step 3.
   - `ADMIN_SETUP_TOKEN`: a long random secret (at least 16 characters). You only need it once.
5. **Redeploy** the site in Vercel.
6. **Create your admin account.** Visit `https://your-site/admin/setup`, enter the setup token,
   your name, email and a strong password. Your current website content is copied into the
   database automatically, and nothing on the live site changes.

After that, sign in at `/admin`. Setup is disabled for good once an admin account exists.

## How publishing works

- **Hero, About, Contact, Appearance and Navigation** are edited as drafts. Use **Preview** to
  see the real site with your drafts (only you see them), then **Publish** to make them live.
- **Projects, services, skills and testimonials** have their own Published/Draft (or
  Visible/Hidden) switch. Drafts and hidden items never appear on the site.
- Changes go live on the very next page load after publishing.

## Security

- No database credentials or secrets ever reach the browser; the database is only used from the
  server, and every table has Supabase's row-level security switched on with no public access.
- Passwords are hashed with scrypt. Sessions are random tokens stored only as hashes, sent in
  `httpOnly`, `Secure`, `SameSite=Strict` cookies, and expire after 24 hours idle or 7 days.
- Every admin page, server action and API route checks the session on the server. Hiding the
  `/admin` URL is not relied on.
- Login is rate-limited (5 failed attempts per email, 10 per network, per 15 minutes).
- All input is validated on the server; links only allow `https://`, `http://`, `mailto:`,
  `tel:` and site paths.
- Uploads are decoded to prove they're real images (SVG is refused), resized, stripped of
  metadata such as GPS location, and re-encoded as WebP (4 MB limit).
- The contact form has a hidden spam trap and rate limits per visitor and per day.

## Local development

```bash
cp .env.example .env.local   # fill in DATABASE_URL and ADMIN_SETUP_TOKEN
npm run db:migrate           # creates the tables (same as pasting db/schema.sql)
npm run dev
```
