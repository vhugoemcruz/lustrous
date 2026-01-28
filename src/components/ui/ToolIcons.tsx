/**
 * @module ToolIcons
 * @description Custom SVG icons for Lustrous tools, following the Mineral Spectrum design system.
 */

import type { FC, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * Icon size in pixels
   * @default 24
   */
  size?: number;
}

/**
 * PerspectiveGridIcon - Represents the Perspective Grid tool.
 * Features converging lines suggesting perspective and depth.
 */
export const PerspectiveGridIcon: FC<IconProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient
        id="perspectiveGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="var(--aqua-cyan, #00ffff)" />
        <stop offset="100%" stopColor="var(--amethyst-purple, #8a2be2)" />
      </linearGradient>
    </defs>
    {/* Horizon line */}
    <line
      x1="2"
      y1="12"
      x2="22"
      y2="12"
      stroke="url(#perspectiveGradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Converging lines from vanishing point */}
    <line
      x1="12"
      y1="12"
      x2="2"
      y2="22"
      stroke="url(#perspectiveGradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="12"
      x2="22"
      y2="22"
      stroke="url(#perspectiveGradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="12"
      x2="6"
      y2="22"
      stroke="url(#perspectiveGradient)"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
    <line
      x1="12"
      y1="12"
      x2="18"
      y2="22"
      stroke="url(#perspectiveGradient)"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.6"
    />
    {/* Vanishing point */}
    <circle cx="12" cy="12" r="2" fill="url(#perspectiveGradient)" />
  </svg>
);

/**
 * Cube3DIcon - Represents the 3D Viewer tool.
 * An isometric cube suggesting three-dimensionality.
 */
export const Cube3DIcon: FC<IconProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="cubeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--amethyst-purple, #8a2be2)" />
        <stop offset="100%" stopColor="var(--magenta-fusion, #ff00ff)" />
      </linearGradient>
      <linearGradient id="cubeGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop
          offset="0%"
          stopColor="var(--amethyst-purple, #8a2be2)"
          stopOpacity="0.6"
        />
        <stop
          offset="100%"
          stopColor="var(--aqua-cyan, #00ffff)"
          stopOpacity="0.3"
        />
      </linearGradient>
    </defs>
    {/* Top face */}
    <path
      d="M12 2L20 7V11L12 6L4 11V7L12 2Z"
      fill="url(#cubeGradient2)"
      stroke="url(#cubeGradient1)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Left face */}
    <path
      d="M4 11L12 16V22L4 17V11Z"
      fill="url(#cubeGradient2)"
      stroke="url(#cubeGradient1)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Right face */}
    <path
      d="M20 11L12 16V22L20 17V11Z"
      fill="url(#cubeGradient2)"
      stroke="url(#cubeGradient1)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Center vertical line */}
    <line
      x1="12"
      y1="6"
      x2="12"
      y2="22"
      stroke="url(#cubeGradient1)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * ColorPaletteIcon - Represents the Color Analysis tool.
 * Color swatches arranged in a palette formation.
 */
export const ColorPaletteIcon: FC<IconProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="paletteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--magenta-fusion, #ff00ff)" />
        <stop offset="50%" stopColor="var(--amethyst-purple, #8a2be2)" />
        <stop offset="100%" stopColor="var(--aqua-cyan, #00ffff)" />
      </linearGradient>
    </defs>
    {/* Outer palette shape */}
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C12.83 22 13.5 21.33 13.5 20.5C13.5 20.12 13.36 19.78 13.13 19.52C12.91 19.27 12.79 18.95 12.79 18.58C12.79 17.75 13.46 17.08 14.29 17.08H16C19.31 17.08 22 14.39 22 11.08C22 6.06 17.52 2 12 2Z"
      stroke="url(#paletteGradient)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Color dots */}
    <circle cx="6.5" cy="11.5" r="1.5" fill="var(--magenta-fusion, #ff00ff)" />
    <circle cx="9.5" cy="7.5" r="1.5" fill="var(--amethyst-purple, #8a2be2)" />
    <circle cx="14.5" cy="7.5" r="1.5" fill="var(--aqua-cyan, #00ffff)" />
    <circle cx="17.5" cy="11.5" r="1.5" fill="var(--pyrite-gold, #ffd700)" />
  </svg>
);

/**
 * ArrowRightIcon - Simple arrow icon for CTAs and links.
 */
export const ArrowRightIcon: FC<IconProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ShieldIcon - Privacy/security icon for feature highlights.
 */
export const ShieldIcon: FC<IconProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--emerald-green, #34d399)" />
        <stop offset="100%" stopColor="var(--aqua-cyan, #00ffff)" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L4 6V12C4 16.42 7.33 20.64 12 22C16.67 20.64 20 16.42 20 12V6L12 2Z"
      stroke="url(#shieldGradient)"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="url(#shieldGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * BrowserIcon - Browser/local icon for feature highlights.
 */
export const BrowserIcon: FC<IconProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="browserGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--aqua-cyan, #00ffff)" />
        <stop offset="100%" stopColor="var(--amethyst-purple, #8a2be2)" />
      </linearGradient>
    </defs>
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
      stroke="url(#browserGradient)"
      strokeWidth="1.5"
      fill="none"
    />
    <line
      x1="3"
      y1="9"
      x2="21"
      y2="9"
      stroke="url(#browserGradient)"
      strokeWidth="1.5"
    />
    <circle cx="6" cy="6.5" r="1" fill="var(--magenta-fusion, #ff00ff)" />
    <circle cx="9" cy="6.5" r="1" fill="var(--pyrite-gold, #ffd700)" />
    <circle cx="12" cy="6.5" r="1" fill="var(--emerald-green, #34d399)" />
  </svg>
);

/**
 * SparklesIcon - Sparkles/magic icon for feature highlights.
 */
export const SparklesIcon: FC<IconProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="sparklesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--pyrite-gold, #ffd700)" />
        <stop offset="100%" stopColor="var(--magenta-fusion, #ff00ff)" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      stroke="url(#sparklesGradient)"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M19 15L19.75 17.25L22 18L19.75 18.75L19 21L18.25 18.75L16 18L18.25 17.25L19 15Z"
      fill="url(#sparklesGradient)"
    />
    <path
      d="M5 3L5.5 4.5L7 5L5.5 5.5L5 7L4.5 5.5L3 5L4.5 4.5L5 3Z"
      fill="url(#sparklesGradient)"
    />
  </svg>
);
