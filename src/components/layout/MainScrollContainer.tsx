"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface MainScrollContainerProps {
  children: ReactNode;
}

/**
 * MainScrollContainer component.
 * Wraps the main content and handles global scrolling.
 * Conditionally applies a data-mask attribute to enable/disable the fade effect.
 *
 * @param children - The page content
 */
export function MainScrollContainer({ children }: MainScrollContainerProps) {
  const pathname = usePathname();

  // Disable mask on perspective grid to avoid hiding toolbar particles
  const shouldDisableMask = pathname === "/perspective-grid";

  return (
    <main
      id="main-scroll-container"
      className="relative h-[100dvh] w-full overflow-x-hidden overflow-y-auto pt-[var(--header-height)]"
      style={{
        maskImage: shouldDisableMask
          ? "none"
          : "linear-gradient(to bottom, transparent 0px, transparent var(--header-height), black calc(var(--header-height) + 30px))",
        WebkitMaskImage: shouldDisableMask
          ? "none"
          : "linear-gradient(to bottom, transparent 0px, transparent var(--header-height), black calc(var(--header-height) + 30px))",
      }}
    >
      {children}
    </main>
  );
}
