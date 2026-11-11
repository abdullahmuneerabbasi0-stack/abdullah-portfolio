import { NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/server/auth";
import { insertMedia, listMedia, mediaUsage, processImage, UploadError, MAX_UPLOAD_BYTES } from "@/lib/server/media";
import { logActivity } from "@/lib/server/repo";
import { jsonError, sameOrigin } from "@/lib/server/http";
import { Ctx, text } from "@/lib/validate";

export const runtime = "nodejs";

/** The media library, with where each image is used. */
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return jsonError("Not signed in", 401);
  }
  const [items, usage] = await Promise.all([listMedia(), mediaUsage()]);
  return NextResponse.json({ items: items.map((m) => ({ ...m, usedIn: usage[m.id] ?? [] })) });
}

/** Upload a new image. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return jsonError("Cross-site request blocked", 403);
  let admin;
  try {
    admin = await requireAdmin();
  } catch (e) {
    return jsonError(e instanceof AuthError ? e.message : "Not signed in", 401);
  }
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_UPLOAD_BYTES + 64 * 1024) return jsonError("Images must be 4 MB or smaller.", 413);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Upload failed. Please try again.", 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("Choose an image to upload.", 400);
  const c = new Ctx();
  const name = text(c, file.name.replace(/\.[^.]+$/, ""), "filename", { max: 120 }) || "image";
  const folder = text(c, form.get("folder"), "folder", { max: 40 }) || "General";
  const alt = text(c, form.get("alt"), "alt", { max: 200 });

  try {
    const img = await processImage(Buffer.from(await file.arrayBuffer()));
    const item = await insertMedia({ filename: name, folder, alt }, img);
    await logActivity(admin, "create", "media", item.id, `Uploaded image "${name}"`);
    return NextResponse.json({ item: { ...item, usedIn: [] } }, { status: 201 });
  } catch (e) {
    if (e instanceof UploadError) return jsonError(e.message, 400);
    console.error("[media upload]", e);
    return jsonError("Upload failed. Please try again.", 500);
  }
}
