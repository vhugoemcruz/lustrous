// @ts-check
/**
 * @module PerspectiveCanvas
 * @description Canvas interativo para renderização do grid de perspectiva
 */

"use client";

import { useRef, useEffect, useState } from "react";
import { usePerspectiveGrid } from "@/lib/hooks/usePerspectiveGrid";

// Ícone de informação SVG
function InfoIcon({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

// Ícone de exportação (câmera) SVG
function ExportIcon() {
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

// Ícones para Fullscreen e UI
function MaximizeIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
    );
}

function MinimizeIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
    );
}

function EyeIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
    );
}

export function PerspectiveCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hideUI, setHideUI] = useState(false);

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            await containerRef.current.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFS = !!document.fullscreenElement;
            setIsFullscreen(isFS);
            if (!isFS) setHideUI(false); // Reset hideUI when leaving fullscreen
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const handleCloseHelp = () => {
        setIsExiting(true);
        setTimeout(() => {
            setShowHelp(false);
            setIsExiting(false);
        }, 800); // Sincronizado com os 800ms do CSS
    };

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
        <div className="flex flex-col h-full bg-anthracite overflow-hidden">
            {/* Canvas Container - Now includes Toolbar for Fullscreen Context */}
            <div ref={containerRef} className="flex-1 relative overflow-hidden bg-anthracite flex flex-col">
                {/* Toolbar - Moved inside for Fullscreen visibility */}
                <div className={`flex flex-wrap items-center gap-4 p-4 transition-all duration-300 z-50 ${isFullscreen
                    ? "absolute top-0 left-0 w-full pointer-events-none"
                    : "glass border-b border-glass-border relative"
                    } ${hideUI ? "opacity-0 invisible -translate-y-4" : "opacity-100 visible translate-y-0"}`}>
                    <div className={`flex flex-wrap items-center gap-4 w-full ${isFullscreen ? "pointer-events-none" : ""}`}>
                        {/* Tipo de perspectiva */}
                        <div className="flex items-center gap-2 pointer-events-auto">
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
                            <div className="flex items-center gap-2 pointer-events-auto">
                                <span className="text-xs text-text-muted uppercase tracking-wider">
                                    Third Point:
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
                        <div className="flex items-center gap-2 pointer-events-auto">
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
                        <div className="flex items-center gap-2 pointer-events-auto">
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
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <span className="text-xs text-text-muted uppercase tracking-wider">
                                Zoom:
                            </span>
                            <span className="text-xs text-text-secondary tabular-nums">
                                {Math.round((state?.camera.zoom ?? 1) * 100)}%
                            </span>
                        </div>

                        {/* Spacer */}
                        {!isFullscreen && <div className="flex-1" />}

                        {/* Reset & Export */}
                        <div className={`flex items-center gap-2 pl-4 border-l border-white/10 pointer-events-auto ${isFullscreen ? "ml-auto" : ""}`}>
                            <button
                                onClick={reset}
                                className="h-9 px-4 flex items-center gap-2 bg-slate-grey text-text-secondary rounded-lg hover:bg-medium-grey hover:text-text-primary transition-all text-sm font-medium"
                                title="Resetar Grid"
                            >
                                Reset
                            </button>
                            <button
                                onClick={exportImage}
                                className="h-9 px-4 flex items-center gap-2 bg-aqua text-deep-obsidian rounded-lg hover:bg-opacity-90 transition-all text-sm font-bold shadow-lg shadow-aqua/20"
                                title="Exportar Imagem"
                            >
                                <ExportIcon />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 relative">
                    <canvas
                        ref={canvasRef}
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        style={{ cursor: getCursor() }}
                        className="absolute inset-0 z-10"
                    />

                    {/* Floating Controls Group */}
                    <div className={`absolute right-4 z-[60] flex flex-col items-center gap-2 transition-all duration-300 ${isFullscreen ? "top-20" : "top-4"}`}>
                        {/* Hide UI Button (Only in Fullscreen) */}
                        {isFullscreen && (
                            <button
                                onClick={() => setHideUI(!hideUI)}
                                className={`w-11 h-11 flex items-center justify-center rounded-full text-aqua transition-all pointer-events-auto hover:bg-white/5 hover:scale-110 ${hideUI ? "bg-aqua/20" : ""}`}
                                title={hideUI ? "Mostrar Controles" : "Esconder Controles"}
                            >
                                {hideUI ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
                            </button>
                        )}

                        {/* Fullscreen Button */}
                        <button
                            onClick={toggleFullscreen}
                            className={`w-11 h-11 flex items-center justify-center rounded-full text-aqua transition-all pointer-events-auto hover:bg-white/5 hover:scale-110 ${hideUI ? "opacity-0 invisible" : "opacity-100 visible"}`}
                            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                        >
                            {isFullscreen ? <MinimizeIcon size={24} /> : <MaximizeIcon size={24} />}
                        </button>

                        {/* Help Button - Persistent Aqua Visibility */}
                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className={`w-11 h-11 flex items-center justify-center rounded-full text-aqua transition-all pointer-events-auto hover:bg-white/5 ${showHelp ? "rotate-12 scale-110" : "hover:scale-110"
                                } ${hideUI ? "opacity-0 invisible" : "opacity-100 visible"}`}
                            title="User Guide"
                        >
                            <InfoIcon size={24} />
                        </button>
                    </div>

                    {/* Instructions overlay */}
                    {!state && (
                        <div className="absolute inset-0 flex items-center justify-center bg-deep-obsidian">
                            <div className="text-text-muted text-sm">Loading...</div>
                        </div>
                    )}

                    {/* Balão de Ajuda Centralizado com Backdrop (Relativo ao Canvas) */}
                    {showHelp && (
                        <div
                            className={`absolute inset-0 z-[100] flex items-center justify-center bg-deep-obsidian/30 ${isExiting ? "animate-backdrop-unfade" : "animate-backdrop-fade"
                                }`}
                            onClick={handleCloseHelp}
                        >
                            <div
                                className={`w-full max-w-[680px] p-8 glass border border-glass-border rounded-2xl shadow-2xl z-[101] ${isExiting ? "animate-balloon-exit" : "animate-balloon-enter"
                                    }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-glass-border pb-4">
                                        <h3 className="text-aqua font-bold text-xl uppercase tracking-widest">User Guide</h3>
                                        <button
                                            onClick={handleCloseHelp}
                                            className="text-text-muted hover:text-white transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="flex gap-8">
                                        {/* Left Column: Controls & Actions */}
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h4 className="text-gold font-bold text-sm mb-3 uppercase tracking-wider">Controls & Actions</h4>
                                                <ul className="text-sm text-text-secondary space-y-3">
                                                    <li>• <span className="text-aqua font-semibold">Click and drag</span> points to change perspective</li>
                                                    <li>• Use <span className="text-gold font-semibold">scroll</span> to zoom any area</li>
                                                    <li>• <span className="text-magenta font-semibold">Click and drag</span> empty space to navigate</li>
                                                    <li>• Click <span className="text-text-primary font-semibold">Reset</span> to restore default grid state</li>
                                                    <li>• Click <span className="text-aqua font-semibold">Export</span> to save high-res 1080p image</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Right Column: Interface */}
                                        <div className="flex-[1.8]">
                                            <h4 className="text-gold font-bold text-sm mb-3 uppercase tracking-wider">Interface</h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary block mb-1 text-xs">Points</strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Active vanishing points in the grid.</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary block mb-1 text-xs">Third Point</strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Flips vertical convergence orientation.</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary block mb-1 text-xs">Density</strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Frequency of primary grid lines.</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary block mb-1 text-xs">Tilt</strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Angles the horizon line rotation.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
