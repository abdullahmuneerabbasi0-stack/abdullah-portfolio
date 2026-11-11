import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { getSettings } from "@/lib/server/repo";
import { AboutForm } from "@/components/admin/forms/AboutForm";

export const metadata: Metadata = { title: "About & education" };

export default async function Page() {
  await requireAdminPage();
  const s = await getSettings("about");
  const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from projects where published`;
  return <AboutForm initial={s.draft} hasUnpublished={s.hasUnpublished} publishedAt={s.publishedAt} projectCount={n} />;
}
