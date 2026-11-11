"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Lock, Menu } from "lucide-react";
import type { LayoutSettings, SectionConfig } from "@/lib/content/types";
import { SettingsEditor } from "../SettingsEditor";
import { Badge, Card, Switch, TextArea, TextField, cx } from "../ui";
import { IconBtn, ListEditor } from "../fields";
import { useConfirm } from "../feedback";

type Props = { initial: LayoutSettings; hasUnpublished: boolean; publishedAt: string | null; emptySections: string[] };

const SECTION_NAMES: Record<string, string> = {
  hero: "Hero",
  about: "About",
  skills: "Skills",
  services: "Services",
  projects: "Projects",
  testimonials: "Testimonials",
  education: "Education",
  contact: "Contact",
};

export function NavigationForm({ initial, hasUnpublished, publishedAt, emptySections }: Props) {
  const confirm = useConfirm();
  return (
    <SettingsEditor
      settingsKey="layout"
      title="Navigation & sections"
      description="Choose which sections appear on your home page, in what order, and what the menu and footer show."
      initial={initial}
      hasUnpublished={hasUnpublished}
      publishedAt={publishedAt}
    >
      {({ value: v, set, errors: e }) => {
        const move = (i: number, d: number) => {
          const j = i + d;
          // The hero always stays first.
          if (j < 1 || j >= v.sections.length || i < 1) return;
          const next = [...v.sections];
          [next[i], next[j]] = [next[j], next[i]];
          set("sections", next);
        };
        const toggle = async (i: number, s: SectionConfig, enabled: boolean) => {
          if (!enabled && s.key === "contact") {
            const ok = await confirm({
              title: "Hide the contact section?",
              body: "Visitors won't be able to reach you from your home page, and every \"Hire me\" button will point to nothing. Only do this if you're sure.",
              confirmLabel: "Hide contact",
              danger: true,
            });
            if (!ok) return;
          }
          set(`sections.${i}.enabled`, enabled);
        };
        const menuCount = v.sections.filter((s) => s.enabled && s.inNav).length + v.extraNavLinks.length;
        return (
          <>
            <Card title="Home page sections" description="Use the arrows to reorder. Titles support *asterisks* for the italic accent words.">
              {e.sections && <p className="mb-3 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">{e.sections}</p>}
              <ol className="space-y-2.5">
                {v.sections.map((s, i) => {
                  const locked = s.key === "hero";
                  const empty = emptySections.includes(s.key);
                  return (
                    <li key={s.key} className={cx("rounded-xl border p-4 transition-colors", s.enabled ? "border-white/[0.08] bg-black/20" : "border-dashed border-white/[0.08] opacity-70")}>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-display text-lg text-accent-2 italic">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-medium">{SECTION_NAMES[s.key]}</span>
                        {locked && (
                          <Badge>
                            <Lock className="h-3 w-3" /> Always first
                          </Badge>
                        )}
                        {s.enabled ? (
                          <Badge tone="success">
                            <Eye className="h-3 w-3" /> Visible
                          </Badge>
                        ) : (
                          <Badge>
                            <EyeOff className="h-3 w-3" /> Hidden
                          </Badge>
                        )}
                        {s.enabled && s.inNav && (
                          <Badge tone="accent">
                            <Menu className="h-3 w-3" /> In menu
                          </Badge>
                        )}
                        {empty && s.enabled && <Badge tone="warning">No content yet, hidden automatically</Badge>}
                        <span className="flex-1" />
                        {!locked && (
                          <div className="flex items-center gap-0.5">
                            <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i <= 1}>
                              <ArrowUp className="h-3.5 w-3.5" />
                            </IconBtn>
                            <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === v.sections.length - 1}>
                              <ArrowDown className="h-3.5 w-3.5" />
                            </IconBtn>
                          </div>
                        )}
                      </div>
                      {!locked && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <Switch label="Show on the home page" checked={s.enabled} onChange={(x) => toggle(i, s, x)} />
                          <Switch label="Show in the menu" checked={s.inNav} onChange={(x) => set(`sections.${i}.inNav`, x)} disabled={!s.enabled} />
                          <TextField label="Menu label" value={s.navLabel} onChange={(x) => set(`sections.${i}.navLabel`, x)} error={e[`sections.${i}.navLabel`]} maxLength={30} />
                          <TextField label="Small label above the title" value={s.eyebrow} onChange={(x) => set(`sections.${i}.eyebrow`, x)} maxLength={40} />
                          {s.key !== "contact" && (
                            <>
                              <TextField className="sm:col-span-2" label="Section title" value={s.title} onChange={(x) => set(`sections.${i}.title`, x)} error={e[`sections.${i}.title`]} maxLength={120} />
                              <TextArea className="sm:col-span-2" label="Intro (optional)" value={s.intro} onChange={(x) => set(`sections.${i}.intro`, x)} rows={2} maxLength={300} />
                            </>
                          )}
                          {s.key === "contact" && <p className="text-xs text-muted sm:col-span-2">The contact heading and intro are edited under Contact details.</p>}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Card>

            <Card title="Menu" description={`${menuCount} link${menuCount === 1 ? "" : "s"} in the menu right now. At least one is always kept.`}>
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-end pb-2">
                    <Switch label="Show menu button" checked={v.navCta.enabled} onChange={(x) => set("navCta.enabled", x)} />
                  </div>
                  <TextField label="Button label" value={v.navCta.label} onChange={(x) => set("navCta.label", x)} maxLength={30} />
                  <TextField label="Button link" value={v.navCta.href} onChange={(x) => set("navCta.href", x)} error={e["navCta.href"]} />
                </div>
                <ListEditor
                  label="Extra menu links"
                  description="For pages outside the home page, such as your blog or resume."
                  items={v.extraNavLinks}
                  onChange={(x) => set("extraNavLinks", x)}
                  max={4}
                  addLabel="Add link"
                  itemLabel={(l) => l.label}
                  create={() => ({ label: "", href: "https://" })}
                  render={(l, i, setItem) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField label="Label" value={l.label} onChange={(x) => setItem("label", x)} error={e[`extraNavLinks.${i}.label`]} maxLength={30} />
                      <TextField label="Link" value={l.href} onChange={(x) => setItem("href", x)} error={e[`extraNavLinks.${i}.href`]} />
                    </div>
                  )}
                />
              </div>
            </Card>

            <Card title="Footer">
              <div className="space-y-5">
                <TextField label="Footer text" value={v.footer.text} onChange={(x) => set("footer.text", x)} maxLength={200} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Switch label="Large name wordmark" checked={v.footer.showWordmark} onChange={(x) => set("footer.showWordmark", x)} />
                  <Switch label="Social icons" checked={v.footer.showSocials} onChange={(x) => set("footer.showSocials", x)} />
                  <Switch label="Back to top link" checked={v.footer.showBackToTop} onChange={(x) => set("footer.showBackToTop", x)} />
                </div>
                <ListEditor
                  label="Footer links"
                  items={v.footer.links}
                  onChange={(x) => set("footer.links", x)}
                  max={8}
                  addLabel="Add footer link"
                  itemLabel={(l) => l.label}
                  create={() => ({ label: "", href: "/#" })}
                  render={(l, i, setItem) => (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField label="Label" value={l.label} onChange={(x) => setItem("label", x)} error={e[`footer.links.${i}.label`]} maxLength={30} />
                      <TextField label="Link" value={l.href} onChange={(x) => setItem("href", x)} error={e[`footer.links.${i}.href`]} />
                    </div>
                  )}
                />
              </div>
            </Card>
          </>
        );
      }}
    </SettingsEditor>
  );
}
