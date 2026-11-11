"use client";

import { useState } from "react";
import { Briefcase, MessageSquareQuote, Wrench } from "lucide-react";
import type { ServiceRecord, SkillRecord, TestimonialRecord } from "@/lib/content/types";
import { Icon } from "@/components/ui/Icon";
import { ItemManager, type ManagedItem } from "./ItemManager";
import { Badge, Switch, TextArea, TextField } from "./ui";
import { IconPicker, ImageField, ListEditor, TagsInput } from "./fields";

const iconThumb = (name: string) => (
  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-accent-2">
    <Icon name={name} className="h-4 w-4" />
  </span>
);

export function ServicesManager({ items, previews: initial }: { items: ManagedItem<ServiceRecord>[]; previews: Record<string, string> }) {
  const [previews, setPreviews] = useState(initial);
  return (
    <ItemManager<ServiceRecord>
      collection="services"
      title="Services"
      description="What you offer. Reorder by dragging, hide a service without deleting it, and add an optional image to any card."
      noun="service"
      items={items}
      emptyIcon={<Briefcase className="h-5 w-5" />}
      emptyText="Describe the services you offer to clients."
      publishedLabel="Visible"
      draftLabel="Hidden"
      toRow={(i) => ({ title: i.data.title, subtitle: i.data.description, thumb: iconThumb(i.data.icon) })}
      create={() => ({ title: "", icon: "Sparkles", description: "", deliverables: [] })}
      renderFields={(v, set, e) => (
        <>
          <TextField label="Service name" value={v.title} onChange={(x) => set("title", x)} error={e["data.title"]} maxLength={80} />
          <TextArea label="Description" value={v.description} onChange={(x) => set("description", x)} error={e["data.description"]} rows={3} maxLength={500} />
          <TagsInput label="What's included" value={v.deliverables} onChange={(x) => set("deliverables", x)} error={e["data.deliverables"]} max={8} />
          <IconPicker label="Icon" value={v.icon} onChange={(x) => set("icon", x)} />
          <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
            <ImageField
              label="Image (optional)"
              value={v.image ?? ""}
              preview={v.image ? previews[v.image] : null}
              onChange={(ref, item) => {
                if (item) setPreviews((p) => ({ ...p, [ref]: item.url }));
                set("image", ref);
              }}
            />
            <TextField label="Image alt text" value={v.imageAlt ?? ""} onChange={(x) => set("imageAlt", x)} maxLength={200} />
          </div>
        </>
      )}
    />
  );
}

export function SkillsManager({ items }: { items: ManagedItem<SkillRecord>[] }) {
  return (
    <ItemManager<SkillRecord>
      collection="skills"
      title="Skills"
      description="Skill categories and the technologies in each. Turn on proficiency to show a level bar per skill instead of tags. Only list what you've really used."
      noun="skill category"
      items={items}
      emptyIcon={<Wrench className="h-5 w-5" />}
      emptyText="Group your technologies into categories such as Frontend or Tools."
      publishedLabel="Visible"
      draftLabel="Hidden"
      toRow={(i) => ({
        title: i.data.title,
        subtitle: i.data.skills.map((s) => s.name).join(", "),
        thumb: iconThumb(i.data.icon),
        badges: i.data.showProficiency ? <Badge tone="accent">Proficiency bars</Badge> : undefined,
      })}
      create={() => ({ title: "", icon: "Code2", description: "", showProficiency: false, skills: [] })}
      renderFields={(v, set, e) => (
        <>
          <TextField label="Category name" value={v.title} onChange={(x) => set("title", x)} error={e["data.title"]} maxLength={60} />
          <TextArea label="Description (optional)" value={v.description} onChange={(x) => set("description", x)} rows={2} maxLength={300} />
          <Switch label="Show proficiency levels" description="Display a level bar (0–100) next to each skill instead of simple tags." checked={v.showProficiency} onChange={(x) => set("showProficiency", x)} />
          <ListEditor
            label="Skills"
            items={v.skills}
            onChange={(x) => set("skills", x)}
            max={30}
            addLabel="Add skill"
            error={e["data.skills"]}
            itemLabel={(s) => s.name}
            create={() => ({ name: "", level: null })}
            render={(s, i, setItem) => (
              <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                <TextField label="Skill" value={s.name} onChange={(x) => setItem("name", x)} error={e[`data.skills.${i}.name`]} maxLength={50} />
                <TextField
                  label="Level (0–100)"
                  type="number"
                  min={0}
                  max={100}
                  value={s.level === null ? "" : String(s.level)}
                  onChange={(x) => setItem("level", x === "" ? null : Number(x))}
                  error={e[`data.skills.${i}.level`]}
                  disabled={!v.showProficiency}
                  placeholder="Optional"
                />
              </div>
            )}
          />
          <IconPicker label="Icon" value={v.icon} onChange={(x) => set("icon", x)} />
        </>
      )}
    />
  );
}

export function TestimonialsManager({ items, previews: initial }: { items: ManagedItem<TestimonialRecord>[]; previews: Record<string, string> }) {
  const [previews, setPreviews] = useState(initial);
  return (
    <ItemManager<TestimonialRecord>
      collection="testimonials"
      title="Testimonials"
      description="Words from real clients, colleagues or teachers. The section appears on your site automatically once at least one testimonial is published. Only add quotes you have permission to share."
      noun="testimonial"
      items={items}
      defaultPublished={false}
      emptyIcon={<MessageSquareQuote className="h-5 w-5" />}
      emptyText="When someone gives you feedback you can share, add it here. The section stays hidden until then."
      toRow={(i) => ({
        title: i.data.name,
        subtitle: `“${i.data.quote}”`,
        thumb:
          i.data.image && previews[i.data.image] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previews[i.data.image]} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 font-display text-lg text-accent-2 italic">{i.data.name.charAt(0)}</span>
          ),
      })}
      create={() => ({ name: "", role: "", company: "", quote: "" })}
      renderFields={(v, set, e) => (
        <>
          <TextArea label="Testimonial" value={v.quote} onChange={(x) => set("quote", x)} error={e["data.quote"]} rows={4} maxLength={800} />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="Name" value={v.name} onChange={(x) => set("name", x)} error={e["data.name"]} maxLength={80} />
            <TextField label="Role" value={v.role} onChange={(x) => set("role", x)} maxLength={80} />
            <TextField label="Company" value={v.company} onChange={(x) => set("company", x)} maxLength={80} />
          </div>
          <TextField label="Profile link (optional)" value={v.link ?? ""} onChange={(x) => set("link", x)} error={e["data.link"]} placeholder="https://www.linkedin.com/in/…" />
          <ImageField
            label="Photo (optional)"
            aspect="aspect-square"
            value={v.image ?? ""}
            preview={v.image ? previews[v.image] : null}
            onChange={(ref, item) => {
              if (item) setPreviews((p) => ({ ...p, [ref]: item.url }));
              set("image", ref);
            }}
          />
        </>
      )}
    />
  );
}
