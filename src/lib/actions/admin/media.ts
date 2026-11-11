"use server";

import { Ctx, isUuid, text } from "@/lib/validate";
import { deleteMedia, getMediaMeta, mediaUsage, updateMediaMeta } from "@/lib/server/media";
import { logActivity } from "@/lib/server/repo";
import { adminAction, refreshPublicSite, UserError } from "./shared";

export async function saveMediaDetails(id: string, input: { alt: string; folder: string; filename: string }) {
  return adminAction(async (admin) => {
    if (!isUuid(id)) throw new UserError("Unknown image.");
    const c = new Ctx();
    const value = {
      alt: text(c, input.alt, "alt", { max: 200, label: "Alt text" }),
      folder: text(c, input.folder, "folder", { max: 40, label: "Folder" }) || "General",
      filename: text(c, input.filename, "filename", { max: 120, required: true, label: "File name" }),
    };
    if (!c.ok) throw new UserError("Please fix the highlighted fields.", c.errors);
    await updateMediaMeta(id, value);
    await logActivity(admin, "update", "media", id, `Updated details of "${value.filename}"`);
    refreshPublicSite();
    return { message: "Image details saved." };
  });
}

export async function removeMedia(id: string, force = false) {
  return adminAction(async (admin) => {
    if (!isUuid(id)) throw new UserError("Unknown image.");
    const [meta] = await getMediaMeta([id]);
    if (!meta) return { message: "Already deleted." };
    const used = (await mediaUsage())[id] ?? [];
    if (used.length && !force) throw new UserError(`This image is still used in: ${used.join(", ")}. Replace it there first.`);
    await deleteMedia(id);
    await logActivity(admin, "delete", "media", id, `Deleted image "${meta.filename}"`);
    refreshPublicSite();
    return { message: "Image deleted." };
  });
}
