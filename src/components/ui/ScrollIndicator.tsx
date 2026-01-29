/**
 * @module ScrollIndicator
 * @description Simple scroll indicator with "Explore" text and animated arrow.
 * Fades out as user scrolls down.
 */

"use client";

import { useEffect, useState, useCallback } from "react";

interface ScrollIndicatorProps {
  /** Callback fired when visibility changes */
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * ScrollIndicator component.
 * Displays "Explore" text with gradient animation and a bouncing arrow.
 * Fades out when user scrolls down.
 * @param props.onVisibilityChange - Optional callback when visibility changes
 */
export function ScrollIndicator({ onVisibilityChange }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Handles scroll events to update visibility.
   */
  const handleScroll = useCallback(() => {
    const mainContainer = document.getElementById("main-scroll-container");
    if (!mainContainer) return;

    const scrollY = mainContainer.scrollTop;
    const newVisible = scrollY < 100;
    setIsVisible(newVisible);
  }, []);

  // Notify parent when visibility changes
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
      {/* Explore text with gradient */}
      <span className="gradient-text-animated mb-2 text-sm font-semibold tracking-widest uppercase">
        Explore
      </span>

      {/* Animated arrow with animated gradient */}
      <svg
        className="animate-bounce-arrow h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="arrowGradientAnimated"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#8a2be2">
              <animate
                attributeName="stop-color"
                values="#8a2be2; #00ffff; #ff00ff; #8a2be2"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#00ffff">
              <animate
                attributeName="stop-color"
                values="#00ffff; #ff00ff; #8a2be2; #00ffff"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#ff00ff">
              <animate
                attributeName="stop-color"
                values="#ff00ff; #8a2be2; #00ffff; #ff00ff"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <path
          d="M12 4v16m0 0l-6-6m6 6l6-6"
          stroke="url(#arrowGradientAnimated)"
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
