/**
 * @module ArtisticBackground
 * @description Interactive ambient background combining a live watercolor drawing canvas
 * with floating animated SVG brush strokes.
 *
 * ### UX flow
 * 1. Page loads — brush button is white, no colour selected, drawing is inactive.
 * 2. User clicks the button → panel opens.
 * 3. User picks a colour → panel closes, drawing activates, button adopts that colour.
 * 4. User paints freely; button stays coloured as a status indicator.
 * 5. User clicks the button again → panel opens over current selection.
 * 6. Clicking the *same* colour deactivates the brush (button returns to white).
 *    Clicking a *different* colour swaps the active colour and closes the panel.
 * 7. A native colour picker is included in the panel; it opens pre-loaded with the
 *    currently active pastel and converts any picked colour into a drawable entry.
 *
 * A static "Paint the background!" hint (cursive text + curved arrow) points toward
 * the button until the brush is activated for the first time.
 *
 * Event listeners are attached to `document` (not the canvas) so the negative
 * z-index of the background layer never blocks pointer events.
 *
 * @requires globals.css — add the gentle-float and panel-in keyframes (see @note below).
 */
"use client";

import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ─── Palette & Path Constants ─────────────────────────────────────────────────

const WATERCOLOR_PALETTE = [
  { name: "Ocean",  hex: "#5B8FB9", rgb: "91, 143, 185"  },
  { name: "Coral",  hex: "#E07A5F", rgb: "224, 122, 95"  },
  { name: "Violet", hex: "#8B6BB5", rgb: "139, 107, 181" },
  { name: "Sage",   hex: "#81B29A", rgb: "129, 178, 154" },
  { name: "Amber",  hex: "#F2CC8F", rgb: "242, 204, 143" },
  { name: "Rose",   hex: "#D4899A", rgb: "212, 137, 154" },
  { name: "Ink",    hex: "#3D3D4E", rgb: "61, 61, 78"    },
] as const;

type BuiltinColor = (typeof WATERCOLOR_PALETTE)[number];

interface DrawableColor {
  name: string;
  hex: string;
  rgb: string;
}

const BRUSH_PATHS = [
  "M10,25 Q30,5 60,20 T110,15 Q140,10 160,25 Q180,40 150,45 Q120,50 90,40 T30,45 Q5,42 10,25Z",
  "M5,20 Q25,2 55,18 T100,12 Q130,8 155,22 Q175,38 145,42 Q115,48 85,38 T25,42 Q0,38 5,20Z",
  "M8,30 Q35,8 65,22 Q95,36 125,18 Q155,4 180,20 Q195,35 165,42 Q135,50 100,38 Q65,48 35,42 Q5,48 8,30Z",
  "M15,22 Q40,5 70,18 T120,10 Q150,5 170,22 Q185,38 155,44 Q125,50 95,36 T40,44 Q10,40 15,22Z",
] as const;

const AMBIENT_COLORS = [
  "rgba(91, 143, 185, 0.07)",
  "rgba(224, 122, 95, 0.06)",
  "rgba(139, 107, 181, 0.06)",
  "rgba(129, 178, 154, 0.05)",
  "rgba(242, 204, 143, 0.06)",
] as const;

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, [role="button"], [data-no-paint]';

// ─── Colour Utilities ─────────────────────────────────────────────────────────

