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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        className={`bg-deep-obsidian/90 fixed inset-0 z-[100] backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: "var(--header-height)" }}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <nav
        ref={menuRef}
        className={`bg-deep-obsidian fixed top-[var(--header-height)] right-0 z-[101] h-[calc(100vh-var(--header-height))] w-full max-w-sm transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="flex flex-col gap-2 p-6">
          <p className="text-diamond-dust mb-4 text-xs font-medium tracking-widest uppercase">
            Tools
          </p>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group bg-slate-grey/30 hover:bg-slate-grey/60 hover:shadow-aqua/5 relative flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-pure-quartz group-hover:text-aqua text-base font-semibold transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-diamond-dust/80 group-hover:text-diamond-dust mt-0.5 text-sm transition-colors duration-300">
                  {item.description}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute right-0 bottom-0 left-0 p-6">
          <p className="text-diamond-dust/50 text-center text-xs">
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
