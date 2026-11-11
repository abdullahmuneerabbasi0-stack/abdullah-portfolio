"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import type { CollectionKey } from "@/lib/content/types";
import { saveItem } from "@/lib/actions/admin/content";
import { CollectionList, type ListRow } from "./CollectionList";
import { Button, EmptyState, PageHeader, Switch } from "./ui";
import { Modal, useConfirm } from "./feedback";
import { useAction, useEditor } from "./form";

export type ManagedItem<T> = { id: string; published: boolean; updatedAt: string; data: T };

/**
 * List + modal editor for the simpler collections (services, skills,
 * testimonials). Opening "?edit=<id>" in the URL opens that item directly,
 * which is how global search links here.
 */
export function ItemManager<T>({
  collection,
  title,
  description,
  noun,
  items,
  toRow,
  create,
  renderFields,
  emptyIcon,
  emptyText,
  publishedLabel,
  draftLabel,
  defaultPublished = true,
}: {
  collection: CollectionKey;
  title: string;
  description: ReactNode;
  noun: string;
  items: ManagedItem<T>[];
  toRow: (item: ManagedItem<T>) => Omit<ListRow, "id" | "published" | "updatedAt">;
  create: () => T;
  renderFields: (value: T, set: (path: string, v: unknown) => void, errors: Record<string, string>) => ReactNode;
  emptyIcon: ReactNode;
  emptyText: string;
  publishedLabel?: string;
  draftLabel?: string;
  defaultPublished?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const editParam = params.get("edit");
  const [editing, setEditing] = useState<{ id: string | null; data: T; published: boolean } | null>(null);

  // Opening "?edit=<id>" (for example from search) opens that item.
  const [handledParam, setHandledParam] = useState<string | null>(null);
  if (editParam && editParam !== handledParam) {
    setHandledParam(editParam);
    const item = items.find((i) => i.id === editParam);
    if (item) setEditing({ id: item.id, data: item.data, published: item.published });
  }

  const open = (id: string | null) => {
    const item = id ? items.find((i) => i.id === id) : null;
    setEditing(item ? { id: item.id, data: item.data, published: item.published } : { id: null, data: create(), published: defaultPublished });
  };
  const close = () => {
    setEditing(null);
    if (editParam) router.replace(pathname);
  };

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => open(null)}>
            Add {noun}
          </Button>
        }
      />
      <CollectionList
        collection={collection}
        noun={noun}
        onEdit={open}
        publishedLabel={publishedLabel}
        draftLabel={draftLabel}
        rows={items.map((i) => ({ id: i.id, published: i.published, updatedAt: i.updatedAt, ...toRow(i) }))}
        empty={<EmptyState icon={emptyIcon} title={`No ${noun}s yet`} description={emptyText} action={<Button variant="primary" onClick={() => open(null)}>Add {noun}</Button>} />}
      />
      <Modal open={!!editing} onClose={close} size="lg" labelledBy="item-editor-title">
        {editing && (
          <ItemEditor
            key={editing.id ?? "new"}
            collection={collection}
            noun={noun}
            initial={editing}
            renderFields={renderFields}
            publishedLabel={publishedLabel ?? "Published"}
            onDone={() => {
              close();
              router.refresh();
            }}
            onCancel={close}
          />
        )}
      </Modal>
    </>
  );
}

function ItemEditor<T>({
  collection,
  noun,
  initial,
  renderFields,
  publishedLabel,
  onDone,
  onCancel,
}: {
  collection: CollectionKey;
  noun: string;
  initial: { id: string | null; data: T; published: boolean };
  renderFields: (value: T, set: (path: string, v: unknown) => void, errors: Record<string, string>) => ReactNode;
  publishedLabel: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const confirm = useConfirm();
  const { value, set, dirty, errors, setErrors, markSaved } = useEditor({ data: initial.data, published: initial.published });
  const { run, pending } = useAction();
  const save = async () => {
    const res = await run("save", () => saveItem(collection, initial.id, value.data, value.published), { onErrors: (errs) => setErrors(Object.fromEntries(Object.entries(errs).map(([k, v]) => [`data.${k}`, v]))) });
    if (res?.ok) {
      markSaved();
      onDone();
    }
  };
  const cancel = async () => {
    if (dirty && !(await confirm({ title: "Discard your changes?", body: "Your edits to this item haven't been saved.", confirmLabel: "Discard", danger: true }))) return;
    markSaved();
    onCancel();
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
        <h2 id="item-editor-title" className="font-display text-2xl">
          {initial.id ? `Edit ${noun}` : `New ${noun}`}
        </h2>
        <button type="button" onClick={cancel} aria-label="Close" className="rounded-lg p-1.5 text-muted hover:bg-white/10 hover:text-text">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-5 px-6 py-5">
        {renderFields(value.data, (p, v) => set(`data.${p}`, v), errors)}
        <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
          <Switch label={`${publishedLabel} on the site`} description="Turn off to keep it saved but hidden from visitors." checked={value.published} onChange={(x) => set("published", x)} />
        </div>
      </div>
      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-white/[0.07] bg-[#141110] px-6 py-4">
        <Button type="button" variant="ghost" onClick={cancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={pending === "save"} disabled={!dirty && !!initial.id}>
          {initial.id ? "Save changes" : `Add ${noun}`}
        </Button>
      </div>
    </form>
  );
}
