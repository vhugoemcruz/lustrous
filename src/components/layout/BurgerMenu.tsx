/**
 * @module BurgerMenu
 * @description Side navigation menu with warm paper aesthetic.
 * Replaces dark glass-effect menu with sketchbook-style panel.
 */

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/** SVG icon components for each tool (replaces emoji per skill guidelines) */
const PerspectiveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--watercolor-blue)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M2 3h20M4 3v18l8-4 8 4V3" />
    <path d="M8 8h8M6 13h12" opacity="0.6" />
  </svg>
);

const ViewerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--watercolor-coral)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 3L2 9l10 6 10-6-10-6Z" />
    <path d="M2 15l10 6 10-6" opacity="0.6" />
    <path d="M2 9v6" opacity="0.4" />
    <path d="M22 9v6" opacity="0.4" />
  </svg>
);

const ColorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--watercolor-violet)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="8" r="2.5" fill="var(--watercolor-coral)" opacity="0.4" stroke="none" />
    <circle cx="8.5" cy="14" r="2.5" fill="var(--watercolor-blue)" opacity="0.4" stroke="none" />
    <circle cx="15.5" cy="14" r="2.5" fill="var(--watercolor-amber)" opacity="0.4" stroke="none" />
  </svg>
);

const menuItems = [
  {
    href: "/perspective-grid",
    label: "Perspective Grid",
    description: "Create and study perspective grids",
    icon: <PerspectiveIcon />,
  },
  {
    href: "/obj-viewer",
    label: "3D Viewer",
    description: "Visualize .obj models for 3D study",
    icon: <ViewerIcon />,
  },
  {
    href: "/color-analysis",
    label: "Color Analysis",
    description: "Analyze color palettes from images",
    icon: <ColorIcon />,
  },
];

/**
 * Side Navigation Menu component (Burger Menu) — Artist's Studio style.
 * Paper-panel design with warm tones and hand-drawn icon style.
 * Uses portal to render outside header stacking context.
 */
export function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
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
      {/* Backdrop — warm paper overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[var(--canvas-cream)]/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: "var(--header-height)" }}
        aria-hidden="true"
      />

      {/* Menu Panel — paper card style */}
      <nav
        ref={menuRef}
        className={`fixed top-[var(--header-height)] right-0 z-[101] h-[calc(100vh-var(--header-height))] w-full max-w-sm bg-[var(--paper-warm)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Main navigation"
        role="navigation"
        style={{
          boxShadow: isOpen
            ? "-4px 0 20px rgba(44, 44, 44, 0.08)"
            : "none",
        }}
      >
        {/* Left pencil-line border */}
        <div
          className="absolute top-0 bottom-0 left-0 w-px"
          style={{ background: "var(--sketchbook-grey)" }}
        />

        <div className="flex flex-col gap-2 p-6">
          <p className="text-ink-light mb-4 font-[family-name:var(--font-headline)] text-sm font-medium tracking-widest uppercase">
            Tools
          </p>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group relative flex items-start gap-4 rounded-xl border border-transparent bg-[var(--canvas-cream)]/60 p-4 transition-all duration-300 hover:border-[var(--sketchbook-grey)] hover:bg-[var(--canvas-cream)]"
              style={{
                boxShadow: "1px 2px 6px rgba(44, 44, 44, 0.04)",
              }}
            >
              <span className="flex h-10 w-10 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-ink-black group-hover:text-wc-blue text-base font-semibold transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-ink-light group-hover:text-ink-charcoal mt-0.5 text-sm transition-colors duration-300">
                  {item.description}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute right-0 bottom-0 left-0 p-6">
          <p className="text-ink-light/50 text-center font-[family-name:var(--font-headline)] text-sm">
            Free tools for artists ✨
          </p>
        </div>
      </nav>
    </>
  );

  if (!mounted) return null;
  return createPortal(menuContent, document.body);
}
