/**
 * @module ScrollReveal
 * @description Client component that reveals children with animation when they enter the viewport.
 * Uses Intersection Observer for performant scroll-based animations.
 */

"use client";

import { useEffect, useRef, useState, type FC, type ReactNode } from "react";

interface ScrollRevealProps {
  /**
   * Content to reveal on scroll
   */
  children: ReactNode;
  /**
   * Delay before animation starts (in milliseconds)
   * @default 0
   */
  delay?: number;
  /**
   * Additional CSS classes
   */
  rootMargin?: string;
  className?: string;
}

/**
 * ScrollReveal component.
 * Animates children into view when they enter the viewport.
 * Initially hidden, then fades in and slides up when scrolled into view.
 */
export const ScrollReveal: FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  rootMargin = "0px 0px -80px 0px",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Once visible, keep visible to prevent flickering/trembling
          // when element is at the edge of the viewport
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Disconnect observer after reveal for better performance
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
