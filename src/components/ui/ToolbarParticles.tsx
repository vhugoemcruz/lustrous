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
    radius: number;
    color: string;
    alpha: number;
    pulsePhase: number;
}

interface ToolbarParticlesProps {
    particleCount?: number;
    connectionDistance?: number;
    className?: string;
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
}: ToolbarParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>(0);
    const dimensionsRef = useRef({ width: 0, height: 0 });

    const initParticles = useCallback(
        (width: number, height: number) => {
            const particles: Particle[] = [];

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    alpha: Math.random() * 0.4 + 0.2,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }

            particlesRef.current = particles;
        },
        [particleCount]
    );

    const animate = useCallback(
        function animate(ctx: CanvasRenderingContext2D) {
            const { width, height } = dimensionsRef.current;
            const particles = particlesRef.current;
            const time = Date.now() * 0.001;

            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Keep in bounds
                p.x = Math.max(0, Math.min(width, p.x));
                p.y = Math.max(0, Math.min(height, p.y));

                // Pulsing alpha
                const pulseAlpha = p.alpha + Math.sin(time + p.pulsePhase) * 0.15;

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
                        const alpha = ((connectionDistance - dist) / connectionDistance) * 0.2;
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
        [connectionDistance]
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

            dimensionsRef.current = { width: rect.width, height: rect.height };

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.scale(dpr, dpr);

            initParticles(rect.width, rect.height);
        };

        handleResize();

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        animate(ctx);

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [initParticles, animate]);

    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                aria-hidden="true"
            />
        </div>
    );
}
