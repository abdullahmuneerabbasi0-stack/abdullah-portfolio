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
          background: "radial-gradient(circle at 80% 0%, rgba(255,77,46,0.45), transparent 55%), radial-gradient(circle at 0% 100%, rgba(255,176,32,0.25), transparent 50%), #0a0a0b",
          color: "#f5f5f4",
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
            background: "linear-gradient(100deg,#ff4d2e,#ff7a1a,#ffb020)",
            color: "#0a0a0b",
            fontSize: 44,
            fontWeight: 800,
          }}
        >
          {profile.initials}
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, marginTop: 48, letterSpacing: -2 }}>{profile.name}</div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 12, color: "#ff7a1a" }}>{profile.roles.join("  ·  ")}</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 28, color: "#a1a1aa", maxWidth: 900 }}>{profile.headline}</div>
      </div>
    ),
    size,
  );
}
