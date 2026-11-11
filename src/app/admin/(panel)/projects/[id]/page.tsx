import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/server/auth";
import { getItem } from "@/lib/server/repo";
import { mediaPreviews } from "@/lib/server/previews";
import { isUuid } from "@/lib/validate";
import { ProjectEditor } from "@/components/admin/forms/ProjectEditor";

export const metadata: Metadata = { title: "Edit project" };

export default async function Page({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdminPage();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const row = await getItem("projects", id);
  if (!row) notFound();
  return <ProjectEditor key={row.id} id={row.id} initial={row.data} published={row.published} previews={await mediaPreviews(row.data)} />;
}
