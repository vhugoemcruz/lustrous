/**
 * @module ArtisticBackground
 * @description Interactive ambient background combining a live watercolor drawing canvas
 * with floating animated SVG brush strokes. Visitors can paint directly onto the
 * background at any time — no mode toggle required. A minimal floating toolbar
 * (bottom-right) opens a palette for colour, brush size, and canvas clearing.
 *
 * Event listeners are attached to `document` rather than the canvas element so
 * that the negative z-index of the background layer never blocks pointer events.
 * Clicks on interactive page elements (links, buttons, inputs…) are automatically
 * excluded from drawing via a closest-ancestor guard.
 *
 * @requires globals.css — the gentle-float and panel-in keyframes (see bottom of file).
 */
"use client";

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Palette & Path Constants ─────────────────────────────────────────────────

/**
 * Watercolor palette exposed through the drawing toolbar.
 * Each entry carries both a hex value (for the UI swatch) and a pre-computed
 * RGB string that feeds directly into canvas `rgba()` calls.
 *
 * Coral (`index 1`) is the default — warm and inviting for an art platform.
 */
const WATERCOLOR_PALETTE = [
  { name: "Ocean", hex: "#5B8FB9", rgb: "91, 143, 185" },
  { name: "Coral", hex: "#E07A5F", rgb: "224, 122, 95" }, // ← default
  { name: "Violet", hex: "#8B6BB5", rgb: "139, 107, 181" },
  { name: "Sage", hex: "#81B29A", rgb: "129, 178, 154" },
  { name: "Amber", hex: "#F2CC8F", rgb: "242, 204, 143" },
  { name: "Rose", hex: "#D4899A", rgb: "212, 137, 154" },
  { name: "Ink", hex: "#3D3D4E", rgb: "61, 61, 78" },
] as const;

type PaletteColor = (typeof WATERCOLOR_PALETTE)[number];

/** SVG path data for organic brush stroke shapes used in the ambient floating layer. */
const BRUSH_PATHS = [
  "M10,25 Q30,5 60,20 T110,15 Q140,10 160,25 Q180,40 150,45 Q120,50 90,40 T30,45 Q5,42 10,25Z",
  "M5,20 Q25,2 55,18 T100,12 Q130,8 155,22 Q175,38 145,42 Q115,48 85,38 T25,42 Q0,38 5,20Z",
  "M8,30 Q35,8 65,22 Q95,36 125,18 Q155,4 180,20 Q195,35 165,42 Q135,50 100,38 Q65,48 35,42 Q5,48 8,30Z",
  "M15,22 Q40,5 70,18 T120,10 Q150,5 170,22 Q185,38 155,44 Q125,50 95,36 T40,44 Q10,40 15,22Z",
] as const;

/** Fill colours for the purely decorative ambient floating strokes. */
const AMBIENT_COLORS = [
  "rgba(91, 143, 185, 0.07)",
  "rgba(224, 122, 95, 0.06)",
  "rgba(139, 107, 181, 0.06)",
  "rgba(129, 178, 154, 0.05)",
  "rgba(242, 204, 143, 0.06)",
] as const;

/**
 * CSS selector for interactive elements that should NOT trigger drawing.
 * Any pointer-down on one of these (or their descendants) is ignored by the canvas.
 */
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, [role="button"], [data-no-paint]';

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

/**
 * Individual floating ambient brush stroke element.
 * Uses a CSS custom property (`--stroke-rot`) so the `gentle-float` keyframe
 * can preserve each stroke's unique rotation while translating vertically.
 * Purely decorative — pointer events and screen-reader visibility are disabled.
 */
