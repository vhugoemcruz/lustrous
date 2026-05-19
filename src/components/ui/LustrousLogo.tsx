/**
 * @module LustrousLogo
 * @description SVG logo component featuring a hand-drawn paintbrush with watercolor gradient.
 * Replaces the crystal/mineral logo with an artistic brush icon.
 */

import type { FC } from "react";

interface LustrousLogoProps {
  /**
   * Size of the logo (width and height)
   * @default 32
   */
  size?: number;
  /**
   * Whether to show the text alongside the icon
   * @default true
   */
  showText?: boolean;
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * LustrousLogo component.
 * Paintbrush icon with optional handwritten-style text.
 */
export const LustrousLogo: FC<LustrousLogoProps> = ({
  size = 32,
  showText = true,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Paintbrush Icon SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="brush-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#5B8FB9" />
            <stop offset="50%" stopColor="#8B6BB5" />
            <stop offset="100%" stopColor="#E07A5F" />
          </linearGradient>
        </defs>

        {/* Brush bristles — colorful tip */}
        <path
          d="M6,4 Q8,2 12,3 Q16,5 18,9 Q19,12 17,14 Q14,16 10,15 Q6,14 4,10 Q3,7 6,4Z"
          fill="url(#brush-gradient)"
          opacity="0.9"
        />

        {/* Ferrule (metal band) */}
        <rect
          x="14"
          y="13"
          width="6"
          height="3"
          rx="1"
          fill="#8A8478"
          opacity="0.7"
          transform="rotate(40, 17, 14.5)"
        />

        {/* Brush handle */}
        <path
          d="M18,16 L28,27 Q29,28 28,29 Q27,30 26,29 L16,18"
          stroke="#4A4A4A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Small paint drip from brush tip */}
        <circle cx="7" cy="6" r="1.5" fill="#E07A5F" opacity="0.6" />
      </svg>

      {/* Logo Text — handwritten style */}
      {showText && (
        <span className="gradient-text font-[family-name:var(--font-headline)] text-2xl font-bold tracking-tight">
          Lustrous
        </span>
      )}
    </div>
  );
};
