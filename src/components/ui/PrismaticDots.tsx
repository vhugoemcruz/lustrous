/**
 * @module PrismaticDots
 * @description Five colored dots that pulse in sequence, using the Mineral Spectrum colors.
 * Colors are shuffled randomly on each page load (client-side only to avoid hydration mismatch).
 */

"use client";

import { FC, useState, useEffect } from "react";

const COLORS = [
  { name: "amethyst", color: "var(--amethyst-purple)" },
  { name: "aqua", color: "var(--aqua-cyan)" },
  { name: "magenta", color: "var(--magenta-fusion)" },
  { name: "gold", color: "var(--pyrite-gold)" },
  { name: "emerald", color: "var(--emerald-green)" },
];

/**
 * Fisher-Yates shuffle algorithm.
 * Creates a new shuffled array without mutating the original.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * PrismaticDots component.
 * Displays 5 dots that pulse in sequence with the Mineral Spectrum colors.
 * Colors are randomized on each page load without repetition.
 */
export const PrismaticDots: FC = () => {
  // Start with original order for SSR, shuffle on client after hydration
  const [colors, setColors] = useState(COLORS);

  useEffect(() => {
    setColors(shuffleArray(COLORS));
  }, []);

  return (
    <div className="my-10 flex items-center justify-center gap-20">
      {colors.map((c, index) => (
        <span
          key={c.name}
          className="prismatic-dot"
          style={{
            backgroundColor: c.color,
            boxShadow: `0 0 12px ${c.color}`,
            animationDelay: `${index * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
};
