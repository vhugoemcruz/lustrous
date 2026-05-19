/**
 * @module FeatureCard
 * @description Sketchbook-style card component for displaying tools and features.
 * Cards look like paper notes with hand-drawn aesthetic borders,
 * warm shadows, and watercolor accent hover effects.
 */

import { FC, ReactNode } from "react";
import Link from "next/link";

export type FeatureCardVariant = "blue" | "coral" | "violet" | "sage" | "amber";

interface FeatureCardProps {
  /** Optional icon or content to display at the top */
  icon?: ReactNode;
  /** Optional title string or element */
  title?: ReactNode;
  /** Main content/description */
  children?: ReactNode;
  /** Optional custom classes */
  className?: string;
  /** Accent color variant for hover effects */
  variant?: FeatureCardVariant;
  /** Optional link destination. If provided, card becomes a clickable Link. */
  href?: string;
  /** Optional description text (alternative to children) */
  description?: string;
  /** External link target */
  target?: string;
}

/**
 * FeatureCard component — Sketchbook style.
 * Paper-like card with watercolor accent hover effects.
 */
export const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  title,
  children,
  description,
  className = "",
  variant = "blue",
  href,
  target,
}) => {
  const variantStyles: Record<
    FeatureCardVariant,
    {
      hoverBorder: string;
      hoverShadow: string;
      iconColor: string;
      accentBg: string;
      titleHover: string;
    }
  > = {
    blue: {
      hoverBorder: "hover:border-[var(--watercolor-blue)]/40",
      hoverShadow: "hover:shadow-[3px_5px_20px_rgba(91,143,185,0.15)]",
      iconColor: "text-wc-blue",
      accentBg: "bg-[var(--watercolor-blue)]/8",
      titleHover: "group-hover:text-[var(--watercolor-blue)]",
    },
    coral: {
      hoverBorder: "hover:border-[var(--watercolor-coral)]/40",
      hoverShadow: "hover:shadow-[3px_5px_20px_rgba(224,122,95,0.15)]",
      iconColor: "text-wc-coral",
      accentBg: "bg-[var(--watercolor-coral)]/8",
      titleHover: "group-hover:text-[var(--watercolor-coral)]",
    },
    violet: {
      hoverBorder: "hover:border-[var(--watercolor-violet)]/40",
      hoverShadow: "hover:shadow-[3px_5px_20px_rgba(139,107,181,0.15)]",
      iconColor: "text-wc-violet",
      accentBg: "bg-[var(--watercolor-violet)]/8",
      titleHover: "group-hover:text-[var(--watercolor-violet)]",
    },
    sage: {
      hoverBorder: "hover:border-[var(--watercolor-sage)]/40",
      hoverShadow: "hover:shadow-[3px_5px_20px_rgba(129,178,154,0.15)]",
      iconColor: "text-wc-sage",
      accentBg: "bg-[var(--watercolor-sage)]/8",
      titleHover: "group-hover:text-[var(--watercolor-sage)]",
    },
    amber: {
      hoverBorder: "hover:border-[var(--watercolor-amber)]/40",
      hoverShadow: "hover:shadow-[3px_5px_20px_rgba(242,204,143,0.15)]",
      iconColor: "text-wc-amber",
      accentBg: "bg-[var(--watercolor-amber)]/8",
      titleHover: "group-hover:text-[var(--watercolor-amber)]",
    },
  };

  const styles = variantStyles[variant];

  const content = (
    <>
      <div className="relative z-10 flex h-full flex-col items-center text-center">
        {icon && (
          <div
            className={`${styles.accentBg} mb-4 flex items-center justify-center rounded-2xl transition-transform duration-300 ${
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
            className={`text-ink-black mb-2 text-lg font-semibold transition-colors duration-300 ${styles.titleHover}`}
          >
            {title}
          </h3>
        )}
        <div className="text-ink-charcoal/80 w-full text-sm leading-relaxed">
          {description || children}
        </div>
      </div>
    </>
  );

  const containerClasses = `feature-card group relative overflow-hidden rounded-2xl border-2 border-[var(--sketchbook-grey)] bg-[var(--paper-warm)] p-8 transition-all duration-400 hover:translate-y-[-4px] hover:rotate-[-0.5deg] ${styles.hoverBorder} ${styles.hoverShadow} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        className={`${containerClasses} block h-full`}
        style={{ boxShadow: "var(--card-shadow)" }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={containerClasses}
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      {content}
    </div>
  );
};
