import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";

/** Global admin search across content, messages and media. */
export async function GET(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return NextResponse.json({ results: [] });
  const like = `%${q.replace(/[\\%_]/g, (m) => "\\" + m)}%`;
  const sql = db();
  const rows = await sql<{ kind: string; id: string; title: string; detail: string }[]>`
    (select 'Project' as kind, id::text, title, coalesce(data->>'tagline', '') as detail from projects
      where title ilike ${like} or data::text ilike ${like} limit 5)
    union all
    (select 'Service', id::text, title, coalesce(data->>'description', '') from services
      where title ilike ${like} or data::text ilike ${like} limit 5)
    union all
    (select 'Skill category', id::text, title, '' from skill_groups
      where title ilike ${like} or data::text ilike ${like} limit 5)
    union all
    (select 'Testimonial', id::text, title, coalesce(data->>'quote', '') from testimonials
      where title ilike ${like} or data::text ilike ${like} limit 5)
    union all
    (select 'Message', id::text, name || ' · ' || email, left(message, 120) from contact_submissions
      where name ilike ${like} or email ilike ${like} or subject ilike ${like} or message ilike ${like}
      order by created_at desc limit 5)
    union all
    (select 'Image', id::text, filename, alt from media where filename ilike ${like} or alt ilike ${like} limit 5)
  `;
  const href = (kind: string, id: string) =>
    ({
      Project: `/admin/projects/${id}`,
      Service: `/admin/services?edit=${id}`,
      "Skill category": `/admin/skills?edit=${id}`,
      Testimonial: `/admin/testimonials?edit=${id}`,
      Message: `/admin/messages?open=${id}`,
      Image: `/admin/media`,
    })[kind] ?? "/admin";
  return NextResponse.json({ results: rows.map((r) => ({ ...r, href: href(r.kind, r.id), detail: r.detail.slice(0, 140) })) });
}
