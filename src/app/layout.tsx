import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/content/site";
import {
  Cormorant_Garamond,
  DM_Sans,
  DM_Serif_Display,
  Fraunces,
  Inter,
  Manrope,
  Playfair_Display,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

// The default pair is preloaded. The alternatives offered in the admin
// Appearance settings are declared too, but browsers only download a font
// once a page actually uses it.
const inter = Inter({ variable: "--ff-inter", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({
  variable: "--ff-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const playfair = Playfair_Display({ variable: "--ff-playfair", subsets: ["latin"], style: ["normal", "italic"], display: "swap", preload: false });
const fraunces = Fraunces({ variable: "--ff-fraunces", subsets: ["latin"], style: ["normal", "italic"], display: "swap", preload: false });
const dmSerif = DM_Serif_Display({ variable: "--ff-dmserif", subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", preload: false });
const manrope = Manrope({ variable: "--ff-manrope", subsets: ["latin"], display: "swap", preload: false });
const dmSans = DM_Sans({ variable: "--ff-dmsans", subsets: ["latin"], display: "swap", preload: false });
const grotesk = Space_Grotesk({ variable: "--ff-grotesk", subsets: ["latin"], display: "swap", preload: false });

const fontVars = [inter, cormorant, playfair, fraunces, dmSerif, manrope, dmSans, grotesk].map((f) => f.variable).join(" ");

export const metadata: Metadata = { metadataBase: new URL(siteUrl) };

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  colorScheme: "dark light",
};

/** Shared by the public site and the admin panel; each adds its own chrome. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVars} antialiased`} suppressHydrationWarning>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
