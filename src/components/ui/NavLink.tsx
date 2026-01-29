/**
 * @module NavLink
 * @description Navigation link component with prismatic underline effect.
 */

import Link from "next/link";
import { FC, ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

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
        isActive ? "text-aqua" : "text-diamond-dust hover:text-pure-quartz"
      } ${className} group`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[image:var(--gradient-prismatic)] transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-full ${
          isActive ? "bg-aqua w-full" : ""
        }`}
      />
    </Link>
  );
};
