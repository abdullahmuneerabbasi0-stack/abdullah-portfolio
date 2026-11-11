import { isUuid } from "@/lib/validate";
import { isDbConfigured } from "@/lib/server/db";
import { readMedia } from "@/lib/server/media";

export const runtime = "nodejs";

/**
 * Serves media-library images. The version in the URL changes whenever an
 * image is replaced, so each URL can be cached forever by browsers and the CDN.
 */
export async function GET(_req: Request, ctx: RouteContext<"/media/[id]/[version]">) {
  const { id, version } = await ctx.params;
  if (!isDbConfigured() || !isUuid(id) || !/^\d{1,6}$/.test(version)) return new Response("Not found", { status: 404 });
  const img = await readMedia(id, Number(version));
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(img.data), {
    headers: {
      "Content-Type": img.mime,
      "Content-Length": String(img.data.length),
      "Cache-Control": img.current ? "public, max-age=31536000, immutable" : "public, max-age=60",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
