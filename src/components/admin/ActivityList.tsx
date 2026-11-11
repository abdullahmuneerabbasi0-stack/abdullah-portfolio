import { Activity as ActivityIcon, Eye, EyeOff, LogIn, Pencil, Plus, Rocket, RotateCcw, Trash2, ArrowUpDown, Download } from "lucide-react";
import type { Activity } from "@/lib/server/repo";
import { fmtDate } from "./time";

const ICONS: Record<string, typeof Pencil> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  publish: Rocket,
  unpublish: EyeOff,
  reorder: ArrowUpDown,
  discard: RotateCcw,
  login: LogIn,
  import: Download,
  view: Eye,
};

export function ActivityList({ items, empty = "No activity yet." }: { items: Activity[]; empty?: string }) {
  if (!items.length) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;
  return (
    <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-white/[0.07]">
      {items.map((a) => {
        const Icon = ICONS[a.action] ?? ActivityIcon;
        return (
          <li key={a.id} className="relative flex gap-3">
            <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full border ${a.action === "publish" ? "border-accent/40 bg-accent/15 text-accent-2" : a.action === "delete" ? "border-red-400/25 bg-red-500/10 text-red-300" : "border-white/10 bg-[#141110] text-muted"}`}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-sm leading-snug text-text/90">{a.summary}</p>
              <p className="mt-0.5 text-[0.7rem] text-muted">
                {fmtDate(a.createdAt)}
                {a.who ? ` · ${a.who}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
