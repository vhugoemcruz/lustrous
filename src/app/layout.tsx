/**
 * @module layout
 * @description Lustrous root layout with dark theme and base structure
 */

import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { MainScrollContainer } from "@/components/layout/MainScrollContainer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Lustrous | Tools for Artists",
  description:
    "Free utility tools for artists - perspective grids, 3D visualization, and color analysis",
  keywords: [
    "art",
    "illustration",
    "perspective",
    "3D",
    "color theory",
    "tools",
  ],
  authors: [{ name: "Lustrous" }],
  openGraph: {
    title: "Lustrous | Tools for Artists",
    description: "Free utility tools for artists",
    type: "website",
  },
};

/**
 * Root Layout component.
 * Defines the basic document structure, fonts, and theme.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${montserrat.variable} bg-background text-foreground bg-deep-obsidian h-screen w-screen overflow-hidden antialiased`}
        suppressHydrationWarning
      >
        <ParticleBackground
          particleCount={100}
          connectionDistance={120}
          interactive
        />
        <Header />
        <MainScrollContainer>{children}</MainScrollContainer>
      </body>
    </html>
  );
}
