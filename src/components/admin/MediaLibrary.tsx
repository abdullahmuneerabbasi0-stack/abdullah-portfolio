"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, FolderOpen, ImageIcon, RefreshCw, Search, Trash2, UploadCloud, X } from "lucide-react";
import type { MediaItem } from "@/lib/server/media";
import { removeMedia, saveMediaDetails } from "@/lib/actions/admin/media";
import { Badge, Button, EmptyState, Skeleton, TextField, cx } from "./ui";
import { Modal, useConfirm, useToast } from "./feedback";
import { useAction } from "./form";

export type LibraryItem = MediaItem & { usedIn: string[] };

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif";
const MAX = 4 * 1024 * 1024;
const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

async function upload(file: File, opts: { folder?: string; replaceId?: string }) {
  if (file.size > MAX) throw new Error(`${file.name} is larger than 4 MB.`);
  const body = new FormData();
  body.append("file", file);
  if (opts.folder) body.append("folder", opts.folder);
  const res = await fetch(opts.replaceId ? `/api/admin/media/${opts.replaceId}` : "/api/admin/media", { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Upload failed.");
  return json.item as LibraryItem;
}

export function useMediaLibrary(enabled = true) {
  const [items, setItems] = useState<LibraryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setItems((await res.json()).items);
      setError(null);
    } catch {
      setError("Couldn't load the media library.");
      setItems([]);
    }
  }, []);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    fetch("/api/admin/media", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => alive && (setItems(json.items), setError(null)))
      .catch(() => alive && (setError("Couldn't load the media library."), setItems([])));
    return () => {
      alive = false;
    };
  }, [enabled]);
  return { items, setItems, error, reload: load };
}

