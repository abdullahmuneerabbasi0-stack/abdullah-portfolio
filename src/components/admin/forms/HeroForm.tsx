"use client";

import { useState } from "react";
import type { Cta, HeroSettings } from "@/lib/content/types";
import { SettingsEditor } from "../SettingsEditor";
import { Card, SelectField, Switch, TextArea, TextField } from "../ui";
import { ImageField, ListEditor } from "../fields";

type Props = { initial: HeroSettings; hasUnpublished: boolean; publishedAt: string | null; previews: Record<string, string> };

export function HeroForm({ initial, hasUnpublished, publishedAt, previews: initialPreviews }: Props) {
  const [previews, setPreviews] = useState(initialPreviews);
  return (
    <SettingsEditor
      settingsKey="hero"
      title="Hero & profile"
      description="The first thing visitors see: your name, headline, photo and main buttons. Your name and role are also used for search results and link previews."
      initial={initial}
      hasUnpublished={hasUnpublished}
      publishedAt={publishedAt}
      aside={(v) => <HeroPreview v={v} photo={previews[v.photo] ?? (v.photo.startsWith("/") ? v.photo : null)} />}
    >
      {({ value: v, set, errors: e }) => (
        <>
          <Card title="Identity" description="How you're named across the whole site.">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Full name" value={v.name} onChange={(x) => set("name", x)} error={e.name} maxLength={80} />
              <TextField label="Short name" hint={`Used in "Hi, I'm …" and the footer.`} value={v.shortName} onChange={(x) => set("shortName", x)} error={e.shortName} maxLength={40} />
              <TextField label="Role" hint="Shown as the second line of the main heading." value={v.role} onChange={(x) => set("role", x)} error={e.role} maxLength={80} />
              <TextField label="Initials" hint="Shown in the logo." value={v.initials} onChange={(x) => set("initials", x)} error={e.initials} maxLength={4} />
              <TextField label="Location" value={v.location} onChange={(x) => set("location", x)} error={e.location} maxLength={120} />
              <TextField label="Availability line" hint="The small line above your name." value={v.availability} onChange={(x) => set("availability", x)} error={e.availability} maxLength={140} />
            </div>
          </Card>

          <Card title="Main heading and description">
            <TextArea label="Description" hint="A sentence or two under the heading." value={v.headline} onChange={(x) => set("headline", x)} error={e.headline} rows={3} maxLength={400} />
          </Card>

          <Card title="Profile image">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
              <ImageField label="Photo" value={v.photo} preview={previews[v.photo] ?? (v.photo.startsWith("/") ? v.photo : null)} onChange={(ref, item) => {
                  if (item) setPreviews((p) => ({ ...p, [ref]: item.url }));
                  set("photo", ref);
                }} error={e.photo} aspect="aspect-[4/5]" />
              <TextField label="Alt text" hint="Describe the photo for screen readers." value={v.photoAlt} onChange={(x) => set("photoAlt", x)} error={e.photoAlt} maxLength={200} />
            </div>
          </Card>

          <Card title="Buttons" description="Call-to-action buttons under the description. Links can be site sections like /#contact or full web addresses.">
            <ListEditor<Cta>
              label="Hero buttons"
              items={v.ctas}
              onChange={(x) => set("ctas", x)}
              max={4}
              addLabel="Add button"
              itemLabel={(c) => c.label}
              error={e.ctas}
              create={() => ({ id: `cta-${Date.now()}`, label: "New button", href: "/#contact", style: "outline", enabled: true })}
              render={(c, i, setItem) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Label" value={c.label} onChange={(x) => setItem("label", x)} error={e[`ctas.${i}.label`]} maxLength={40} />
                  <TextField label="Link" value={c.href} onChange={(x) => setItem("href", x)} error={e[`ctas.${i}.href`]} placeholder="/#projects or https://…" />
                  <SelectField
                    label="Style"
                    value={c.style}
                    onChange={(x) => setItem("style", x)}
                    options={[
                      { value: "solid", label: "Solid (light)" },
                      { value: "copper", label: "Accent colour" },
                      { value: "outline", label: "Outline" },
                    ]}
                  />
                  <div className="flex items-end pb-2">
                    <Switch label="Show this button" checked={c.enabled} onChange={(x) => setItem("enabled", x)} />
                  </div>
                </div>
              )}
            />
            <div className="mt-6 grid gap-4 border-t border-white/[0.06] pt-5 sm:grid-cols-2">
              <Switch label="Show CV download link" checked={v.cv.enabled} onChange={(x) => set("cv.enabled", x)} />
              <span />
              <TextField label="CV link" value={v.cv.url} onChange={(x) => set("cv.url", x)} error={e["cv.url"]} placeholder="/Muhammad_Abdullah_Resume.pdf" />
              <TextField label="CV link label" value={v.cv.label} onChange={(x) => set("cv.label", x)} maxLength={40} />
            </div>
          </Card>

          <Card title="Quick facts" description="Short label and value pairs shown along the bottom of the hero.">
            <ListEditor
              label="Facts"
              items={v.focus}
              onChange={(x) => set("focus", x)}
              max={4}
              addLabel="Add fact"
              itemLabel={(f) => f.label}
              create={() => ({ label: "", value: "" })}
              render={(f, i, setItem) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Label" value={f.label} onChange={(x) => setItem("label", x)} error={e[`focus.${i}.label`]} maxLength={30} />
                  <TextField label="Value" value={f.value} onChange={(x) => setItem("value", x)} error={e[`focus.${i}.value`]} maxLength={60} />
                </div>
              )}
            />
          </Card>
        </>
      )}
    </SettingsEditor>
  );
}

function HeroPreview({ v, photo }: { v: HeroSettings; photo: string | null }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0a09]">
      <p className="border-b border-white/[0.06] px-4 py-2.5 text-[0.65rem] tracking-[0.22em] text-muted uppercase">Live preview</p>
      <div className="p-5">
        <p className="text-[0.6rem] tracking-[0.22em] text-accent-2 uppercase">{v.availability}</p>
        <p className="mt-3 font-display text-3xl leading-none">Hi, I&apos;m {v.shortName || "…"}.</p>
        <p className="mt-2 font-display text-xl leading-tight text-text/85">
          I&apos;m a <em className="text-accent-2">{v.role}</em>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{v.headline}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {v.ctas
            .filter((c) => c.enabled)
            .map((c) => (
              <span
                key={c.id}
                className={
                  c.style === "outline"
                    ? "rounded-full border border-white/30 px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase"
                    : c.style === "copper"
                      ? "rounded-full bg-accent px-3 py-1.5 text-[0.6rem] tracking-[0.12em] text-ink uppercase"
                      : "rounded-full bg-bone px-3 py-1.5 text-[0.6rem] tracking-[0.12em] text-ink uppercase"
                }
              >
                {c.label}
              </span>
            ))}
        </div>
        <div className="relative mt-5 aspect-[4/5] overflow-hidden rounded-xl bg-surface-2">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
          ) : (
            <span className="absolute inset-0 grid place-items-center font-display text-5xl italic">{v.initials}</span>
          )}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 font-display text-lg">{v.name}</span>
        </div>
      </div>
    </div>
  );
}
