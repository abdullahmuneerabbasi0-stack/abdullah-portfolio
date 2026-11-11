"use server";

import { draftMode } from "next/headers";
import { collectionParsers, settingsParsers } from "@/lib/content/schemas";
import { SETTINGS_KEYS, type CollectionKey, type SettingsKey } from "@/lib/content/types";
import { isUuid } from "@/lib/validate";
import * as repo from "@/lib/server/repo";
import { adminAction, refreshPublicSite, UserError } from "./shared";

const LABELS: Record<SettingsKey, string> = {
  hero: "Hero & profile",
  about: "About",
  contact: "Contact",
  layout: "Navigation & sections",
  appearance: "Appearance",
};
const COLLECTION_LABELS: Record<CollectionKey, string> = {
  projects: "project",
  services: "service",
  skills: "skill category",
  testimonials: "testimonial",
};

const isSettingsKey = (k: unknown): k is SettingsKey => SETTINGS_KEYS.includes(k as SettingsKey);
const isCollection = (k: unknown): k is CollectionKey => typeof k === "string" && k in COLLECTION_LABELS;

// Settings ---------------------------------------------------------------------------

/** Saves a draft. Visitors keep seeing the published version until it's published. */
export async function saveSettingsDraft(key: SettingsKey, value: unknown, opts: { publish?: boolean } = {}) {
  return adminAction(async (admin) => {
    if (!isSettingsKey(key)) throw new UserError("Unknown section.");
    const parsed = settingsParsers[key](value);
    if (!parsed.ok) throw new UserError("Some fields need attention before saving.", parsed.errors);
    await repo.saveDraft(key, parsed.value as never);
    if (opts.publish) {
      await repo.publishSettings([key]);
      refreshPublicSite();
      await repo.logActivity(admin, "publish", key, null, `Published ${LABELS[key]}`);
      return { message: `${LABELS[key]} published. The live site is updated.` };
    }
    await repo.logActivity(admin, "update", key, null, `Saved a draft of ${LABELS[key]}`);
    return { message: "Draft saved. Publish when you're ready for visitors to see it." };
  });
}

export async function publishAllSettings() {
  return adminAction(async (admin) => {
    const pending = (await repo.allSettingsStatus()).filter((s) => s.hasUnpublished).map((s) => s.key);
    if (!pending.length) return { message: "Everything is already published." };
    await repo.publishSettings(pending);
    refreshPublicSite();
    await repo.logActivity(admin, "publish", "site", null, `Published ${pending.map((k) => LABELS[k]).join(", ")}`);
    return { message: `Published ${pending.length} section${pending.length === 1 ? "" : "s"}.` };
  });
}

export async function discardSettingsDraft(key: SettingsKey) {
  return adminAction(async (admin) => {
    if (!isSettingsKey(key)) throw new UserError("Unknown section.");
    await repo.discardDraft(key);
    await repo.logActivity(admin, "discard", key, null, `Discarded unpublished changes to ${LABELS[key]}`);
    return { message: "Unpublished changes discarded." };
  });
}

/** Turns on preview mode for this browser so the site shows drafts. */
export async function enablePreview() {
  return adminAction(async () => {
    (await draftMode()).enable();
    return {};
  });
}

// Collections --------------------------------------------------------------------

export async function saveItem(key: CollectionKey, id: string | null, value: unknown, published: boolean) {
  return adminAction<{ id: string }>(async (admin) => {
    if (!isCollection(key)) throw new UserError("Unknown collection.");
    if (id !== null && !isUuid(id)) throw new UserError("Unknown item.");
    const parsed = collectionParsers[key](value);
    if (!parsed.ok) throw new UserError("Some fields need attention before saving.", parsed.errors);
    const data = parsed.value;
    if (key === "projects") {
      const slug = (data as { slug: string }).slug;
      if (await repo.slugTaken(slug, id ?? undefined))
        throw new UserError("That web address is already used by another project.", { slug: "Already used by another project." });
    }
    const label = COLLECTION_LABELS[key];
    const title = "title" in data ? (data as { title: string }).title : (data as { name: string }).name;
    let savedId = id;
    if (id) {
      const existing = await repo.getItem(key, id);
      if (!existing) throw new UserError(`This ${label} no longer exists. It may have been deleted.`);
      await repo.updateItem(key, id, data as never, !!published);
      await repo.logActivity(admin, "update", key, id, `Updated ${label} "${title}"${published ? "" : " (draft)"}`);
    } else {
      savedId = await repo.createItem(key, data as never, !!published);
      await repo.logActivity(admin, "create", key, savedId, `Added ${label} "${title}"${published ? "" : " as a draft"}`);
    }
    refreshPublicSite();
    return { id: savedId!, message: published ? `Saved and live on the site.` : `Saved as a draft. It's hidden from visitors.` };
  });
}

export async function setItemPublished(key: CollectionKey, id: string, published: boolean) {
  return adminAction(async (admin) => {
    if (!isCollection(key) || !isUuid(id)) throw new UserError("Unknown item.");
    const item = await repo.getItem(key, id);
    if (!item) throw new UserError("This item no longer exists.");
    await repo.setPublished(key, id, !!published);
    const title = "title" in item.data ? (item.data as { title: string }).title : (item.data as { name: string }).name;
    await repo.logActivity(admin, published ? "publish" : "unpublish", key, id, `${published ? "Published" : "Hid"} ${COLLECTION_LABELS[key]} "${title}"`);
    refreshPublicSite();
    return { message: published ? "Now visible on the site." : "Hidden from the site." };
  });
}

export async function deleteItem(key: CollectionKey, id: string) {
  return adminAction(async (admin) => {
    if (!isCollection(key) || !isUuid(id)) throw new UserError("Unknown item.");
    const item = await repo.getItem(key, id);
    if (!item) return { message: "Already deleted." };
    await repo.deleteItem(key, id);
    const title = "title" in item.data ? (item.data as { title: string }).title : (item.data as { name: string }).name;
    await repo.logActivity(admin, "delete", key, id, `Deleted ${COLLECTION_LABELS[key]} "${title}"`);
    refreshPublicSite();
    return { message: "Deleted." };
  });
}

export async function reorderItems(key: CollectionKey, ids: string[]) {
  return adminAction(async (admin) => {
    if (!isCollection(key) || !Array.isArray(ids) || ids.length > 500 || !ids.every(isUuid)) throw new UserError("Invalid order.");
    await repo.reorder(key, ids);
    await repo.logActivity(admin, "reorder", key, null, `Reordered ${COLLECTION_LABELS[key]}s`);
    refreshPublicSite();
    return { message: "Order saved." };
  });
}
