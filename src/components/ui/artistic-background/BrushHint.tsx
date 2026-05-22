/**
 * @module artistic-background/BrushHint
 * @description Static "Paint the background!" callout with a cursive label
 * and a hand-drawn curved arrow pointing toward the pencil button.
 *
 * Displayed until the user activates drawing for the first time.
 * Uses the `hint-bob` keyframe from `globals.css`.
 */

import type { FC } from "react";

/**
 * A decorative, pointer-events-disabled hint that invites the user to
 * try the drawing feature. Positioned at the bottom-right corner
 * just above the pencil toggle button.
 */
export const BrushHint: FC<{ bottom: string }> = ({ bottom }) => (
  <div
    style={{
      position: "fixed",
      bottom,
      right: "78px",
      pointerEvents: "none",
      zIndex: 49,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "2px",
    }}
    aria-hidden="true"
  >
    <span
      style={{
        fontFamily:
          "'Segoe Script', 'Brush Script MT', 'Comic Sans MS', cursive",
        fontSize: "20px",
        color: "#E07A5F",
        whiteSpace: "nowrap",
        lineHeight: 1.1,
        textShadow: "0 1px 8px rgba(255,255,255,0.55)",
        opacity: 0.92,
        marginRight: "4px",
        animation: "hint-bob 2.5s ease-in-out infinite",
      }}
    >
      Paint the background!
    </span>

    <svg
      width="50"
      height="45"
      viewBox="0 0 60 52"
      fill="none"
      style={{
        alignSelf: "flex-end",
        animation: "hint-bob 2.5s ease-in-out 0.3s infinite",
      }}
    >
      <path
        d="M6,4 C12,22 34,30 52,46"
        stroke="#E07A5F"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.82"
      />
      <path
        d="M52,46 L40,41 M52,46 L48,34"
        stroke="#E07A5F"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.82"
      />
    </svg>
  </div>
);