const BrushStroke: FC<BrushStrokeProps> = ({
  path,
  color,
  x,
  y,
  rotation,
  scale,
  delay,
  duration,
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

interface CanvasPoint {
  x: number;
  y: number;
}

/**
 * Renders a single watercolor splat at the given canvas position.
 *
 * Simulates the translucent, layered nature of watercolor by drawing multiple
 * overlapping circles with randomised position offsets, size jitter, and very
 * low opacity — stacking up to produce the characteristic soft pigment bloom.
 *
 * @param ctx    - Canvas 2D rendering context
 * @param x      - Splat centre X in canvas pixels
 * @param y      - Splat centre Y in canvas pixels
 * @param radius - Base brush radius; individual circles vary within ±80 %
 * @param rgb    - Pre-computed RGB string, e.g. `"91, 143, 185"`
 */
function drawWatercolorSplat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rgb: string
): void {
  const LAYER_COUNT = 9;

  for (let i = 0; i < LAYER_COUNT; i++) {
    const jitterX = (Math.random() - 0.5) * radius * 0.95;
    const jitterY = (Math.random() - 0.5) * radius * 0.95;
    const r = radius * (0.35 + Math.random() * 0.85);
    const alpha = 0.018 + Math.random() * 0.032;

    ctx.beginPath();
    ctx.arc(x + jitterX, y + jitterY, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
    ctx.fill();
  }
}

/**
 * Interpolates between two canvas points and deposits watercolor splats along
 * the path, keeping strokes visually smooth even during rapid mouse movement.
 *
 * Step distance is proportional to brush radius so mark density stays consistent
 * regardless of stroke speed.
 *
 * @param ctx    - Canvas 2D rendering context
 * @param from   - Starting point of this segment
 * @param to     - Ending point of this segment
 * @param radius - Brush radius forwarded to `drawWatercolorSplat`
 * @param rgb    - RGB colour string forwarded to `drawWatercolorSplat`
 */
function drawWatercolorStroke(
  ctx: CanvasRenderingContext2D,
  from: CanvasPoint,
  to: CanvasPoint,
  radius: number,
  rgb: string
): void {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(1, Math.floor(dist / (radius * 0.28)));

  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    drawWatercolorSplat(ctx, from.x + dx * t, from.y + dy * t, radius, rgb);
  }
}

// ─── Drawing Toolbar ──────────────────────────────────────────────────────────

interface DrawingToolbarProps {
  panelOpen: boolean;
  onTogglePanel: () => void;
  selectedColor: PaletteColor;
  onSelectColor: (color: PaletteColor) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
}

/**
 * Floating drawing toolbar rendered at `z-index: 50`, always above page content.
 *
 * The toggle button permanently reflects the active brush colour as a continuous
 * visual cue. Clicking it reveals or hides the control panel without affecting
 * drawing (which is always active).
 */
const DrawingToolbar: FC<DrawingToolbarProps> = ({
  panelOpen,
  onTogglePanel,
  selectedColor,
  onSelectColor,
  brushSize,
  onBrushSizeChange,
  onClear,
}) => (
  <div
    className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3"
    style={{ pointerEvents: "auto" }}
  >
    {/* ── Expanded control panel ── */}
    {panelOpen && (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "18px",
          padding: "16px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          minWidth: "170px",
          animation: "panel-in 0.2s ease",
        }}
        role="toolbar"
        aria-label="Controles de desenho"
      >
        {/* Colour swatches */}
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
            COR
          </p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {WATERCOLOR_PALETTE.map((color) => {
              const isActive = selectedColor.name === color.name;
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
                  aria-label={`Cor ${color.name}`}
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
            TAMANHO — {brushSize}px
          </p>
          <input
            type="range"
            min={8}
            max={60}
            step={1}
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            style={{ width: "100%", accentColor: selectedColor.hex }}
            aria-label="Tamanho do pincel"
          />
        </div>

        {/* Clear canvas button */}
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
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(0,0,0,0.06)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(0,0,0,0.70)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "none";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(0,0,0,0.45)";
          }}
          aria-label="Limpar canvas"
        >
          🗑 Limpar canvas
        </button>
      </div>
    )}

    {/* ── Toggle button — colour always matches the active brush ── */}
    <button
      onClick={onTogglePanel}
      title={panelOpen ? "Fechar painel" : "Abrir painel de pintura"}
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: selectedColor.hex,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "none",
        boxShadow: `0 6px 24px ${selectedColor.hex}66`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: panelOpen
          ? "scale(1.1) rotate(-15deg)"
          : "scale(1) rotate(0deg)",
        outline: "none",
      }}
      aria-label={panelOpen ? "Fechar painel" : "Abrir painel de pintura"}
      aria-expanded={panelOpen}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 17L12 8l4 4-9 9H3v-4z" />
        <path d="M12.5 6.5l2-2a2.121 2.121 0 013 3l-2 2" />
        <circle cx="19" cy="5" r="1.4" fill="#fff" stroke="none" />
      </svg>
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * ArtisticBackground component.
 *
 * Renders a layered, interactive artistic background composed of:
 *
 * 1. **Warm gradient overlay** — multi-point radial gradients for soft ambient depth.
 * 2. **Floating ambient brush strokes** — eight SVG shapes animated with `gentle-float`.
 * 3. **Interactive drawing canvas** — always active; visitors paint freely at any time.
 * 4. **Floating toolbar** — bottom-right button that opens colour/size/clear controls.
 *
 * ### Why document-level events?
 * The canvas lives at `z-index: -10` so page content renders above it. Attaching
 * listeners directly to the canvas element would fail because higher-z elements
 * (layout wrappers, Next.js internals, etc.) intercept pointer events first.
 * By listening on `document`, we receive every event regardless of which element
 * it physically hit. An `INTERACTIVE_SELECTOR` guard then prevents drawing when
 * the user is genuinely clicking a link, button, or input.
 *
 * @example
 * // app/layout.tsx
 * import { ArtisticBackground } from "@/components/ArtisticBackground";
 *
 * export default function Layout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ArtisticBackground />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 *
 * @note Add to globals.css:
 * ```css
 * \@keyframes gentle-float {
 *   0%, 100% { transform: translateY(0px)   rotate(var(--stroke-rot, 0deg)); }
 *   33%       { transform: translateY(-14px) rotate(var(--stroke-rot, 0deg)); }
 *   66%       { transform: translateY(-8px)  rotate(var(--stroke-rot, 0deg)); }
 * }
 * \@keyframes panel-in {
 *   from { opacity: 0; transform: translateY(8px) scale(0.97); }
 *   to   { opacity: 1; transform: translateY(0)   scale(1);    }
 * }
 * ```
 */
