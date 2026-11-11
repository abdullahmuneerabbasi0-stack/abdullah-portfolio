"use client";

import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, Moon, Sun } from "lucide-react";
import { BODY_FONTS, DISPLAY_FONTS, type AppearanceSettings } from "@/lib/content/types";
import { DARK_COLORS, LIGHT_COLORS } from "@/lib/content/defaults";
import { contrast, themeVariables } from "@/lib/content/theme";
import { SettingsEditor } from "../SettingsEditor";
import { Card, Field, Switch, cx } from "../ui";

type Props = { initial: AppearanceSettings; hasUnpublished: boolean; publishedAt: string | null };

const COLOR_FIELDS: { key: keyof AppearanceSettings["colors"]; label: string; hint: string }[] = [
  { key: "accent", label: "Primary colour", hint: "Buttons, highlights and progress bar." },
  { key: "accent2", label: "Secondary colour", hint: "Italic headline words and small labels." },
  { key: "bg", label: "Background", hint: "Main page background." },
  { key: "surface", label: "Cards", hint: "Card and panel backgrounds on the main background." },
  { key: "text", label: "Text", hint: "Main text on the background." },
  { key: "muted", label: "Muted text", hint: "Secondary text and labels." },
  { key: "panel", label: "Feature panels", hint: "The contrasting About and Services panels." },
  { key: "panelText", label: "Panel text", hint: "Text on the feature panels and on primary buttons." },
];

