/**
 * @module artistic-background/DrawingToolbar
 * @description Floating control panel for the ArtisticBackground drawing system.
 *
 * Includes colour swatches, a brush-size slider, undo/eraser toggles,
 * and the main pencil toggle button. The panel animates in/out with
 * the `panel-in` keyframe from `globals.css`.
 *
 * The toolbar accepts a `toolbarBottom` prop so it can be pushed up
 * when the footer becomes visible, preventing overlap.
 */
"use client";

import { FC, useRef, useState, useEffect } from "react";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { WATERCOLOR_PALETTE } from "./constants";
import type { BuiltinColor, DrawingToolbarProps } from "./types";

// ─── Layout Constants ────────────────────────────────────────────────────────
const BTN_SIZE_SECONDARY = 44; // px
const BTN_SIZE_PRIMARY = 52; // px
const GAP_SIZE = 10; // px

const TRANSLATE_UNDO = BTN_SIZE_SECONDARY + GAP_SIZE; // 54px
const TRANSLATE_ERASER = BTN_SIZE_PRIMARY + GAP_SIZE; // 62px

// ─── SVG Icon Sub-components ──────────────────────────────────────────────────

/**
 * Pencil icon — clean, recognisable pencil silhouette.
 * Used as the main toggle button icon.
 */
const PencilIcon: FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Pencil body */}
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    {/* Collar line */}
    <path d="M15 5l4 4" />
    {/* Tip accent */}
    <path d="M2 22l1.5-5.5" />
  </svg>
);

/**
 * Eraser icon — rectangular block eraser with a subtle perspective feel.
 */
const EraserIcon: FC<{ stroke: string }> = ({ stroke }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Eraser body — angled rectangle */}
    <path d="M20 20H7L3 16a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l7 7a1 1 0 0 1 0 1.4L16.5 18" />
    {/* Collar band — spans full width separating rubber from grip */}
    <path d="M5.5 12L11.5 20" />
    {/* Ground line */}
    <line x1="18" y1="20" x2="22" y2="20" />
  </svg>
);

/**
 * Undo arrow icon — counter-clockwise curved arrow.
 */
const UndoIcon: FC = () => (
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
);

/**
 * Export icon — download arrow pointing into a tray.
 */
const ExportIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// ─── Drawing Toolbar ──────────────────────────────────────────────────────────

/**
 * Floating drawing toolbar that provides colour selection, brush-size control,
 * eraser mode, undo, export, and canvas clear functionality.
 *
 * Positioned `fixed` at the bottom-right of the viewport. The `toolbarBottom`
 * prop allows the parent to push the toolbar up when the page footer is visible.
 *
 * Animation sequence on EXPAND (selectedColor set):
 *   Phase 1 (t=0ms):    eraser container + X button animate to their positions simultaneously.
 *   Phase 2 (t=350ms):  undo button animates to its position.
 *
 * Animation sequence on RETRACT (selectedColor cleared):
 *   Phase 1 (t=0ms):    undo button + X button retract simultaneously.
 *   Phase 2 (t=350ms):  eraser container retracts.
 *
 * The "emerge from behind" effect is achieved via z-index hierarchy:
 *   pencil: 30 > X: 20 > eraser: 10 > undo: 5
 *
 * All buttons are always mounted in the DOM (no conditional rendering) so that
 * CSS transitions can animate both entry and exit correctly.
 */
