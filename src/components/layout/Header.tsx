/**
 * @module Header
 * @description Fixed header with frosted glass effect, logo, nav links, and CTA button.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BurgerMenu } from "./BurgerMenu";
import { LustrousLogo } from "@/components/ui/LustrousLogo";

const navLinks = [
  { href: "/perspective-grid", label: "Perspective" },
  { href: "/obj-viewer", label: "3D Viewer" },
  { href: "/color-analysis", label: "Colors" },
];

/**
 * Header component.
 * Contains the logo, navigation links (desktop), CTA button, and burger menu.
 */
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Burger Menu - Right Corner */}
        <div className="flex items-center">
          {/* Burger Button - All screens */}
          <button
            id="burger-toggle-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:bg-anthracite relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span
              className={`bg-pure-quartz h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`bg-pure-quartz h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "scale-0 opacity-0" : ""
              }`}
            />
            <span
              className={`bg-pure-quartz h-0.5 w-5 rounded-full transition-all duration-300 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Menu Overlay */}
      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
