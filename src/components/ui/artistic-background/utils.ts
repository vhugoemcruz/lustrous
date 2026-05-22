/**
 * @module artistic-background/utils
 * @description Pure utility functions for colour conversion and
 * canvas-based watercolour rendering. Free of React dependencies.
 */

import type { CanvasPoint } from "./types";

// ─── Colour Utilities ─────────────────────────────────────────────────────────

/**
 * Converts a hex colour string to a comma-separated RGB string.
 *
 * Supports both shorthand (`#ABC`) and full (`#AABBCC`) formats.
 *
 * @param hex - The hex colour, e.g. `"#5B8FB9"` or `"#FFF"`.
 * @returns A string like `"91, 143, 185"`.
 */
export function hexToRgbString(hex: string): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

// ─── Canvas Watercolour Rendering ─────────────────────────────────────────────

/**
 * Draws a single watercolour "splat" — a cluster of semi-transparent circles
 * that simulate the bleeding, fuzzy edge of a wet brush mark.
 *
 * @param ctx    - The 2D canvas rendering context.
 * @param x      - Centre X coordinate in canvas pixels.
 * @param y      - Centre Y coordinate in canvas pixels.
 * @param radius - Nominal radius of the splat.
 * @param rgb    - Comma-separated RGB string, e.g. `"91, 143, 185"`.
 */
export function drawWatercolorSplat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rgb: string,
): void {
  for (let i = 0; i < 9; i++) {
    const jx = (Math.random() - 0.5) * radius * 0.95;
    const jy = (Math.random() - 0.5) * radius * 0.95;
    const r = radius * (0.35 + Math.random() * 0.85);
    const alpha = 0.018 + Math.random() * 0.032;

    ctx.beginPath();
    ctx.arc(x + jx, y + jy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
    ctx.fill();
  }
}

/**
 * Draws an interpolated watercolour stroke between two points by placing
 * overlapping splats along the line.
 *
 * @param ctx    - The 2D canvas rendering context.
 * @param from   - Start point of the stroke.
 * @param to     - End point of the stroke.
 * @param radius - Brush radius in pixels.
 * @param rgb    - Comma-separated RGB string.
 */
export function drawWatercolorStroke(
  ctx: CanvasRenderingContext2D,
  from: CanvasPoint,
  to: CanvasPoint,
  radius: number,
  rgb: string,
): void {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(1, Math.floor(dist / (radius * 0.28)));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    drawWatercolorSplat(ctx, from.x + dx * t, from.y + dy * t, radius, rgb);
  }
}