export function MediaLibrary({ mode = "manage", onPick }: { mode?: "manage" | "pick"; onPick?: (item: LibraryItem) => void }) {
  const { items, setItems, error, reload } = useMediaLibrary();
  const toast = useToast();
  const confirm = useConfirm();
  const { run, pending } = useAction();
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(0);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  const folders = useMemo(() => ["All", ...Array.from(new Set((items ?? []).map((i) => i.folder))).sort()], [items]);
  const visible = (items ?? []).filter(
    (i) => (folder === "All" || i.folder === folder) && (!q || `${i.filename} ${i.alt} ${i.folder}`.toLowerCase().includes(q.toLowerCase())),
  );
  const selected = items?.find((i) => i.id === selectedId) ?? null;

  const uploadFiles = async (files: FileList | File[]) => {
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    if (!list.length) return toast("Choose JPG, PNG, WebP, AVIF or GIF images.", "error");
    setUploading((n) => n + list.length);
    for (const f of list) {
      try {
        const item = await upload(f, { folder: folder === "All" ? "General" : folder });
        setItems((cur) => [item, ...(cur ?? [])]);
        setSelectedId(item.id);
        toast(`Uploaded ${f.name}, optimised to ${fmtSize(item.size)}.`);
      } catch (e) {
        toast((e as Error).message, "error");
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const replace = async (file: File) => {
    if (!selected) return;
    try {
      setUploading(1);
      const item = await upload(file, { replaceId: selected.id });
      setItems((cur) => cur?.map((i) => (i.id === item.id ? { ...i, ...item } : i)) ?? null);
      toast("Image replaced everywhere it's used.");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setUploading(0);
    }
  };

  const remove = async () => {
    if (!selected) return;
    if (selected.usedIn.length) {
      toast(`This image is used in ${selected.usedIn.join(", ")}. Replace it there before deleting.`, "error");
      return;
    }
    const ok = await confirm({ title: `Delete "${selected.filename}"?`, body: "This permanently removes the image from the library.", confirmLabel: "Delete image", danger: true });
    if (!ok) return;
    const res = await run("delete", () => removeMedia(selected.id));
    if (res?.ok) {
      setItems((cur) => cur?.filter((i) => i.id !== selected.id) ?? null);
      setSelectedId(null);
    }
  };

  return (
    <div
      className="relative"
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDrag(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        void uploadFiles(e.dataTransfer.files);
      }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, alt text or folder"
            aria-label="Search media"
            className="h-10 w-full rounded-xl border border-white/10 bg-black/30 pr-3 pl-9 text-sm placeholder:text-muted/50 focus:border-accent/60 focus:outline-none"
          />
        </div>
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          aria-label="Folder"
          className="h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm focus:border-accent/60 focus:outline-none"
        >
          {folders.map((f) => (
            <option key={f} className="bg-surface">
              {f}
            </option>
          ))}
        </select>
        <Button variant="primary" icon={<UploadCloud className="h-4 w-4" />} onClick={() => fileRef.current?.click()} loading={uploading > 0}>
          {uploading > 0 ? `Uploading ${uploading}` : "Upload"}
        </Button>
        <input ref={fileRef} type="file" accept={ACCEPT} multiple hidden onChange={(e) => e.target.files && uploadFiles(e.target.files).then(() => (e.target.value = ""))} />
        <input ref={replaceRef} type="file" accept={ACCEPT} hidden onChange={(e) => e.target.files?.[0] && replace(e.target.files[0]).then(() => (e.target.value = ""))} />
      </div>

      {drag && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-2xl border-2 border-dashed border-accent/60 bg-black/70 text-sm text-accent-3">
          Drop images to upload
        </div>
      )}

      <div className={cx("grid gap-5", selected && "lg:grid-cols-[1fr_20rem]")}>
        <div>
          {items === null ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          ) : error ? (
            <EmptyState icon={<ImageIcon className="h-5 w-5" />} title="Media unavailable" description={error} action={<Button onClick={reload}>Try again</Button>} />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={<UploadCloud className="h-5 w-5" />}
              title={items.length ? "No matching images" : "No images yet"}
              description={items.length ? "Try a different search or folder." : "Upload images here, or drag and drop them onto this area. They're resized and converted to WebP automatically."}
              action={!items.length && <Button variant="primary" onClick={() => fileRef.current?.click()}>Upload images</Button>}
            />
          ) : (
            <ul className={cx("grid grid-cols-2 gap-3 sm:grid-cols-3", selected ? "xl:grid-cols-3" : "xl:grid-cols-4")}>
              {visible.map((i) => (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(i.id === selectedId ? null : i.id)}
                    onDoubleClick={() => mode === "pick" && onPick?.(i)}
                    aria-pressed={i.id === selectedId}
                    className={cx(
                      "group relative block aspect-square w-full overflow-hidden rounded-xl border bg-black/30 text-left transition-all",
                      i.id === selectedId ? "border-accent ring-2 ring-accent/40" : "border-white/[0.07] hover:border-white/25",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.url} alt={i.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5 pt-8">
                      <span className="block truncate text-xs font-medium">{i.filename}</span>
                      <span className="text-[0.65rem] text-white/60">
                        {i.width}×{i.height} · {fmtSize(i.size)}
                      </span>
                    </span>
                    {!i.usedIn.length && mode === "manage" && <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[0.6rem] text-white/70">Unused</span>}
                    {!i.alt && <span className="absolute top-2 right-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[0.6rem] font-medium text-black">No alt text</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && (
          <MediaDetails
            key={selected.id + selected.version}
            item={selected}
            mode={mode}
            busy={pending === "delete" || uploading > 0}
            onClose={() => setSelectedId(null)}
            onPick={() => onPick?.(selected)}
            onReplace={() => replaceRef.current?.click()}
            onDelete={remove}
            onSaved={(patch) => setItems((cur) => cur?.map((i) => (i.id === selected.id ? { ...i, ...patch } : i)) ?? null)}
          />
        )}
      </div>
    </div>
  );
}

function MediaDetails({
  item,
  mode,
  busy,
  onClose,
  onPick,
  onReplace,
  onDelete,
  onSaved,
}: {
  item: LibraryItem;
  mode: "manage" | "pick";
  busy: boolean;
  onClose: () => void;
  onPick: () => void;
  onReplace: () => void;
  onDelete: () => void;
  onSaved: (p: Partial<LibraryItem>) => void;
}) {
  const [alt, setAlt] = useState(item.alt);
  const [folder, setFolder] = useState(item.folder);
  const [filename, setFilename] = useState(item.filename);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const { run, pending } = useAction();
  const dirty = alt !== item.alt || folder !== item.folder || filename !== item.filename;

  const save = async () => {
    const res = await run("save", () => saveMediaDetails(item.id, { alt, folder, filename }), { onErrors: setErrors });
    if (res?.ok) onSaved({ alt: alt.trim(), folder: folder.trim() || "General", filename: filename.trim() });
  };

  return (
    <aside className="h-fit rounded-2xl border border-white/[0.07] bg-surface/70 p-4 lg:sticky lg:top-24">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Image details</p>
        <button type="button" onClick={onClose} aria-label="Close details" className="rounded-lg p-1 text-muted hover:bg-white/10 hover:text-text">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[repeating-conic-gradient(#1d1916_0%_25%,#151210_0%_50%)] bg-[length:16px_16px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={item.alt} className="absolute inset-0 h-full w-full object-contain" />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted">Size</dt>
          <dd>
            {item.width}×{item.height}, {fmtSize(item.size)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Uploaded</dt>
          <dd>{new Date(item.createdAt).toLocaleDateString()}</dd>
        </div>
      </dl>
      <div className="mt-3">
        <p className="text-xs text-muted">Used in</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {item.usedIn.length ? item.usedIn.map((u) => <Badge key={u} tone="accent">{u}</Badge>) : <Badge>Not used anywhere</Badge>}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <TextField label="Alt text" hint="Describe the image for screen readers and search engines." value={alt} onChange={setAlt} maxLength={200} error={errors.alt} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Name" value={filename} onChange={setFilename} maxLength={120} error={errors.filename} />
          <TextField label="Folder" value={folder} onChange={setFolder} maxLength={40} error={errors.folder} />
        </div>
        <Button className="w-full" variant={dirty ? "primary" : "secondary"} disabled={!dirty} loading={pending === "save"} onClick={save}>
          Save details
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-4">
        {mode === "pick" ? (
          <Button variant="primary" className="col-span-2" icon={<Check className="h-4 w-4" />} onClick={onPick}>
            Use this image
          </Button>
        ) : (
          <Button
            size="sm"
            icon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            onClick={async () => {
              await navigator.clipboard.writeText(new URL(item.url, location.origin).toString());
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied" : "Copy URL"}
          </Button>
        )}
        <Button size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={onReplace} disabled={busy}>
          Replace
        </Button>
        <Button size="sm" variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={onDelete} disabled={busy} className={mode === "pick" ? "" : "col-span-2"}>
          Delete
        </Button>
      </div>
    </aside>
  );
}

export function MediaPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (item: LibraryItem) => void }) {
  return (
    <Modal open={open} onClose={onClose} size="xl" labelledBy="media-picker-title">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-accent-2" aria-hidden="true" />
          <h2 id="media-picker-title" className="text-sm font-semibold">
            Choose an image
          </h2>
          <span className="hidden text-xs text-muted sm:inline">Select an image, then &ldquo;Use this image&rdquo;. Or upload a new one.</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted hover:bg-white/10 hover:text-text">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-5">{open && <MediaLibrary mode="pick" onPick={onPick} />}</div>
    </Modal>
  );
}
