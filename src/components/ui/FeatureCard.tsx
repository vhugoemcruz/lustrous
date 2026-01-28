/**
 * @module FeatureCard
 * @description Card component for tool showcase with centered icon, fixed height, and gradient background.
 */

import type { FC, ReactNode } from "react";
import Link from "next/link";

type GradientVariant = "cyan" | "purple" | "magenta" | "prismatic";

interface FeatureCardProps {
  /**
   * Navigation link for the card
   */
  href: string;
  /**
   * Card title
   */
  title: string;
  /**
   * Card description
   */
  description: string;
  /**
   * Icon element to display (centered)
   */
  icon: ReactNode;
  /**
   * Gradient color variant for the border and effects
   * @default "prismatic"
   */
  variant?: GradientVariant;
  /**
   * Additional CSS class names
   */
  className?: string;
}

const variantConfig: Record<
  GradientVariant,
  { hover: string; gradient: string; border: string }
> = {
  cyan: {
    hover: "hover:shadow-[0_0_40px_rgba(0,255,255,0.25)]",
    gradient: "from-[#00ffff]/5 via-transparent to-transparent",
    border: "hover:border-[#00ffff]/40",
  },
  purple: {
    hover: "hover:shadow-[0_0_40px_rgba(138,43,226,0.25)]",
    gradient: "from-[#8a2be2]/5 via-transparent to-transparent",
    border: "hover:border-[#8a2be2]/40",
  },
  magenta: {
    hover: "hover:shadow-[0_0_40px_rgba(255,0,255,0.25)]",
    gradient: "from-[#ff00ff]/5 via-transparent to-transparent",
    border: "hover:border-[#ff00ff]/40",
  },
  prismatic: {
    hover:
      "hover:shadow-[0_0_40px_rgba(0,255,255,0.2),0_0_80px_rgba(138,43,226,0.15)]",
    gradient: "from-aqua/5 via-transparent to-transparent",
    border: "hover:border-aqua/40",
  },
};

/**
 * FeatureCard component.
 * Fixed height card with centered icon, gradient background, and smooth hover effects.
 */
export const FeatureCard: FC<FeatureCardProps> = ({
  href,
  title,
  description,
  icon,
  variant = "prismatic",
  className = "",
}) => {
  const config = variantConfig[variant];

  return (
    <Link
      href={href}
      className={`feature-card group from-slate-grey to-slate-grey/80 relative block h-full overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-b p-8 text-center transition-all duration-500 ease-out hover:translate-y-[-6px] ${config.hover} ${config.border} ${className}`}
    >
      {/* Gradient overlay */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Shine effect on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Centered Icon */}
        <div className="bg-aqua/10 mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-4xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-pure-quartz group-hover:text-aqua mb-2 text-lg font-semibold transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-diamond-dust/80 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
};
