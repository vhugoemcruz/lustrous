/**
 * @module FeatureCard
 * @description A generic card component with glass/gradient effect, used for all card sections (Tools, Community, Support).
 * Supports navigation (href) and the 5 mineral spectrum colors.
 */

import { FC, ReactNode } from "react";
import Link from "next/link";

export type FeatureCardVariant =
  | "amethyst"
  | "aqua"
  | "magenta"
  | "gold"
  | "emerald";

interface FeatureCardProps {
  /**
   * Optional icon or content to display at the top
   */
  icon?: ReactNode;
  /**
   * Optional title string or element
   */
  title?: ReactNode;
  /**
   * Main content/description
   */
  children?: ReactNode;
  /**
   * Optional custom classes
   */
  className?: string;
  /**
   * Optional accent color for hover effects (default: aqua)
   * Corresponds to the 5 particle colors.
   */
  variant?: FeatureCardVariant;
  /**
   * Optional link destination. If provided, card becomes a clickable Link.
   */
  href?: string;
  /**
   * Optional description text (alternative to children)
   */
  description?: string;
  /**
   * External link target
   */
  target?: string;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  title,
  children,
  description,
  className = "",
  variant = "aqua",
  href,
  target,
}) => {
  const variantStyles: Record<
    FeatureCardVariant,
    {
      hoverBorder: string;
      hoverShadow: string;
      iconBg: string;
      titleHover: string;
    }
  > = {
    aqua: {
      hoverBorder: "hover:border-[var(--aqua-cyan)]/30",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]",
      iconBg: "bg-[var(--aqua-cyan)]/10",
      titleHover: "group-hover:text-[var(--aqua-cyan)]",
    },
    amethyst: {
      hoverBorder: "hover:border-[var(--amethyst-purple)]/30",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(138,43,226,0.15)]",
      iconBg: "bg-[var(--amethyst-purple)]/10",
      titleHover: "group-hover:text-[var(--amethyst-purple)]",
    },
    magenta: {
      hoverBorder: "hover:border-[var(--magenta-fusion)]/30",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(255,0,255,0.15)]",
      iconBg: "bg-[var(--magenta-fusion)]/10",
      titleHover: "group-hover:text-[var(--magenta-fusion)]",
    },
    gold: {
      hoverBorder: "hover:border-[var(--pyrite-gold)]/30",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(255,215,0,0.15)]",
      iconBg: "bg-[var(--pyrite-gold)]/10",
      titleHover: "group-hover:text-[var(--pyrite-gold)]",
    },
    emerald: {
      hoverBorder: "hover:border-[var(--emerald-green)]/30",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(52,211,153,0.15)]",
      iconBg: "bg-[var(--emerald-green)]/10",
      titleHover: "group-hover:text-[var(--emerald-green)]",
    },
  };

  const styles = variantStyles[variant];

  const content = (
    <>
      {/* Shine effect */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <div className="relative z-10 flex h-full flex-col items-center text-center">
        {icon && (
          <div
            className={`${styles.iconBg} mb-4 flex items-center justify-center rounded-xl transition-transform duration-300 ${
              typeof icon === "string"
                ? "h-auto w-auto bg-transparent text-4xl"
                : "h-14 w-14"
            }`}
          >
            {icon}
          </div>
        )}
        {title && (
          <h3
            className={`text-pure-quartz mb-2 text-lg font-semibold transition-colors duration-300 ${styles.titleHover}`}
          >
            {title}
          </h3>
        )}
        <div className="text-diamond-dust/80 w-full text-sm leading-relaxed">
          {description || children}
        </div>
      </div>
    </>
  );

  const containerClasses = `feature-card group from-slate-grey to-slate-grey/80 relative overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-b p-8 transition-all duration-500 hover:translate-y-[-6px] ${styles.hoverBorder} ${styles.hoverShadow} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        className={`${containerClasses} block h-full`}
      >
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
};
