import {
  Bot,
  ClipboardList,
  Cloud,
  Code2,
  Cpu,
  Database,
  Globe,
  Handshake,
  Layout,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Palette,
  PenTool,
  Rocket,
  Search,
  Server,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Wand2,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/content/icons";

export const icons: Record<IconName, LucideIcon> = {
  Bot,
  ClipboardList,
  Cloud,
  Code2,
  Cpu,
  Database,
  Globe,
  Handshake,
  Layout,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Palette,
  PenTool,
  Rocket,
  Search,
  Server,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Wand2,
  Workflow,
  Wrench,
};

/** Looks up an icon by name so content can stay plain data. */
export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = icons[name as IconName] ?? Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}
