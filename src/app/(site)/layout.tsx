import type { Metadata } from "next";
import { getSiteData } from "@/lib/server/site-data";
import { siteUrl } from "@/content/site";
import { SiteShell } from "@/components/site/SiteShell";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getSiteData();
  const title = `${hero.name} | ${hero.role}`;
  const description = hero.headline || `${hero.name}, ${hero.role}${hero.location ? ` in ${hero.location}` : ""}.`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${hero.name}` },
    description,
    applicationName: `${hero.name} Portfolio`,
    authors: [{ name: hero.name, url: siteUrl }],
    creator: hero.name,
    keywords: [hero.name, hero.role, "Next.js developer", "React developer", "Web developer Karachi", "Premium AI Website Studio"],
    alternates: { canonical: "/" },
    openGraph: { type: "website", url: siteUrl, siteName: `${hero.name} Portfolio`, title, description, locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
