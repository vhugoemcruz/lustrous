// @ts-check
/**
 * @module LustrousLogo
 * @description SVG logo component featuring a polyhedral crystal with prismatic gradient.
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
 * Polyhedral crystal icon with optional text.
 */
export const LustrousLogo: FC<LustrousLogoProps> = ({
    size = 32,
    showText = true,
    className = "",
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Crystal Icon SVG */}
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
                        id="crystal-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#8a2be2" />
                        <stop offset="50%" stopColor="#00ffff" />
                        <stop offset="100%" stopColor="#ff00ff" />
                    </linearGradient>
                    <linearGradient
                        id="crystal-face-light"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8a2be2" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient
                        id="crystal-face-dark"
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8a2be2" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {/* Main hexagonal prism shape */}
                <g>
                    {/* Top face */}
                    <polygon
                        points="16,2 26,8 26,14 16,10 6,14 6,8"
                        fill="url(#crystal-face-light)"
                        stroke="url(#crystal-gradient)"
                        strokeWidth="0.5"
                    />
                    {/* Left face */}
                    <polygon
                        points="6,8 16,10 16,24 6,18"
                        fill="url(#crystal-face-dark)"
                        stroke="url(#crystal-gradient)"
                        strokeWidth="0.5"
                    />
                    {/* Right face */}
                    <polygon
                        points="26,8 16,10 16,24 26,18"
                        fill="url(#crystal-face-light)"
                        stroke="url(#crystal-gradient)"
                        strokeWidth="0.5"
                    />
                    {/* Bottom point */}
                    <polygon
                        points="16,24 6,18 16,30 26,18"
                        fill="url(#crystal-face-dark)"
                        stroke="url(#crystal-gradient)"
                        strokeWidth="0.5"
                    />
                    {/* Center highlight line */}
                    <line
                        x1="16"
                        y1="2"
                        x2="16"
                        y2="30"
                        stroke="url(#crystal-gradient)"
                        strokeWidth="0.5"
                        opacity="0.5"
                    />
                </g>
            </svg>

            {/* Logo Text */}
            {showText && (
                <span className="text-xl font-bold gradient-text font-[family-name:var(--font-montserrat)] tracking-tight">
                    Lustrous
                </span>
            )}
        </div>
    );
};
