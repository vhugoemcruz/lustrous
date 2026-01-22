
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
            className={`
        group relative block p-6 rounded-2xl
        bg-slate-grey border border-anthracite
        transition-all duration-300 ease-out
        hover:translate-y-[-4px]
        ${variantStyles[variant]}
        ${className}
      `}
            style={
                {
                    "--border-gradient": variantBorderGradients[variant],
                } as React.CSSProperties
            }
        >
            {/* Gradient border overlay */}
            <div
                className="
          absolute inset-0 rounded-2xl opacity-0 
          group-hover:opacity-100 transition-opacity duration-300
          pointer-events-none
        "
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
                <div
                    className="
          w-12 h-12 mb-4 flex items-center justify-center
          rounded-xl bg-anthracite/50
          text-2xl group-hover:scale-110 transition-transform duration-300
        "
                >
                    {icon}
                </div>

                {/* Title */}
                <h3
                    className="
          text-lg font-semibold text-pure-quartz mb-2
          group-hover:text-aqua transition-colors duration-300
        "
                >
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-diamond-dust leading-relaxed">
                    {description}
                </p>

                {/* Arrow indicator */}
                <div
                    className="
          absolute bottom-6 right-6
          opacity-0 group-hover:opacity-100
          translate-x-[-8px] group-hover:translate-x-0
          transition-all duration-300
        "
                >
                    <span className="text-aqua text-xl">→</span>
                </div>
            </div>
        </Link>
    );
};
