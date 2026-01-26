/**
 * @module ToolbarParticles
 * @description Lightweight particle animation for toolbar backgrounds.
 * A simplified version of ParticleBackground that works within a container.
 */

"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  color: string;
  alpha: number;
  pulsePhase: number;
}

interface ToolbarParticlesProps {
  particleCount?: number;
  connectionDistance?: number;
  className?: string;
  /**
   * Whether particles should react to mouse movement
   * @default true
   */
  interactive?: boolean;
}

const COLORS = [
  "rgba(138, 43, 226, 1)", // Amethyst Purple
  "rgba(0, 255, 255, 1)", // Aqua Cyan
  "rgba(255, 0, 255, 1)", // Magenta Fusion
  "rgba(255, 215, 0, 1)", // Gold
  "rgba(80, 200, 120, 1)", // Emerald Green
];

/**
 * ToolbarParticles component.
 * Renders animated particles within a container (not fullscreen).
 */
export function ToolbarParticles({
  particleCount = 25,
  connectionDistance = 80,
  className = "",
  interactive = true,
}: ToolbarParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dimensionsRef = useRef({ width: 0, height: 0, left: 0, top: 0 });

  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        // Random base velocity for constant natural movement (slow drift)
        const baseVx = (Math.random() - 0.5) * 0.3;
        const baseVy = (Math.random() - 0.5) * 0.3;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseVx,
          baseVy,
          vx: baseVx,
          vy: baseVy,
          // Visual params matched to ParticleBackground
          radius: Math.random() * 2 + 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: Math.random() * 0.5 + 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      particlesRef.current = particles;
    },
    [particleCount]
  );

  const animate = useCallback(
    function animate(ctx: CanvasRenderingContext2D) {
      const { width, height, left, top } = dimensionsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current; // Global mouse coordinates
      const time = Date.now() * 0.001;

      // Physics constants
      const MOUSE_INFLUENCE_RADIUS = 150;
      const REPULSION_STRENGTH = 0.8;

      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Start with base velocity
        p.vx = p.baseVx;
        p.vy = p.baseVy;

        // Apply mouse REPULSION
        if (interactive) {
          // Calculate mouse position relative to this specific canvas
          const relativeMouseX = mouse.x - left;
          const relativeMouseY = mouse.y - top;

          const dx = p.x - relativeMouseX;
          const dy = p.y - relativeMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0) {
            const force =
              ((MOUSE_INFLUENCE_RADIUS - dist) / MOUSE_INFLUENCE_RADIUS) *
              REPULSION_STRENGTH;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0) {
          p.x = 0;
          p.baseVx = Math.abs(p.baseVx);
        } else if (p.x > width) {
          p.x = width;
          p.baseVx = -Math.abs(p.baseVx);
        }

        if (p.y < 0) {
          p.y = 0;
          p.baseVy = Math.abs(p.baseVy);
        } else if (p.y > height) {
          p.y = height;
          p.baseVy = -Math.abs(p.baseVy);
        }

        // Keep in bounds
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // Pulsing alpha
        const pulseAlpha = p.alpha + Math.sin(time + p.pulsePhase) * 0.2;

        // Draw particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("1)", `${pulseAlpha * 0.3})`);
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("1)", `${pulseAlpha})`);
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha =
              ((connectionDistance - dist) / connectionDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(() => animate(ctx));
    },
    [connectionDistance, interactive]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Store dimensions including position for interaction calc
      dimensionsRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      initParticles(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Add global mouse listeners for interaction
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }

    // Also update rect on scroll as it might change position
    window.addEventListener("scroll", handleResize);
    window.addEventListener("resize", handleResize);

    animate(ctx);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleResize);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [initParticles, animate, interactive]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
