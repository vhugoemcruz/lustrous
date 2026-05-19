/**
 * @module PaintSplatters
 * @description Five watercolor paint splatters that pulse in sequence.
 * Replaces PrismaticDots with organic, hand-drawn ink blobs
 * using SVG blob shapes in the studio watercolor palette.
 */

"use client";

import { FC, useState, useEffect } from "react";

/** Watercolor splatter colors */
const SPLATTER_COLORS = [
  { name: "blue", color: "var(--watercolor-blue)" },
  { name: "coral", color: "var(--watercolor-coral)" },
  { name: "violet", color: "var(--watercolor-violet)" },
  { name: "sage", color: "var(--watercolor-sage)" },
  { name: "amber", color: "var(--watercolor-amber)" },
];

/** Unique organic blob SVG paths for each splatter */
const BLOB_PATHS = [
  "M12,2 Q18,0 22,4 Q26,8 24,14 Q22,20 16,22 Q10,24 6,20 Q2,16 2,10 Q2,4 6,2 Q9,0 12,2Z",
  "M14,3 Q20,1 24,6 Q28,11 25,17 Q22,23 15,24 Q8,25 4,20 Q0,15 1,9 Q2,3 8,1 Q11,0 14,3Z",
  "M13,2 Q19,0 23,5 Q27,10 24,16 Q21,22 14,23 Q7,24 3,19 Q0,14 1,8 Q3,2 9,1 Q11,0 13,2Z",
  "M15,3 Q21,1 25,7 Q29,13 25,19 Q21,25 14,25 Q7,25 3,20 Q0,14 2,8 Q5,2 11,1 Q13,0 15,3Z",
  "M12,1 Q18,0 22,5 Q26,10 23,16 Q20,22 13,23 Q6,24 2,19 Q0,13 2,7 Q5,1 10,0 Q11,0 12,1Z",
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
 * PaintSplatters component.
 * Displays 5 organic ink splatters that pulse in sequence with watercolor tones.
 * Colors are randomized on each page load without repetition.
 */
export const PaintSplatters: FC = () => {
  const [colors, setColors] = useState(SPLATTER_COLORS);

  useEffect(() => {
    setColors(shuffleArray(SPLATTER_COLORS));
  }, []);

  return (
    <div className="my-10 flex items-center justify-center gap-16">
      {colors.map((c, index) => (
        <svg
          key={c.name}
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="drop-shadow-sm"
          style={{
            animation:
              "splatter-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            animationDelay: `${index * 0.4}s`,
            opacity: 0.5,
          }}
          aria-hidden="true"
        >
          <path d={BLOB_PATHS[index]} fill={c.color} opacity="0.8" />
        </svg>
      ))}
    </div>
  );
};
