/**
 * @module ToolIcons
 * @description Hand-drawn style SVG icons for the Artist's Studio theme.
 * Each icon uses watercolor palette colors and organic stroke styles.
 * Replaces emoji icons per UI/UX skill guidelines (no-emoji-icons rule).
 */

import { FC } from "react";

interface IconProps {
  /** Icon size in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Shield/privacy icon — hand-drawn style with sage green watercolor.
 */
export const ShieldIcon: FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 2L3.5 6.5V11.5C3.5 16.5 7 20.5 12 22C17 20.5 20.5 16.5 20.5 11.5V6.5L12 2Z"
      stroke="var(--watercolor-sage)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="var(--watercolor-sage)"
      fillOpacity="0.1"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="var(--watercolor-sage)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Browser/easy-access icon — hand-drawn style with blue watercolor.
 */
export const BrowserIcon: FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="3"
      stroke="var(--watercolor-blue)"
      strokeWidth="1.8"
      fill="var(--watercolor-blue)"
      fillOpacity="0.08"
    />
    <line
      x1="3"
      y1="9"
      x2="21"
      y2="9"
      stroke="var(--watercolor-blue)"
      strokeWidth="1.5"
      opacity="0.6"
    />
    <circle cx="6.5" cy="6.5" r="1" fill="var(--watercolor-coral)" opacity="0.6" />
    <circle cx="9.5" cy="6.5" r="1" fill="var(--watercolor-amber)" opacity="0.6" />
    <circle cx="12.5" cy="6.5" r="1" fill="var(--watercolor-sage)" opacity="0.6" />
  </svg>
);

/**
 * Sparkles/craft icon — hand-drawn style with violet watercolor.
 */
export const SparklesIcon: FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z"
      stroke="var(--watercolor-violet)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="var(--watercolor-violet)"
      fillOpacity="0.1"
    />
    <path
      d="M19 15L20 17.5L22.5 18.5L20 19.5L19 22L18 19.5L15.5 18.5L18 17.5L19 15Z"
      stroke="var(--watercolor-amber)"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="var(--watercolor-amber)"
      fillOpacity="0.15"
    />
  </svg>
);

/**
 * Perspective grid icon — hand-drawn lines converging to a point.
 */
export const PerspectiveGridIcon: FC<IconProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 6L3 18M12 6L21 18M12 6V18"
      stroke="var(--watercolor-blue)"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="5"
      y1="14"
      x2="19"
      y2="14"
      stroke="var(--watercolor-blue)"
      strokeWidth="1.2"
      opacity="0.5"
    />
    <line
      x1="7"
      y1="18"
      x2="17"
      y2="18"
      stroke="var(--watercolor-blue)"
      strokeWidth="1.2"
      opacity="0.4"
    />
    <circle cx="12" cy="6" r="2" fill="var(--watercolor-blue)" opacity="0.2" />
  </svg>
);

/**
 * 3D cube/viewer icon — isometric cube with watercolor fill.
 */
export const CubeViewerIcon: FC<IconProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
      stroke="var(--watercolor-coral)"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="var(--watercolor-coral)"
      fillOpacity="0.08"
    />
    <path d="M12 12L21 7" stroke="var(--watercolor-coral)" strokeWidth="1.2" opacity="0.5" />
    <path d="M12 12L3 7" stroke="var(--watercolor-coral)" strokeWidth="1.2" opacity="0.5" />
    <path d="M12 12V22" stroke="var(--watercolor-coral)" strokeWidth="1.2" opacity="0.5" />
  </svg>
);

/**
 * Color palette icon — overlapping circles with watercolor fills.
 */
export const ColorPaletteIcon: FC<IconProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <circle
      cx="10"
      cy="9"
      r="5"
      fill="var(--watercolor-coral)"
      fillOpacity="0.3"
      stroke="var(--watercolor-coral)"
      strokeWidth="1.2"
    />
    <circle
      cx="14"
      cy="9"
      r="5"
      fill="var(--watercolor-blue)"
      fillOpacity="0.3"
      stroke="var(--watercolor-blue)"
      strokeWidth="1.2"
    />
    <circle
      cx="12"
      cy="14"
      r="5"
      fill="var(--watercolor-violet)"
      fillOpacity="0.3"
      stroke="var(--watercolor-violet)"
      strokeWidth="1.2"
    />
  </svg>
);

/**
 * Discord brand icon — simple path icon.
 */
export const DiscordIcon: FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
  </svg>
);
