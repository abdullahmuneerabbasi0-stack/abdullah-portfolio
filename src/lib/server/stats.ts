import "server-only";
import { db } from "./db";

export type DayCount = { day: string; count: number };

/** Real counts straight from the database; nothing here is estimated. */
export async function dashboardStats() {
  const sql = db();
  const [counts] = await sql<
    {
      projects: number;
      projects_published: number;
      services: number;
      services_published: number;
      skills: number;
      testimonials: number;
      testimonials_published: number;
      media: number;
      media_bytes: number;
      messages: number;
      unread: number;
    }[]
  >`
    select
      (select count(*) from projects)::int as projects,
      (select count(*) from projects where published)::int as projects_published,
      (select count(*) from services)::int as services,
      (select count(*) from services where published)::int as services_published,
      (select count(*) from skill_groups)::int as skills,
      (select count(*) from testimonials)::int as testimonials,
      (select count(*) from testimonials where published)::int as testimonials_published,
      (select count(*) from media)::int as media,
      (select coalesce(sum(size), 0) from media)::int as media_bytes,
      (select count(*) from contact_submissions)::int as messages,
      (select count(*) from contact_submissions where not is_read)::int as unread
  `;
  const statusRows = await sql<{ status: string; n: number }[]>`
    select coalesce(data->>'status', 'Unknown') as status, count(*)::int as n from projects group by 1 order by 2 desc
  `;
  const series = async (tableName: "contact_submissions" | "activity_log"): Promise<DayCount[]> => {
    const rows = await sql<{ day: string; count: number }[]>`
      select to_char(d.day, 'YYYY-MM-DD') as day, coalesce(c.n, 0)::int as count
      from generate_series(current_date - 29, current_date, interval '1 day') as d(day)
      left join (
        select date_trunc('day', created_at)::date as day, count(*) as n from ${sql(tableName)}
        where created_at >= current_date - 29 group by 1
      ) c on c.day = d.day::date
      order by d.day
    `;
    return rows;
  };
  const messagesByDay = await series("contact_submissions");
  const updatesByDay = await series("activity_log");
  return { counts, statusRows, messagesByDay, updatesByDay };
}
