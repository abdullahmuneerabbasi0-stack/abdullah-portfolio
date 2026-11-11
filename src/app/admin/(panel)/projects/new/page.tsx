import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/server/auth";
import { ProjectEditor } from "@/components/admin/forms/ProjectEditor";

export const metadata: Metadata = { title: "New project" };

export default async function Page() {
  await requireAdminPage();
  return <ProjectEditor id={null} initial={null} published={false} previews={{}} />;
}
