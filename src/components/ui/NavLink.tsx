/**
 * @module NavLink
 * @description Navigation link component with brush-stroke underline effect.
 * Uses a hand-drawn style watercolor underline instead of a prismatic gradient.
 */

import Link from "next/link";
import { FC, ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

/**
 * NavLink component — Artist's Studio style.
 * Hover reveals a brush-stroke underline that looks hand-painted.
 */
export const NavLink: FC<NavLinkProps> = ({
  href,
  children,
  isActive = false,
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 font-medium transition-colors duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isActive ? "text-wc-blue" : "text-ink-charcoal hover:text-ink-black"
      } ${className} group`}
    >
      {children}
      {/* Brush-stroke underline effect */}
      <span
        className={`absolute right-0 bottom-0 left-0 h-[6px] rounded-sm transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-x-100 ${
          isActive ? "bg-wc-blue/30 scale-x-100" : "bg-wc-amber/40 scale-x-0"
        }`}
        style={{
          borderRadius: "2px 6px 2px 4px",
          transformOrigin: "center",
          rotate: "-0.5deg",
        }}
      />
    </Link>
  );
};
