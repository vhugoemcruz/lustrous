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

/**
 * DiscordIcon - Social icon for community links.
 */
export const DiscordIcon: FC<IconProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1432-.1084.2868-.2185.4209-.336a.0734.0734 0 01.063-.0166c3.9783 1.8093 8.3568 1.8093 12.285 0a.077.077 0 01.0641.0163c.134.1175.2776.2276.4208.336a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.8732.8914.0766.0766 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);
