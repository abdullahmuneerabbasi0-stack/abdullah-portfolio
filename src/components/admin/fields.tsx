"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2, X } from "lucide-react";
import { Button, Field, cx } from "./ui";
import { useConfirm } from "./feedback";
import { MediaPicker } from "./MediaLibrary";
import { Icon, icons } from "@/components/ui/Icon";
import { ICON_NAMES } from "@/lib/content/icons";
import type { MediaItem } from "@/lib/server/media";

/** Chips for a list of short strings: type and press Enter (or comma) to add. */
export function TagsInput({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder = "Type and press Enter",
  max = 30,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.includes(s));
    if (parts.length) onChange([...value, ...parts].slice(0, max));
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
  };
  return (
    <Field label={label} hint={hint ?? "Press Enter after each item. Backspace removes the last one."} error={error} htmlFor={id}>
      <div className={cx("flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border bg-black/30 p-1.5 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/20", error ? "border-red-400/60" : "border-white/10")}>
        {value.map((t, i) => (
          <span key={t + i} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.06] py-1 pr-1 pl-2.5 text-xs text-text/90">
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded p-0.5 text-muted hover:bg-white/10 hover:text-text">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={value.length >= max ? "Limit reached" : placeholder}
          disabled={value.length >= max}
          className="h-7 min-w-[8rem] flex-1 bg-transparent px-1.5 text-sm text-text placeholder:text-muted/50 focus:outline-none"
        />
      </div>
    </Field>
  );
}

/**
 * A repeating group of fields with add, remove and move up/down controls.
 * Used for buttons, facts, education, features and so on.
 */
export function ListEditor<T>({
  label,
  description,
  items,
  onChange,
  render,
  create,
  max = 20,
  itemLabel,
  addLabel = "Add item",
  error,
  confirmRemove = false,
}: {
  label: string;
  description?: ReactNode;
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, index: number, set: (path: string, v: unknown) => void) => ReactNode;
  create: () => T;
  max?: number;
  itemLabel: (item: T, index: number) => string;
  addLabel?: string;
  error?: string;
  confirmRemove?: boolean;
}) {
  const confirm = useConfirm();
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = async (i: number) => {
    if (confirmRemove && !(await confirm({ title: `Remove "${itemLabel(items[i], i)}"?`, body: "It will be removed when you save.", confirmLabel: "Remove", danger: true }))) return;
    onChange(items.filter((_, j) => j !== i));
  };
  const setAt = (i: number) => (path: string, v: unknown) => {
    const next = [...items];
    next[i] = path === "" ? (v as T) : (setPath(items[i], path, v) as T);
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.8rem] font-medium text-text/90">{label}</p>
          {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
        </div>
        <span className="text-[0.7rem] text-muted">
          {items.length}/{max}
        </span>
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
      {items.length === 0 && <p className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-center text-xs text-muted">Nothing here yet.</p>}
      <ol className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="group rounded-xl border border-white/[0.07] bg-black/20 p-4 transition-colors hover:border-white/15">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="truncate text-xs font-medium text-muted">
                <span className="mr-2 font-display text-sm text-accent-2 italic">{String(i + 1).padStart(2, "0")}</span>
                {itemLabel(item, i) || "Untitled"}
              </span>
              <div className="flex shrink-0 items-center gap-0.5">
                <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Remove" onClick={() => remove(i)} danger>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconBtn>
              </div>
            </div>
            {render(item, i, setAt(i))}
          </li>
        ))}
      </ol>
      <Button type="button" size="sm" variant="secondary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => onChange([...items, create()])} disabled={items.length >= max}>
        {addLabel}
      </Button>
    </div>
  );
}

function setPath(obj: unknown, path: string, v: unknown): unknown {
  const [head, ...rest] = path.split(".");
  const base = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
  (base as Record<string, unknown>)[head] = rest.length ? setPath((obj as Record<string, unknown>)?.[head], rest.join("."), v) : v;
  return base;
}

export function IconBtn({ label, onClick, children, disabled, danger }: { label: string; onClick: () => void; children: ReactNode; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cx("grid h-7 w-7 place-items-center rounded-lg text-muted transition-colors disabled:opacity-30", danger ? "hover:bg-red-500/15 hover:text-red-300" : "hover:bg-white/10 hover:text-text")}
    >
      {children}
    </button>
  );
}

/** Picks an icon from the curated set used on the site. */
export function IconPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-12" role="radiogroup" aria-label={label}>
        {ICON_NAMES.filter((n) => n in icons).map((name) => (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={value === name}
            aria-label={name}
            title={name}
            onClick={() => onChange(name)}
            className={cx(
              "grid aspect-square place-items-center rounded-lg border transition-colors",
              value === name ? "border-accent/70 bg-accent/15 text-accent-2" : "border-white/[0.07] text-muted hover:border-white/20 hover:text-text",
            )}
          >
            <Icon name={name} className="h-4 w-4" />
          </button>
        ))}
      </div>
    </Field>
  );
}

/** An image field backed by the media library. */
export function ImageField({
  label,
  hint,
  value,
  onChange,
  preview,
  error,
  aspect = "aspect-video",
}: {
  label: string;
  hint?: ReactNode;
  value: string;
  onChange: (ref: string, item?: MediaItem) => void;
  preview?: string | null;
  error?: string;
  aspect?: string;
}) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<{ ref: string; url: string } | null>(null);
  const url = picked?.ref === value ? picked.url : value && !value.startsWith("media:") ? value : preview;
  return (
    <Field label={label} hint={hint} error={error}>
      <div className="flex flex-wrap items-center gap-4">
        <div className={cx("relative w-40 overflow-hidden rounded-xl border border-white/10 bg-black/30", aspect)}>
          {value && url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-muted">
              <ImageIcon className="h-6 w-6" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => setOpen(true)}>
            {value ? "Change image" : "Choose image"}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
              Remove
            </Button>
          )}
        </div>
      </div>
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onPick={(item) => {
          const ref = `media:${item.id}`;
          setPicked({ ref, url: item.url });
          onChange(ref, item);
          setOpen(false);
        }}
      />
    </Field>
  );
}
