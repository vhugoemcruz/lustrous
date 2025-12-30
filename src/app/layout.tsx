// @ts-check
/**
 * @module layout
 * @description Layout raiz do Lustrous com tema escuro e estrutura base
 */

import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

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
  keywords: ["art", "illustration", "perspective", "3D", "color theory", "tools"],
  authors: [{ name: "Lustrous" }],
  openGraph: {
    title: "Lustrous | Tools for Artists",
    description: "Free utility tools for artists",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Header />
        <main className="pt-[var(--header-height)]">{children}</main>
      </body>
    </html>
  );
}
