// @ts-check
/**
 * @module Header
 * @description Header fixo com logo e burger menu para navegação
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { BurgerMenu } from "./BurgerMenu";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] glass border-b border-glass-border">
            <div className="container mx-auto h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-xl font-bold gradient-text font-[family-name:var(--font-montserrat)] tracking-tight hover:opacity-80 transition-opacity"
                >
                    LUSTROUS
                </Link>

                {/* Burger Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-grey transition-colors"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                >
                    <span
                        className={`w-5 h-0.5 bg-text-primary rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""
                            }`}
                    />
                    <span
                        className={`w-5 h-0.5 bg-text-primary rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-0" : ""
                            }`}
                    />
                    <span
                        className={`w-5 h-0.5 bg-text-primary rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Menu Overlay */}
            <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
}
