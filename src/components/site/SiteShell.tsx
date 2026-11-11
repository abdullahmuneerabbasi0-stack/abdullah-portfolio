import type { ReactNode } from "react";
import Link from "next/link";
import { getSiteData } from "@/lib/server/site-data";
import { themeCss } from "@/lib/content/theme";
import { siteUrl } from "@/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Background } from "@/components/ui/Background";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Loader } from "@/components/layout/Loader";
import { navLinks } from "./nav";

/** The public site's frame: theme, navigation, footer and ambient effects. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const data = await getSiteData();
  const { appearance: a, hero, contact } = data;
  const minimal = a.motion.level === "minimal";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: hero.name,
    jobTitle: hero.role,
    url: siteUrl,
    sameAs: [contact.github, contact.linkedin, contact.facebook, contact.instagram].filter(Boolean),
    knowsAbout: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Supabase"],
    address: { "@type": "PostalAddress", addressLocality: "Karachi", addressRegion: "Sindh", addressCountry: "PK" },
  };

  return (
    <div data-motion={minimal ? "minimal" : "full"} className="contents">
      <style dangerouslySetInnerHTML={{ __html: themeCss(a) }} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      {data.preview && (
        <div className="fixed inset-x-0 bottom-4 z-[95] flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/85 px-4 py-2 text-xs text-white shadow-2xl backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
            Preview: showing unpublished drafts
            <a href="/admin/preview/exit" className="rounded-full bg-white px-3 py-1 font-medium text-black">
              Exit preview
            </a>
            <Link href="/admin" className="underline underline-offset-2">
              Back to admin
            </Link>
          </div>
        </div>
      )}
      <MotionProvider minimal={minimal} pageTransitions={a.motion.pageTransitions}>
        <Loader enabled={a.motion.loader && !minimal} name={hero.name} />
        <Background particles={a.effects.particles && !minimal} glow={a.effects.glow} />
        <ScrollProgress />
        <Navbar
          links={navLinks(data)}
          cta={data.layout.navCta.enabled ? { label: data.layout.navCta.label, href: data.layout.navCta.href } : null}
          name={hero.name}
          initials={hero.initials}
          email={contact.email}
          location={hero.location}
          header={a.header}
        />
        <main id="main">{children}</main>
        <Footer data={data} />
      </MotionProvider>
      {a.effects.grain && <div className="grain" aria-hidden="true" />}
    </div>
  );
}
