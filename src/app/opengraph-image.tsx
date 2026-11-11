import { ImageResponse } from "next/og";
import { profile } from "@/content/site";
import { getPublishedSiteData } from "@/lib/server/site-data";

export const alt = `${profile.name}: ${profile.roles.join(" & ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const { hero, appearance } = await getPublishedSiteData();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "radial-gradient(circle at 80% 0%, rgba(217,138,92,0.4), transparent 55%), #0c0a09",
          color: "#f1ebe0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 96,
            height: 96,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            background: appearance.colors.accent,
            color: "#0c0a09",
            fontSize: 44,
            fontWeight: 800,
          }}
        >
          {hero.initials}
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, marginTop: 48, letterSpacing: -2 }}>{hero.name}</div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 12, color: "#e39b6e" }}>{hero.role}</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 28, color: "#a69c8f", maxWidth: 900 }}>{hero.headline}</div>
      </div>
    ),
    size,
  );
}
