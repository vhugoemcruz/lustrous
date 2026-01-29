import { ElementType, HTMLAttributes, FC } from "react";

// Section Label
export const SectionLabel: FC<HTMLAttributes<HTMLSpanElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <span
    className={`text-aqua mb-4 inline-block text-xs font-semibold tracking-widest uppercase ${className}`}
    {...props}
  >
    {children}
  </span>
);

// Section Title
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
    className={`text-pure-quartz mb-4 font-[family-name:var(--font-headline)] text-4xl leading-[1.1] font-bold md:text-5xl ${className}`}
    {...props}
  >
    {children}
  </Component>
);

// Section Subtitle
export const SectionSubtitle: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <p
    className={`text-diamond-dust max-w-[1000px] text-lg leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </p>
);
