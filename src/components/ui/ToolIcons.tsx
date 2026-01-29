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
    <g transform="translate(0, 2)">
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
    </g>
  </svg>
);
