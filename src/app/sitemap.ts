import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { getPublishedSiteData } from "@/lib/server/site-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getPublishedSiteData();
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
