import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdminPage } from "@/lib/server/auth";
import { listCollection } from "@/lib/server/repo";

import { SkillsManager } from "@/components/admin/managers";

export const metadata: Metadata = { title: "Skills" };

export default async function Page() {
  await requireAdminPage();
  const items = await listCollection("skills");
  return (
    <Suspense>
      <SkillsManager items={items} />
    </Suspense>
  );
}
