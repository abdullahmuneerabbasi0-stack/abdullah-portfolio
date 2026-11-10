import { ImageResponse } from "next/og";
import { profile } from "@/content/site";

export const alt = `${profile.name}: ${profile.roles.join(" & ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#121110",
          color: "#ece6da",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 2, color: "#ff5a36", textTransform: "uppercase" }}>
          {profile.name} · Karachi
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>
          {profile.headline}
        </div>
        <div style={{ display: "flex", height: 8, width: 160, background: "#ff5a36" }} />
      </div>
    ),
    size,
  );
}
