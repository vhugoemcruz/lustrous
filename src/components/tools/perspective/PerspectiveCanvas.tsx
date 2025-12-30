// @ts-check
/**
 * @module PerspectiveCanvas
 * @description Canvas interativo para renderização do grid de perspectiva
 */

"use client";

import { useRef, useEffect } from "react";
import { usePerspectiveGrid } from "@/lib/hooks/usePerspectiveGrid";

// Ícone de câmera SVG
function CameraIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );
}

export function PerspectiveCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        state,
        isDragging,
        isPanning,
        initialize,
        updateConfig,
        updateHorizonAngle,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel,
        reset,
        exportImage,
    } = usePerspectiveGrid(canvasRef);

    // Inicializar canvas com tamanho do container
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (canvasRef.current && width > 0 && height > 0) {
                    canvasRef.current.width = width;
                    canvasRef.current.height = height;
                    initialize(width, height);
                }
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [initialize]);

    // Determinar cursor
    const getCursor = () => {
        if (isDragging) return "grabbing";
        if (isPanning) return "grabbing";
        return "crosshair";
    };

    return (
        <div className="flex flex-col h-full bg-anthracite">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 p-4 glass border-b border-glass-border">
                {/* Tipo de perspectiva */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted uppercase tracking-wider">
                        Points:
                    </span>
                    <div className="flex gap-1">
                        {([1, 2, 3] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => updateConfig({ type })}
                                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${state?.config.type === type
                                        ? "bg-aqua text-deep-obsidian shadow-lg"
                                        : "bg-slate-grey text-text-secondary hover:bg-medium-grey hover:text-text-primary"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orientação do terceiro ponto */}
                {state?.config.type === 3 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted uppercase tracking-wider">
                            VP3:
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => updateConfig({ thirdPointOrientation: "top" })}
                                className={`px-3 h-9 rounded-lg text-xs font-semibold transition-all ${state?.config.thirdPointOrientation === "top"
                                        ? "bg-magenta text-white shadow-lg"
                                        : "bg-slate-grey text-text-secondary hover:bg-medium-grey hover:text-text-primary"
                                    }`}
                            >
                                ↑ Above
                            </button>
                            <button
                                onClick={() => updateConfig({ thirdPointOrientation: "bottom" })}
                                className={`px-3 h-9 rounded-lg text-xs font-semibold transition-all ${state?.config.thirdPointOrientation === "bottom"
                                        ? "bg-magenta text-white shadow-lg"
                                        : "bg-slate-grey text-text-secondary hover:bg-medium-grey hover:text-text-primary"
                                    }`}
                            >
                                ↓ Below
                            </button>
                        </div>
                    </div>
                )}

                {/* Densidade */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted uppercase tracking-wider">
                        Density:
                    </span>
                    <div className="flex gap-1">
                        {(["low", "medium", "high"] as const).map((density) => (
                            <button
                                key={density}
                                onClick={() => updateConfig({ density })}
                                className={`px-3 h-9 rounded-lg text-xs font-semibold capitalize transition-all ${state?.config.density === density
                                        ? "bg-amethyst text-white shadow-lg"
                                        : "bg-slate-grey text-text-secondary hover:bg-medium-grey hover:text-text-primary"
                                    }`}
                            >
                                {density}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Angulo do horizonte - Tilt até ±90° */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted uppercase tracking-wider">
                        Tilt:
                    </span>
                    <input
                        type="range"
                        min="-90"
                        max="90"
                        value={state?.camera.horizonAngle ?? 0}
                        onChange={(e) => updateHorizonAngle(Number(e.target.value))}
                        className="w-28 h-2 bg-slate-grey rounded-lg appearance-none cursor-pointer accent-gold"
                    />
                    <span className="text-xs text-text-secondary w-10 tabular-nums">
                        {state?.camera.horizonAngle ?? 0}°
                    </span>
                </div>

                {/* Zoom indicator */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted uppercase tracking-wider">
                        Zoom:
                    </span>
                    <span className="text-xs text-text-secondary tabular-nums">
                        {Math.round((state?.camera.zoom ?? 1) * 100)}%
                    </span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Ações */}
                <div className="flex gap-2">
                    <button
                        onClick={reset}
                        className="px-4 h-9 rounded-lg text-xs font-semibold bg-slate-grey text-text-secondary hover:bg-medium-grey hover:text-text-primary transition-all"
                    >
                        Reset
                    </button>
                    <button
                        onClick={exportImage}
                        className="flex items-center gap-2 px-4 h-9 rounded-lg text-xs font-semibold bg-aqua text-deep-obsidian hover:opacity-90 transition-all shadow-lg"
                        title="Export Full HD (1920×1080)"
                    >
                        <CameraIcon />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Canvas Container */}
            <div ref={containerRef} className="flex-1 relative overflow-hidden">
                <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    style={{ cursor: getCursor() }}
                    className="absolute inset-0"
                />

                {/* Instructions overlay */}
                {!state && (
                    <div className="absolute inset-0 flex items-center justify-center bg-deep-obsidian">
                        <div className="text-text-muted text-sm">Loading...</div>
                    </div>
                )}
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2 glass border-t border-glass-border text-xs">
                <span className="text-text-muted">
                    Drag vanishing points • Scroll to zoom • Click and drag to pan
                </span>
                <span className="text-text-secondary tabular-nums">
                    {state?.canvasWidth} × {state?.canvasHeight}
                </span>
            </div>
        </div>
    );
}
