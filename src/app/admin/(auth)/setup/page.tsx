import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/server/db";
import { SetupForm } from "@/components/admin/AuthForms";

export const metadata: Metadata = { title: "Set up" };

export default async function SetupPage() {
  // Setup is only possible while no administrator exists.
  const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from admin_users`;
  if (n > 0) redirect("/admin/login");
  return <SetupForm />;
}
