/**
 * @module FeatureCard
 * @description Premium card component with gradient border on hover and glow effects.
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
   * Icon element to display
   */
  icon: ReactNode;
  /**
   * Gradient color variant for the border
   * @default "prismatic"
   */
  variant?: GradientVariant;
  /**
   * Additional CSS class names
   */
  className?: string;
}

const variantStyles: Record<GradientVariant, string> = {
  cyan: "hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]",
  purple: "hover:shadow-[0_0_30px_rgba(138,43,226,0.3)]",
  magenta: "hover:shadow-[0_0_30px_rgba(255,0,255,0.3)]",
  prismatic:
    "hover:shadow-[0_0_30px_rgba(0,255,255,0.3),0_0_60px_rgba(138,43,226,0.2)]",
};

const variantBorderGradients: Record<GradientVariant, string> = {
  cyan: "linear-gradient(135deg, #00ffff, #00cccc)",
  purple: "linear-gradient(135deg, #8a2be2, #6a1fb2)",
  magenta: "linear-gradient(135deg, #ff00ff, #cc00cc)",
  prismatic: "linear-gradient(135deg, #8a2be2, #00ffff, #ff00ff)",
};

/**
 * FeatureCard component.
 * Card with gradient border reveal on hover and lift effect.
 */
export const FeatureCard: FC<FeatureCardProps> = ({
  href,
  title,
  description,
  icon,
  variant = "prismatic",
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`group bg-slate-grey border-anthracite relative block rounded-2xl border p-6 transition-all duration-300 ease-out hover:translate-y-[-4px] ${variantStyles[variant]} ${className} `}
      style={
        {
          "--border-gradient": variantBorderGradients[variant],
        } as React.CSSProperties
      }
    >
      {/* Gradient border overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: "1px",
          background: variantBorderGradients[variant],
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="bg-anthracite/50 mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-pure-quartz group-hover:text-aqua mb-2 text-lg font-semibold transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-diamond-dust text-sm leading-relaxed">
          {description}
        </p>

        {/* Arrow indicator */}
        <div className="absolute right-6 bottom-6 translate-x-[-8px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <span className="text-aqua text-xl">→</span>
        </div>
      </div>
    </Link>
  );
};
