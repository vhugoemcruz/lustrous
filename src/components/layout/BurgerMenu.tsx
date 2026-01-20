// @ts-check
/**
 * @module BurgerMenu
 * @description Navigation menu with glass effect listing the tools
 */

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface BurgerMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    {
        href: "/perspective-grid",
        label: "Perspective Grid",
        description: "Create and study perspective grids",
        icon: "📐",
    },
    {
        href: "/obj-viewer",
        label: "3D Viewer",
        description: "Visualize .obj models for 3D study",
        icon: "🧊",
    },
    {
        href: "/color-analysis",
        label: "Color Analysis",
        description: "Analyze color palettes from images",
        icon: "🎨",
    },
];

/**
 * Side Navigation Menu component (Burger Menu).
 * Displays available tools in a side panel with glass effect.
 * Uses portal to render outside header stacking context.
 */
export function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Mount state for portal (client-side only)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            // Ignore clicks on the burger toggle button (it handles its own toggle)
            const burgerBtn = document.getElementById("burger-toggle-btn");
            if (burgerBtn && burgerBtn.contains(target)) {
                return;
            }
            if (menuRef.current && !menuRef.current.contains(target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const menuContent = (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[100] bg-deep-obsidian/90 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                style={{ top: "var(--header-height)" }}
                aria-hidden="true"
            />

            {/* Menu Panel */}
            <nav
                ref={menuRef}
                className={`fixed right-0 top-[var(--header-height)] z-[101] h-[calc(100vh-var(--header-height))] w-full max-w-sm glass border-l border-glass-border transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                aria-label="Main navigation"
                role="navigation"
            >
                <div className="flex flex-col gap-2 p-6">
                    <p className="text-xs font-medium text-diamond-dust uppercase tracking-widest mb-4">
                        Tools
                    </p>

                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-grey transition-all duration-200"
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <div className="flex flex-col">
                                <span className="text-base font-semibold text-pure-quartz group-hover:text-aqua transition-colors">
                                    {item.label}
                                </span>
                                <span className="text-sm text-diamond-dust mt-0.5">
                                    {item.description}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-glass-border">
                    <p className="text-xs text-diamond-dust/60 text-center">
                        Free tools for artists ✨
                    </p>
                </div>
            </nav>
        </>
    );

    // Use portal to render outside header stacking context
    if (!mounted) return null;
    return createPortal(menuContent, document.body);
}
