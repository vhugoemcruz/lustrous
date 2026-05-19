/**
 * @module Header
 * @description Fixed header with paper-strip aesthetic, paintbrush logo, and hand-drawn nav.
 * Replaces glass/frosted header with warm, artistic styling.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BurgerMenu } from "./BurgerMenu";
import { LustrousLogo } from "@/components/ui/LustrousLogo";
import { NavLink } from "@/components/ui/NavLink";

const navLinks = [
  { href: "/perspective-grid", label: "Perspective" },
  { href: "/obj-viewer", label: "3D Viewer" },
  { href: "/color-analysis", label: "Colors" },
];

/** Watercolor palette for burger menu lines */
const WATERCOLORS = [
  "#5B8FB9", // blue
  "#E07A5F", // coral
  "#8B6BB5", // violet
  "#81B29A", // sage
  "#F2CC8F", // amber
];

/**
 * Header component — Artist's Studio style.
 * Paper-strip aesthetic with paintbrush logo and hand-drawn navigation.
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lineColors, setLineColors] = useState<string[]>([
    "#4A4A4A",
    "#4A4A4A",
    "#4A4A4A",
  ]);
  const pathname = usePathname();

  useEffect(() => {
    const randomColors = Array(3)
      .fill(null)
      .map(() => WATERCOLORS[Math.floor(Math.random() * WATERCOLORS.length)]);
    setLineColors(randomColors);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-[var(--header-height)]">
      {/* Subtle bottom border — like a pencil line */}
      <div
        className="absolute right-0 bottom-0 left-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, var(--sketchbook-grey) 20%, var(--sketchbook-grey) 80%, transparent 95%)",
        }}
      />

      <div className="flex h-full items-center justify-between px-8 md:px-20">
        {/* Logo - Left Corner */}
        <Link
          href="/"
          className="transition-opacity hover:opacity-80"
          aria-label="Lustrous Home"
        >
          <LustrousLogo size={28} showText />
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav
          className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              isActive={pathname === link.href}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: Burger Menu */}
        <div className="flex items-center">
          <button
            id="burger-toggle-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
              style={{ backgroundColor: lineColors[0] }}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "scale-0 opacity-0" : ""
              }`}
              style={{ backgroundColor: lineColors[1] }}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
              style={{ backgroundColor: lineColors[2] }}
            />
          </button>
        </div>
      </div>

      {/* Menu Overlay */}
      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
