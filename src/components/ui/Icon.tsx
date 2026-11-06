import {
  Bot,
  ClipboardList,
  Code2,
  Database,
  Handshake,
  Layout,
  LayoutDashboard,
  MessageSquare,
  Server,
  Sparkles,
  Wand2,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Bot,
  ClipboardList,
  Code2,
  Database,
  Handshake,
  Layout,
  LayoutDashboard,
  MessageSquare,
  Server,
  Sparkles,
  Wand2,
  Workflow,
  Wrench,
};

/** Looks up an icon by name so content files can stay plain data. */
export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = icons[name] ?? Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}
