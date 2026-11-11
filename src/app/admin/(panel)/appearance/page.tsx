import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/server/auth";
import { getSettings } from "@/lib/server/repo";
import { AppearanceForm } from "@/components/admin/forms/AppearanceForm";

export const metadata: Metadata = { title: "Appearance" };

export default async function Page() {
  await requireAdminPage();
  const s = await getSettings("appearance");
  return <AppearanceForm initial={s.draft} hasUnpublished={s.hasUnpublished} publishedAt={s.publishedAt} />;
}
