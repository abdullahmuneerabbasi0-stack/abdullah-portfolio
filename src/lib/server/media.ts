import "server-only";
import sharp, { type Metadata as SharpMetadata } from "sharp";
import { db } from "./db";
import { TABLES } from "./repo";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // Vercel functions accept bodies up to 4.5 MB.
const MAX_DIMENSION = 2400;
const MAX_INPUT_PIXELS = 50_000_000;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "gif", "heif"]);

export type MediaItem = {
  id: string;
  filename: string;
  alt: string;
  folder: string;
  width: number;
  height: number;
  size: number;
  version: number;
  url: string;
  createdAt: string;
  updatedAt: string;
};

export const mediaUrl = (id: string, version: number) => `/media/${id}/${version}`;

export class UploadError extends Error {}

/**
 * Validates an upload by actually decoding it (the file extension and the
 * browser's content type are never trusted), then resizes it to at most
 * 2400px, strips metadata (including GPS location) and re-encodes as WebP.
 * SVG is refused because it can carry scripts.
 */
export async function processImage(input: Buffer) {
  if (input.length === 0) throw new UploadError("The file is empty.");
  if (input.length > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 4 MB or smaller.");
  let meta: SharpMetadata;
  try {
    meta = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS }).metadata();
  } catch {
    throw new UploadError("That file isn't a supported image. Use JPG, PNG, WebP, AVIF or GIF.");
  }
  if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) throw new UploadError("Use JPG, PNG, WebP, AVIF or GIF images.");
  const out = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS })
    .rotate() // respect camera orientation before metadata is stripped
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  return { data: out.data, width: out.info.width, height: out.info.height, size: out.info.size, mime: "image/webp" };
}

type MediaRow = { id: string; filename: string; alt: string; folder: string; width: number; height: number; size: number; version: number; created_at: Date; updated_at: Date };

const toItem = (r: MediaRow): MediaItem => ({
  id: r.id,
  filename: r.filename,
  alt: r.alt,
  folder: r.folder,
  width: r.width,
  height: r.height,
  size: r.size,
  version: r.version,
  url: mediaUrl(r.id, r.version),
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at.toISOString(),
});

export async function listMedia(): Promise<MediaItem[]> {
  const rows = await db()<MediaRow[]>`
    select id, filename, alt, folder, width, height, size, version, created_at, updated_at
    from media order by created_at desc
  `;
  return rows.map(toItem);
}

export async function getMediaMeta(ids: string[]): Promise<MediaItem[]> {
  if (!ids.length) return [];
  const rows = await db()<MediaRow[]>`
    select id, filename, alt, folder, width, height, size, version, created_at, updated_at
    from media where id in ${db()(ids)}
  `;
  return rows.map(toItem);
}

export async function insertMedia(file: { filename: string; alt: string; folder: string }, img: Awaited<ReturnType<typeof processImage>>) {
  const [r] = await db()<MediaRow[]>`
    insert into media (filename, alt, folder, mime, width, height, size, data)
    values (${file.filename}, ${file.alt}, ${file.folder}, ${img.mime}, ${img.width}, ${img.height}, ${img.size}, ${img.data})
    returning id, filename, alt, folder, width, height, size, version, created_at, updated_at
  `;
  return toItem(r);
}

export async function replaceMedia(id: string, img: Awaited<ReturnType<typeof processImage>>) {
  const [r] = await db()<MediaRow[]>`
    update media set data = ${img.data}, mime = ${img.mime}, width = ${img.width}, height = ${img.height},
      size = ${img.size}, version = version + 1, updated_at = now()
    where id = ${id}
    returning id, filename, alt, folder, width, height, size, version, created_at, updated_at
  `;
  return r ? toItem(r) : null;
}

export async function updateMediaMeta(id: string, meta: { alt: string; folder: string; filename: string }) {
  await db()`update media set alt = ${meta.alt}, folder = ${meta.folder}, filename = ${meta.filename}, updated_at = now() where id = ${id}`;
}

export async function deleteMedia(id: string) {
  await db()`delete from media where id = ${id}`;
}

export async function readMedia(id: string, version: number) {
  const [r] = await db()<{ data: Buffer; mime: string; version: number }[]>`
    select data, mime, version from media where id = ${id}
  `;
  if (!r) return null;
  return { ...r, current: r.version === version };
}

/** Where each image is used, so unused images can be cleaned up safely. */
export async function mediaUsage(): Promise<Record<string, string[]>> {
  const usage: Record<string, string[]> = {};
  const add = (text: string, where: string) => {
    for (const m of text.matchAll(/media:([0-9a-f-]{36})/g)) {
      const list = (usage[m[1]] ??= []);
      if (!list.includes(where)) list.push(where);
    }
  };
  const settings = await db()<{ key: string; t: string }[]>`select key, coalesce(draft::text, '') || coalesce(published::text, '') as t from site_settings`;
  for (const s of settings) add(s.t, s.key[0].toUpperCase() + s.key.slice(1));
  for (const [key, tbl] of Object.entries(TABLES)) {
    const rows = await db()<{ title: string; t: string }[]>`select title, data::text as t from ${db()(tbl)}`;
    for (const r of rows) add(r.t, `${key[0].toUpperCase() + key.slice(1)}: ${r.title}`);
  }
  return usage;
}
