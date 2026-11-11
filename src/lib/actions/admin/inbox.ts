"use server";

import { isUuid } from "@/lib/validate";
import { deleteSubmissions, setRead } from "@/lib/server/inbox";
import { logActivity } from "@/lib/server/repo";
import { adminAction, UserError } from "./shared";

const check = (ids: string[]) => {
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 200 || !ids.every(isUuid)) throw new UserError("Nothing selected.");
};

export async function markMessages(ids: string[], read: boolean) {
  return adminAction(async () => {
    check(ids);
    await setRead(ids, !!read);
    return { message: `Marked as ${read ? "read" : "unread"}.` };
  });
}

export async function deleteMessages(ids: string[]) {
  return adminAction(async (admin) => {
    check(ids);
    await deleteSubmissions(ids);
    await logActivity(admin, "delete", "messages", null, `Deleted ${ids.length} message${ids.length === 1 ? "" : "s"}`);
    return { message: `Deleted ${ids.length} message${ids.length === 1 ? "" : "s"}.` };
  });
}
