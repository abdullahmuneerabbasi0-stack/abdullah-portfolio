import "server-only";
import { db } from "./db";

export type Submission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type SubRow = { id: string; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: Date };
const toSub = (r: SubRow): Submission => ({
  id: r.id,
  name: r.name,
  email: r.email,
  subject: r.subject,
  message: r.message,
  isRead: r.is_read,
  createdAt: r.created_at.toISOString(),
});

export async function listSubmissions(opts: { q?: string; filter?: "all" | "unread" | "read"; page?: number; perPage?: number }) {
  const { q = "", filter = "all", page = 1, perPage = 20 } = opts;
  const sql = db();
  const like = `%${q.replace(/[\\%_]/g, (m) => "\\" + m)}%`;
  const where = sql`
    where true
    ${q ? sql`and (name ilike ${like} or email ilike ${like} or subject ilike ${like} or message ilike ${like})` : sql``}
    ${filter === "unread" ? sql`and is_read = false` : filter === "read" ? sql`and is_read = true` : sql``}
  `;
  const rows = await sql<SubRow[]>`
    select id, name, email, subject, message, is_read, created_at from contact_submissions
    ${where}
    order by created_at desc
    limit ${perPage} offset ${(page - 1) * perPage}
  `;
  const [{ total }] = await sql<{ total: number }[]>`select count(*)::int as total from contact_submissions ${where}`;
  return { items: rows.map(toSub), total, page, perPage };
}

export async function getSubmission(id: string) {
  const [r] = await db()<SubRow[]>`select id, name, email, subject, message, is_read, created_at from contact_submissions where id = ${id}`;
  return r ? toSub(r) : null;
}

export async function setRead(ids: string[], read: boolean) {
  if (!ids.length) return;
  await db()`update contact_submissions set is_read = ${read} where id in ${db()(ids)}`;
}

export async function deleteSubmissions(ids: string[]) {
  if (!ids.length) return;
  await db()`delete from contact_submissions where id in ${db()(ids)}`;
}

export async function unreadCount() {
  const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from contact_submissions where is_read = false`;
  return n;
}

export async function createSubmission(s: { name: string; email: string; subject: string; message: string; ipHash: string }) {
  await db()`
    insert into contact_submissions (name, email, subject, message, ip_hash)
    values (${s.name}, ${s.email}, ${s.subject}, ${s.message}, ${s.ipHash})
  `;
}

/** At most 5 messages per visitor per hour, and 200 per day site-wide. */
export async function submissionAllowed(ipHash: string) {
  const [r] = await db()<{ by_ip: number; total: number }[]>`
    select
      count(*) filter (where ip_hash = ${ipHash} and created_at > now() - interval '1 hour')::int as by_ip,
      count(*)::int as total
    from contact_submissions where created_at > now() - interval '1 day'
  `;
  return r.by_ip < 5 && r.total < 200;
}
