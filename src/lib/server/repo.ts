import "server-only";
import { db } from "./db";
import type { Admin } from "./auth";
import {
  SETTINGS_KEYS,
  type CollectionKey,
  type CollectionMap,
  type Row,
  type SettingsKey,
  type SettingsMap,
} from "@/lib/content/types";
import {
  defaultProjects,
  defaultServices,
  defaultSettings,
  defaultSkills,
  defaultTestimonials,
} from "@/lib/content/defaults";
import { collectionTitle } from "@/lib/content/schemas";

/** Collection key -> table name. Only these fixed names are ever interpolated into SQL. */
export const TABLES: Record<CollectionKey, string> = {
  projects: "projects",
  services: "services",
  skills: "skill_groups",
  testimonials: "testimonials",
};

const table = (key: CollectionKey) => db()(TABLES[key]);

// Activity log ---------------------------------------------------------------------

export async function logActivity(admin: Admin | null, action: string, entity: string, entityId: string | null, summary: string) {
  await db()`
    insert into activity_log (user_id, action, entity, entity_id, summary)
    values (${admin?.id ?? null}, ${action}, ${entity}, ${entityId}, ${summary.slice(0, 300)})
  `;
}

export type Activity = { id: string; action: string; entity: string; entityId: string | null; summary: string; createdAt: string; who: string | null };

export async function recentActivity(limit = 20, offset = 0, entity?: string): Promise<Activity[]> {
  const rows = await db()<{ id: string; action: string; entity: string; entity_id: string | null; summary: string; created_at: Date; who: string | null }[]>`
    select a.id::text, a.action, a.entity, a.entity_id, a.summary, a.created_at, coalesce(nullif(u.name, ''), u.email) as who
    from activity_log a left join admin_users u on u.id = a.user_id
    ${entity ? db()`where a.entity = ${entity}` : db()``}
    order by a.created_at desc
    limit ${limit} offset ${offset}
  `;
  return rows.map((r) => ({ id: r.id, action: r.action, entity: r.entity, entityId: r.entity_id, summary: r.summary, createdAt: r.created_at.toISOString(), who: r.who }));
}

// Settings (draft + published) -------------------------------------------------------

export type SettingsRow<K extends SettingsKey = SettingsKey> = {
  key: K;
  draft: SettingsMap[K];
  published: SettingsMap[K] | null;
  updatedAt: string;
  publishedAt: string | null;
  hasUnpublished: boolean;
};

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export async function getSettings<K extends SettingsKey>(key: K): Promise<SettingsRow<K>> {
  const [row] = await db()<{ draft: SettingsMap[K]; published: SettingsMap[K] | null; updated_at: Date; published_at: Date | null }[]>`
    select draft, published, updated_at, published_at from site_settings where key = ${key}
  `;
  if (!row) {
    const d = defaultSettings[key];
    return { key, draft: d, published: null, updatedAt: new Date(0).toISOString(), publishedAt: null, hasUnpublished: true };
  }
  // Fill in any fields added to the defaults since this row was saved.
  const draft = { ...defaultSettings[key], ...row.draft };
  return {
    key,
    draft,
    published: row.published,
    updatedAt: row.updated_at.toISOString(),
    publishedAt: row.published_at?.toISOString() ?? null,
    hasUnpublished: !row.published || !same(row.draft, row.published),
  };
}

export async function allSettingsStatus(): Promise<{ key: SettingsKey; hasUnpublished: boolean; updatedAt: string; publishedAt: string | null }[]> {
  const rows = await db()<{ key: SettingsKey; changed: boolean; updated_at: Date; published_at: Date | null }[]>`
    select key, (published is null or draft <> published) as changed, updated_at, published_at from site_settings
  `;
  return SETTINGS_KEYS.map((key) => {
    const r = rows.find((x) => x.key === key);
    return r
      ? { key, hasUnpublished: r.changed, updatedAt: r.updated_at.toISOString(), publishedAt: r.published_at?.toISOString() ?? null }
      : { key, hasUnpublished: false, updatedAt: new Date(0).toISOString(), publishedAt: null };
  });
}

export async function saveDraft<K extends SettingsKey>(key: K, value: SettingsMap[K]) {
  await db()`
    insert into site_settings (key, draft) values (${key}, ${value as never})
    on conflict (key) do update set draft = excluded.draft, updated_at = now()
  `;
}

