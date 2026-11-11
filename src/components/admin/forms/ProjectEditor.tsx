"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Eye, Rocket, Save, Trash2 } from "lucide-react";
import type { ProjectRecord } from "@/lib/content/types";
import { ICON_NAMES } from "@/lib/content/icons";
import { deleteItem, saveItem } from "@/lib/actions/admin/content";
import { slugify } from "@/lib/validate";
import { Badge, Button, Card, PageHeader, SelectField, Switch, TextArea, TextField } from "../ui";
import { ImageField, ListEditor, TagsInput } from "../fields";
import { useConfirm } from "../feedback";
import { useAction, useEditor } from "../form";

const emptyProject = (): ProjectRecord => ({
  slug: "",
  title: "",
  tagline: "",
  summary: "",
  status: "In development",
  category: "",
  technologies: [],
  highlights: [],
});

const STATUSES = ["Concept", "Planning & architecture", "In development", "Beta", "Live"] as const;

type Props = { id: string | null; initial: ProjectRecord | null; published: boolean; previews: Record<string, string> };

export function ProjectEditor({ id: initialId, initial, published: initialPublished, previews: initialPreviews }: Props) {
  const router = useRouter();
  const confirm = useConfirm();
  const [id, setId] = useState(initialId);
  const [previews, setPreviews] = useState(initialPreviews);
  const [slugTouched, setSlugTouched] = useState(!!initialId);
  const editor = useEditor({ data: initial ?? emptyProject(), published: initialPublished });
  const { value, set, dirty, errors: rawErrors, setErrors, markSaved } = editor;
  const p = value.data;
  const e = rawErrors;
  const { run, pending } = useAction();

  const save = async (publish: boolean) => {
    const res = await run(publish ? "publish" : "save", () => saveItem("projects", id, p, publish), {
      onErrors: (errs) => {
        setErrors(Object.fromEntries(Object.entries(errs).map(([k, v]) => [`data.${k}`, v])));
        setTimeout(() => document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      },
    });
    if (res?.ok) {
      set("published", publish);
      markSaved({ data: p, published: publish });
      if (!id && "id" in res) {
        setId(res.id);
        router.replace(`/admin/projects/${res.id}`);
      }
      router.refresh();
    }
  };

  const remove = async () => {
    if (!id) return router.push("/admin/projects");
    const ok = await confirm({ title: `Delete "${p.title}"?`, body: "The project and its case-study page will be removed from your site. This can't be undone.", confirmLabel: "Delete project", danger: true });
    if (!ok) return;
    const res = await run("delete", () => deleteItem("projects", id));
    if (res?.ok) {
      markSaved();
      router.push("/admin/projects");
      router.refresh();
    }
  };

  const setData = (path: string, v: unknown) => set(`data.${path}`, v);
  const err = (k: string) => e[`data.${k}`];

  return (
    <div className="pb-28">
      <Link href="/admin/projects" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> All projects
      </Link>
      <PageHeader
        title={p.title || "New project"}
        description={id ? `Case study at /projects/${p.slug}` : "Fill in the essentials, then save as a draft or publish."}
        actions={
          <>
            {dirty ? <Badge tone="warning">Unsaved changes</Badge> : value.published ? <Badge tone="success">Published</Badge> : <Badge tone="warning">Draft, hidden from visitors</Badge>}
            {id && value.published && (
              <a href={`/projects/${p.slug}`} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-muted hover:bg-white/[0.06] hover:text-text">
                View <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {id && !value.published && (
              <a href={`/admin/preview?path=/projects/${p.slug}`} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-muted hover:bg-white/[0.06] hover:text-text">
                <Eye className="h-3.5 w-3.5" /> Preview
              </a>
            )}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card title="Essentials">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Project title"
                value={p.title}
                onChange={(x) => {
                  setData("title", x);
                  if (!slugTouched) setData("slug", slugify(x));
                }}
                error={err("title")}
                maxLength={100}
              />
              <TextField
                label="Web address"
                hint={`yoursite.com/projects/${p.slug || "…"}`}
                value={p.slug}
                onChange={(x) => {
                  setSlugTouched(true);
                  setData("slug", slugify(x));
                }}
                error={err("slug")}
                maxLength={80}
              />
              <TextField label="Category" value={p.category} onChange={(x) => setData("category", x)} error={err("category")} maxLength={60} placeholder="Full-stack web app" />
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Status" value={p.status} onChange={(x) => setData("status", x)} options={STATUSES} />
                <TextField label="Status detail" value={p.statusDetail ?? ""} onChange={(x) => setData("statusDetail", x)} maxLength={60} placeholder="Optional" />
              </div>
              <TextArea className="sm:col-span-2" label="Short description" hint="One line shown on project cards." value={p.tagline} onChange={(x) => setData("tagline", x)} error={err("tagline")} rows={2} maxLength={240} />
              <TextArea className="sm:col-span-2" label="Summary" hint="A short paragraph for the featured card and search engines." value={p.summary} onChange={(x) => setData("summary", x)} error={err("summary")} rows={3} maxLength={1200} />
            </div>
          </Card>

          <Card title="Technologies and links">
            <div className="grid gap-4">
              <TagsInput label="Technologies used" value={p.technologies} onChange={(x) => setData("technologies", x)} error={err("technologies")} max={20} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Live website" value={p.liveUrl ?? ""} onChange={(x) => setData("liveUrl", x)} error={err("liveUrl")} placeholder="https://" />
                <TextField label="GitHub repository" value={p.repoUrl ?? ""} onChange={(x) => setData("repoUrl", x)} error={err("repoUrl")} placeholder="https://github.com/…" />
              </div>
            </div>
          </Card>

          <Card title="Highlights" description="Short, factual bullets about what was built. Only include results that are true.">
            <ListEditor
              label="Highlights"
              items={p.highlights ?? []}
              onChange={(x) => setData("highlights", x)}
              max={12}
              addLabel="Add highlight"
              itemLabel={(h) => h.slice(0, 60)}
              create={() => ""}
              render={(h, i, setItem) => <TextArea label="Highlight" value={h} onChange={(x) => setItem("", x)} error={err(`highlights.${i}`)} rows={2} maxLength={400} />}
            />
          </Card>

          <Card title="Case study (optional)" description="Longer sections for the project page. Empty sections are hidden automatically.">
            <div className="space-y-6">
              <ListEditor label="The problem" items={p.problem ?? []} onChange={(x) => setData("problem", x)} max={6} addLabel="Add paragraph" itemLabel={(t) => t.slice(0, 60)} create={() => ""} render={(t, i, s) => <TextArea label="Paragraph" value={t} onChange={(x) => s("", x)} rows={3} maxLength={1200} error={err(`problem.${i}`)} />} />
              <ListEditor label="The vision" items={p.vision ?? []} onChange={(x) => setData("vision", x)} max={6} addLabel="Add paragraph" itemLabel={(t) => t.slice(0, 60)} create={() => ""} render={(t, i, s) => <TextArea label="Paragraph" value={t} onChange={(x) => s("", x)} rows={3} maxLength={1200} error={err(`vision.${i}`)} />} />
              <ListEditor
                label="Features"
                items={p.features ?? []}
                onChange={(x) => setData("features", x)}
                max={12}
                addLabel="Add feature"
                itemLabel={(f) => f.title}
                create={() => ({ title: "", icon: "Sparkles", description: "", points: [], state: "Planned" as const })}
                render={(f, i, s) => (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Feature" value={f.title} onChange={(x) => s("title", x)} error={err(`features.${i}.title`)} maxLength={80} />
                    <div className="grid grid-cols-2 gap-3">
                      <SelectField label="State" value={f.state} onChange={(x) => s("state", x)} options={["Planned", "In progress", "Built"] as const} />
                      <SelectField label="Icon" value={f.icon as (typeof ICON_NAMES)[number]} onChange={(x) => s("icon", x)} options={ICON_NAMES} />
                    </div>
                    <TextField className="sm:col-span-2" label="Description" value={f.description} onChange={(x) => s("description", x)} maxLength={300} />
                    <div className="sm:col-span-2">
                      <TagsInput label="Points" value={f.points} onChange={(x) => s("points", x)} max={8} />
                    </div>
                  </div>
                )}
              />
              <ListEditor
                label="Architecture decisions"
                items={p.architecture ?? []}
                onChange={(x) => setData("architecture", x)}
                max={8}
                addLabel="Add decision"
                itemLabel={(a) => a.title}
                create={() => ({ title: "", description: "" })}
                render={(a, i, s) => (
                  <div className="grid gap-3">
                    <TextField label="Title" value={a.title} onChange={(x) => s("title", x)} error={err(`architecture.${i}.title`)} maxLength={80} />
                    <TextArea label="Description" value={a.description} onChange={(x) => s("description", x)} rows={2} maxLength={400} />
                  </div>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TagsInput label="Progress: done so far" value={p.progress?.done ?? []} onChange={(x) => setData("progress", { done: x, next: p.progress?.next ?? [] })} max={12} />
                <TagsInput label="Progress: next milestones" value={p.progress?.next ?? []} onChange={(x) => setData("progress", { done: p.progress?.done ?? [], next: x })} max={12} />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:h-fit">
          <Card title="Visibility">
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-muted">
                {value.published ? "This project is live on your site." : "Drafts are saved but never shown to visitors."}
              </p>
              <Switch label="Featured project" description="Shown large at the top of the projects section." checked={!!p.flagship} onChange={(x) => setData("flagship", x)} />
            </div>
          </Card>
          <Card title="Cover image">
            <div className="space-y-4">
              <ImageField
                label="Image"
                hint="Without an image, a typographic poster is generated."
                value={p.cover ?? ""}
                preview={p.cover ? previews[p.cover] : null}
                onChange={(ref, item) => {
                  if (item) setPreviews((x) => ({ ...x, [ref]: item.url }));
                  setData("cover", ref);
                }}
                error={err("cover")}
              />
              <TextField label="Alt text" value={p.coverAlt ?? ""} onChange={(x) => setData("coverAlt", x)} maxLength={200} />
              {p.visual === "studio" && <p className="text-xs text-muted">Without a cover image this project shows the agent-workflow diagram.</p>}
            </div>
          </Card>
          {id && (
            <Button variant="danger" className="w-full" icon={<Trash2 className="h-4 w-4" />} onClick={remove} loading={pending === "delete"}>
              Delete project
            </Button>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 lg:pl-[17rem]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#171311]/95 p-3 shadow-2xl backdrop-blur">
          <p className="mr-auto px-2 text-sm text-muted">{dirty ? "You have unsaved changes." : "All changes saved."}</p>
          <Button variant="ghost" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
          <Button icon={<Save className="h-4 w-4" />} onClick={() => save(false)} loading={pending === "save"} disabled={!dirty && !!id && !value.published}>
            {value.published ? "Unpublish & save as draft" : "Save draft"}
          </Button>
          <Button variant="primary" icon={<Rocket className="h-4 w-4" />} onClick={() => save(true)} loading={pending === "publish"} disabled={!dirty && !!id && value.published}>
            {value.published ? "Save & update live" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
