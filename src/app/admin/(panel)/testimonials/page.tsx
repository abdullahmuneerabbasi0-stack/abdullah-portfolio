import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdminPage } from "@/lib/server/auth";
import { listCollection } from "@/lib/server/repo";
import { mediaPreviews } from "@/lib/server/previews";
import { TestimonialsManager } from "@/components/admin/managers";

export const metadata: Metadata = { title: "Testimonials" };

export default async function Page() {
  await requireAdminPage();
  const items = await listCollection("testimonials");
  return (
    <Suspense>
      <TestimonialsManager items={items} previews={await mediaPreviews(items.map((i) => i.data))} />
    </Suspense>
  );
}
