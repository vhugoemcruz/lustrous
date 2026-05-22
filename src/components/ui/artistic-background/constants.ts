/**
 * @module artistic-background/constants
 * @description Static palette data, SVG brush-stroke paths, ambient colours,
 * and DOM selectors used by the ArtisticBackground drawing system.
 */

// ─── Watercolour Palette ──────────────────────────────────────────────────────

/** Built-in watercolour swatches shown in the drawing toolbar. */
export const WATERCOLOR_PALETTE = [
  { name: "Ocean",  hex: "#5B8FB9", rgb: "91, 143, 185"  },
  { name: "Coral",  hex: "#E07A5F", rgb: "224, 122, 95"  },
  { name: "Violet", hex: "#8B6BB5", rgb: "139, 107, 181" },
  { name: "Sage",   hex: "#81B29A", rgb: "129, 178, 154" },
  { name: "Amber",  hex: "#F2CC8F", rgb: "242, 204, 143" },
  { name: "Rose",   hex: "#D4899A", rgb: "212, 137, 154" },
  { name: "Ink",    hex: "#3D3D4E", rgb: "61, 61, 78"    },
] as const;

// ─── Ambient SVG Brush Strokes ────────────────────────────────────────────────

/** SVG `d` path strings for the decorative floating brush strokes. */
export const BRUSH_PATHS = [
  "M10,25 Q30,5 60,20 T110,15 Q140,10 160,25 Q180,40 150,45 Q120,50 90,40 T30,45 Q5,42 10,25Z",
  "M5,20 Q25,2 55,18 T100,12 Q130,8 155,22 Q175,38 145,42 Q115,48 85,38 T25,42 Q0,38 5,20Z",
  "M8,30 Q35,8 65,22 Q95,36 125,18 Q155,4 180,20 Q195,35 165,42 Q135,50 100,38 Q65,48 35,42 Q5,48 8,30Z",
  "M15,22 Q40,5 70,18 T120,10 Q150,5 170,22 Q185,38 155,44 Q125,50 95,36 T40,44 Q10,40 15,22Z",
] as const;

/** Semi-transparent `rgba` colours for the ambient floating strokes. */
export const AMBIENT_COLORS = [
  "rgba(91, 143, 185, 0.07)",
  "rgba(224, 122, 95, 0.06)",
  "rgba(139, 107, 181, 0.06)",
  "rgba(129, 178, 154, 0.05)",
  "rgba(242, 204, 143, 0.06)",
] as const;

// ─── DOM Selectors ────────────────────────────────────────────────────────────

/**
 * Selector that matches interactive elements.
 * Drawing events that start on these targets are ignored so the user
 * can still click buttons, links, and inputs normally.
 */
export const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, [role="button"], [data-no-paint]';
