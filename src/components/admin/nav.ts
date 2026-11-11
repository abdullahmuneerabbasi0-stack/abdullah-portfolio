import {
  Activity,
  Brush,
  Briefcase,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  ListTree,
  Mail,
  MessageSquareQuote,
  Settings,
  Sparkles,
  User,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; keywords?: string };
export type NavGroup = { title: string; items: NavItem[] };

export const ADMIN_NAV: NavGroup[] = [
  { title: "", items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard, keywords: "dashboard home stats" }] },
  {
    title: "Content",
    items: [
      { href: "/admin/hero", label: "Hero & profile", icon: UserRound, keywords: "heading name photo buttons cv headline" },
      { href: "/admin/about", label: "About & education", icon: User, keywords: "introduction facts education certifications interests" },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban, keywords: "case studies portfolio" },
      { href: "/admin/services", label: "Services", icon: Briefcase, keywords: "offer" },
      { href: "/admin/skills", label: "Skills", icon: Wrench, keywords: "technologies proficiency" },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, keywords: "reviews quotes clients" },
      { href: "/admin/contact", label: "Contact details", icon: Mail, keywords: "email phone social links form" },
    ],
  },
  {
    title: "Design",
    items: [
      { href: "/admin/appearance", label: "Appearance", icon: Brush, keywords: "colors colours fonts theme dark light buttons radius spacing animation" },
      { href: "/admin/navigation", label: "Navigation & sections", icon: ListTree, keywords: "menu order footer visibility" },
    ],
  },
  {
    title: "Library",
    items: [
      { href: "/admin/media", label: "Media", icon: ImageIcon, keywords: "images upload photos" },
      { href: "/admin/messages", label: "Messages", icon: Inbox, keywords: "contact submissions inbox" },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/activity", label: "Activity", icon: Activity, keywords: "history log changes" },
      { href: "/admin/settings", label: "Account & security", icon: Settings, keywords: "password sessions logout" },
    ],
  },
];

export const BRAND_ICON = Sparkles;