export const DrawingToolbar: FC<DrawingToolbarProps> = ({
  selectedColor,
  panelOpen,
  onTogglePanel,
  onSelectColor,
  onDeactivateColor,
  brushSize,
  onBrushSizeChange,
  onClear,
  onExport,
  onUndo,
  canUndo,
  isEraser,
  onToggleEraser,
  eraserSize,
  onEraserSizeChange,
  toolbarBottom,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const pencilBtnRef = useRef<HTMLButtonElement>(null);
  const timeoutRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorTimeout1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorTimeout2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Animation states ───────────────────────────────────────────────────────
  const [eraserVisible, setEraserVisible] = useState<boolean>(!!selectedColor);
  const [undoVisible, setUndoVisible]     = useState<boolean>(!!selectedColor);
  const [xVisible, setXVisible]           = useState<boolean>(!!selectedColor);

  // lastColor: keeps the most recent non-null colour so the pencil button
  // retains its colour throughout the full retract sequence before fading.
  const [lastColor, setLastColor] = useState(selectedColor);

  // colorOverlayVisible: drives the circular colour overlay on the pencil
  // button. Stays true during the entire retract animation; only becomes
  // false after all buttons have finished retracting, triggering the
  // "suck-into-centre" scale-down animation.
  const [colorOverlayVisible, setColorOverlayVisible] = useState<boolean>(!!selectedColor);

  useEffect(() => {
    if (timeoutRef.current)       clearTimeout(timeoutRef.current);
    if (colorTimeout1Ref.current) clearTimeout(colorTimeout1Ref.current);
    if (colorTimeout2Ref.current) clearTimeout(colorTimeout2Ref.current);

    if (selectedColor) {
      // ── Expand sequence ──────────────────────────────────────────────────
      setLastColor(selectedColor);
      setColorOverlayVisible(true);
      setEraserVisible(true);
      setXVisible(true);
      timeoutRef.current = setTimeout(() => setUndoVisible(true), 350);
    } else {
      // ── Retract sequence ─────────────────────────────────────────────────
      // Phase 1 (t=0): undo + X retract; colour stays visible on pencil.
      setUndoVisible(false);
      setXVisible(false);
      // Phase 2 (t=350ms): eraser retracts.
      colorTimeout1Ref.current = setTimeout(() => {
        setEraserVisible(false);
        // After the eraser CSS transition completes (~350ms), fire the
        // colour suck-in animation on the pencil button.
        colorTimeout2Ref.current = setTimeout(() => {
          setColorOverlayVisible(false);
        }, 350);
      }, 350);
    }

    return () => {
      if (timeoutRef.current)       clearTimeout(timeoutRef.current);
      if (colorTimeout1Ref.current) clearTimeout(colorTimeout1Ref.current);
      if (colorTimeout2Ref.current) clearTimeout(colorTimeout2Ref.current);
    };
  }, [selectedColor]);

  useClickOutside(
    panelRef,
    () => {
      if (panelOpen) onTogglePanel();
    },
    panelOpen,
    [pencilBtnRef],
  );

  // ─── Shared transition string ────────────────────────────────────────────────
  // Applied to every animated button / container.
  const animTransition =
    "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease";

  return (
    <div
      className="fixed right-6 z-50 flex flex-col items-end gap-3"
      style={{
        pointerEvents: "auto",
        bottom: toolbarBottom,
        transition: "bottom 0.3s ease",
      }}
    >
      {/* ── Action buttons row (undo + eraser + deactivate/pencil) ── */}
      {/*
       * All three secondary button groups (undo, eraser container, X) are
       * always mounted in the DOM.  Visibility is driven by the three state
       * booleans (undoVisible / eraserVisible / xVisible) via opacity +
       * translateX / translateY + pointerEvents.
       *
       * z-index hierarchy creates the "emerge from behind" depth effect:
       *   pencil 30 > X 20 > eraser 10 > undo 5
       *
       * The outer container is `fixed right-6 flex-col items-end`, so it is
       * anchored to the RIGHT edge of the viewport.  Hidden buttons that still
       * occupy space in the flex row simply add invisible width to the LEFT of
       * the pencil button — the pencil itself never moves.
       *
       * translateX offsets (hidden → pencil area, positive = rightward):
       *   eraser container: TRANSLATE_ERASER (GAP_SIZE + BTN_SIZE_PRIMARY)
       *   undo button:      TRANSLATE_UNDO   (GAP_SIZE + BTN_SIZE_SECONDARY)
       *   X button:        translateY(+44px)  (moves down toward pencil top)
       *)
      */}
      <div style={{ display: "flex", alignItems: "center", gap: `${GAP_SIZE}px` }}>

        {/* ── Undo button ── */}
        <button
          onClick={onUndo}
          disabled={!canUndo || !undoVisible}
          title="Undo last stroke"
          style={{
            width: `${BTN_SIZE_SECONDARY}px`,
            height: `${BTN_SIZE_SECONDARY}px`,
            borderRadius: "50%",
            background: canUndo
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.60)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1.5px solid rgba(0,0,0,0.10)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            cursor: canUndo ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
            // ── Animation ──
            position: "relative",
            zIndex: 5,
            transform: undoVisible ? "translateX(0)" : `translateX(${TRANSLATE_UNDO}px)`,
            opacity: undoVisible ? (canUndo ? 1 : 0.5) : 0,
            pointerEvents: undoVisible ? "auto" : "none",
            transition: animTransition,
          }}
          aria-label="Undo last stroke"
        >
          <UndoIcon />
        </button>

        {/* ── Eraser container (slider + eraser button) ── */}
        {/*
         * The ENTIRE container receives the expand/collapse translateX so that
         * the eraser button (right end of the container) visually slides out
         * from behind the pencil button.
         *
         * The slider inside the container has its own independent scaleX
         * animation driven by isEraser, which is unrelated to the
         * expand/collapse sequence.
         *)
        */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // No gap here — spacing between slider and eraser button is
            // handled by the slider wrapper's marginRight so that it
            // collapses to zero (along with the wrapper width) when hidden,
            // leaving no phantom space in the layout.
            gap: "0px",
            // ── Animation ──
            position: "relative",
            zIndex: 10,
            transform: eraserVisible ? "translateX(0)" : `translateX(${TRANSLATE_ERASER}px)`,
            opacity: eraserVisible ? 1 : 0,
            pointerEvents: eraserVisible ? "auto" : "none",
            transition: animTransition,
          }}
        >
          {/*
           * Collapsing wrapper — collapses max-width to 0 when the slider is
           * not active so it takes up zero space in the flex layout.
           * The margin-right collapses at the same time, ensuring no phantom
           * gap is left between the eraser button and the undo button.
           * Both the margin and max-width use the same easing as the other
           * button animations to keep motion consistent.
           * The inner pill div keeps its own scaleX + opacity animation for
           * a crisp "emerge from the right" visual effect.
           *)
          */}
          <div
            style={{
              overflow: "hidden",
              // borderRadius matches the pill so the overflow clip is rounded —
              // without this the rectangular clip leaves gray corners visible
              // against the pill's white background.
              borderRadius: "22px",
              maxWidth: isEraser ? "180px" : "0px",
              marginRight: isEraser ? `${GAP_SIZE}px` : "0px",
              transition: `max-width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                           margin-right 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)`,
            }}
          >
            {/*
             * The wrapper's maxWidth already provides the slide-in-from-right
             * motion, so the inner pill only needs an opacity fade — no
             * translateX/scaleX that would push it outside the clip area and
             * produce a visible jump or mid-animation crop.
             */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: "22px",
                padding: "6px 12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                border: "1.5px solid rgba(0,0,0,0.10)",
                whiteSpace: "nowrap",
                opacity: isEraser ? 1 : 0,
                pointerEvents: isEraser ? "auto" : "none",
                transition: "opacity 0.25s ease",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#000",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                {eraserSize}px
              </span>
              <input
                type="range"
                min={1}
                max={48}
                step={1}
                value={eraserSize}
                onChange={(e) => onEraserSizeChange(Number(e.target.value))}
                style={{
                  width: "80px",
                  accentColor: "#3D3D4E",
                  margin: 0,
                }}
                aria-label="Eraser size"
              />
            </div>
          </div>

          {/* Eraser toggle button */}
          <button
            onClick={onToggleEraser}
            title={isEraser ? "Switch to pencil" : "Switch to eraser"}
            style={{
              width: `${BTN_SIZE_SECONDARY}px`,
              height: `${BTN_SIZE_SECONDARY}px`,
              borderRadius: "50%",
              background: isEraser
                ? "rgba(61, 61, 78, 0.85)"
                : "rgba(255,255,255,0.92)",
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
              // Visual-state transition only (background/shadow/border).
              // The expand/collapse translate is handled by the parent container.
              transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              outline: "none",
              flexShrink: 0,
            }}
            aria-label={isEraser ? "Switch to pencil" : "Switch to eraser"}
            aria-pressed={isEraser}
          >
            <EraserIcon stroke={isEraser ? "#fff" : "#888"} />
          </button>
        </div>

        {/* ── Pencil toggle button with X deactivate button above ── */}
        <div style={{ position: "relative" }}>
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
                minWidth: "280px",
                zIndex: 100,
                position: "absolute",
                bottom: "calc(100% + 6px)",
                right: "calc(100% - 2px)",
                transformOrigin: "bottom right",
              }}
              role="toolbar"
              aria-label="Drawing controls"
            >
              {/* Close button ✕ */}
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
                  color: "rgba(0,0,0,0.5)",
                  transition: "background 0.15s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(0,0,0,0.06)";
                }}
                aria-label="Close panel"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              {/* Colour swatches */}
              <div style={{ paddingTop: "4px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "#000",
                    marginBottom: "8px",
                  }}
                >
                  COLOUR
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
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
                          transition:
                            "transform 0.15s ease, box-shadow 0.15s ease",
                          transform: isActive ? "scale(1.22)" : "scale(1)",
                          boxShadow: isActive
                            ? `0 2px 8px ${color.hex}88`
                            : "none",
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
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "#000",
                    marginBottom: "8px",
                  }}
                >
                  SIZE — {brushSize}px
                </p>
                <input
                  type="range"
                  min={1}
                  max={48}
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

              {/* Action buttons — Export + Clear */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={onExport}
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    background: "none",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: "10px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    transition: "background 0.15s ease, color 0.15s ease",
                    letterSpacing: "0.02em",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(0,0,0,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(0,0,0,0.70)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "none";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#000";
                  }}
                  aria-label="Export drawing"
                >
                  <ExportIcon /> Export
                </button>
                <button
                  onClick={onClear}
                  style={{
                    fontSize: "14px",
                    color: "#000",
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
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(0,0,0,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(0,0,0,0.70)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "none";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#000";
                  }}
                  aria-label="Clear canvas"
                >
                  🗑 Clear canvas
                </button>
              </div>
            </div>
          )}


          {/* Deactivate button — X above pencil */}
          {/*
           * position: absolute keeps it out of the flex flow.
           * When hidden: translateY(+44px) pushes it DOWN into the pencil
           * button area (emerging-from-behind effect on the Y axis).
           * When visible: translateX(-50%) re-centres it horizontally as before.
           *)
          */}
          <button
            onClick={onDeactivateColor}
            title="Stop painting"
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: "50%",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(0,0,0,0.10)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(0,0,0,0.50)",
              lineHeight: 1,
              // ── Animation ──
              zIndex: 20,
              transform: xVisible
                ? "translateX(-50%)"
                : "translateX(-50%) translateY(44px)",
              opacity: xVisible ? 1 : 0,
              pointerEvents: xVisible ? "auto" : "none",
              transition: animTransition,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(0,0,0,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(0,0,0,0.70)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.92)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(0,0,0,0.50)";
            }}
            aria-label="Stop painting"
          >
            ✕
          </button>

          {/* ── Pencil toggle button ── */}
          <button
            ref={pencilBtnRef}
            onClick={onTogglePanel}
            title={colorOverlayVisible ? "Drawing options" : "Start painting"}
            style={{
              width: `${BTN_SIZE_PRIMARY}px`,
              height: `${BTN_SIZE_PRIMARY}px`,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "none",
              boxShadow: colorOverlayVisible && lastColor
                ? `0 6px 24px ${lastColor.hex}66`
                : "0 4px 16px rgba(0,0,0,0.12)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "border 0.3s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: panelOpen
                ? "scale(1.1) rotate(-15deg) translateZ(0)"
                : "scale(1) rotate(0deg) translateZ(0)",
              // translateZ(0) forces GPU compositing, preventing the subpixel
              // blur that browsers produce when rotating at non-90° angles.
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              outline: "none",
              position: "relative",
              zIndex: 30,
              overflow: "hidden",
            }}
            aria-label={colorOverlayVisible ? "Drawing options" : "Start painting"}
            aria-expanded={panelOpen}
          >
            {/* Colour overlay — stays at scale(1) while buttons are visible,
                then shrinks to scale(0) once all buttons finish retracting,
                giving the "colour sucked into the centre" effect. */}
            {lastColor && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: lastColor.hex,
                  transform: colorOverlayVisible ? "scale(1)" : "scale(0)",
                  opacity: colorOverlayVisible ? 1 : 0,
                  transition:
                    "transform 0.45s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.35s ease",
                  pointerEvents: "none",
                }}
              />
            )}
            {/* Icon colour transitions from white → grey only AFTER the overlay
                finishes scaling down (0.45s), so the icon stays visible
                throughout the "suck-in" animation instead of vanishing. */}
            <span
              style={{
                color: colorOverlayVisible ? "#fff" : "#888",
                transition: colorOverlayVisible
                  ? "color 0s"                          // instant when activating
                  : "color 0.2s ease 0.35s",            // delayed when deactivating
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <PencilIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};