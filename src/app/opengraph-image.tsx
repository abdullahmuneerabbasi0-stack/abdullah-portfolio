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
            background: "#d98a5c",
            color: "#0c0a09",
            fontSize: 44,
            fontWeight: 800,
          }}
        >
          {profile.initials}
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, marginTop: 48, letterSpacing: -2 }}>{profile.name}</div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 12, color: "#e39b6e" }}>{profile.roles.join("  ·  ")}</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 28, color: "#a69c8f", maxWidth: 900 }}>{profile.headline}</div>
      </div>
    ),
    size,
  );
}
