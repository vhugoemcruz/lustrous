/**
 * @module layout
 * @description Lustrous root layout — Artist's Studio theme with warm paper aesthetics
 */

import type { Metadata } from "next";
import { Nunito, Caveat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

import { MainScrollContainer } from "@/components/layout/MainScrollContainer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${caveat.variable} bg-background text-foreground h-screen w-screen overflow-hidden antialiased`}
        suppressHydrationWarning
      >

        <Header />
        <MainScrollContainer>{children}</MainScrollContainer>
      </body>
    </html>
  );
}
