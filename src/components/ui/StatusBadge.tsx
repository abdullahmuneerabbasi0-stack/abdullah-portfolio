import type { ProjectStatus } from "@/content/projects";

const tone: Record<ProjectStatus, string> = {
  Concept: "border-white/15 text-muted",
  "Planning & architecture": "border-accent-3/40 text-accent-3",
  "In development": "border-accent-2/40 text-accent-2",
  Beta: "border-accent-3/40 text-accent-3",
  Live: "border-emerald-400/40 text-emerald-300",
};

export function StatusBadge({ status, detail }: { status: ProjectStatus; detail?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border bg-black/30 px-3 py-1 text-xs font-medium ${tone[status]}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      {status}
      {detail && <span className="text-muted">· {detail}</span>}
    </span>
  );
}
