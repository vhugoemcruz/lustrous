/**
 * @module ExploreButton
 * @description Hand-drawn style button for the "Explore Tools" action.
 * Features an SVG hand-drawn border with a draw-in animation and watercolor fill on hover.
 */

"use client";

import { FC } from "react";

/**
 * Scroll smoothly to the tools section, centering it on the viewport
 */
const scrollToTools = () => {
  const toolsSection = document.getElementById("tools");
  if (toolsSection) {
    toolsSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

/**
 * ExploreButton component — hand-drawn style.
 * Uses an SVG path for a slightly irregular border,
 * with a watercolor wash fill effect on hover.
 */
export const ExploreButton: FC = () => {
  return (
    <button
      onClick={scrollToTools}
      className="animate-fade-in-up-delayed-3 group relative mt-12 cursor-pointer border-none bg-transparent px-0 py-0"
      aria-label="Explore the available tools"
    >
      {/* SVG hand-drawn border */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 56"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {/* Watercolor fill on hover */}
        <path
          d="M12,6 Q6,5 5,12 L4,42 Q5,50 14,49 L186,47 Q194,48 193,40 L195,14 Q196,6 188,7 Z"
          className="fill-[var(--watercolor-blue)]/0 transition-all duration-500 group-hover:fill-[var(--watercolor-blue)]/10"
        />
        {/* Hand-drawn border path */}
        <path
          d="M12,6 Q6,5 5,12 L4,42 Q5,50 14,49 L186,47 Q194,48 193,40 L195,14 Q196,6 188,7 Z"
          stroke="var(--ink-charcoal)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-[var(--watercolor-blue)]"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: 0,
          }}
        />
      </svg>

      {/* Button text */}
      <span className="text-ink-charcoal relative z-10 flex items-center gap-2 px-8 py-3 font-[family-name:var(--font-headline)] text-xl font-semibold transition-colors duration-300 group-hover:text-[var(--watercolor-blue)]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        Explore Tools
      </span>
    </button>
  );
};