function hexToRgbString(hex: string): string {
  const clean = hex.replace("#", "");
  const full  = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

// ─── Ambient Brush Stroke (SVG layer) ────────────────────────────────────────

interface BrushStrokeProps {
  path: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
  duration: number;
}

const BrushStroke: FC<BrushStrokeProps> = ({
  path, color, x, y, rotation, scale, delay, duration,
}) => (
  <svg
    className="pointer-events-none absolute"
    style={
      {
        left: `${x}%`,
        top: `${y}%`,
        width: `${180 * scale}px`,
        height: `${60 * scale}px`,
        "--stroke-rot": `${rotation}deg`,
        animation: `gentle-float ${duration}s ease-in-out ${delay}s infinite`,
      } as React.CSSProperties
    }
    viewBox="0 0 200 60"
    fill="none"
    aria-hidden="true"
  >
    <path d={path} fill={color} />
  </svg>
);

// ─── Canvas Watercolor Utilities ──────────────────────────────────────────────

interface CanvasPoint { x: number; y: number }

function drawWatercolorSplat(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  radius: number, rgb: string,
): void {
  for (let i = 0; i < 9; i++) {
    const jx    = (Math.random() - 0.5) * radius * 0.95;
    const jy    = (Math.random() - 0.5) * radius * 0.95;
    const r     = radius * (0.35 + Math.random() * 0.85);
    const alpha = 0.018 + Math.random() * 0.032;

    ctx.beginPath();
    ctx.arc(x + jx, y + jy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
    ctx.fill();
  }
}

function drawWatercolorStroke(
  ctx: CanvasRenderingContext2D,
  from: CanvasPoint, to: CanvasPoint,
  radius: number, rgb: string,
): void {
  const dx    = to.x - from.x;
  const dy    = to.y - from.y;
  const dist  = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(1, Math.floor(dist / (radius * 0.28)));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    drawWatercolorSplat(ctx, from.x + dx * t, from.y + dy * t, radius, rgb);
  }
}

// ─── Static Brush Hint ────────────────────────────────────────────────────────

const BrushHint: FC = () => (
  <div
    style={{
      position: "fixed",
      bottom: "67.5px",
      right: "78px",
      pointerEvents: "none",
      zIndex: 49,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "2px",
    }}
    aria-hidden="true"
  >
    <span
      style={{
        fontFamily:
          "'Segoe Script', 'Brush Script MT', 'Comic Sans MS', cursive",
        fontSize: "20px",
        color: "#E07A5F",
        whiteSpace: "nowrap",
        lineHeight: 1.1,
        textShadow: "0 1px 8px rgba(255,255,255,0.55)",
        opacity: 0.92,
        marginRight: "4px",
        animation: "hint-bob 2.5s ease-in-out infinite",
      }}
    >
      Paint the background!
    </span>

    <svg
      width="50"
      height="45"
      viewBox="0 0 60 52"
      fill="none"
      style={{ alignSelf: "flex-end", animation: "hint-bob 2.5s ease-in-out 0.3s infinite" }}
    >
      <path
        d="M6,4 C12,22 34,30 52,46"
        stroke="#E07A5F"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.82"
      />
      <path
        d="M52,46 L40,41 M52,46 L48,34"
        stroke="#E07A5F"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.82"
      />
    </svg>
  </div>
);

// ─── Click Outside Hook ───────────────────────────────────────────────────────

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener("mousedown", listener, { capture: true });
    document.addEventListener("touchstart", listener, { capture: true });

    return () => {
      document.removeEventListener("mousedown", listener, { capture: true });
      document.removeEventListener("touchstart", listener, { capture: true });
    };
  }, [ref, handler, enabled]);
}

// ─── Drawing Toolbar ──────────────────────────────────────────────────────────

interface DrawingToolbarProps {
  selectedColor: DrawableColor | null;
  panelOpen: boolean;
  onTogglePanel: () => void;
  onSelectColor: (color: DrawableColor) => void;
  onDeactivateColor: () => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isEraser: boolean;
  onToggleEraser: () => void;
}

