"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eye, RotateCcw, Rocket, Save } from "lucide-react";
import type { SettingsKey, SettingsMap } from "@/lib/content/types";
import { discardSettingsDraft, saveSettingsDraft } from "@/lib/actions/admin/content";
import { Badge, Button, PageHeader } from "./ui";
import { useConfirm, useToast } from "./feedback";
import { useAction, useEditor } from "./form";
import { timeAgo } from "./time";

export type EditorApi<T> = {
  value: T;
  set: (path: string, v: unknown) => void;
  setValue: (v: T) => void;
  errors: Record<string, string>;
};

/**
 * Shared editor for the singleton settings (hero, about, contact, layout,
 * appearance). Changes are saved as a draft first; "Publish" makes them live.
 */
export function SettingsEditor<K extends SettingsKey>({
  settingsKey,
  title,
  description,
  initial,
  hasUnpublished: initialUnpublished,
  publishedAt,
  children,
  aside,
}: {
  settingsKey: K;
  title: string;
  description: ReactNode;
  initial: SettingsMap[K];
  hasUnpublished: boolean;
  publishedAt: string | null;
  children: (api: EditorApi<SettingsMap[K]>) => ReactNode;
  aside?: (value: SettingsMap[K]) => ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const { value, set, setValue, dirty, errors, setErrors, markSaved, reset } = useEditor(initial);
  const { run, pending } = useAction();
  const [unpublished, setUnpublished] = useState(initialUnpublished);

  const save = async (publish: boolean) => {
    const res = await run(publish ? "publish" : "save", () => saveSettingsDraft(settingsKey, value, { publish }), {
      onErrors: (e) => {
        setErrors(e);
        setTimeout(() => document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      },
    });
    if (res?.ok) {
      markSaved();
      setUnpublished(!publish);
      setErrors({});
      router.refresh();
    }
    return res?.ok ?? false;
  };

  const preview = async () => {
    if (dirty && !(await save(false))) return;
    window.open("/admin/preview?path=/", "_blank", "noopener");
  };

  const discard = async () => {
    const ok = await confirm({
      title: "Discard unpublished changes?",
      body: "This brings back the version that's live on your site now. Unsaved and draft changes on this page will be lost.",
      confirmLabel: "Discard changes",
      danger: true,
    });
    if (!ok) return;
    const res = await run("discard", () => discardSettingsDraft(settingsKey));
    if (res?.ok) {
      markSaved();
      router.refresh();
      // Reload so the editor shows the published version.
      window.location.reload();
    }
  };

  const status = dirty ? (
    <Badge tone="warning">Unsaved changes</Badge>
  ) : unpublished ? (
    <Badge tone="accent">Draft saved, not published</Badge>
  ) : (
    <Badge tone="success">Live{publishedAt ? ` · published ${timeAgo(publishedAt)}` : ""}</Badge>
  );

  return (
    <div className="pb-28">
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {status}
            <Button variant="ghost" icon={<Eye className="h-4 w-4" />} onClick={preview} loading={pending === "save" && !dirty}>
              Preview
            </Button>
          </>
        }
      />
      <div className={aside ? "grid gap-6 xl:grid-cols-[1fr_22rem]" : ""}>
        <div className="space-y-6">{children({ value, set, setValue: (v) => setValue(v), errors })}</div>
        {aside && <div className="xl:sticky xl:top-24 xl:h-fit">{aside(value)}</div>}
      </div>

      <AnimatePresence>
        {(dirty || unpublished) && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 lg:pl-[17rem]"
          >
            <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#171311]/95 p-3 shadow-2xl backdrop-blur">
              <p className="mr-auto px-2 text-sm text-muted">
                {dirty ? "You have unsaved changes." : "Your draft is saved but visitors still see the published version."}
              </p>
              {dirty && (
                <Button
                  variant="ghost"
                  onClick={async () => {
                    if (await confirm({ title: "Cancel your edits?", body: "Fields go back to the last saved version.", confirmLabel: "Cancel edits" })) {
                      reset();
                      toast("Edits cancelled.", "info");
                    }
                  }}
                >
                  Cancel
                </Button>
              )}
              {!dirty && unpublished && publishedAt && (
                <Button variant="ghost" icon={<RotateCcw className="h-4 w-4" />} onClick={discard} loading={pending === "discard"}>
                  Discard draft
                </Button>
              )}
              {dirty && (
                <Button icon={<Save className="h-4 w-4" />} onClick={() => save(false)} loading={pending === "save"}>
                  Save draft
                </Button>
              )}
              <Button variant="primary" icon={<Rocket className="h-4 w-4" />} onClick={() => save(true)} loading={pending === "publish"}>
                Publish
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
