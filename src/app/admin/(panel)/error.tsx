"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/admin/ui";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-8 text-center">
      <AlertTriangle className="mx-auto h-6 w-6 text-red-300" aria-hidden="true" />
      <h1 className="mt-4 font-display text-3xl">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">This page couldn&apos;t load. Your saved content is safe. Try again, or check that the database is reachable.</p>
      <Button className="mt-6" variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
