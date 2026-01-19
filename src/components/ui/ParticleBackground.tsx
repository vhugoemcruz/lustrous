// @ts-check
/**
 * @module ParticleBackground
 * @description Animated particle background creating a molecular/crystalline network effect.
 * Particles are interconnected by lines, with colors from the Mineral Spectrum palette.
 */

"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
    x: number;
    y: number;
    baseVx: number;
    baseVy: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    alpha: number;
    pulsePhase: number;
}

interface ParticleBackgroundProps {
    /**
     * Number of particles to render
     * @default 80
     */
    particleCount?: number;
    /**
     * Maximum distance for particle connections
     * @default 150
     */
    connectionDistance?: number;
    /**
     * Whether particles should react to mouse movement
     * @default true
     */
    interactive?: boolean;
    /**
     * Maximum particles that can be attracted to cursor at once
     * @default 8
     */
    maxAttractedParticles?: number;
    /**
     * Additional CSS class names
     */
    className?: string;
}

const COLORS = [
    "rgba(138, 43, 226, 1)", // Amethyst Purple
    "rgba(0, 255, 255, 1)", // Aqua Cyan
    "rgba(255, 0, 255, 1)", // Magenta Fusion
];

/**
 * ParticleBackground component.
 * Renders an animated canvas with interconnected particles forming a molecular network.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
export function ParticleBackground({
    particleCount = 80,
    connectionDistance = 150,
    interactive = true,
    maxAttractedParticles = 8,
    className = "",
}: ParticleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationFrameRef = useRef<number>(0);

    /**
     * Initializes particles with random positions, velocities, and colors.
     * Each particle has a base velocity for constant natural movement.
     */
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

    /**
     * Main animation loop.
     * Updates particle positions and draws connections.
     * Limits the number of particles that can be attracted to cursor.
     */
    const animate = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            const particles = particlesRef.current;
            const mouse = mouseRef.current;
            const time = Date.now() * 0.001;

            // Physics constants
            const MOUSE_INFLUENCE_RADIUS = 150;
            const REPULSION_STRENGTH = 0.8;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Update particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Start with base velocity for constant natural movement
                p.vx = p.baseVx;
                p.vy = p.baseVy;

                // Apply mouse REPULSION - slingshot particles away from cursor
                if (interactive) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0) {
                        // Stronger force when closer (inverse relationship)
                        const force = ((MOUSE_INFLUENCE_RADIUS - dist) / MOUSE_INFLUENCE_RADIUS) * REPULSION_STRENGTH;
                        // Push particle AWAY from cursor (slingshot effect)
                        p.vx += (dx / dist) * force;
                        p.vy += (dy / dist) * force;
                    }
                }

                // Update position
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

                // Pulsing alpha
                const pulseAlpha = p.alpha + Math.sin(time + p.pulsePhase) * 0.2;

                // Draw particle with glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace("1)", `${pulseAlpha * 0.3})`);
                ctx.fill();

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

            animationFrameRef.current = requestAnimationFrame(() =>
                animate(ctx, width, height)
            );
        },
        [connectionDistance, interactive, maxAttractedParticles]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        /**
         * Handles canvas resize to match window dimensions.
         */
        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
            initParticles(window.innerWidth, window.innerHeight);
        };

        /**
         * Tracks mouse position for interactive mode.
         */
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        /**
         * Resets mouse position when leaving window.
         */
        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        if (interactive) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseleave", handleMouseLeave);
        }

        animate(ctx, window.innerWidth, window.innerHeight);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [initParticles, animate, interactive]);

    return (
        <canvas
            ref={canvasRef}
            className={`particle-container ${className}`}
            aria-hidden="true"
        />
    );
}
