// @ts-check
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
 * Contains the logo, navigation links (desktop), CTA button, and burger menu (mobile).
 */
export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] glass border-b border-glass-border">
            <div className="container mx-auto h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="hover:opacity-80 transition-opacity"
                    aria-label="Lustrous Home"
                >
                    <LustrousLogo size={28} showText />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
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

                {/* Right side: CTA + Burger */}
                <div className="flex items-center gap-4">
                    {/* CTA Button - Desktop only */}
                    <Link
                        href="/perspective-grid"
                        className="hidden md:flex btn-cta text-sm"
                    >
                        Open App
                    </Link>

                    {/* Burger Button - All screens */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-anthracite transition-colors"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMenuOpen}
                    >
                        <span
                            className={`w-5 h-0.5 bg-pure-quartz rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`w-5 h-0.5 bg-pure-quartz rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-0" : ""
                                }`}
                        />
                        <span
                            className={`w-5 h-0.5 bg-pure-quartz rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""
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