export function ArtisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<CanvasPoint | null>(null);

  /** Coral (index 1) is the default — warm and inviting for an art platform. */
  const [selectedColor, setSelectedColor] = useState<PaletteColor>(
    WATERCOLOR_PALETTE[1]
  );
  const [brushSize, setBrushSize] = useState(24);
  const [panelOpen, setPanelOpen] = useState(false);

  // ── Resize handler — preserve existing painting across window resizes ──────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      /** Snapshot the current drawing before the canvas dimensions reset. */
      const snapshot = document.createElement("canvas");
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext("2d")?.drawImage(canvas, 0, 0);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      /** Restore the snapshot so paintings survive window resizes. */
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
    `;
    document.head.appendChild(style);
    return () => document.getElementById(STYLE_ID)?.remove();
  }, []);

  /** Clears all user-painted marks from the drawing canvas. */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  /**
   * Extracts viewport coordinates from a MouseEvent or TouchEvent.
   *
   * Since the canvas covers the entire viewport (`position: fixed; inset: 0`),
   * `clientX / clientY` map directly to canvas pixel coordinates without any
   * bounding-rect adjustment.
   */
  const getCanvasPoint = useCallback(
    (e: MouseEvent | TouchEvent): CanvasPoint => {
      if ("touches" in e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    },
    []
  );

  // ── Document-level drawing events ────────────────────────────────────────
  //
  // Listeners are attached to `document` instead of the canvas element.
  // The canvas sits at z-index -10, so any wrapper div or Next.js layout element
  // at z-index 0+ would intercept canvas-level events and silently drop them.
  // Document-level listeners receive every event after bubbling, regardless of
  // which element was the original target.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /** Begin a new stroke — skip if the click lands on an interactive element. */
    const onPointerStart = (e: MouseEvent | TouchEvent) => {
      const target = (e.target ?? e.currentTarget) as HTMLElement | null;
      if (target?.closest(INTERACTIVE_SELECTOR)) return;

      isDrawingRef.current = true;
      const pos = getCanvasPoint(e);
      lastPosRef.current = pos;

      const ctx = canvas.getContext("2d");
      if (ctx)
        drawWatercolorSplat(ctx, pos.x, pos.y, brushSize, selectedColor.rgb);
    };

    /** Continue the stroke as the pointer moves across the document. */
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;

      const ctx = canvas.getContext("2d");
      const pos = getCanvasPoint(e);

      if (ctx && lastPosRef.current) {
        drawWatercolorStroke(
          ctx,
          lastPosRef.current,
          pos,
          brushSize,
          selectedColor.rgb
        );
      }
      lastPosRef.current = pos;
    };

    /** End the active stroke on pointer release anywhere on the document. */
    const onPointerEnd = () => {
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };

    document.addEventListener("mousedown", onPointerStart);
    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", onPointerEnd);
    document.addEventListener("touchstart", onPointerStart, { passive: true });
    document.addEventListener("touchmove", onPointerMove, { passive: true });
    document.addEventListener("touchend", onPointerEnd);

    return () => {
      document.removeEventListener("mousedown", onPointerStart);
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerEnd);
      document.removeEventListener("touchstart", onPointerStart);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerEnd);
    };
  }, [brushSize, selectedColor, getCanvasPoint]);

  /**
   * Deterministic ambient stroke layout computed once on mount.
   * Index-based arithmetic keeps the distribution consistent across renders
   * without a seeded RNG.
   */
  const ambientStrokes = useMemo<BrushStrokeProps[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      path: BRUSH_PATHS[i % BRUSH_PATHS.length],
      color: AMBIENT_COLORS[i % AMBIENT_COLORS.length],
      x: (i * 14 + 5) % 90,
      y: (i * 13 + 3) % 85,
      rotation: (i * 47) % 360,
      scale: 0.8 + (i % 3) * 0.4,
      delay: i * 0.8,
      duration: 12 + (i % 4) * 3,
    }));
  }, []);

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

        {/* Ambient floating brush strokes */}
        {ambientStrokes.map((stroke, i) => (
          <BrushStroke key={i} {...stroke} />
        ))}

        {/*
         * Drawing canvas — visually behind the page but receives no direct events.
         * All drawing is driven by the document-level listeners in the effect above.
         * pointer-events: none here is intentional — the document listener handles
         * everything; a canvas-level listener would be unreachable at z-index -10.
         */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ pointerEvents: "none", touchAction: "none" }}
          aria-label="Canvas de desenho interativo"
          role="img"
        />
      </div>

      {/* ── Floating toolbar (z-index: 50, always above page content) ─────── */}
      <DrawingToolbar
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((prev) => !prev)}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onClear={clearCanvas}
      />
    </>
  );
}
