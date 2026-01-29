/**
 * @module Header
 * @description Fixed header with frosted glass effect, logo, nav links, and CTA button.
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

const PARTICLE_COLORS = [
  "#8a2be2", // Amethyst Purple
  "#00ffff", // Aqua Cyan
  "#ff00ff", // Magenta Fusion
  "#ffd700", // Pyrite Gold
  "#34d399", // Emerald Green
];

/**
 * Header component.
 * Contains the logo, navigation links (desktop), CTA button, and burger menu.
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lineColors, setLineColors] = useState<string[]>([
    "#fff",
    "#fff",
    "#fff",
  ]);
  const pathname = usePathname();

  useEffect(() => {
    // Generate 3 random colors from the palette
    const randomColors = Array(3)
      .fill(null)
      .map(
        () =>
          PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
      );
    setLineColors(randomColors);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-[var(--header-height)]">
      <div className="flex h-full items-center justify-between px-20">
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

        {/* Right side: Burger Menu - Right Corner */}
        <div className="flex items-center">
          {/* Burger Button - All screens */}
          <button
            id="burger-toggle-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-pure-quartz/5 hover:bg-pure-quartz/10 relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
              style={{
                backgroundColor: lineColors[0],
                boxShadow: `0 0 8px ${lineColors[0]}`,
              }}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "scale-0 opacity-0" : ""
              }`}
              style={{
                backgroundColor: lineColors[1],
                boxShadow: `0 0 8px ${lineColors[1]}`,
              }}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
              style={{
                backgroundColor: lineColors[2],
                boxShadow: `0 0 8px ${lineColors[2]}`,
              }}
            />
          </button>
        </div>
      </div>

      {/* Menu Overlay */}
      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
