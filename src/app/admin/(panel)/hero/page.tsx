import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/server/auth";
import { getSettings } from "@/lib/server/repo";
import { mediaPreviews } from "@/lib/server/previews";
import { HeroForm } from "@/components/admin/forms/HeroForm";

export const metadata: Metadata = { title: "Hero & profile" };

export default async function Page() {
  await requireAdminPage();
  const s = await getSettings("hero");
  return <HeroForm initial={s.draft} hasUnpublished={s.hasUnpublished} publishedAt={s.publishedAt} previews={await mediaPreviews(s.draft)} />;
}
