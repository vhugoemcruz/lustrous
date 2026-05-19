/**
 * @module ArtisticBackground
 * @description Ambient background with floating watercolor brush strokes and subtle ink splatters.
 * Replaces the molecular particle network with organic, artistic elements.
 * Uses pure SVG + CSS animations for performance (no heavy canvas).
 */

"use client";

import { FC, useMemo } from "react";

/** Watercolor palette for floating brush strokes */
const BRUSH_COLORS = [
  "rgba(91, 143, 185, 0.07)", // blue
  "rgba(224, 122, 95, 0.06)", // coral
  "rgba(139, 107, 181, 0.06)", // violet
  "rgba(129, 178, 154, 0.05)", // sage
  "rgba(242, 204, 143, 0.06)", // amber
];

/** SVG path data for organic brush stroke shapes */
const BRUSH_PATHS = [
  "M10,25 Q30,5 60,20 T110,15 Q140,10 160,25 Q180,40 150,45 Q120,50 90,40 T30,45 Q5,42 10,25Z",
  "M5,20 Q25,2 55,18 T100,12 Q130,8 155,22 Q175,38 145,42 Q115,48 85,38 T25,42 Q0,38 5,20Z",
  "M8,30 Q35,8 65,22 Q95,36 125,18 Q155,4 180,20 Q195,35 165,42 Q135,50 100,38 Q65,48 35,42 Q5,48 8,30Z",
  "M15,22 Q40,5 70,18 T120,10 Q150,5 170,22 Q185,38 155,44 Q125,50 95,36 T40,44 Q10,40 15,22Z",
];

interface BrushStrokeProps {
  path: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
  duration: number;
}

/**
 * Individual floating brush stroke element.
 * Uses CSS keyframe animation for gentle drifting motion.
 */
const BrushStroke: FC<BrushStrokeProps> = ({
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
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${180 * scale}px`,
      height: `${60 * scale}px`,
      transform: `rotate(${rotation}deg)`,
      animation: `gentle-float ${duration}s ease-in-out ${delay}s infinite`,
    }}
    viewBox="0 0 200 60"
    fill="none"
    aria-hidden="true"
  >
    <path d={path} fill={color} />
  </svg>
);

/**
 * ArtisticBackground component.
 * Renders floating watercolor brush strokes and subtle ambient effects.
 * Much lighter than canvas-based particles — uses CSS animations on SVG elements.
 */
export function ArtisticBackground() {
  const strokes = useMemo(() => {
    const items: BrushStrokeProps[] = [];
    for (let i = 0; i < 8; i++) {
      items.push({
        path: BRUSH_PATHS[i % BRUSH_PATHS.length],
        color: BRUSH_COLORS[i % BRUSH_COLORS.length],
        x: (i * 14 + 5) % 90,
        y: (i * 13 + 3) % 85,
        rotation: (i * 47) % 360,
        scale: 0.8 + (i % 3) * 0.4,
        delay: i * 0.8,
        duration: 12 + (i % 4) * 3,
      });
    }
    return items;
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm ambient gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 15% 85%, rgba(242, 204, 143, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 15%, rgba(139, 107, 181, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(212, 207, 197, 0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Floating brush strokes */}
      {strokes.map((stroke, i) => (
        <BrushStroke key={i} {...stroke} />
      ))}
    </div>
  );
}
