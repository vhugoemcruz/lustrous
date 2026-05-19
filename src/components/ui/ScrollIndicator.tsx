/**
 * @module ScrollIndicator
 * @description Artistic scroll indicator with a hand-drawn pencil icon
 * and handwritten "Explore" text. Fades out as user scrolls down.
 */

"use client";

import { useEffect, useState, useCallback } from "react";

interface ScrollIndicatorProps {
  /** Callback fired when visibility changes */
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * ScrollIndicator component — Artist's Studio style.
 * Displays handwritten "Explore" text with a bouncing hand-drawn pencil icon.
 * Fades out when user scrolls down.
 */
export function ScrollIndicator({ onVisibilityChange }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const mainContainer = document.getElementById("main-scroll-container");
    if (!mainContainer) return;
    const scrollY = mainContainer.scrollTop;
    const newVisible = scrollY < 100;
    setIsVisible(newVisible);
  }, []);

  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  useEffect(() => {
    const mainContainer = document.getElementById("main-scroll-container");
    if (!mainContainer) return;
    mainContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainContainer.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Handwritten explore text */}
      <span className="text-ink-light mb-2 font-[family-name:var(--font-headline)] text-base font-semibold tracking-widest">
        explore
      </span>

      {/* Hand-drawn down arrow/pencil */}
      <svg
        className="animate-bounce-arrow h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 4v16m0 0l-6-6m6 6l6-6"
          stroke="var(--ink-light)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <style jsx>{`
        @keyframes bounce-arrow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }
        .animate-bounce-arrow {
          animation: bounce-arrow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
