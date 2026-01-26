/**
 * @module PerspectiveCanvas
 * @description Interactive canvas for rendering the perspective grid
 */

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { usePerspectiveGrid } from "@/lib/hooks/usePerspectiveGrid";

// SVG info icon
/**
 * SVG info icon for the user guide.
 */
function InfoIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
function MaximizeIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function MinimizeIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function EyeIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function ImageIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function TrashIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SettingsIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function RotateIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <polyline points="21 3 21 8 16 8" />
    </svg>
  );
}

function ZoomIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

// Color conversion helpers
// Color conversion helpers (HSV based for accurate picker)
function hsvToHex(h: number, s: number, v: number): string {
  s /= 100;
  v /= 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  const rgb = [f(5), f(3), f(1)].map((c) =>
    Math.round(c * 255)
      .toString(16)
      .padStart(2, "0")
  );
  return `#${rgb.join("")}`;
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, v: 0 };
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    v = max;
  let d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
}

/**
 * Custom Color Picker Component
 */
function ColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (hex: string) => void;
}) {
  const [hsv, setHsv] = useState(hexToHsv(color));
  const [isDraggingError, setIsDragging] = useState<string | null>(null); // "sv" or "h"
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render Canvas (SV Box)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Default to client dimensions if available, else small default
    const width = canvas.clientWidth || 200;
    const height = canvas.clientHeight || 200;

    // Match buffer size to display size
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.fillStyle = `hsl(${hsv.h}, 100%, 50%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradSat = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradSat.addColorStop(0, "white");
    gradSat.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradSat;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradVal = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradVal.addColorStop(0, "rgba(0,0,0,0)");
    gradVal.addColorStop(1, "black");
    ctx.fillStyle = gradVal;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [hsv.h]);

  // Sync internal state if prop changes freely (optional, might cause loops if not careful)
  useEffect(() => {
    const newHsv = hexToHsv(color);
    // Only update if significantly different to avoid rounding loops
    if (
      Math.abs(newHsv.h - hsv.h) > 1 ||
      Math.abs(newHsv.s - hsv.s) > 1 ||
      Math.abs(newHsv.v - hsv.v) > 1
    ) {
      setHsv(newHsv);
    }
  }, [color]);

  const handleSvMove = useCallback(
    (e: MouseEvent | React.MouseEvent, isDown: boolean = false) => {
      if (!svRef.current) return;
      const rect = svRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      // s = x, v = 1 - y
      const newS = x * 100;
      const newV = (1 - y) * 100;

      const newHsv = { ...hsv, s: newS, v: newV };
      setHsv(newHsv);
      onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
    },
    [hsv, onChange]
  );

  const handleHueMove = useCallback(
    (e: MouseEvent | React.MouseEvent, isDown: boolean = false) => {
      if (!hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      const newH = x * 360;
      const newHsv = { ...hsv, h: newH };
      setHsv(newHsv);
      onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
    },
    [hsv, onChange]
  );

  useEffect(() => {
    const handleUp = () => setIsDragging(null);
    const handleMove = (e: MouseEvent) => {
      if (isDraggingError === "sv") handleSvMove(e);
      if (isDraggingError === "hue") handleHueMove(e);
    };
    if (isDraggingError) {
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("mousemove", handleMove);
    }
    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [isDraggingError, handleSvMove, handleHueMove]);

  return (
    <div className="flex w-full flex-col gap-3 p-1 select-none">
      {/* Saturation/Value Box - Canvas */}
      <div
        ref={svRef}
        className="relative aspect-square w-full cursor-crosshair overflow-hidden rounded-lg border border-white/10"
        onMouseDown={(e) => {
          setIsDragging("sv");
          handleSvMove(e, true);
        }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
        <div
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-white shadow-sm"
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Hue Slider */}
      <div
        ref={hueRef}
        className="relative h-3 w-full cursor-pointer rounded-full border border-white/10"
        style={{
          background:
            "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
        }}
        onMouseDown={(e) => {
          setIsDragging("hue");
          handleHueMove(e, true);
        }}
      >
        <div
          className="pointer-events-none absolute top-0 h-3 w-3 -translate-x-1/2 transform rounded-full border border-black/20 bg-white shadow-sm"
          style={{ left: `${(hsv.h / 360) * 100}%` }}
        />
      </div>
    </div>
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
  const [showGridSettings, setShowGridSettings] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(
    null
  );
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle click outside color picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        activeColorPicker &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setActiveColorPicker(null);
      }
    }

    if (activeColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeColorPicker]);

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
    floatActive: isFullscreen ? "text-gray-700" : "text-white",
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
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
    updateVanishingPoint,
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
    <div className="flex h-full flex-col overflow-hidden">
      {/* Canvas Container - Includes Toolbar for Fullscreen Context */}
      <div
        ref={containerRef}
        className="relative flex flex-1 flex-col overflow-hidden"
      >
        {/* Toolbar - Moved inside for Fullscreen visibility */}
        <div
          className={`z-50 flex flex-wrap items-center gap-4 p-4 transition-all duration-300 ${
            isFullscreen
              ? "pointer-events-none absolute top-0 left-0 w-full"
              : "relative"
          } ${hideUI ? "invisible -translate-y-4 opacity-0" : "visible translate-y-0 opacity-100"}`}
        >
          <div
            className={`flex w-full flex-wrap items-center gap-4 ${isFullscreen ? "pointer-events-none" : ""}`}
          >
            {/* Perspective type */}
            <div className="pointer-events-auto flex items-center gap-2">
              <span
                className={`text-xs ${btnStyles.label} tracking-wider uppercase`}
              >
                Points:
              </span>
              <div className="flex gap-1">
                {([1, 2, 3] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateConfig({ type })}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      state?.config.type === type
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
              <div className="pointer-events-auto flex items-center gap-2">
                <span
                  className={`text-xs ${btnStyles.label} tracking-wider uppercase`}
                >
                  Third Point:
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      updateConfig({ thirdPointOrientation: "top" })
                    }
                    className={`h-8 rounded-lg px-3 text-xs font-medium transition-all duration-200 ${
                      state?.config.thirdPointOrientation === "top"
                        ? btnStyles.active
                        : btnStyles.inactive
                    }`}
                  >
                    ↑ Above
                  </button>
                  <button
                    onClick={() =>
                      updateConfig({ thirdPointOrientation: "bottom" })
                    }
                    className={`h-8 rounded-lg px-3 text-xs font-medium transition-all duration-200 ${
                      state?.config.thirdPointOrientation === "bottom"
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
            <div className="pointer-events-auto flex items-center gap-2">
              <span
                className={`text-xs ${btnStyles.label} tracking-wider uppercase`}
              >
                Density:
              </span>
              <div className="flex gap-1">
                {(["low", "medium", "high"] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => updateConfig({ density })}
                    className={`h-8 rounded-lg px-3 text-xs font-medium capitalize transition-all duration-200 ${
                      state?.config.density === density
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
            <div className="pointer-events-auto flex items-center gap-2">
              <span
                className={`text-xs ${btnStyles.label} tracking-wider uppercase`}
              >
                Tilt:
              </span>
              <input
                type="range"
                min="-90"
                max="90"
                value={state?.camera.horizonAngle ?? 0}
                onChange={(e) => updateHorizonAngle(Number(e.target.value))}
                className={`h-1.5 w-24 cursor-pointer appearance-none rounded-full ${btnStyles.slider}`}
              />
              <span className={`text-xs ${btnStyles.value} w-10 tabular-nums`}>
                {state?.camera.horizonAngle ?? 0}°
              </span>
            </div>

            {/* Zoom indicator */}
            <div className="pointer-events-auto flex items-center gap-2">
              <span
                className={`text-xs ${btnStyles.label} tracking-wider uppercase`}
              >
                Zoom:
              </span>
              <span className={`text-xs ${btnStyles.value} tabular-nums`}>
                {Math.round((state?.camera.zoom ?? 1) * 100)}%
              </span>
            </div>

            {/* Spacer */}
            {!isFullscreen && <div className="flex-1" />}

            {/* Reset & Export */}
            <div
              className={`pointer-events-auto flex items-center gap-2 pl-4 ${isFullscreen ? "ml-auto" : ""}`}
            >
              <button
                onClick={resetCamera}
                className={`flex h-8 items-center gap-2 rounded-lg px-4 text-xs font-medium transition-all duration-200 ${btnStyles.inactive}`}
                title="Recenter (Reset Pan/Zoom - Preserves Tilt)"
              >
                Center
              </button>
              <button
                onClick={reset}
                className={`flex h-8 items-center gap-2 rounded-lg px-4 text-xs font-medium transition-all duration-200 ${btnStyles.inactive}`}
                title="Reset Entire Grid"
              >
                Reset Grid
              </button>
              <button
                onClick={exportImage}
                className={`flex h-8 items-center gap-2 rounded-lg px-4 text-xs font-semibold transition-all duration-200 ${btnStyles.export}`}
                title="Export Image"
              >
                <ExportIcon />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative flex-1">
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
          <div
            className={`absolute right-4 z-[60] flex flex-col items-center gap-2 transition-all duration-300 ${isFullscreen ? "top-20" : "top-4"}`}
          >
            {/* Hide UI Button (Only in Fullscreen) */}
            {isFullscreen && (
              <button
                onClick={() => setHideUI(!hideUI)}
                className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all ${hideUI ? btnStyles.floatActive : btnStyles.floatInactive}`}
                title={hideUI ? "Show Controls" : "Hide Controls"}
              >
                {hideUI ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all ${btnStyles.floatInactive} ${hideUI ? "invisible opacity-0" : "visible opacity-100"}`}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <MinimizeIcon size={20} />
              ) : (
                <MaximizeIcon size={20} />
              )}
            </button>

            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all ${showHelp ? btnStyles.floatActive : btnStyles.floatInactive} ${hideUI ? "invisible opacity-0" : "visible opacity-100"}`}
              title="User Guide"
            >
              <InfoIcon size={20} />
            </button>

            {/* Grid Settings */}
            <div
              className={`relative ${hideUI ? "invisible opacity-0" : "visible opacity-100"}`}
            >
              <button
                onClick={() => setShowGridSettings(!showGridSettings)}
                className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                  showGridSettings
                    ? btnStyles.floatActive
                    : btnStyles.floatInactive
                }`}
                title="Grid Settings"
              >
                <SettingsIcon size={20} />
              </button>

              {/* Grid Settings Submenu */}
              {showGridSettings && state && (
                <div className="bg-deep-obsidian/95 animate-in fade-in slide-in-from-top-2 pointer-events-auto absolute top-full right-0 z-[70] mt-2 flex w-72 flex-col gap-4 rounded-2xl border border-white/10 p-4 shadow-2xl backdrop-blur-xl duration-200">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                      <SettingsIcon size={14} className="text-white/60" />
                      Grid Settings
                    </h3>
                    <button
                      onClick={() => setShowGridSettings(false)}
                      className="text-text-muted transition-colors hover:text-white"
                    >
                      <span className="text-lg">&times;</span>
                    </button>
                  </div>

                  {/* Opacity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-text-muted text-[10px] uppercase">
                        Line Opacity
                      </label>
                      <span className="text-[10px] text-white/70 tabular-nums">
                        {Math.round((state.config.opacity ?? 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={state.config.opacity ?? 1}
                      onChange={(e) =>
                        updateConfig({ opacity: parseFloat(e.target.value) })
                      }
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-white/60"
                    />
                  </div>

                  {/* VP Colors */}
                  <div className="space-y-3 border-t border-white/5 pt-2">
                    <label className="text-text-muted mb-1 block text-[10px] uppercase">
                      Point Colors
                    </label>

                    {/* Dynamic list of active VPs */}
                    {state.vanishingPoints
                      .filter((vp) => {
                        if (vp.id === "vp3" && state.config.type !== 3)
                          return false;
                        if (vp.id === "vp2" && state.config.type === 1)
                          return false;
                        return true;
                      })
                      .map((vp) => (
                        <div key={vp.id} className="relative">
                          <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-2 transition-colors hover:bg-white/10">
                            <span className="text-[10px] font-medium text-white/70 uppercase">
                              {vp.id.replace("vp", "Point ")}
                            </span>
                            <button
                              onClick={() =>
                                setActiveColorPicker(
                                  activeColorPicker === vp.id ? null : vp.id
                                )
                              }
                              className="group flex items-center gap-2"
                            >
                              <div
                                className="h-4 w-6 rounded border border-white/20 shadow-sm"
                                style={{ backgroundColor: vp.color }}
                              />
                            </button>
                          </div>

                          {/* Color Picker Popover */}
                          {activeColorPicker === vp.id && (
                            <div
                              ref={popoverRef}
                              className="bg-deep-obsidian animate-in fade-in slide-in-from-top-1 absolute top-full right-0 z-[80] mt-2 w-48 rounded-t-xl rounded-b-md border border-white/10 p-2 shadow-xl"
                            >
                              <div className="mb-2 flex items-center justify-between px-1">
                                <span className="text-text-muted text-[10px] font-bold uppercase">
                                  Pick Color
                                </span>
                                <button
                                  onClick={() => setActiveColorPicker(null)}
                                  className="text-text-muted transition-colors hover:text-white"
                                >
                                  <span className="text-lg leading-none">
                                    &times;
                                  </span>
                                </button>
                              </div>
                              <ColorPicker
                                color={vp.color}
                                onChange={(hex) =>
                                  updateVanishingPoint(vp.id, { color: hex })
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reference Image Button */}
            <div
              className={`relative ${hideUI ? "invisible opacity-0" : "visible opacity-100"}`}
            >
              {!state?.referenceImage ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all ${btnStyles.floatInactive}`}
                  title="Add Reference Image"
                >
                  <ImageIcon size={20} />
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {/* Visibility Toggle */}
                  <button
                    onClick={() =>
                      updateReferenceImage({
                        isVisible: !state.referenceImage?.isVisible,
                      })
                    }
                    className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                      state.referenceImage.isVisible
                        ? btnStyles.floatActive
                        : btnStyles.floatInactive
                    }`}
                    title={
                      state.referenceImage.isVisible
                        ? "Hide Reference"
                        : "Show Reference"
                    }
                  >
                    {state.referenceImage.isVisible ? (
                      <EyeIcon size={20} />
                    ) : (
                      <EyeOffIcon size={20} />
                    )}
                  </button>

                  {/* Settings Button */}
                  <button
                    onClick={() => setShowRefSubmenu(!showRefSubmenu)}
                    className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                      showRefSubmenu
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
                <div className="bg-deep-obsidian/95 animate-in fade-in slide-in-from-top-2 pointer-events-auto absolute top-full right-0 z-[70] mt-2 flex w-72 flex-col gap-4 rounded-2xl border border-white/10 p-4 shadow-2xl backdrop-blur-xl duration-200">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                      <ImageIcon size={14} className="text-white/60" />
                      Reference Settings
                    </h3>
                    <button
                      onClick={() => setShowRefSubmenu(false)}
                      className="text-text-muted transition-colors hover:text-white"
                    >
                      <span className="text-lg">&times;</span>
                    </button>
                  </div>

                  {/* Opacity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-text-muted text-[10px] uppercase">
                        Opacity
                      </label>
                      <span className="text-[10px] text-white/70 tabular-nums">
                        {Math.round((state.referenceImage?.opacity ?? 0) * 100)}
                        %
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={state.referenceImage?.opacity ?? 0.5}
                      onChange={(e) =>
                        updateReferenceImage({
                          opacity: parseFloat(e.target.value),
                        })
                      }
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-white/60"
                    />
                  </div>

                  {/* Rotation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-text-muted text-[10px] uppercase">
                        Rotation
                      </label>
                      <div className="flex gap-1">
                        {[0, 90, 180, 270].map((angle) => (
                          <button
                            key={angle}
                            onClick={() =>
                              updateReferenceImage({ rotation: angle })
                            }
                            className={`rounded px-1.5 py-0.5 text-[9px] ${state.referenceImage?.rotation === angle ? "bg-white/20 text-white" : "text-text-muted bg-white/5 hover:text-white"}`}
                          >
                            {angle}°
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateIcon size={14} className="text-text-muted" />
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
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
                        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-white/60"
                      />
                      <span className="text-text-secondary w-8 text-[10px] tabular-nums">
                        {state.referenceImage?.rotation ?? 0}°
                      </span>
                    </div>
                  </div>

                  {/* Scale (Zoom) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-text-muted text-[10px] uppercase">
                        Image Zoom
                      </label>
                      <span className="text-[10px] text-white/70 tabular-nums">
                        {Math.round((state.referenceImage?.scale ?? 1) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ZoomIcon size={14} className="text-text-muted" />
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={state.referenceImage?.scale ?? 1}
                        onChange={(e) =>
                          updateReferenceImage({
                            scale: parseFloat(e.target.value),
                          })
                        }
                        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-white/60"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        updateReferenceImage({
                          followHorizon: !state.referenceImage?.followHorizon,
                        })
                      }
                      className={`flex items-center gap-2 rounded-lg border p-2 text-[10px] font-medium transition-all ${state.referenceImage.followHorizon ? "border-white/30 bg-white/15 text-white" : "text-text-muted border-white/10 bg-white/5 hover:border-white/20 hover:text-white"}`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full border ${state.referenceImage.followHorizon ? "border-white bg-white" : "border-text-muted"}`}
                      />
                      Sync Tilt
                    </button>
                    <button
                      onClick={() =>
                        updateReferenceImage({
                          followZoom: !state.referenceImage?.followZoom,
                        })
                      }
                      className={`flex items-center gap-2 rounded-lg border p-2 text-[10px] font-medium transition-all ${state.referenceImage.followZoom ? "border-white/30 bg-white/15 text-white" : "text-text-muted border-white/10 bg-white/5 hover:border-white/20 hover:text-white"}`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full border ${state.referenceImage.followZoom ? "border-white bg-white" : "border-text-muted"}`}
                      />
                      Sync Zoom
                    </button>
                    <button
                      onClick={() =>
                        updateReferenceImage({
                          isInteractive: !state.referenceImage?.isInteractive,
                        })
                      }
                      className={`flex items-center gap-2 rounded-lg border p-2 text-[10px] font-medium transition-all ${state.referenceImage.isInteractive ? "border-white/30 bg-white/15 text-white" : "text-text-muted border-white/10 bg-white/5 hover:border-white/20 hover:text-white"}`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full border ${state.referenceImage.isInteractive ? "border-white bg-white" : "border-text-muted"}`}
                      />
                      Move Handle
                    </button>
                    <button
                      onClick={resetReferenceImage}
                      className="text-text-muted flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 text-[10px] font-medium transition-all hover:bg-white/10 hover:text-white"
                    >
                      Reset Pos
                    </button>
                  </div>

                  <div className="mt-1 flex gap-2 border-t border-white/5 pt-2">
                    <button
                      onClick={clearReferenceImage}
                      className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 text-xs font-medium text-red-400 transition-all hover:bg-red-500/15"
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
            <div className="bg-deep-obsidian absolute inset-0 flex items-center justify-center">
              <div className="text-text-muted text-sm">Loading...</div>
            </div>
          )}

          {/* Help Balloon Centered with Backdrop (Relative to Canvas) */}
          {showHelp && (
            <div
              className={`bg-deep-obsidian/30 absolute inset-0 z-[100] flex items-center justify-center ${
                isExiting ? "animate-backdrop-unfade" : "animate-backdrop-fade"
              }`}
              onClick={handleCloseHelp}
            >
              <div
                className={`glass border-glass-border z-[101] w-full max-w-[680px] rounded-2xl border p-8 shadow-2xl ${
                  isExiting ? "animate-balloon-exit" : "animate-balloon-enter"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="border-glass-border flex items-center justify-between border-b pb-4">
                    <h3 className="text-aqua text-xl font-bold tracking-widest uppercase">
                      User Guide
                    </h3>
                    <button
                      onClick={handleCloseHelp}
                      className="text-text-muted transition-colors hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex gap-8">
                    {/* Left Column: Controls & Actions */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h4 className="text-gold mb-3 text-sm font-bold tracking-wider uppercase">
                          Controls & Actions
                        </h4>
                        <ul className="text-text-secondary space-y-3 text-sm">
                          <li>
                            •{" "}
                            <span className="text-aqua font-semibold">
                              Click and drag
                            </span>{" "}
                            points to change perspective
                          </li>
                          <li>
                            • Use{" "}
                            <span className="text-gold font-semibold">
                              scroll
                            </span>{" "}
                            to zoom any area
                          </li>
                          <li>
                            •{" "}
                            <span className="text-magenta font-semibold">
                              Click and drag
                            </span>{" "}
                            empty space to navigate
                          </li>
                          <li>
                            • Click{" "}
                            <span className="text-text-primary font-semibold">
                              Reset
                            </span>{" "}
                            to restore default grid state
                          </li>
                          <li>
                            • Click{" "}
                            <span className="text-aqua font-semibold">
                              Export
                            </span>{" "}
                            to save high-res 1080p image
                          </li>
                          <li>
                            • Use{" "}
                            <span className="text-emerald font-semibold">
                              Add Ref
                            </span>{" "}
                            to overlay an image for study
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Interface */}
                    <div className="flex-[1.8]">
                      <h4 className="text-gold mb-3 text-sm font-bold tracking-wider uppercase">
                        Interface
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-medium-grey/20 hover:bg-medium-grey/30 rounded-lg border border-white/5 p-3 transition-colors">
                          <strong className="text-text-primary mb-1 block text-xs">
                            Vanishing Points
                          </strong>
                          <p className="text-text-secondary text-[10px] leading-relaxed">
                            Click and drag on the vanishing points to move them
                            directly.
                          </p>
                        </div>
                        <div className="bg-medium-grey/20 hover:bg-medium-grey/30 rounded-lg border border-white/5 p-3 transition-colors">
                          <strong className="text-text-primary mb-1 block text-xs">
                            Points
                          </strong>
                          <p className="text-text-secondary text-[10px] leading-relaxed">
                            Changes the number of vanishing points.
                          </p>
                        </div>
                        <div className="bg-medium-grey/20 hover:bg-medium-grey/30 rounded-lg border border-white/5 p-3 transition-colors">
                          <strong className="text-text-primary mb-1 block text-xs">
                            Density
                          </strong>
                          <p className="text-text-secondary text-[10px] leading-relaxed">
                            Frequency of grid lines.
                          </p>
                        </div>
                        <div className="bg-medium-grey/20 hover:bg-medium-grey/30 rounded-lg border border-white/5 p-3 transition-colors">
                          <strong className="text-text-primary mb-1 block text-xs">
                            Tilt
                          </strong>
                          <p className="text-text-secondary text-[10px] leading-relaxed">
                            Changes the angle of inclination of the horizon
                            line.
                          </p>
                        </div>
                        <div className="bg-medium-grey/20 hover:bg-medium-grey/30 rounded-lg border border-white/5 p-3 transition-colors">
                          <strong className="text-text-primary mb-1 flex items-center gap-1.5 text-xs">
                            <MaximizeIcon size={12} className="text-aqua" />
                            Fullscreen
                          </strong>
                          <p className="text-text-secondary text-[10px] leading-relaxed">
                            Expands the grid to fill the browser window.
                          </p>
                        </div>
                        <div className="bg-medium-grey/20 hover:bg-medium-grey/30 rounded-lg border border-white/5 p-3 transition-colors">
                          <strong className="text-text-primary mb-1 flex items-center gap-1.5 text-xs">
                            <EyeIcon size={12} className="text-aqua" />
                            Hide UI
                          </strong>
                          <p className="text-text-secondary text-[10px] leading-relaxed">
                            Hides all controls for a clean view (Fullscreen
                            only).
                          </p>
                        </div>
                        <div className="bg-medium-grey/20 hover:bg-medium-grey/30 col-span-2 rounded-lg border border-white/5 p-3 transition-colors">
                          <strong className="mb-1 flex items-center gap-1.5 tracking-tighter">
                            Colored Circles
                          </strong>
                          <p className="text-text-secondary text-[10px] leading-relaxed">
                            The colored circles on the screen are the controls
                            for the vanishing points of their respective colors.
                            Click and drag them to move the vanishing points.
                          </p>
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
