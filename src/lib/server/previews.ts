import "server-only";
import { getMediaMeta } from "./media";

/** Maps "media:<id>" references found in a value to their current image URLs. */
export async function mediaPreviews(value: unknown): Promise<Record<string, string>> {
  const ids = [...new Set([...JSON.stringify(value).matchAll(/"media:([0-9a-f-]{36})"/g)].map((m) => m[1]))];
  const out: Record<string, string> = {};
  for (const m of await getMediaMeta(ids)) out[`media:${m.id}`] = m.url;
  return out;
}
