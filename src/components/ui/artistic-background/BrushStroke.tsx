/**
 * @module artistic-background/BrushStroke
 * @description A single decorative SVG brush stroke that floats lazily
 * across the background using the `gentle-float` CSS animation.
 */

import type { FC } from "react";
import type { BrushStrokeProps } from "./types";

/**
 * Renders a semi-transparent SVG brush-stroke path positioned absolutely
 * within its parent container.
 *
 * The element uses the `gentle-float` keyframe defined in `globals.css`
 * and a CSS custom property `--stroke-rot` for per-instance rotation.
 */
export const BrushStroke: FC<BrushStrokeProps> = ({
  path,
  color,
  x,
  y,
  rotation,
  scale,
  delay,
  duration,
}) => (
  <svg
    className="pointer-events-none absolute"
    style={
      {
        left: `${x}%`,
        top: `${y}%`,
        width: `${180 * scale}px`,
        height: `${60 * scale}px`,
        "--stroke-rot": `${rotation}deg`,
        animation: `gentle-float ${duration}s ease-in-out ${delay}s infinite`,
      } as React.CSSProperties
    }
    viewBox="0 0 200 60"
    fill="none"
    aria-hidden="true"
  >
    <path d={path} fill={color} />
  </svg>
);
