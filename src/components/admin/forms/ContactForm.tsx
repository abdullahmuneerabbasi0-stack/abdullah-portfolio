"use client";

import type { ContactSettings } from "@/lib/content/types";
import { SettingsEditor } from "../SettingsEditor";
import { Card, Switch, TextArea, TextField } from "../ui";

type Props = { initial: ContactSettings; hasUnpublished: boolean; publishedAt: string | null };

export function ContactSettingsForm({ initial, hasUnpublished, publishedAt }: Props) {
  return (
    <SettingsEditor
      settingsKey="contact"
      title="Contact details"
      description="How visitors can reach you. Leave a field empty to hide that option on the site."
      initial={initial}
      hasUnpublished={hasUnpublished}
      publishedAt={publishedAt}
    >
      {({ value: v, set, errors: e }) => (
        <>
          <Card title="Section text" description="Wrap words in *asterisks* to show them in the italic accent style.">
            <div className="grid gap-4">
              <TextField label="Heading" value={v.heading} onChange={(x) => set("heading", x)} error={e.heading} maxLength={120} />
              <TextArea label="Intro" value={v.intro} onChange={(x) => set("intro", x)} error={e.intro} rows={2} maxLength={400} />
            </div>
          </Card>
          <Card title="Direct contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Email" type="email" value={v.email} onChange={(x) => set("email", x)} error={e.email} />
              <TextField label="Phone" value={v.phone} onChange={(x) => set("phone", x)} error={e.phone} placeholder="+92 300 1234567" />
              <TextField label="WhatsApp number" hint="Country code and number, digits only, e.g. 923001234567." value={v.whatsapp} onChange={(x) => set("whatsapp", x)} error={e.whatsapp} />
            </div>
          </Card>
          <Card title="Social profiles" description="Full web addresses. These appear in the contact section and the footer.">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="LinkedIn" value={v.linkedin} onChange={(x) => set("linkedin", x)} error={e.linkedin} placeholder="https://www.linkedin.com/in/…" />
              <TextField label="GitHub" value={v.github} onChange={(x) => set("github", x)} error={e.github} placeholder="https://github.com/…" />
              <TextField label="Facebook" value={v.facebook} onChange={(x) => set("facebook", x)} error={e.facebook} />
              <TextField label="Instagram" value={v.instagram} onChange={(x) => set("instagram", x)} error={e.instagram} />
            </div>
          </Card>
          <Card title="Contact form" description="Messages are stored in your admin inbox under Messages. Spam protection and rate limiting are built in.">
            <div className="space-y-4">
              <Switch label="Show the contact form" description="When off, visitors only see your direct contact options." checked={v.form.enabled} onChange={(x) => set("form.enabled", x)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Form title" value={v.form.title} onChange={(x) => set("form.title", x)} maxLength={80} />
                <TextField label="Message after sending" value={v.form.successMessage} onChange={(x) => set("form.successMessage", x)} maxLength={300} />
                <TextArea className="sm:col-span-2" label="Form intro" value={v.form.intro} onChange={(x) => set("form.intro", x)} rows={2} maxLength={300} />
              </div>
            </div>
          </Card>
        </>
      )}
    </SettingsEditor>
  );
}
