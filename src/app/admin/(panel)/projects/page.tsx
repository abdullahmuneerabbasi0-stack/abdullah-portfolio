import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireAdminPage } from "@/lib/server/auth";
import { listCollection } from "@/lib/server/repo";
import { mediaPreviews } from "@/lib/server/previews";
import { ButtonLink, PageHeader } from "@/components/admin/ui";
import { ProjectsList } from "@/components/admin/ProjectsList";

export const metadata: Metadata = { title: "Projects" };

export default async function Page() {
  await requireAdminPage();
  const rows = await listCollection("projects");
  const previews = await mediaPreviews(rows.map((r) => r.data.cover ?? ""));
  return (
    <>
      <PageHeader
        title="Projects"
        description="Add, edit, reorder and publish the projects on your site. Drafts are never shown to visitors. Drag rows to change the order."
        actions={
          <ButtonLink href="/admin/projects/new" variant="primary" icon={<Plus className="h-4 w-4" />}>
            New project
          </ButtonLink>
        }
      />
      <ProjectsList
        rows={rows.map((r) => ({
          id: r.id,
          title: r.data.title,
          subtitle: r.data.tagline,
          published: r.published,
          updatedAt: r.updatedAt,
          cover: r.data.cover ? (previews[r.data.cover] ?? null) : null,
          flagship: !!r.data.flagship,
          status: r.data.status,
        }))}
      />
    </>
  );
}
