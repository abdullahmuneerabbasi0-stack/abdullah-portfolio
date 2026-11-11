import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/server/auth";
import { getSettings } from "@/lib/server/repo";
import { getSiteData } from "@/lib/server/site-data";
import { sectionHasContent } from "@/components/site/nav";
import { SECTION_KEYS } from "@/lib/content/types";
import { NavigationForm } from "@/components/admin/forms/NavigationForm";

export const metadata: Metadata = { title: "Navigation & sections" };

export default async function Page() {
  await requireAdminPage();
  const [s, data] = await Promise.all([getSettings("layout"), getSiteData()]);
  const empty = SECTION_KEYS.filter((k) => !sectionHasContent(data, k));
  return <NavigationForm initial={s.draft} hasUnpublished={s.hasUnpublished} publishedAt={s.publishedAt} emptySections={empty} />;
}
