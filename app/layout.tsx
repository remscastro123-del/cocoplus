import type { Metadata } from "next";
import { Bebas_Neue, Caveat_Brush, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Headings (h1/h2) only, matching the packaging. Bebas Neue has one weight.
const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

// Hand-painted accent for short labels (eyebrows, stickers) only.
const caveatBrush = Caveat_Brush({
  variable: "--font-caveat-brush",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cocoplus",
  description:
    "Manufactures organic Virgin Coconut Oil, Known to be the healthiest dietary oil on earth.",
  keywords: ["coconut oil", "virgin oil"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${bebas.variable} ${caveatBrush.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
