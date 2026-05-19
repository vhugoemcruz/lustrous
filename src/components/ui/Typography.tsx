/**
 * @module Typography
 * @description Typographic components for the Artist's Studio theme.
 * Uses handwritten headline font and warm ink colors.
 */

import { ElementType, HTMLAttributes, FC } from "react";

/**
 * Section Label — small uppercase accent text.
 * Styled with watercolor accent color and handwritten font.
 */
export const SectionLabel: FC<HTMLAttributes<HTMLSpanElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <span
    className={`text-wc-coral mb-4 inline-block font-[family-name:var(--font-headline)] text-sm font-semibold tracking-widest uppercase ${className}`}
    {...props}
  >
    {children}
  </span>
);

/**
 * Section Title — large heading with ink-black color.
 * Uses handwritten headline font for artistic feel.
 */
interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
}

export const SectionTitle: FC<SectionTitleProps> = ({
  className = "",
  children,
  as: Component = "h2",
  ...props
}) => (
  <Component
    className={`text-ink-black mb-4 font-[family-name:var(--font-headline)] text-5xl leading-[1.1] font-bold md:text-6xl ${className}`}
    {...props}
  >
    {children}
  </Component>
);

/**
 * Section Subtitle — descriptive paragraph with charcoal ink.
 * Uses body font for readability, warm secondary color.
 */
export const SectionSubtitle: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <p
    className={`text-ink-charcoal max-w-[1000px] text-lg leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </p>
);
