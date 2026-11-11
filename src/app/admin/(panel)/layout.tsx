import { requireAdminPage } from "@/lib/server/auth";
import { unreadCount } from "@/lib/server/inbox";
import { allSettingsStatus, getSettings } from "@/lib/server/repo";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdminPage();
  const [unread, status, hero] = await Promise.all([unreadCount(), allSettingsStatus(), getSettings("hero")]);
  return (
    <AdminShell
      admin={{ name: admin.name, email: admin.email }}
      siteName={hero.draft.name}
      initials={hero.draft.initials}
      unread={unread}
      pendingPublish={status.filter((s) => s.hasUnpublished).length}
    >
      {children}
    </AdminShell>
  );
}
