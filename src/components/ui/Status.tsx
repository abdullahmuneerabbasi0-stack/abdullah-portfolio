import type { ProjectStatus } from "@/content/projects";

/** Project status as a plain monospace label. Only "Live" uses the signal colour. */
export function Status({ status, detail }: { status: ProjectStatus; detail?: string }) {
  const live = status === "Live";
  return (
    <span className="label inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`inline-block h-2 w-2 ${live ? "rounded-full bg-accent" : "rounded-full border border-current"}`}
      />
      <span className={live ? "text-accent" : undefined}>{status}</span>
      {detail && <span>· {detail}</span>}
    </span>
  );
}