export async function publishSettings(keys: SettingsKey[]) {
  if (!keys.length) return;
  await db()`
    update site_settings set published = draft, published_at = now()
    where key in ${db()(keys)} and (published is null or published <> draft)
  `;
}

export async function discardDraft(key: SettingsKey) {
  await db()`update site_settings set draft = published, updated_at = now() where key = ${key} and published is not null`;
}

// Collections --------------------------------------------------------------------

type DbRow = { id: string; published: boolean; sort_order: number; created_at: Date; updated_at: Date; data: unknown; slug?: string; title: string };

function toRow<K extends CollectionKey>(key: K, r: DbRow): Row<CollectionMap[K]> {
  const data = r.data as CollectionMap[K];
  if (key === "projects") Object.assign(data, { slug: r.slug, title: r.title });
  return { id: r.id, published: r.published, sortOrder: r.sort_order, createdAt: r.created_at.toISOString(), updatedAt: r.updated_at.toISOString(), data };
}

export async function listCollection<K extends CollectionKey>(key: K, opts: { publishedOnly?: boolean } = {}): Promise<Row<CollectionMap[K]>[]> {
  const rows = await db()<DbRow[]>`
    select * from ${table(key)}
    ${opts.publishedOnly ? db()`where published = true` : db()``}
    order by sort_order asc, created_at asc
  `;
  return rows.map((r) => toRow(key, r));
}

export async function getItem<K extends CollectionKey>(key: K, id: string): Promise<Row<CollectionMap[K]> | null> {
  const [r] = await db()<DbRow[]>`select * from ${table(key)} where id = ${id}`;
  return r ? toRow(key, r) : null;
}

function columns<K extends CollectionKey>(key: K, data: CollectionMap[K]) {
  const title = collectionTitle(key, data);
  if (key === "projects") {
    const { slug, title: _t, ...rest } = data as CollectionMap["projects"];
    void _t;
    return { title, slug, data: rest };
  }
  return { title, data };
}

export async function slugTaken(slug: string, exceptId?: string) {
  const rows = await db()`select 1 from projects where slug = ${slug} ${exceptId ? db()`and id <> ${exceptId}` : db()``}`;
  return rows.length > 0;
}

export async function createItem<K extends CollectionKey>(key: K, data: CollectionMap[K], published: boolean): Promise<string> {
  const [{ next }] = await db()<{ next: number }[]>`select coalesce(max(sort_order), -1) + 1 as next from ${table(key)}`;
  const cols = { ...columns(key, data), published, sort_order: next };
  const [r] = await db()<{ id: string }[]>`insert into ${table(key)} ${db()(cols as never)} returning id`;
  return r.id;
}

export async function updateItem<K extends CollectionKey>(key: K, id: string, data: CollectionMap[K], published: boolean) {
  const cols = { ...columns(key, data), published };
  await db()`update ${table(key)} set ${db()(cols as never)}, updated_at = now() where id = ${id}`;
}

export async function setPublished(key: CollectionKey, id: string, published: boolean) {
  await db()`update ${table(key)} set published = ${published}, updated_at = now() where id = ${id}`;
}

export async function deleteItem(key: CollectionKey, id: string) {
  await db()`delete from ${table(key)} where id = ${id}`;
}

export async function reorder(key: CollectionKey, ids: string[]) {
  await db().begin(async (sql) => {
    for (const [i, id] of ids.entries()) await sql`update ${sql(TABLES[key])} set sort_order = ${i} where id = ${id}`;
  });
}

// Seeding -------------------------------------------------------------------------

/** Copies the current site content into an empty database. Never overwrites. */
export async function seedIfEmpty(): Promise<boolean> {
  const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from site_settings`;
  if (n > 0) return false;
  await db().begin(async (sql) => {
    for (const key of SETTINGS_KEYS) {
      const value = defaultSettings[key];
      await sql`insert into site_settings (key, draft, published, published_at) values (${key}, ${value as never}, ${value as never}, now()) on conflict do nothing`;
    }
    const seed = async <K extends CollectionKey>(key: K, items: CollectionMap[K][]) => {
      for (const [i, item] of items.entries()) {
        const cols = columns(key, item);
        await sql`insert into ${sql(TABLES[key])} ${sql({ ...cols, published: true, sort_order: i } as never)}`;
      }
    };
    await seed("projects", defaultProjects);
    await seed("services", defaultServices);
    await seed("skills", defaultSkills);
    await seed("testimonials", defaultTestimonials);
  });
  return true;
}
