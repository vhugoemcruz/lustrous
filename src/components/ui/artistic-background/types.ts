/**
 * @module artistic-background/types
 * @description Shared type definitions for the ArtisticBackground drawing system.
 */

import type { WATERCOLOR_PALETTE } from "./constants";

/** A colour entry from the built-in {@link WATERCOLOR_PALETTE}. */
export type BuiltinColor = (typeof WATERCOLOR_PALETTE)[number];

/** Any colour that can be painted on the canvas — either built-in or user-picked. */
export interface DrawableColor {
  name: string;
  hex: string;
  /** Comma-separated RGB string, e.g. `"91, 143, 185"`. */
  rgb: string;
}

/** A 2D point in canvas (client) coordinates. */
export interface CanvasPoint {
  x: number;
  y: number;
}

/** Props for the ambient {@link BrushStroke} SVG element. */
export interface BrushStrokeProps {
  /** SVG path data string. */
  path: string;
  /** Fill colour (usually an `rgba()` string). */
  color: string;
  /** Horizontal position as a percentage of the container width. */
  x: number;
  /** Vertical position as a percentage of the container height. */
  y: number;
  /** Rotation angle in degrees. */
  rotation: number;
  /** Scale factor applied to the SVG dimensions. */
  scale: number;
  /** Animation delay in seconds. */
  delay: number;
  /** Animation cycle duration in seconds. */
  duration: number;
}

/** Props accepted by the {@link DrawingToolbar} control panel. */
export interface DrawingToolbarProps {
  /** Currently active colour, or `null` when drawing is inactive. */
  selectedColor: DrawableColor | null;
  /** Whether the expanded control panel is visible. */
  panelOpen: boolean;
  /** Callback to open/close the control panel. */
  onTogglePanel: () => void;
  /** Callback fired when the user picks a colour swatch. */
  onSelectColor: (color: DrawableColor) => void;
  /** Callback to deactivate the current colour (stop drawing). */
  onDeactivateColor: () => void;
  /** Current brush radius in pixels. */
  brushSize: number;
  /** Callback to change the brush radius. */
  onBrushSizeChange: (size: number) => void;
  /** Callback to clear the entire drawing canvas. */
  onClear: () => void;
  /** Callback to undo the last stroke. */
  onUndo: () => void;
  /** Whether there are strokes available to undo. */
  canUndo: boolean;
  /** Whether eraser mode is active. */
  isEraser: boolean;
  /** Callback to toggle eraser mode on/off. */
  onToggleEraser: () => void;
  /** CSS `bottom` value for the toolbar (for footer-aware positioning). */
  toolbarBottom: string;
}
