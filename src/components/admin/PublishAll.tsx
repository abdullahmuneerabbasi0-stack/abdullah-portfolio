"use client";

import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { publishAllSettings } from "@/lib/actions/admin/content";
import { Button } from "./ui";
import { useConfirm } from "./feedback";
import { useAction } from "./form";

export function PublishAll({ count, labels }: { count: number; labels: string[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const { run, pending } = useAction();
  if (!count) return null;
  return (
    <Button
      variant="primary"
      icon={<Rocket className="h-4 w-4" />}
      loading={pending === "all"}
      onClick={async () => {
        const ok = await confirm({ title: `Publish ${count} section${count === 1 ? "" : "s"}?`, body: `Visitors will see your latest changes to: ${labels.join(", ")}.`, confirmLabel: "Publish now" });
        if (!ok) return;
        const res = await run("all", () => publishAllSettings());
        if (res?.ok) router.refresh();
      }}
    >
      Publish all changes
    </Button>
  );
}
