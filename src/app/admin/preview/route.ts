import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/server/auth";

/** Opens the public site with unpublished drafts visible (admins only). */
export async function GET(req: Request) {
  if (!(await getAdmin())) redirect("/admin/login");
  const path = new URL(req.url).searchParams.get("path") ?? "/";
  (await draftMode()).enable();
  redirect(path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/admin") ? path : "/");
}