function Choice<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; preview?: ReactNode }[]; label: string }) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cx(
              "flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs transition-colors",
              value === o.value ? "border-accent/70 bg-accent/10 text-text" : "border-white/[0.08] text-muted hover:border-white/20 hover:text-text",
            )}
          >
            {o.preview}
            {o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

export function AppearanceForm({ initial, hasUnpublished, publishedAt }: Props) {
  return (
    <SettingsEditor
      settingsKey="appearance"
      title="Appearance"
      description="Colours, fonts, shapes and motion for the public website. Use Preview to check a design change on the real site before publishing it."
      initial={initial}
      hasUnpublished={hasUnpublished}
      publishedAt={publishedAt}
      aside={(v) => <ThemePreview a={v} />}
    >
      {({ value: v, set, setValue, errors: e }) => {
        const warnings = [
          contrast(v.colors.text, v.colors.bg) < 4.5 && "Text and background are too similar to read comfortably.",
          contrast(v.colors.panelText, v.colors.panel) < 4.5 && "Panel text and feature panels are too similar to read comfortably.",
          contrast(v.colors.panelText, v.colors.accent) < 3 && "Button text is hard to read on the primary colour.",
        ].filter(Boolean) as string[];
        return (
          <>
            <Card title="Theme" description="Start from a preset, then fine-tune the colours below.">
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["dark", "Dark", "Warm ink background (default)", DARK_COLORS, <Moon key="m" className="h-4 w-4" />],
                    ["light", "Light", "Warm paper background", LIGHT_COLORS, <Sun key="s" className="h-4 w-4" />],
                  ] as const
                ).map(([mode, label, text, colors, icon]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setValue({ ...v, mode, colors: { ...colors } })}
                    aria-pressed={v.mode === mode}
                    className={cx("flex items-center gap-3 rounded-xl border p-3 text-left transition-colors", v.mode === mode ? "border-accent/70 bg-accent/10" : "border-white/[0.08] hover:border-white/20")}
                  >
                    <span className="flex overflow-hidden rounded-lg border border-white/10">
                      {[colors.bg, colors.surface, colors.accent, colors.panel].map((c) => (
                        <span key={c} className="h-9 w-4" style={{ background: c }} />
                      ))}
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        {icon}
                        {label}
                      </span>
                      <span className="text-xs text-muted">{text}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Choosing a preset replaces the colours below.</p>
            </Card>

            <Card title="Colours">
              {warnings.length > 0 && (
                <div className="mb-4 space-y-1 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-xs text-amber-100">
                  {warnings.map((w) => (
                    <p key={w} className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {w}
                    </p>
                  ))}
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {COLOR_FIELDS.map((f) => (
                  <Field key={f.key} label={f.label} hint={f.hint} error={e[`colors.${f.key}`]}>
                    <div className="flex items-center gap-2">
                      <label className="relative h-10 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10" style={{ background: v.colors[f.key] }}>
                        <span className="sr-only">Pick {f.label}</span>
                        <input type="color" value={v.colors[f.key]} onChange={(x) => set(`colors.${f.key}`, x.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                      </label>
                      <input
                        value={v.colors[f.key]}
                        onChange={(x) => set(`colors.${f.key}`, x.target.value)}
                        aria-label={`${f.label} hex value`}
                        maxLength={7}
                        className="h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 font-mono text-sm uppercase focus:border-accent/60 focus:outline-none"
                      />
                    </div>
                  </Field>
                ))}
              </div>
            </Card>

            <Card title="Typography">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Heading font">
                  <div className="grid gap-2">
                    {DISPLAY_FONTS.map((f) => (
                      <FontOption key={f} name={f} selected={v.fonts.display === f} onSelect={() => set("fonts.display", f)} display />
                    ))}
                  </div>
                </Field>
                <Field label="Body font">
                  <div className="grid gap-2">
                    {BODY_FONTS.map((f) => (
                      <FontOption key={f} name={f} selected={v.fonts.body === f} onSelect={() => set("fonts.body", f)} />
                    ))}
                  </div>
                </Field>
              </div>
            </Card>

            <Card title="Shapes and spacing">
              <div className="space-y-5">
                <Choice
                  label="Button style"
                  value={v.buttons}
                  onChange={(x) => set("buttons", x)}
                  options={[
                    { value: "pill", label: "Pill", preview: <span className="h-5 w-12 rounded-full bg-accent" /> },
                    { value: "rounded", label: "Rounded", preview: <span className="h-5 w-12 rounded-md bg-accent" /> },
                    { value: "square", label: "Square", preview: <span className="h-5 w-12 rounded-[2px] bg-accent" /> },
                  ]}
                />
                <Choice
                  label="Corner radius"
                  value={v.corners}
                  onChange={(x) => set("corners", x)}
                  options={[
                    { value: "sharp", label: "Sharp", preview: <span className="h-6 w-10 rounded-[3px] border border-white/40" /> },
                    { value: "soft", label: "Soft", preview: <span className="h-6 w-10 rounded-md border border-white/40" /> },
                    { value: "round", label: "Round", preview: <span className="h-6 w-10 rounded-xl border border-white/40" /> },
                  ]}
                />
                <Choice
                  label="Section spacing"
                  value={v.spacing}
                  onChange={(x) => set("spacing", x)}
                  options={[
                    { value: "compact", label: "Compact" },
                    { value: "comfortable", label: "Comfortable" },
                    { value: "spacious", label: "Spacious" },
                  ]}
                />
              </div>
            </Card>

            <Card title="Background effects">
              <div className="space-y-4">
                <Switch label="Floating dust particles" description="Gently drifting specks behind dark sections. Paused automatically when the tab is hidden." checked={v.effects.particles} onChange={(x) => set("effects.particles", x)} />
                <Switch label="Accent glow" description="A soft glow of the primary colour at the top of the page." checked={v.effects.glow} onChange={(x) => set("effects.glow", x)} />
                <Switch label="Film grain" description="A fine texture over the whole page." checked={v.effects.grain} onChange={(x) => set("effects.grain", x)} />
              </div>
            </Card>

            <Card title="Animation" description="Visitors who ask their device for reduced motion always get a calm version, whatever you choose here.">
              <div className="space-y-5">
                <Choice
                  label="Animation level"
                  value={v.motion.level}
                  onChange={(x) => set("motion.level", x)}
                  options={[
                    { value: "full", label: "Full cinematic" },
                    { value: "minimal", label: "Minimal" },
                  ]}
                />
                <Switch label="Intro loader" description="The short name reveal shown once per visit." checked={v.motion.loader} onChange={(x) => set("motion.loader", x)} disabled={v.motion.level === "minimal"} />
                <Switch label="Page transitions" description="The colour curtain when moving between pages." checked={v.motion.pageTransitions} onChange={(x) => set("motion.pageTransitions", x)} disabled={v.motion.level === "minimal"} />
              </div>
            </Card>

            <Card title="Header" description="Footer options are under Navigation & sections.">
              <div className="space-y-4">
                <Switch label="Hide header while scrolling down" description="It comes back as soon as the visitor scrolls up." checked={v.header.hideOnScroll} onChange={(x) => set("header.hideOnScroll", x)} />
                <Switch label="Blurred glass background" checked={v.header.blur} onChange={(x) => set("header.blur", x)} />
                <Switch label="Show your name next to the logo" checked={v.header.showName} onChange={(x) => set("header.showName", x)} />
              </div>
            </Card>
          </>
        );
      }}
    </SettingsEditor>
  );
}

function FontOption({ name, selected, onSelect, display }: { name: string; selected: boolean; onSelect: () => void; display?: boolean }) {
  const varName = {
    "Cormorant Garamond": "--ff-cormorant",
    "Playfair Display": "--ff-playfair",
    Fraunces: "--ff-fraunces",
    "DM Serif Display": "--ff-dmserif",
    Inter: "--ff-inter",
    Manrope: "--ff-manrope",
    "DM Sans": "--ff-dmsans",
    "Space Grotesk": "--ff-grotesk",
  }[name];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cx("flex items-baseline justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors", selected ? "border-accent/70 bg-accent/10" : "border-white/[0.08] hover:border-white/20")}
    >
      <span style={{ fontFamily: `var(${varName})` }} className={display ? "text-xl" : "text-sm"}>
        {display ? "Build something remarkable" : "Clear, readable body text"}
      </span>
      <span className="ml-3 shrink-0 text-[0.7rem] text-muted">{name}</span>
    </button>
  );
}

/** A miniature of the site rendered with the chosen settings. */
function ThemePreview({ a }: { a: AppearanceSettings }) {
  const vars = themeVariables(a) as unknown as CSSProperties;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
      <p className="border-b border-white/[0.06] bg-[#0d0b0a] px-4 py-2.5 text-[0.65rem] tracking-[0.22em] text-muted uppercase">Live preview</p>
      <div style={vars} className="bg-bg font-sans text-text">
        <div className="relative overflow-hidden p-5">
          {a.effects.glow && <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[140%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.25),transparent)]" />}
          <div className="relative flex items-center justify-between text-[0.6rem] tracking-[0.18em] text-muted uppercase">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-text/25 font-display text-xs normal-case italic">MA</span>
            <span>About · Projects</span>
          </div>
          <p className="relative mt-6 text-[0.55rem] tracking-[0.22em] text-accent-2 uppercase">Open to work</p>
          <p className="relative mt-2 font-display text-3xl leading-none">
            Hi, I&apos;m <em className="text-accent-2">Abdullah.</em>
          </p>
          <p className="relative mt-2 text-xs text-muted">Building fast, modern websites.</p>
          <div className="relative mt-4 flex gap-2">
            <span className="rounded-[var(--btn-radius)] bg-bone px-3 py-1.5 text-[0.55rem] tracking-[0.12em] text-ink uppercase">View work</span>
            <span className="rounded-[var(--btn-radius)] border border-text/30 px-3 py-1.5 text-[0.55rem] tracking-[0.12em] uppercase">Hire me</span>
          </div>
        </div>
        <div className="rounded-t-[var(--panel-radius-sm)] bg-bone p-5 text-ink">
          <p className="text-[0.55rem] tracking-[0.22em] text-accent-ink uppercase">About me</p>
          <p className="mt-2 font-display text-2xl leading-tight">
            A <em className="text-accent-ink">building</em> journey
          </p>
          <div className="mt-3 rounded-2xl border border-ink/10 bg-bone-2 p-3 text-xs text-ink/70">Cards use your corner radius.</div>
        </div>
        <div className="p-5">
          <div className="rounded-3xl border border-line bg-surface p-4">
            <p className="font-display text-lg">Project card</p>
            <p className="text-xs text-muted">Next.js · TypeScript</p>
            <span className="mt-3 inline-block rounded-[var(--btn-radius)] bg-accent px-3 py-1.5 text-[0.55rem] tracking-[0.12em] text-ink uppercase">Case study</span>
          </div>
        </div>
      </div>
    </div>
  );
}
