import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/server/auth";
import { processImage, replaceMedia, UploadError, MAX_UPLOAD_BYTES } from "@/lib/server/media";
import { logActivity } from "@/lib/server/repo";
import { SITE_TAG } from "@/lib/server/site-data";
import { jsonError, sameOrigin } from "@/lib/server/http";
import { isUuid } from "@/lib/validate";

export const runtime = "nodejs";

/** Replace an image's file while keeping it wherever it's used on the site. */
export async function POST(req: Request, ctx: RouteContext<"/api/admin/media/[id]">) {
  if (!sameOrigin(req)) return jsonError("Cross-site request blocked", 403);
  let admin;
  try {
    admin = await requireAdmin();
  } catch (e) {
    return jsonError(e instanceof AuthError ? e.message : "Not signed in", 401);
  }
  const { id } = await ctx.params;
  if (!isUuid(id)) return jsonError("Unknown image.", 404);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_UPLOAD_BYTES + 64 * 1024) return jsonError("Images must be 4 MB or smaller.", 413);
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return jsonError("Choose an image to upload.", 400);
  try {
    const img = await processImage(Buffer.from(await file.arrayBuffer()));
    const item = await replaceMedia(id, img);
    if (!item) return jsonError("This image no longer exists.", 404);
    await logActivity(admin, "update", "media", id, `Replaced image "${item.filename}"`);
    revalidateTag(SITE_TAG, { expire: 0 });
    revalidatePath("/", "layout");
    return NextResponse.json({ item });
  } catch (e) {
    if (e instanceof UploadError) return jsonError(e.message, 400);
    console.error("[media replace]", e);
    return jsonError("Upload failed. Please try again.", 500);
  }
}
