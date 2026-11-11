"use client";

import type { AboutSettings } from "@/lib/content/types";
import { SettingsEditor } from "../SettingsEditor";
import { Card, SelectField, TextArea, TextField } from "../ui";
import { ListEditor, TagsInput } from "../fields";

type Props = { initial: AboutSettings; hasUnpublished: boolean; publishedAt: string | null; projectCount: number };

export function AboutForm({ initial, hasUnpublished, publishedAt, projectCount }: Props) {
  return (
    <SettingsEditor
      settingsKey="about"
      title="About & education"
      description="Your introduction, what you stand for, key numbers, professional interests and education. The section titles are edited under Navigation & sections."
      initial={initial}
      hasUnpublished={hasUnpublished}
      publishedAt={publishedAt}
    >
      {({ value: v, set, errors: e }) => (
        <>
          <Card title="Introduction" description="The first paragraph is shown large and lights up word by word as visitors scroll. The others appear below it.">
            <ListEditor
              label="Paragraphs"
              items={v.paragraphs}
              onChange={(x) => set("paragraphs", x)}
              max={6}
              addLabel="Add paragraph"
              error={e.paragraphs}
              itemLabel={(p, i) => (i === 0 ? "Lead paragraph" : p.slice(0, 50))}
              create={() => ""}
              render={(p, i, setItem) => <TextArea label={i === 0 ? "Lead paragraph" : "Paragraph"} value={p} onChange={(x) => setItem("", x)} error={e[`paragraphs.${i}`]} rows={i === 0 ? 3 : 4} maxLength={1200} />}
            />
          </Card>

          <Card title="What I stand for" description="Short principles shown as numbered cards.">
            <ListEditor
              label="Principles"
              items={v.pillars}
              onChange={(x) => set("pillars", x)}
              max={6}
              addLabel="Add principle"
              itemLabel={(p) => p.title}
              create={() => ({ title: "", text: "" })}
              render={(p, i, setItem) => (
                <div className="grid gap-3">
                  <TextField label="Title" value={p.title} onChange={(x) => setItem("title", x)} error={e[`pillars.${i}.title`]} maxLength={60} />
                  <TextArea label="Text" value={p.text} onChange={(x) => setItem("text", x)} error={e[`pillars.${i}.text`]} rows={2} maxLength={240} />
                </div>
              )}
            />
          </Card>

          <Card title="Key numbers" description="Only use numbers that are true. A number can also be counted automatically from your published projects.">
            <ListEditor
              label="Numbers"
              items={v.facts}
              onChange={(x) => set("facts", x)}
              max={6}
              addLabel="Add number"
              itemLabel={(f) => `${f.auto === "projects" ? projectCount : f.value} ${f.unit}`}
              create={() => ({ value: 0, unit: "", label: "", auto: null })}
              render={(f, i, setItem) => (
                <div className="grid gap-3 sm:grid-cols-3">
                  <SelectField
                    label="Source"
                    value={f.auto === "projects" ? "projects" : "manual"}
                    onChange={(x) => setItem("auto", x === "projects" ? "projects" : null)}
                    options={[
                      { value: "manual", label: "Number I type" },
                      { value: "projects", label: `Published projects (${projectCount})` },
                    ]}
                  />
                  {f.auto === "projects" ? (
                    <TextField label="Number" value={String(projectCount)} onChange={() => {}} disabled hint="Counted automatically." />
                  ) : (
                    <TextField label="Number" type="number" min={0} value={String(f.value)} onChange={(x) => setItem("value", x === "" ? "" : Number(x))} error={e[`facts.${i}.value`]} />
                  )}
                  <TextField label="Unit" value={f.unit} onChange={(x) => setItem("unit", x)} error={e[`facts.${i}.unit`]} maxLength={20} placeholder="days" />
                  <TextField className="sm:col-span-3" label="Description" value={f.label} onChange={(x) => setItem("label", x)} error={e[`facts.${i}.label`]} maxLength={80} />
                </div>
              )}
            />
          </Card>

          <Card title="Professional interests" description="Shown as a scrolling ribbon under the skills.">
            <TagsInput label="Interests" value={v.interests} onChange={(x) => set("interests", x)} error={e.interests} max={16} />
          </Card>

          <Card title="Education">
            <ListEditor
              label="Qualifications"
              items={v.education}
              onChange={(x) => set("education", x)}
              max={12}
              addLabel="Add qualification"
              itemLabel={(x) => x.qualification}
              confirmRemove
              create={() => ({ qualification: "", institution: "", period: "", details: "" })}
              render={(x, i, setItem) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Qualification" value={x.qualification} onChange={(y) => setItem("qualification", y)} error={e[`education.${i}.qualification`]} maxLength={140} />
                  <TextField label="Institution" value={x.institution} onChange={(y) => setItem("institution", y)} maxLength={140} />
                  <TextField label="Period" value={x.period} onChange={(y) => setItem("period", y)} maxLength={60} placeholder="2022 – 2024 or Completed" />
                  <TextField label="Details" value={x.details} onChange={(y) => setItem("details", y)} maxLength={300} />
                </div>
              )}
            />
          </Card>

          <Card title="Certifications" description="Leave empty to hide the certifications list.">
            <ListEditor
              label="Certificates"
              items={v.certifications}
              onChange={(x) => set("certifications", x)}
              max={20}
              addLabel="Add certificate"
              itemLabel={(x) => x.name}
              confirmRemove
              create={() => ({ name: "", issuer: "", year: "", url: "" })}
              render={(x, i, setItem) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Certificate" value={x.name} onChange={(y) => setItem("name", y)} error={e[`certifications.${i}.name`]} maxLength={140} />
                  <TextField label="Issuer" value={x.issuer} onChange={(y) => setItem("issuer", y)} error={e[`certifications.${i}.issuer`]} maxLength={100} />
                  <TextField label="Year" value={x.year} onChange={(y) => setItem("year", y)} maxLength={20} />
                  <TextField label="Verification link" value={x.url} onChange={(y) => setItem("url", y)} error={e[`certifications.${i}.url`]} placeholder="https://" />
                </div>
              )}
            />
          </Card>
        </>
      )}
    </SettingsEditor>
  );
}
