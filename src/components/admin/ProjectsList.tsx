"use client";

import { useRouter } from "next/navigation";
import { FolderKanban, Plus, Star } from "lucide-react";
import { CollectionList, type ListRow } from "./CollectionList";
import { Badge, ButtonLink, EmptyState } from "./ui";

export type ProjectRow = Omit<ListRow, "thumb" | "badges"> & { cover?: string | null; flagship: boolean; status: string };

export function ProjectsList({ rows }: { rows: ProjectRow[] }) {
  const router = useRouter();
  return (
    <CollectionList
      collection="projects"
      noun="project"
      onEdit={(id) => router.push(`/admin/projects/${id}`)}
      rows={rows.map((r) => ({
        ...r,
        thumb: (
          <span className="relative hidden h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(160deg,#211c18,#0c0a09)] sm:block">
            {r.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
          </span>
        ),
        badges: (
          <>
            <Badge>{r.status}</Badge>
            {r.flagship && (
              <Badge tone="accent">
                <Star className="h-3 w-3" /> Featured
              </Badge>
            )}
          </>
        ),
      }))}
      empty={
        <EmptyState
          icon={<FolderKanban className="h-5 w-5" />}
          title="No projects yet"
          description="Add your first project. It stays a draft until you publish it."
          action={
            <ButtonLink href="/admin/projects/new" variant="primary" icon={<Plus className="h-4 w-4" />}>
              New project
            </ButtonLink>
          }
        />
      }
    />
  );
}
