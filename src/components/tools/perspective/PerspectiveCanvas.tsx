/**
 * @module PerspectiveCanvas
 * @description Interactive canvas for rendering the perspective grid
 */

"use client";

import { useRef, useEffect, useState } from "react";
import { usePerspectiveGrid } from "@/lib/hooks/usePerspectiveGrid";

// SVG info icon
/**
 * SVG info icon for the user guide.
 */
function InfoIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
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
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

// SVG export (camera) icon
/**
 * SVG export (camera) icon for the download button.
 */
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

// Icons for Fullscreen and UI
function MaximizeIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
    );
}

function MinimizeIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
    );
}

function EyeIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
    );
}

function ImageIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function TrashIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    );
}

function SettingsIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function RotateIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <polyline points="21 3 21 8 16 8" />
        </svg>
    );
}

function ZoomIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
    );
}

/**
 * Main Perspective Canvas component.
 * Manages user interface, canvas interactions, and fullscreen mode.
 */
export function PerspectiveCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hideUI, setHideUI] = useState(false);
    const [showRefSubmenu, setShowRefSubmenu] = useState(false);

    // Conditional styles for fullscreen mode (dark colors for light background)
    const btnStyles = {
        // Button base styles
        inactive: isFullscreen
            ? "bg-black/20 border border-black/30 text-gray-700 hover:bg-black/30 hover:text-gray-900"
            : "bg-white/10 border border-white/15 text-text-secondary hover:bg-white/15 hover:border-white/25 hover:text-white",
        active: isFullscreen
            ? "bg-black/30 border border-black/40 text-gray-900"
            : "bg-white/25 border border-white/40 text-white",
        // Labels
        label: isFullscreen ? "text-gray-600" : "text-text-muted",
        value: isFullscreen ? "text-gray-700" : "text-text-secondary",
        // Slider
        slider: isFullscreen
            ? "bg-black/20 accent-gray-600"
            : "bg-white/10 accent-white/60",
        // Export button (more prominent)
        export: isFullscreen
            ? "bg-black/30 border border-black/40 text-gray-900 hover:bg-black/40"
            : "bg-white/20 border border-white/25 text-white hover:bg-white/25",
        // Floating buttons (right side) - minimal style, just icons
        floatInactive: isFullscreen
            ? "text-gray-500 hover:text-gray-700"
            : "text-text-muted hover:text-white",
        floatActive: isFullscreen
            ? "text-gray-700"
            : "text-white",
    };

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
        }, 350); // Synchronized with 350ms from CSS
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
        resetCamera,
        exportImage,
        setReferenceImage,
        updateReferenceImage,
        resetReferenceImage,
        clearReferenceImage,
    } = usePerspectiveGrid(canvasRef, hideUI);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReferenceImage(file);
        }
    };

    // Initialize canvas with container size
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

    // Determine cursor
    const getCursor = () => {
        if (isDragging) return "grabbing";
        if (isPanning) return "grabbing";
        return "crosshair";
    };

    return (
        <div className="flex flex-col h-full bg-anthracite overflow-hidden">
            {/* Canvas Container - Includes Toolbar for Fullscreen Context */}
            <div ref={containerRef} className="flex-1 relative overflow-hidden bg-anthracite flex flex-col">
                {/* Toolbar - Moved inside for Fullscreen visibility */}
                <div className={`flex flex-wrap items-center gap-4 p-4 transition-all duration-300 z-50 ${isFullscreen
                    ? "absolute top-0 left-0 w-full pointer-events-none"
                    : "bg-deep-obsidian relative"
                    } ${hideUI ? "opacity-0 invisible -translate-y-4" : "opacity-100 visible translate-y-0"}`}>
                    <div className={`flex flex-wrap items-center gap-4 w-full ${isFullscreen ? "pointer-events-none" : ""}`}>
                        {/* Perspective type */}
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <span className={`text-xs ${btnStyles.label} uppercase tracking-wider`}>
                                Points:
                            </span>
                            <div className="flex gap-1">
                                {([1, 2, 3] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => updateConfig({ type })}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${state?.config.type === type
                                            ? btnStyles.active
                                            : btnStyles.inactive
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Third point orientation */}
                        {state?.config.type === 3 && (
                            <div className="flex items-center gap-2 pointer-events-auto">
                                <span className={`text-xs ${btnStyles.label} uppercase tracking-wider`}>
                                    Third Point:
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => updateConfig({ thirdPointOrientation: "top" })}
                                        className={`px-3 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${state?.config.thirdPointOrientation === "top"
                                            ? btnStyles.active
                                            : btnStyles.inactive
                                            }`}
                                    >
                                        ↑ Above
                                    </button>
                                    <button
                                        onClick={() => updateConfig({ thirdPointOrientation: "bottom" })}
                                        className={`px-3 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${state?.config.thirdPointOrientation === "bottom"
                                            ? btnStyles.active
                                            : btnStyles.inactive
                                            }`}
                                    >
                                        ↓ Below
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Density */}
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <span className={`text-xs ${btnStyles.label} uppercase tracking-wider`}>
                                Density:
                            </span>
                            <div className="flex gap-1">
                                {(["low", "medium", "high"] as const).map((density) => (
                                    <button
                                        key={density}
                                        onClick={() => updateConfig({ density })}
                                        className={`px-3 h-8 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${state?.config.density === density
                                            ? btnStyles.active
                                            : btnStyles.inactive
                                            }`}
                                    >
                                        {density}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Horizon angle - Tilt up to ±90° */}
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <span className={`text-xs ${btnStyles.label} uppercase tracking-wider`}>
                                Tilt:
                            </span>
                            <input
                                type="range"
                                min="-90"
                                max="90"
                                value={state?.camera.horizonAngle ?? 0}
                                onChange={(e) => updateHorizonAngle(Number(e.target.value))}
                                className={`w-24 h-1.5 rounded-full appearance-none cursor-pointer ${btnStyles.slider}`}
                            />
                            <span className={`text-xs ${btnStyles.value} w-10 tabular-nums`}>
                                {state?.camera.horizonAngle ?? 0}°
                            </span>
                        </div>

                        {/* Zoom indicator */}
                        <div className="flex items-center gap-2 pointer-events-auto">
                            <span className={`text-xs ${btnStyles.label} uppercase tracking-wider`}>
                                Zoom:
                            </span>
                            <span className={`text-xs ${btnStyles.value} tabular-nums`}>
                                {Math.round((state?.camera.zoom ?? 1) * 100)}%
                            </span>
                        </div>

                        {/* Spacer */}
                        {!isFullscreen && <div className="flex-1" />}

                        {/* Reset & Export */}
                        <div className={`flex items-center gap-2 pl-4 pointer-events-auto ${isFullscreen ? "ml-auto" : ""}`}>
                            <button
                                onClick={resetCamera}
                                className={`h-8 px-4 flex items-center gap-2 rounded-lg transition-all duration-200 text-xs font-medium ${btnStyles.inactive}`}
                                title="Recenter (Reset Pan/Zoom - Preserves Tilt)"
                            >
                                Center
                            </button>
                            <button
                                onClick={reset}
                                className={`h-8 px-4 flex items-center gap-2 rounded-lg transition-all duration-200 text-xs font-medium ${btnStyles.inactive}`}
                                title="Reset Entire Grid"
                            >
                                Reset Grid
                            </button>
                            <button
                                onClick={exportImage}
                                className={`h-8 px-4 flex items-center gap-2 rounded-lg transition-all duration-200 text-xs font-semibold ${btnStyles.export}`}
                                title="Export Image"
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

                    {/* Floating Controls Group - Right Side */}
                    <div className={`absolute right-4 z-[60] flex flex-col items-center gap-2 transition-all duration-300 ${isFullscreen ? "top-20" : "top-4"}`}>
                        {/* Hide UI Button (Only in Fullscreen) */}
                        {isFullscreen && (
                            <button
                                onClick={() => setHideUI(!hideUI)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all pointer-events-auto ${hideUI ? btnStyles.floatActive : btnStyles.floatInactive}`}
                                title={hideUI ? "Show Controls" : "Hide Controls"}
                            >
                                {hideUI ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </button>
                        )}

                        {/* Fullscreen Button */}
                        <button
                            onClick={toggleFullscreen}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all pointer-events-auto ${btnStyles.floatInactive} ${hideUI ? "opacity-0 invisible" : "opacity-100 visible"}`}
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? <MinimizeIcon size={20} /> : <MaximizeIcon size={20} />}
                        </button>

                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all pointer-events-auto ${showHelp ? btnStyles.floatActive : btnStyles.floatInactive} ${hideUI ? "opacity-0 invisible" : "opacity-100 visible"}`}
                            title="User Guide"
                        >
                            <InfoIcon size={20} />
                        </button>

                        {/* Reference Image Button */}
                        <div className={`relative ${hideUI ? "opacity-0 invisible" : "opacity-100 visible"}`}>
                            {!state?.referenceImage ? (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all pointer-events-auto ${btnStyles.floatInactive}`}
                                    title="Add Reference Image"
                                >
                                    <ImageIcon size={20} />
                                </button>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    {/* Visibility Toggle */}
                                    <button
                                        onClick={() => updateReferenceImage({ isVisible: !state.referenceImage?.isVisible })}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all pointer-events-auto ${state.referenceImage.isVisible
                                            ? btnStyles.floatActive
                                            : btnStyles.floatInactive
                                            }`}
                                        title={state.referenceImage.isVisible ? "Hide Reference" : "Show Reference"}
                                    >
                                        {state.referenceImage.isVisible ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                                    </button>

                                    {/* Settings Button */}
                                    <button
                                        onClick={() => setShowRefSubmenu(!showRefSubmenu)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all pointer-events-auto ${showRefSubmenu
                                            ? btnStyles.floatActive
                                            : btnStyles.floatInactive
                                            }`}
                                        title="Reference Settings"
                                    >
                                        <SettingsIcon size={20} />
                                    </button>
                                </div>
                            )}

                            {/* Reference Settings Submenu - Appears below */}
                            {showRefSubmenu && state?.referenceImage && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-deep-obsidian/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-4 z-[70] animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                                            <ImageIcon size={14} className="text-white/60" />
                                            Reference Settings
                                        </h3>
                                        <button
                                            onClick={() => setShowRefSubmenu(false)}
                                            className="text-text-muted hover:text-white transition-colors"
                                        >
                                            <span className="text-lg">&times;</span>
                                        </button>
                                    </div>

                                    {/* Opacity */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] text-text-muted uppercase">Opacity</label>
                                            <span className="text-[10px] text-white/70 tabular-nums">{Math.round((state.referenceImage?.opacity ?? 0) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0.05" max="1" step="0.05"
                                            value={state.referenceImage?.opacity ?? 0.5}
                                            onChange={(e) => updateReferenceImage({ opacity: parseFloat(e.target.value) })}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/60"
                                        />
                                    </div>

                                    {/* Rotation */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] text-text-muted uppercase">Rotation</label>
                                            <div className="flex gap-1">
                                                {[0, 90, 180, 270].map(angle => (
                                                    <button
                                                        key={angle}
                                                        onClick={() => updateReferenceImage({ rotation: angle })}
                                                        className={`text-[9px] px-1.5 py-0.5 rounded ${state.referenceImage?.rotation === angle ? "bg-white/20 text-white" : "bg-white/5 text-text-muted hover:text-white"}`}
                                                    >
                                                        {angle}°
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RotateIcon size={14} className="text-text-muted" />
                                            <input
                                                type="range" min="0" max="360" step="1"
                                                value={state.referenceImage?.rotation ?? 0}
                                                onChange={(e) => {
                                                    let val = parseInt(e.target.value);
                                                    // Snapping logic
                                                    const snaps = [0, 90, 180, 270, 360];
                                                    for (const snap of snaps) {
                                                        if (Math.abs(val - snap) < 5) {
                                                            val = snap === 360 ? 0 : snap;
                                                            break;
                                                        }
                                                    }
                                                    updateReferenceImage({ rotation: val });
                                                }}
                                                className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/60"
                                            />
                                            <span className="text-[10px] text-text-secondary w-8 tabular-nums">{state.referenceImage?.rotation ?? 0}°</span>
                                        </div>
                                    </div>

                                    {/* Scale (Zoom) */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] text-text-muted uppercase">Image Zoom</label>
                                            <span className="text-[10px] text-white/70 tabular-nums">{Math.round((state.referenceImage?.scale ?? 1) * 100)}%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ZoomIcon size={14} className="text-text-muted" />
                                            <input
                                                type="range" min="0.1" max="5" step="0.1"
                                                value={state.referenceImage?.scale ?? 1}
                                                onChange={(e) => updateReferenceImage({ scale: parseFloat(e.target.value) })}
                                                className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white/60"
                                            />
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <button
                                            onClick={() => updateReferenceImage({ followHorizon: !state.referenceImage?.followHorizon })}
                                            className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-[10px] font-medium ${state.referenceImage.followHorizon ? "bg-white/15 border-white/30 text-white" : "bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white"}`}
                                        >
                                            <div className={`w-3 h-3 rounded-full border ${state.referenceImage.followHorizon ? "bg-white border-white" : "border-text-muted"}`} />
                                            Sync Tilt
                                        </button>
                                        <button
                                            onClick={() => updateReferenceImage({ followZoom: !state.referenceImage?.followZoom })}
                                            className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-[10px] font-medium ${state.referenceImage.followZoom ? "bg-white/15 border-white/30 text-white" : "bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white"}`}
                                        >
                                            <div className={`w-3 h-3 rounded-full border ${state.referenceImage.followZoom ? "bg-white border-white" : "border-text-muted"}`} />
                                            Sync Zoom
                                        </button>
                                        <button
                                            onClick={() => updateReferenceImage({ isInteractive: !state.referenceImage?.isInteractive })}
                                            className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-[10px] font-medium ${state.referenceImage.isInteractive ? "bg-white/15 border-white/30 text-white" : "bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-white"}`}
                                        >
                                            <div className={`w-3 h-3 rounded-full border ${state.referenceImage.isInteractive ? "bg-white border-white" : "border-text-muted"}`} />
                                            Move Handle
                                        </button>
                                        <button
                                            onClick={resetReferenceImage}
                                            className="flex items-center gap-2 p-2 rounded-lg border border-white/10 bg-white/5 text-text-muted hover:bg-white/10 hover:text-white transition-all text-[10px] font-medium"
                                        >
                                            Reset Pos
                                        </button>
                                    </div>

                                    <div className="pt-2 border-t border-white/5 mt-1 flex gap-2">
                                        <button
                                            onClick={clearReferenceImage}
                                            className="flex-1 h-9 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 rounded-lg transition-all text-xs font-medium"
                                        >
                                            <TrashIcon size={14} />
                                            Remove Image
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions overlay */}
                    {!state && (
                        <div className="absolute inset-0 flex items-center justify-center bg-deep-obsidian">
                            <div className="text-text-muted text-sm">Loading...</div>
                        </div>
                    )}

                    {/* Help Balloon Centered with Backdrop (Relative to Canvas) */}
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
                                                    <li>• Use <span className="text-emerald font-semibold">Add Ref</span> to overlay an image for study</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Right Column: Interface */}
                                        <div className="flex-[1.8]">
                                            <h4 className="text-gold font-bold text-sm mb-3 uppercase tracking-wider">Interface</h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary block mb-1 text-xs">Vanishing Points</strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Click and drag on the vanishing points to move them directly.</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary block mb-1 text-xs">Points</strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Changes the number of vanishing points.</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary block mb-1 text-xs">Density</strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Frequency of grid lines.</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary block mb-1 text-xs">Tilt</strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Changes the angle of inclination of the horizon line.</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary flex items-center gap-1.5 mb-1 text-xs">
                                                        <MaximizeIcon size={12} className="text-aqua" />
                                                        Fullscreen
                                                    </strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Expands the grid to fill the browser window.</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30">
                                                    <strong className="text-text-primary flex items-center gap-1.5 mb-1 text-xs">
                                                        <EyeIcon size={12} className="text-aqua" />
                                                        Hide UI
                                                    </strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">Hides all controls for a clean view (Fullscreen only).</p>
                                                </div>
                                                <div className="bg-medium-grey/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-medium-grey/30 col-span-2">
                                                    <strong className="flex items-center gap-1.5 mb-1 tracking-tighter">
                                                        Colored Circles
                                                    </strong>
                                                    <p className="text-text-secondary text-[10px] leading-relaxed">The colored circles on the screen are the controls for the vanishing points of their respective colors. Click and drag them to move the vanishing points.</p>
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

            {/* Hidden file input for reference image */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
