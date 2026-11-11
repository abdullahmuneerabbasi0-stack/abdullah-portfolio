import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/server/auth";
import { getSubmission, listSubmissions } from "@/lib/server/inbox";
import { getSettings } from "@/lib/server/repo";
import { isUuid } from "@/lib/validate";
import { PageHeader } from "@/components/admin/ui";
import { Inbox } from "@/components/admin/Inbox";

export const metadata: Metadata = { title: "Messages" };

export default async function Page({ searchParams }: PageProps<"/admin/messages">) {
  await requireAdminPage();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const filter = sp.filter === "unread" || sp.filter === "read" ? sp.filter : "all";
  const page = Math.max(1, Math.min(10000, Number(sp.page) || 1));
  const [list, contact] = await Promise.all([listSubmissions({ q, filter, page, perPage: 20 }), getSettings("contact")]);
  const openId = typeof sp.open === "string" && isUuid(sp.open) ? sp.open : null;
  const opened = openId ? (list.items.find((m) => m.id === openId) ?? (await getSubmission(openId))) : null;
  return (
    <>
      <PageHeader title="Messages" description="Everything sent through the contact form on your site, newest first." />
      <Inbox key={`${q}|${filter}|${page}`} list={list} q={q} filter={filter} opened={opened} formEnabled={!!contact.published?.form.enabled} />
    </>
  );
}
