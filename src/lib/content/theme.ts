import type { AppearanceSettings } from "./types";

/** Turns Appearance settings into the CSS variables the public site is built on. */

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("");

/** Mix `b` into `a` by `t` (0..1). */
export const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
};
const rgbTriplet = (hex: string) => hexToRgb(hex).join(" ");

/** Relative luminance, for picking readable text colours. */
export const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

export const FONT_VARS: Record<string, string> = {
  "Cormorant Garamond": "--ff-cormorant",
  "Playfair Display": "--ff-playfair",
  Fraunces: "--ff-fraunces",
  "DM Serif Display": "--ff-dmserif",
  Inter: "--ff-inter",
  Manrope: "--ff-manrope",
  "DM Sans": "--ff-dmsans",
  "Space Grotesk": "--ff-grotesk",
};

const BUTTON_RADIUS = { pill: "9999px", rounded: "0.75rem", square: "0.125rem" };
const CORNERS = {
  sharp: { panel: "0.5rem", panelSm: "0.375rem", frame: "0.375rem", xl: "0.25rem", x2: "0.375rem", x3: "0.5rem" },
  soft: { panel: "1.5rem", panelSm: "1rem", frame: "1rem", xl: "0.5rem", x2: "0.75rem", x3: "1rem" },
  round: { panel: "3rem", panelSm: "2rem", frame: "2rem", xl: "0.75rem", x2: "1rem", x3: "1.5rem" },
};
const SPACING = { compact: 0.7, comfortable: 1, spacious: 1.25 };

export function themeVariables(a: AppearanceSettings): Record<string, string> {
  const c = a.colors;
  const corners = CORNERS[a.corners] ?? CORNERS.round;
  // Copper text on the paper panels needs to be darker (or lighter) than the
  // accent itself to stay readable, so it is mixed toward the panel's text colour.
  const accentInk = mix(c.accent, c.panelText, 0.35);
  return {
    "--bg": c.bg,
    "--surface": c.surface,
    "--surface-2": mix(c.surface, c.text, 0.05),
    "--text": c.text,
    "--muted": c.muted,
    "--accent": c.accent,
    "--accent-2": c.accent2,
    "--accent-3": mix(c.accent2, c.text, 0.3),
    "--accent-rgb": rgbTriplet(c.accent),
    "--accent-ink": accentInk,
    "--bone": c.panel,
    "--bone-2": mix(c.panel, c.panelText, 0.05),
    "--ink": c.panelText,
    "--line": `rgb(${rgbTriplet(c.text)} / 0.12)`,
    "--glass": `rgb(${rgbTriplet(c.text)} / 0.035)`,
    "--glass-strong": `rgb(${rgbTriplet(c.text)} / 0.06)`,
    "--glass-border": `rgb(${rgbTriplet(c.text)} / 0.1)`,
    "--btn-radius": BUTTON_RADIUS[a.buttons] ?? BUTTON_RADIUS.pill,
    "--panel-radius": corners.panel,
    "--panel-radius-sm": corners.panelSm,
    "--frame-radius": corners.frame,
    "--radius-xl": corners.xl,
    "--radius-2xl": corners.x2,
    "--radius-3xl": corners.x3,
    "--section-space": String(SPACING[a.spacing] ?? 1),
    "--font-heading": `var(${FONT_VARS[a.fonts.display] ?? "--ff-cormorant"})`,
    "--font-body": `var(${FONT_VARS[a.fonts.body] ?? "--ff-inter"})`,
  };
}

export function themeCss(a: AppearanceSettings): string {
  const vars = Object.entries(themeVariables(a))
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `:root{${vars}}html{color-scheme:${a.mode === "light" ? "light" : "dark"}}${a.effects.grain ? "" : ".grain{display:none}"}`;
}
