import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import { db, isDbConfigured } from "./db";
import { getMediaMeta } from "./media";
import { listCollection } from "./repo";
import {
  SETTINGS_KEYS,
  type ResolvedImage,
  type SettingsKey,
  type SettingsMap,
  type SiteData,
} from "@/lib/content/types";
import {
  defaultProjects,
  defaultServices,
  defaultSettings,
  defaultSkills,
  defaultTestimonials,
} from "@/lib/content/defaults";

export const SITE_TAG = "site";

function filesData(): SiteData {
  return {
    ...defaultSettings,
    projects: defaultProjects,
    services: defaultServices,
    skillGroups: defaultSkills,
    testimonials: defaultTestimonials,
    images: {},
    source: "files",
    preview: false,
  };
}

async function load(preview: boolean): Promise<SiteData> {
  if (!isDbConfigured()) return filesData();
  const sql = db();
  const rows = await sql<{ key: SettingsKey; draft: unknown; published: unknown }[]>`select key, draft, published from site_settings`;
  // A configured but not-yet-initialised database keeps showing the current content.
  if (rows.length === 0) return filesData();

  const settings = {} as SettingsMap;
  for (const key of SETTINGS_KEYS) {
    const row = rows.find((r) => r.key === key);
    const value = (preview ? row?.draft : row?.published) ?? row?.published;
    (settings as Record<string, unknown>)[key] = { ...defaultSettings[key], ...(value as object | undefined) };
  }

  const pick = async <T,>(key: "projects" | "services" | "skills" | "testimonials") =>
    (await listCollection(key, { publishedOnly: !preview })).map((r) => ({ ...(r.data as T), id: r.id }));

  const [projects, services, skillGroups, testimonials] = await Promise.all([
    pick<SiteData["projects"][number]>("projects"),
    pick<SiteData["services"][number]>("services"),
    pick<SiteData["skillGroups"][number]>("skills"),
    pick<SiteData["testimonials"][number]>("testimonials"),
  ]);

  // Resolve every media-library image the content refers to in one query.
  const ids = new Set<string>();
  const scan = (v: unknown) => {
    for (const m of JSON.stringify(v).matchAll(/"media:([0-9a-f-]{36})"/g)) ids.add(m[1]);
  };
  scan(settings);
  scan([projects, services, testimonials]);
  const images: Record<string, ResolvedImage> = {};
  for (const m of await getMediaMeta([...ids]))
    images[`media:${m.id}`] = { src: `/media/${m.id}/${m.version}`, alt: m.alt, width: m.width, height: m.height };

  return { ...settings, projects, services, skillGroups, testimonials, images, source: "database", preview };
}

const loadPublished = unstable_cache(() => load(false), ["site-data-v1"], { tags: [SITE_TAG] });

/**
 * Content for the public site. Visitors get the published version from the
 * cache; an admin in preview mode gets the latest drafts, uncached.
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  let preview = false;
  try {
    preview = (await draftMode()).isEnabled;
  } catch {
    // Called outside a request (e.g. while generating static params).
  }
  return preview ? load(true) : loadPublished();
});

/** Published content only, for build-time helpers such as generateStaticParams. */
export const getPublishedSiteData = () => loadPublished();

export function resolveImage(data: Pick<SiteData, "images">, ref: string | undefined, alt = ""): ResolvedImage | null {
  if (!ref) return null;
  if (ref.startsWith("media:")) {
    const img = data.images[ref];
    return img ? { ...img, alt: alt || img.alt } : null;
  }
  return { src: ref, alt };
}
