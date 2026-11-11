import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/server/auth";
import { getSettings } from "@/lib/server/repo";
import { ContactSettingsForm } from "@/components/admin/forms/ContactForm";

export const metadata: Metadata = { title: "Contact details" };

export default async function Page() {
  await requireAdminPage();
  const s = await getSettings("contact");
  return <ContactSettingsForm initial={s.draft} hasUnpublished={s.hasUnpublished} publishedAt={s.publishedAt} />;
}
