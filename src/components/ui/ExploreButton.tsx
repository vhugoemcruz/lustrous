/**
 * @module ExploreButton
 * @description A specialized button component for the "Explore Tools" action.
 * Features a shimmer effect, gradient border, and scroll-to-section functionality.
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

export const ExploreButton: FC = () => {
  return (
    <button
      onClick={scrollToTools}
      className="animate-fade-in-up-delayed-3 group from-amethyst via-aqua to-magenta animate-shimmer relative mt-12 cursor-pointer rounded-full bg-gradient-to-r via-50% bg-[length:300%_100%] p-[2px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
    >
      <span className="bg-deep-obsidian group-hover:bg-deep-obsidian/80 flex rounded-full px-8 py-3 transition-all duration-300">
        <span className="from-amethyst via-aqua to-magenta animate-shimmer bg-gradient-to-r via-50% bg-[length:300%_100%] bg-clip-text text-base font-semibold text-transparent">
          Explore Tools
        </span>
      </span>
    </button>
  );
};
