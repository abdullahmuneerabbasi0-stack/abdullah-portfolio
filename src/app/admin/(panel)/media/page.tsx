import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/server/auth";
import { PageHeader } from "@/components/admin/ui";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata: Metadata = { title: "Media" };

export default async function Page() {
  await requireAdminPage();
  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload, organise and reuse images across your site. Uploads are checked, resized to at most 2400px, stripped of location data and converted to WebP for fast loading. Replacing an image updates it everywhere it's used."
      />
      <MediaLibrary />
    </>
  );
}
