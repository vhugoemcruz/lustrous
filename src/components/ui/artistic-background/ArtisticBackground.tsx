/**
 * @module artistic-background/ArtisticBackground
 * @description Interactive ambient background combining a live watercolour
 * drawing canvas with floating animated SVG brush strokes.
 *
 * ### UX flow
 * 1. Page loads — pencil button is white, no colour selected, drawing is inactive.
 * 2. User clicks the button → panel opens.
 * 3. User picks a colour → drawing activates, button adopts that colour.
 * 4. User paints freely; button stays coloured as a status indicator.
 * 5. User clicks the button again → panel opens over current selection.
 * 6. Clicking the *same* colour deactivates drawing (button returns to white).
 *    Clicking a *different* colour swaps the active colour.
 * 7. The toolbar respects the page footer — its `bottom` adjusts dynamically
 *    so it never overlaps footer content.
 *
 * A static "Paint the background!" hint appears until the user
 * activates drawing for the first time.
 *
 * Event listeners are attached to `document` (not the canvas) so the negative
 * z-index of the background layer never blocks pointer events.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AMBIENT_COLORS, BRUSH_PATHS, INTERACTIVE_SELECTOR } from "./constants";
import type { BrushStrokeProps, CanvasPoint, DrawableColor } from "./types";
import { drawWatercolorSplat, drawWatercolorStroke } from "./utils";

import { BrushHint } from "./BrushHint";
import { BrushStroke } from "./BrushStroke";
import { DrawingToolbar } from "./DrawingToolbar";

// ─── Footer Offset Hook ──────────────────────────────────────────────────────

/** Default bottom offset for the toolbar (px). */
const DEFAULT_BOTTOM_PX = 24;

/**
 * Observes the page footer and returns a CSS `bottom` value that keeps
 * the toolbar above the footer when it scrolls into view.
 *
 * Uses `IntersectionObserver` with a threshold array for smooth tracking.
 */
function useFooterAwareBottom(): string {
  const [bottomPx, setBottomPx] = useState(DEFAULT_BOTTOM_PX);

  useEffect(() => {
    const footer = document.querySelector("footer");
    const scrollContainer = document.getElementById("main-scroll-container");
    if (!footer || !scrollContainer) return;

    const update = () => {
      const footerRect = footer.getBoundingClientRect();
      const viewportH = window.innerHeight;

      if (footerRect.top < viewportH) {
        // Footer is partially visible — push toolbar up
        const overlap = viewportH - footerRect.top;
        setBottomPx(DEFAULT_BOTTOM_PX + overlap);
      } else {
        setBottomPx(DEFAULT_BOTTOM_PX);
      }
    };

    // Run on scroll of the main container
    scrollContainer.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      scrollContainer.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return `${bottomPx}px`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Full-page ambient background with interactive watercolour drawing.
 *
 * Renders three layers:
 * 1. **Background** (`z-index: -10`) — gradient overlay + ambient SVG strokes + drawing canvas.
 * 2. **Hint** — "Paint the background!" callout (hidden after first activation).
 * 3. **Toolbar** — floating pencil button + expanded control panel.
 */
export function ArtisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<CanvasPoint | null>(null);

  const [selectedColor, setSelectedColor] = useState<DrawableColor | null>(null);
  const [brushSize, setBrushSize] = useState(8);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [eraserSize, setEraserSize] = useState(8);

  /** Undo history — stores canvas snapshots after each stroke. */
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  /** Footer-aware bottom positioning for toolbar and hint. */
  const toolbarBottom = useFooterAwareBottom();

  // ── Resize handler ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const snapshot = document.createElement("canvas");
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext("2d")?.drawImage(canvas, 0, 0);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.getContext("2d")?.drawImage(snapshot, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Canvas operations ───────────────────────────────────────────────────────

  /** Clears all user-painted marks from the drawing canvas. */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
      setHistoryStep(-1);
    }
  }, []);

  /** Exports the drawing canvas as a PNG file download. */
  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `lustrous-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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

  // ── Colour selection handlers ───────────────────────────────────────────────

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

  /** Extracts canvas-space coordinates from a mouse or touch event. */
  const getCanvasPoint = useCallback(
    (e: MouseEvent | TouchEvent): CanvasPoint => {
      if ("touches" in e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    },
    [],
  );

  // ── Document-level drawing events ───────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedColor) return;

    const rgb = selectedColor.rgb;

    const onPointerStart = (e: MouseEvent | TouchEvent) => {
      const target = (e.target ?? e.currentTarget) as HTMLElement | null;
      if (target?.closest(INTERACTIVE_SELECTOR)) return;

      // Prevent browser drag-to-select behavior while painting
      e.preventDefault();

      isDrawingRef.current = true;
      const pos = getCanvasPoint(e);
      lastPosRef.current = pos;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (isEraser) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, eraserSize, 0, Math.PI * 2);
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
          ctx.lineWidth = eraserSize * 2;
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
      lastPosRef.current = null;
    };

    document.addEventListener("mousedown", onPointerStart);
    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", onPointerEnd);
    document.addEventListener("touchstart", onPointerStart, { passive: false });
    document.addEventListener("touchmove", onPointerMove, { passive: true });
    document.addEventListener("touchend", onPointerEnd);

    return () => {
      document.removeEventListener("mousedown", onPointerStart);
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerEnd);
      document.removeEventListener("touchstart", onPointerStart);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerEnd);
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };
  }, [selectedColor, brushSize, eraserSize, getCanvasPoint, isEraser, saveHistory]);

  // ── Disable text selection while drawing is active ──────────────────────────

  useEffect(() => {
    if (!selectedColor) return;

    document.body.style.userSelect = "none";

    return () => {
      document.body.style.userSelect = "";
    };
  }, [selectedColor]);

  // ── Ambient strokes (deterministic layout) ──────────────────────────────────

  /** Deterministic ambient stroke layout. */
  const ambientStrokes = useMemo<BrushStrokeProps[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        path: BRUSH_PATHS[i % BRUSH_PATHS.length],
        color: AMBIENT_COLORS[i % AMBIENT_COLORS.length],
        x: (i * 14 + 5) % 90,
        y: (i * 13 + 3) % 85,
        rotation: (i * 47) % 360,
        scale: 0.8 + (i % 3) * 0.4,
        delay: i * 0.8,
        duration: 12 + (i % 4) * 3,
      })),
    [],
  );

  // ── Hint bottom — offset from toolbar ───────────────────────────────────────

  const hintBottom = `calc(${toolbarBottom} + 43.5px)`;

  return (
    <>
      {/* ── Background layer (z-index: -10) ──────────────────────────────── */}
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

      {/* ── Static hint ──────────────────────────────────────────────────── */}
      {!hasActivated && <BrushHint bottom={hintBottom} />}

      {/* ── Floating toolbar ─────────────────────────────────────────────── */}
      <DrawingToolbar
        selectedColor={selectedColor}
        panelOpen={panelOpen}
        onTogglePanel={() => {
          setHasActivated(true);
          setPanelOpen((prev) => !prev);
        }}
        onSelectColor={handleSelectColor}
        onDeactivateColor={handleDeactivateColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onClear={clearCanvas}
        onExport={exportCanvas}
        onUndo={handleUndo}
        canUndo={historyStep >= 0}
        isEraser={isEraser}
        onToggleEraser={handleToggleEraser}
        eraserSize={eraserSize}
        onEraserSizeChange={setEraserSize}
        toolbarBottom={toolbarBottom}
      />
    </>
  );
}