const DrawingToolbar: FC<DrawingToolbarProps> = ({
  selectedColor,
  panelOpen,
  onTogglePanel,
  onSelectColor,
  onDeactivateColor,
  brushSize,
  onBrushSizeChange,
  onClear,
  onUndo,
  canUndo,
  isEraser,
  onToggleEraser,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useClickOutside(panelRef, () => {
    if (panelOpen) onTogglePanel();
  }, panelOpen);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      style={{ pointerEvents: "auto" }}
    >
      {/* ── Expanded control panel ── */}
      {panelOpen && (
        <div
          ref={panelRef}
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "18px",
            padding: "20px",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            minWidth: "220px",
            animation: "panel-in 0.2s ease",
            position: "relative",
          }}
          role="toolbar"
          aria-label="Drawing controls"
        >
          {/* Close button X */}
          <button
            onClick={onTogglePanel}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.06)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "rgba(0,0,0,0.5)",
              transition: "background 0.15s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.06)";
            }}
            aria-label="Close panel"
          >
            ✕
          </button>

          {/* Colour swatches */}
          <div style={{ paddingTop: "4px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "rgba(0,0,0,0.35)",
                marginBottom: "8px",
              }}
            >
              COLOUR
            </p>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              {WATERCOLOR_PALETTE.map((color: BuiltinColor) => {
                const isActive = selectedColor?.hex === color.hex;
                return (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => onSelectColor(color)}
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: color.hex,
                      border: isActive
                        ? "3px solid rgba(0,0,0,0.45)"
                        : "2.5px solid rgba(255,255,255,0.7)",
                      cursor: "pointer",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      transform: isActive ? "scale(1.22)" : "scale(1)",
                      boxShadow: isActive ? `0 2px 8px ${color.hex}88` : "none",
                      outline: "none",
                    }}
                    aria-label={`Colour ${color.name}`}
                    aria-pressed={isActive}
                  />
                );
              })}
            </div>
          </div>

          {/* Brush size slider */}
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "rgba(0,0,0,0.35)",
                marginBottom: "8px",
              }}
            >
              SIZE — {brushSize}px
            </p>
            <input
              type="range"
              min={2}
              max={24}
              step={1}
              value={brushSize}
              onChange={(e) => onBrushSizeChange(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: selectedColor?.hex ?? "#E07A5F",
              }}
              aria-label="Brush size"
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            {selectedColor && (
              <button
                onClick={onDeactivateColor}
                style={{
                  fontSize: "12px",
                  color: "rgba(0,0,0,0.45)",
                  background: "none",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "10px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  transition: "background 0.15s ease, color 0.15s ease",
                  letterSpacing: "0.02em",
                  flex: 1,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.70)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "none";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.45)";
                }}
                aria-label="Remove colour"
              >
                ✕ Remove colour
              </button>
            )}
            <button
              onClick={onClear}
              style={{
                fontSize: "12px",
                color: "rgba(0,0,0,0.45)",
                background: "none",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: "10px",
                padding: "6px 12px",
                cursor: "pointer",
                transition: "background 0.15s ease, color 0.15s ease",
                letterSpacing: "0.02em",
                flex: 1,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.70)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.45)";
              }}
              aria-label="Clear canvas"
            >
              🗑 Clear canvas
            </button>
          </div>
        </div>
      )}

      {/* ── Action buttons row (undo + eraser + brush) ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Undo button — only when colour is selected */}
        {selectedColor && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo last stroke"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: canUndo ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.60)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(0,0,0,0.10)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              cursor: canUndo ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              outline: "none",
              opacity: canUndo ? 1 : 0.5,
            }}
            aria-label="Undo last stroke"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </button>
        )}

        {/* Eraser button — only when colour is selected */}
        {selectedColor && (
          <button
            onClick={onToggleEraser}
            title={isEraser ? "Switch to brush" : "Switch to eraser"}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: isEraser ? "rgba(61, 61, 78, 0.85)" : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: isEraser ? "none" : "1.5px solid rgba(0,0,0,0.10)",
              boxShadow: isEraser
                ? "0 6px 24px rgba(61,61,78,0.40)"
                : "0 4px 16px rgba(0,0,0,0.12)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              outline: "none",
            }}
            aria-label={isEraser ? "Switch to brush" : "Switch to eraser"}
            aria-pressed={isEraser}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isEraser ? "#fff" : "#888"}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 3l-9.5 9.5-5 5L3 19l2 2 2.5-1.5 5-5L22 5l-3-2z" />
              <path d="M15 7l3 3" />
              <path d="M8.5 13.5L11 16" />
            </svg>
          </button>
        )}

        {/* ── Brush toggle button ── */}
        <button
          onClick={onTogglePanel}
          title={selectedColor ? "Drawing options" : "Start painting"}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: selectedColor ? selectedColor.hex : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: selectedColor ? "none" : "1.5px solid rgba(0,0,0,0.10)",
            boxShadow: selectedColor
              ? `0 6px 24px ${selectedColor.hex}66`
              : "0 4px 16px rgba(0,0,0,0.12)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: panelOpen ? "scale(1.1) rotate(-15deg)" : "scale(1) rotate(0deg)",
            outline: "none",
          }}
          aria-label={selectedColor ? "Drawing options" : "Start painting"}
          aria-expanded={panelOpen}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={selectedColor ? "#fff" : "#888"}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 17L12 8l4 4-9 9H3v-4z" />
            <path d="M12.5 6.5l2-2a2.121 2.121 0 013 3l-2 2" />
            <circle cx="19" cy="5" r="1.4" fill={selectedColor ? "#fff" : "#888"} stroke="none" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function ArtisticBackground() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef   = useRef<CanvasPoint | null>(null);

  const [selectedColor, setSelectedColor] = useState<DrawableColor | null>(null);
  const [brushSize,     setBrushSize]     = useState(8);
  const [panelOpen,     setPanelOpen]     = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  /** Undo history — stores canvas snapshots after each stroke. */
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // ── Resize handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const snapshot = document.createElement("canvas");
      snapshot.width  = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext("2d")?.drawImage(canvas, 0, 0);

      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.getContext("2d")?.drawImage(snapshot, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Inject animation keyframes once into <head> ───────────────────────────
  useEffect(() => {
    const STYLE_ID = "artistic-bg-keyframes";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes gentle-float {
        0%, 100% { transform: translateY(0px)   rotate(var(--stroke-rot, 0deg)); }
        33%       { transform: translateY(-14px) rotate(var(--stroke-rot, 0deg)); }
        66%       { transform: translateY(-8px)  rotate(var(--stroke-rot, 0deg)); }
      }
      @keyframes panel-in {
        from { opacity: 0; transform: translateY(8px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)   scale(1);    }
      }
      @keyframes hint-bob {
        0%, 100% { transform: translateY(0px); }
        50%      { transform: translateY(-8px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(STYLE_ID)?.remove();
  }, []);

  /** Clears all user-painted marks from the drawing canvas. */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
      setHistoryStep(-1);
    }
  }, []);

  /** Saves current canvas state to history for undo. */
  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyStep + 1);
      return [...trimmed, imageData];
    });
    setHistoryStep((prev) => prev + 1);
  }, [historyStep]);

  /** Restores canvas from a history snapshot. */
  const restoreHistory = useCallback((imageData: ImageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.putImageData(imageData, 0, 0);
  }, []);

  /** Undo last stroke. */
  const handleUndo = useCallback(() => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setHistoryStep(prevStep);
      restoreHistory(history[prevStep]);
    } else if (historyStep === 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHistoryStep(-1);
    }
  }, [history, historyStep, restoreHistory]);

  /** Handles a colour swatch click — panel stays open. */
  const handleSelectColor = useCallback((color: DrawableColor) => {
    setSelectedColor((prev) => {
      if (prev?.hex === color.hex) {
        setIsEraser(false);
        return null;
      }
      setHasActivated(true);
      setIsEraser(false);
      return color;
    });
    // NÃO fecha o painel ao selecionar cor
  }, []);

  /** Deactivates the current colour (remove colour button). */
  const handleDeactivateColor = useCallback(() => {
    setSelectedColor(null);
    setIsEraser(false);
  }, []);

  /** Toggles eraser mode. */
  const handleToggleEraser = useCallback(() => {
    setIsEraser((prev) => !prev);
  }, []);

  const getCanvasPoint = useCallback((e: MouseEvent | TouchEvent): CanvasPoint => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  }, []);

  // ── Document-level drawing events ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedColor) return;

    const rgb = selectedColor.rgb;

    const onPointerStart = (e: MouseEvent | TouchEvent) => {
      const target = (e.target ?? e.currentTarget) as HTMLElement | null;
      if (target?.closest(INTERACTIVE_SELECTOR)) return;

      isDrawingRef.current = true;
      const pos = getCanvasPoint(e);
      lastPosRef.current = pos;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (isEraser) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
        } else {
          drawWatercolorSplat(ctx, pos.x, pos.y, brushSize, rgb);
        }
      }
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      const ctx = canvas.getContext("2d");
      const pos = getCanvasPoint(e);
      if (ctx && lastPosRef.current) {
        if (isEraser) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.lineWidth = brushSize * 2;
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.globalCompositeOperation = "source-over";
        } else {
          drawWatercolorStroke(ctx, lastPosRef.current, pos, brushSize, rgb);
        }
      }
      lastPosRef.current = pos;
    };

    const onPointerEnd = () => {
      if (isDrawingRef.current) {
        saveHistory();
      }
      isDrawingRef.current = false;
      lastPosRef.current   = null;
    };

    document.addEventListener("mousedown",  onPointerStart);
    document.addEventListener("mousemove",  onPointerMove);
    document.addEventListener("mouseup",    onPointerEnd);
    document.addEventListener("touchstart", onPointerStart, { passive: true });
    document.addEventListener("touchmove",  onPointerMove,  { passive: true });
    document.addEventListener("touchend",   onPointerEnd);

    return () => {
      document.removeEventListener("mousedown",  onPointerStart);
      document.removeEventListener("mousemove",  onPointerMove);
      document.removeEventListener("mouseup",    onPointerEnd);
      document.removeEventListener("touchstart", onPointerStart);
      document.removeEventListener("touchmove",  onPointerMove);
      document.removeEventListener("touchend",   onPointerEnd);
      isDrawingRef.current = false;
      lastPosRef.current   = null;
    };
  }, [selectedColor, brushSize, getCanvasPoint, isEraser, saveHistory]);

  /** Deterministic ambient stroke layout. */
  const ambientStrokes = useMemo<BrushStrokeProps[]>(() => (
    Array.from({ length: 8 }, (_, i) => ({
      path:     BRUSH_PATHS[i % BRUSH_PATHS.length],
      color:    AMBIENT_COLORS[i % AMBIENT_COLORS.length],
      x:        (i * 14 + 5) % 90,
      y:        (i * 13 + 3) % 85,
      rotation: (i * 47) % 360,
      scale:    0.8 + (i % 3) * 0.4,
      delay:    i * 0.8,
      duration: 12 + (i % 4) * 3,
    }))
  ), []);

  return (
    <>
      {/* ── Background layer (z-index: -10) ─────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Warm ambient gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 15% 85%, rgba(242, 204, 143, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 15%, rgba(139, 107, 181, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(212, 207, 197, 0.06) 0%, transparent 60%)
            `,
          }}
        />

        {ambientStrokes.map((stroke, i) => (
          <BrushStroke key={i} {...stroke} />
        ))}

        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ pointerEvents: "none", touchAction: "none" }}
          aria-label="Interactive drawing canvas"
          role="img"
        />
      </div>

      {/* ── Static brush hint ────────────────────────────────────────────── */}
      {!hasActivated && <BrushHint />}

      {/* ── Floating toolbar ─────────────────────────────────────────────── */}
      <DrawingToolbar
        selectedColor={selectedColor}
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((prev) => !prev)}
        onSelectColor={handleSelectColor}
        onDeactivateColor={handleDeactivateColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onClear={clearCanvas}
        onUndo={handleUndo}
        canUndo={historyStep >= 0}
        isEraser={isEraser}
        onToggleEraser={handleToggleEraser}
      />
    </>
  );
}