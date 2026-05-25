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

import { FC, useRef } from "react";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { WATERCOLOR_PALETTE } from "./constants";
import type { BuiltinColor, DrawingToolbarProps } from "./types";

// ─── SVG Icon Sub-components ──────────────────────────────────────────────────

/**
 * Pencil icon — clean, recognisable pencil silhouette.
 * Used as the main toggle button icon.
 */
const PencilIcon: FC<{ stroke: string }> = ({ stroke }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
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

  useClickOutside(
    panelRef,
    () => {
      if (panelOpen) onTogglePanel();
    },
    panelOpen,
    [pencilBtnRef],
  );

  return (
    <div
      className="fixed right-6 z-50 flex flex-col items-end gap-3"
      style={{
        pointerEvents: "auto",
        bottom: toolbarBottom,
        transition: "bottom 0.3s ease",
      }}
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
            minWidth: "280px",
            zIndex: 100, 
            position: "relative",
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
              fontSize: "14px",
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
            ✕
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

      {/* ── Action buttons row (undo + eraser + deactivate/pencil) ── */}
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
              transition:
                "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              outline: "none",
              opacity: canUndo ? 1 : 0.5,
            }}
            aria-label="Undo last stroke"
          >
            <UndoIcon />
          </button>
        )}

        {/* Eraser button + horizontal size slider */}
        {selectedColor && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Eraser size slider — visible only when eraser is active */}
            {isEraser && (
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
                  animation: "panel-in 0.2s ease",
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
                  min={2}
                  max={24}
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
            )}

            <button
              onClick={onToggleEraser}
              title={isEraser ? "Switch to pencil" : "Switch to eraser"}
              style={{
                width: "44px",
                height: "44px",
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
                transition:
                  "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                outline: "none",
                flexShrink: 0,
              }}
              aria-label={isEraser ? "Switch to pencil" : "Switch to eraser"}
              aria-pressed={isEraser}
            >
              <EraserIcon stroke={isEraser ? "#fff" : "#888"} />
            </button>
          </div>
        )}

        {/* ── Pencil toggle button with deactivate X above ── */}
        <div style={{ position: "relative" }}>
          {/* Deactivate button — small X above pencil, only when colour is active */}
          {selectedColor && (
            <button
              onClick={onDeactivateColor}
              title="Stop painting"
              style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                left: "50%",
                transform: "translateX(-50%)",
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
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                outline: "none",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(0,0,0,0.50)",
                lineHeight: 1,
                zIndex: 50, 
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
          )}

          {/* ── Pencil toggle button ── */}
          <button
            ref={pencilBtnRef}
            onClick={onTogglePanel}
            title={selectedColor ? "Drawing options" : "Start painting"}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: selectedColor
                ? selectedColor.hex
                : "rgba(255,255,255,0.92)",
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
              transition:
                "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: panelOpen
                ? "scale(1.1) rotate(-15deg)"
                : "scale(1) rotate(0deg)",
              outline: "none",
            }}
            aria-label={selectedColor ? "Drawing options" : "Start painting"}
            aria-expanded={panelOpen}
          >
            <PencilIcon stroke={selectedColor ? "#fff" : "#888"} />
          </button>
        </div>
      </div>
    </div>
  );
};
