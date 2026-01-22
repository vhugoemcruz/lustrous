/**
 * @module perspective-engine
 * @description Perspective geometry calculation engine.
 * 
 * 3D grid implementation with mesh:
 * - Lines distributed by projected distance in 3D space
 * - Creates depth effect with perspective compression
 * - Lines from different VPs intersect forming planes
 */

/**
 * Represents a vanishing point in 2D space.
 */
export interface VanishingPoint {
    /** X coordinate of the point (used only for VP3) */
    x: number;
    /** Y coordinate of the point (not currently used) */
    y: number;
    /** Unique identifier: "vp1", "vp2" or "vp3" */
    id: string;
    /** Distance from horizon center in pixels (world space) */
    distanceFromCenter: number;
}

/**
 * Handle for interactive manipulation of vanishing points.
 * Handles are fixed UI elements on screen that control VPs.
 */
export interface Handle {
    /** Current X displacement of handle (relative to rest position) */
    x: number;
    /** Current Y displacement of handle (relative to rest position) */
    y: number;
    /** ID of associated VP: "vp1", "vp2" or "vp3" */
    id: string;
    /** Rest X position relative to screen center */
    restX: number;
}

/**
 * Grid rendering configuration.
 */
export interface GridConfig {
    /** Number of active vanishing points (1, 2 or 3) */
    type: 1 | 2 | 3;
    /** Orientation of the third vanishing point */
    thirdPointOrientation: "top" | "bottom";
    /** Grid line density */
    density: "low" | "medium" | "high";
}

/**
 * Camera state (pan, zoom, horizon controls).
 */
export interface CameraState {
    /** Horizon Y position in pixels */
    horizonY: number;
    /** Horizon tilt angle in degrees */
    horizonAngle: number;
    /** Horizontal camera offset */
    panX: number;
    /** Vertical camera offset */
    panY: number;
    /** Zoom level (1 = 100%) */
    zoom: number;
}

/**
 * Geometric line for canvas rendering.
 */
export interface Line {
    /** Start X coordinate */
    x1: number;
    /** Start Y coordinate */
    y1: number;
    /** End X coordinate */
    x2: number;
    /** End Y coordinate */
    y2: number;
    /** Line color in hex format */
    color: string;
    /** Line opacity (0-1) */
    opacity: number;
    /** Line width in pixels */
    width: number;
}

/**
 * Reference image configuration.
 */
export interface ReferenceImage {
    /** Image URL (blob or http) */
    url: string;
    /** Image opacity (0-1) */
    opacity: number;
    /** Whether image is visible */
    isVisible: boolean;
    /** Original image width/height ratio */
    aspectRatio: number;

    // Transform properties
    /** Manual scale multiplier (relative to fit) */
    scale: number;
    /** Manual rotation in degrees */
    rotation: number;
    /** Image offset X in pixels (cumulative) */
    offsetX: number;
    /** Image offset Y in pixels (cumulative) */
    offsetY: number;
    /** Whether image tilts with horizon */
    followHorizon: boolean;
    /** Whether image scales with grid zoom */
    followZoom: boolean;
    /** Whether image shows an interactive handle for movement */
    isInteractive: boolean;

    // Handle displacement (like VP handles - returns to 0 after release)
    /** Current handle X displacement (visual, for animation) */
    handleX: number;
    /** Current handle Y displacement (visual, for animation) */
    handleY: number;
}

/**
 * Global state of the perspective grid system.
 */
export interface PerspectiveState {
    /** Array of vanishing points (always 3, even if not active) */
    vanishingPoints: VanishingPoint[];
    /** Array of control handles (always 3) */
    handles: Handle[];
    /** Current grid configuration */
    config: GridConfig;
    /** Camera state */
    camera: CameraState;
    /** Canvas width in pixels */
    canvasWidth: number;
    /** Canvas height in pixels */
    canvasHeight: number;
    /** Optional reference image */
    referenceImage?: ReferenceImage;
}

/** Number of lines for VP3 (third point) - different values from other VPs */
const VP3_LINE_COUNT = {
    low: 96,
    medium: 192,
    high: 384,
};

/** Default colors for each line set */
const LINE_COLORS = {
    vp1: "#90CEE0",
    vp2: "#EDC687",
    vp3: "#E8CAED",
    horizon: "#ff0000ff",
};

/**
 * Creates the initial state of the perspective system.
 * @param canvasWidth Canvas width in pixels.
 * @param canvasHeight Canvas height in pixels.
 * @returns The initial state configured with default values.
 */
export function createInitialState(
    canvasWidth: number,
    canvasHeight: number
): PerspectiveState {
    return {
        vanishingPoints: [
            { id: "vp1", x: 0, y: 0, distanceFromCenter: -canvasWidth * 0.35 },
            { id: "vp2", x: 0, y: 0, distanceFromCenter: canvasWidth * 0.35 },
            { id: "vp3", x: 0, y: 0, distanceFromCenter: -canvasHeight * 3 },
        ],
        handles: [
            { id: "vp1", x: 0, y: 0, restX: -150 },
            { id: "vp2", x: 0, y: 0, restX: 150 },
            { id: "vp3", x: 0, y: 0, restX: 0 },
        ],
        config: {
            type: 2,
            thirdPointOrientation: "top",
            density: "medium",
        },
        camera: {
            horizonY: canvasHeight / 2,
            horizonAngle: 0,
            panX: 0,
            panY: 0,
            zoom: 1,
        },
        canvasWidth,
        canvasHeight,
    };
}

/**
 * Calculates the transformed position of the reference image handle.
 * The handle has a fixed rest position below VP3's handle position,
 * with displacement added from handleX/handleY (like VP handles).
 * @param state Current perspective state.
 * @returns Object with x and y screen coordinates, or null if no reference image.
 */
export function getReferenceHandlePosition(state: PerspectiveState): { x: number; y: number } | null {
    if (!state.referenceImage) return null;

    const { referenceImage, canvasWidth, canvasHeight } = state;

    // Fixed rest position: centered horizontally, 80px below center
    const restX = 0;
    const restY = 80;

    // Screen center (same as VP handles anchor)
    const screenCenterX = canvasWidth / 2;
    const screenCenterY = canvasHeight / 2;

    // Handle position = rest position + current handle displacement (visual feedback)
    const hx = screenCenterX + restX + (referenceImage.handleX || 0);
    const hy = screenCenterY + restY + (referenceImage.handleY || 0);

    return { x: hx, y: hy };
}

/**
 * Calculates the vanishing point coordinates transformed by the camera (pan, zoom, rotation).
 * @param state Current perspective state.
 * @returns Array of objects containing transformed coordinates and ID for each VP.
 */
export function getTransformedVanishingPoints(
    state: PerspectiveState
): { x: number; y: number; id: string }[] {
    const { vanishingPoints, camera, canvasWidth } = state;
    const centerX = canvasWidth / 2 + camera.panX;
    const centerY = camera.horizonY + camera.panY;
    const angleRad = (camera.horizonAngle * Math.PI) / 180;

    const transformed: { x: number; y: number; id: string }[] = [];

    // VP1 and VP2 on the horizon line
    for (let i = 0; i < 2; i++) {
        const vp = vanishingPoints[i];
        const dist = vp.distanceFromCenter * camera.zoom;
        const x = centerX + dist * Math.cos(angleRad);
        const y = centerY + dist * Math.sin(angleRad);
        transformed.push({ x, y, id: vp.id });
    }

    // VP3 above or below (omnidirectional)
    const vp3 = vanishingPoints[2];
    const vp3Dist = vp3.distanceFromCenter * camera.zoom;
    const vp3OffsetX = vp3.x * camera.zoom;

    // VP3 is transformed relative to the horizon center,
    // rotated along with the horizon angle to maintain consistency
    const transformedVP3X = centerX + vp3OffsetX * Math.cos(angleRad) - vp3Dist * Math.sin(angleRad);
    const transformedVP3Y = centerY + vp3OffsetX * Math.sin(angleRad) + vp3Dist * Math.cos(angleRad);

    transformed.push({ x: transformedVP3X, y: transformedVP3Y, id: vp3.id });

    return transformed;
}

/**
 * Calculates all perspective grid lines based on the current state.
 * @param state Current perspective state.
 * @returns Array of lines ready to be rendered.
 */
export function calculatePerspectiveLines(state: PerspectiveState): Line[] {
    const lines: Line[] = [];
    const { config, camera, canvasWidth, canvasHeight } = state;
    const transformedVPs = getTransformedVanishingPoints(state);
    const centerX = canvasWidth / 2 + camera.panX;
    const centerY = camera.horizonY + camera.panY;
    const angleRad = (camera.horizonAngle * Math.PI) / 180;

    const lineLength = Math.max(canvasWidth, canvasHeight) * 3;
    lines.push({
        x1: centerX - lineLength * Math.cos(angleRad),
        y1: centerY - lineLength * Math.sin(angleRad),
        x2: centerX + lineLength * Math.cos(angleRad),
        y2: centerY + lineLength * Math.sin(angleRad),
        color: LINE_COLORS.horizon,
        // Uses value > 1 to increase visibility; renderGrid handles non-standard opacity
        opacity: 3,
        width: 1.5,
    });

    const vpColors = [LINE_COLORS.vp1, LINE_COLORS.vp2, LINE_COLORS.vp3];

    for (let i = 0; i < Math.min(config.type, 2); i++) {
        const vp = transformedVPs[i];
        const color = vpColors[i];
        lines.push(...createRadialLinesFromVP(vp, config.density, canvasWidth, canvasHeight, color, angleRad));
    }

    if (config.type === 3) {
        const vp3 = transformedVPs[2];
        lines.push(...createRadialLinesForVP3(vp3, config.density, canvasWidth, canvasHeight, LINE_COLORS.vp3, angleRad));
    }

    return lines;
}

/**
 * Creates omnidirectional radial lines (360°) with perspective compression.
 * Lines cover the entire space around the VP, with higher density
 * near the horizontal and vertical axes (depth effect).
 * @param vp Transformed vanishing point.
 * @param density Line density.
 * @param canvasWidth Canvas width.
 * @param canvasHeight Canvas height.
 * @param color Line color.
 * @param angleOffset Angular offset based on horizon tilt.
 * @returns Array of radial lines.
 */
function createRadialLinesFromVP(
    vp: { x: number; y: number },
    density: "low" | "medium" | "high",
    canvasWidth: number,
    canvasHeight: number,
    color: string,
    angleOffset: number
): Line[] {
    const lines: Line[] = [];
    const maxDist = Math.hypot(canvasWidth, canvasHeight) * 5;

    // Distribute lines in 360° using half turns per line (each line passes through the VP)
    const angles = getGeometricAngles(density);

    for (const angle of angles) {
        // Rotate base angles according to horizon tilt
        const finalAngle = angle + angleOffset;
        const cos = Math.cos(finalAngle);
        const sin = Math.sin(finalAngle);

        const x1 = vp.x + cos * maxDist;
        const y1 = vp.y + sin * maxDist;
        const x2 = vp.x - cos * maxDist;
        const y2 = vp.y - sin * maxDist;

        const clipped = clipLine(x1, y1, x2, y2, 0, 0, canvasWidth, canvasHeight);

        if (clipped) {
            lines.push({
                x1: clipped.x1,
                y1: clipped.y1,
                x2: clipped.x2,
                y2: clipped.y2,
                color,
                opacity: 0.75,
                width: 1,
            });
        }
    }

    return lines;
}

/**
 * Creates omnidirectional radial lines (360°) for VP3.
 * Lines pass through VP3, uniformly distributed over 180°
 * (each line covers 180° passing through VP3).
 * @param vp Transformed VP3 vanishing point.
 * @param density Line density.
 * @param canvasWidth Canvas width.
 * @param canvasHeight Canvas height.
 * @param color Line color.
 * @param angleOffset Angular offset based on horizon tilt.
 * @returns Array of radial lines for VP3.
 */
function createRadialLinesForVP3(
    vp: { x: number; y: number },
    density: "low" | "medium" | "high",
    canvasWidth: number,
    canvasHeight: number,
    color: string,
    angleOffset: number
): Line[] {
    const lines: Line[] = [];
    const count = VP3_LINE_COUNT[density];

    // Calculate distance from VP3 to canvas center
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const distToCenter = Math.hypot(vp.x - centerX, vp.y - centerY);

    // maxDist needs to be greater than distance from VP to canvas + margin
    const baseDist = Math.hypot(canvasWidth, canvasHeight) * 5;
    const maxDist = Math.max(baseDist, distToCenter * 2 + baseDist);

    // Distribute lines uniformly over 180° (each line passes through VP3)
    // We rotate along with the horizon (angleOffset) + 90° (perpendicular)
    // Each line covers 180° passing through VP3, so divide PI by count
    const step = Math.PI / count;

    for (let i = 0; i < count; i++) {
        const angle = (i * step) + angleOffset + Math.PI / 2;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const x1 = vp.x + cos * maxDist;
        const y1 = vp.y + sin * maxDist;
        const x2 = vp.x - cos * maxDist;
        const y2 = vp.y - sin * maxDist;

        const clipped = clipLine(x1, y1, x2, y2, 0, 0, canvasWidth, canvasHeight);

        if (clipped) {
            lines.push({
                x1: clipped.x1,
                y1: clipped.y1,
                x2: clipped.x2,
                y2: clipped.y2,
                color,
                opacity: 2,
                width: 1,
            });
        }
    }

    return lines;
}

/**
 * Generates angles with geometric (exponential) increment.
 * Creates denser line distribution near VP center, sparser at edges.
 * This mimics natural perspective depth compression.
 * @param density Line density.
 * @returns Array of angles in radians covering ±90° (full 360° when lines pass through VP).
 */
function getGeometricAngles(density: "low" | "medium" | "high"): number[] {
    const factorMap = { low: 0.18, medium: 0.11, high: 0.05 };
    const baseAngleMap = { low: 0.012, medium: 0.006, high: 0.003 };

    const spreadFactor = factorMap[density];
    const baseAngle = baseAngleMap[density];

    const angles: number[] = [0];
    let currentAngle = 0;
    let increment = baseAngle;

    // Each iteration increases increment exponentially: increment *= (1 + spreadFactor)
    // This creates geometric progression: lines cluster near 0° and spread toward 90°
    while (currentAngle < Math.PI / 2) {
        currentAngle += increment;
        if (currentAngle < Math.PI / 2) {
            angles.push(currentAngle);
            angles.push(-currentAngle);
        }
        increment *= (1 + spreadFactor);
    }
    return angles;
}

/**
 * Clips a line to canvas bounds using simplified Cohen-Sutherland algorithm.
 * @param x1 Start X coordinate.
 * @param y1 Start Y coordinate.
 * @param x2 End X coordinate.
 * @param y2 End Y coordinate.
 * @param minX Canvas left bound.
 * @param minY Canvas top bound.
 * @param maxX Canvas right bound.
 * @param maxY Canvas bottom bound.
 * @returns Clipped line or null if outside bounds.
 */
function clipLine(
    x1: number, y1: number, x2: number, y2: number,
    minX: number, minY: number, maxX: number, maxY: number
): { x1: number; y1: number; x2: number; y2: number } | null {
    // Cohen-Sutherland region codes (bitmask for each boundary)
    const INSIDE = 0, LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8;

    const code = (x: number, y: number) => {
        let c = INSIDE;
        if (x < minX) c |= LEFT;
        else if (x > maxX) c |= RIGHT;
        if (y < minY) c |= TOP;
        else if (y > maxY) c |= BOTTOM;
        return c;
    };

    let c1 = code(x1, y1), c2 = code(x2, y2);

    // Max 20 iterations prevents infinite loops on edge cases
    for (let i = 0; i < 20; i++) {
        if (!(c1 | c2)) return { x1, y1, x2, y2 };
        if (c1 & c2) return null;

        const c = c1 || c2;
        let x = 0, y = 0;

        if (c & TOP) { x = x1 + (x2 - x1) * (minY - y1) / (y2 - y1); y = minY; }
        else if (c & BOTTOM) { x = x1 + (x2 - x1) * (maxY - y1) / (y2 - y1); y = maxY; }
        else if (c & RIGHT) { y = y1 + (y2 - y1) * (maxX - x1) / (x2 - x1); x = maxX; }
        else if (c & LEFT) { y = y1 + (y2 - y1) * (minX - x1) / (x2 - x1); x = minX; }

        if (c === c1) { x1 = x; y1 = y; c1 = code(x1, y1); }
        else { x2 = x; y2 = y; c2 = code(x2, y2); }
    }
    return null;
}

/**
 * Renders the perspective grid and user interface (VPs and handles) on the canvas.
 * @param ctx 2D canvas context.
 * @param lines Array of previously calculated lines.
 * @param state Current perspective state.
 * @param showUI Whether to render UI elements (VPs and handles). Defaults to true.
 * @param referenceImageElement Optional HTMLImageElement for background reference.
 */
export function renderGrid(
    ctx: CanvasRenderingContext2D,
    lines: Line[],
    state: PerspectiveState,
    showUI: boolean = true,
    referenceImageElement?: HTMLImageElement | null
): void {
    const { canvasWidth, canvasHeight, referenceImage } = state;

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Reference image (if available and visible)
    if (referenceImageElement && referenceImage?.isVisible) {
        drawReferenceImage(ctx, referenceImageElement, referenceImage, canvasWidth, canvasHeight, state.camera);
    }

    lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity;
        ctx.lineWidth = line.width;
        ctx.stroke();
    });

    ctx.globalAlpha = 1;

    if (showUI) {
        const transformedVPs = getTransformedVanishingPoints(state);
        const vpColors = [LINE_COLORS.vp1, LINE_COLORS.vp2, LINE_COLORS.vp3];

        for (let i = 0; i < state.config.type; i++) {
            const vp = transformedVPs[i];

            ctx.beginPath();
            ctx.arc(vp.x, vp.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 1;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(vp.x, vp.y, 8, 0, Math.PI * 2);
            ctx.strokeStyle = vpColors[i];
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            ctx.stroke();
        }

        renderHandles(ctx, state);

        // Reference image handle
        if (referenceImage?.isInteractive && referenceImage?.isVisible) {
            const hPos = getReferenceHandlePosition(state);
            if (hPos) {
                const { x: hx, y: hy } = hPos;

                ctx.beginPath();
                ctx.arc(hx, hy, 15, 0, Math.PI * 2);
                ctx.fillStyle = "#10b981";
                ctx.globalAlpha = 0.4;
                ctx.fill();

                ctx.lineWidth = 1.5;
                ctx.strokeStyle = "#ffffff";
                ctx.globalAlpha = 0.8;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(hx, hy, 3, 0, Math.PI * 2);
                ctx.fillStyle = "#ffffff";
                ctx.globalAlpha = 1;
                ctx.fill();
            }
        }
    }
}

/**
 * Draws the reference image centered and scaled to cover the canvas.
 * Applies both camera transforms (if enabled) and manual transforms.
 * @param ctx 2D canvas context.
 * @param img HTML image element.
 * @param config Reference image configuration.
 * @param canvasWidth Canvas width.
 * @param canvasHeight Canvas height.
 * @param camera Camera state.
 */
function drawReferenceImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    config: ReferenceImage,
    canvasWidth: number,
    canvasHeight: number,
    camera: CameraState
): void {
    ctx.save();

    // 1. Move to center of canvas (pivot point for grid transforms)
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // 2. Apply Camera Zoom (if followZoom is true)
    if (config.followZoom) {
        ctx.scale(camera.zoom, camera.zoom);
    }

    // 3. Apply Camera/Horizon Rotation (if followHorizon is true)
    if (config.followHorizon) {
        ctx.rotate((camera.horizonAngle * Math.PI) / 180);
    }

    // 4. Apply Manual/Reference Scale
    ctx.scale(config.scale, config.scale);

    // 5. Apply Manual/Reference Rotation
    ctx.rotate((config.rotation * Math.PI) / 180);

    // 6. Apply Manual/Reference Pan (Offset)
    // NOTE: handleX/handleY are for the visual return animation and should NOT stay here 
    // permanently. They are handled by usePerspectiveGrid during drag.
    ctx.translate(config.offsetX, config.offsetY);

    // 7. Calculate base dimensions to cover canvas (Before transforms)
    const imgWidth = img.width;
    const imgHeight = img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let drawWidth, drawHeight;

    if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
    } else {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
    }

    ctx.globalAlpha = config.opacity;
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    ctx.restore();
}

/**
 * Renders interactive handles (circles) for VP control.
 * @param ctx 2D canvas context.
 * @param state Current perspective state.
 */
function renderHandles(
    ctx: CanvasRenderingContext2D,
    state: PerspectiveState
): void {
    const { handles, config } = state;

    const colors = {
        vp1: LINE_COLORS.vp1,
        vp2: LINE_COLORS.vp2,
        vp3: LINE_COLORS.vp3,
    };

    handles.forEach((handle) => {
        if (handle.id === "vp3" && config.type !== 3) return;
        if (handle.id === "vp2" && config.type === 1) return;

        // Handles use fixed screen position (ignores camera transforms)
        const screenCenterX = state.canvasWidth / 2;
        const restX = (handle.id === "vp1" && config.type === 1) ? 0 : handle.restX;
        const x = screenCenterX + restX + handle.x;
        const y = (state.canvasHeight / 2) + handle.y;

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = colors[handle.id as keyof typeof colors];
        ctx.globalAlpha = 0.4;
        ctx.fill();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1;
        ctx.fill();
    });
}

/**
 * Exports canvas content as a high-resolution PNG image (1920x1080).
 * Creates a temporary canvas to render the grid at export resolution.
 * @param state Current perspective state.
 * @param fileName Name of the file to be downloaded. Defaults to "perspective-grid".
 */
export function exportCanvasAsImage(
    state: PerspectiveState,
    fileName: string = "perspective-grid"
): void {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1920;
    exportCanvas.height = 1080;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Scale factors to map current canvas size to export resolution
    const scaleX = 1920 / state.canvasWidth;
    const scaleY = 1080 / state.canvasHeight;

    const scaledState: PerspectiveState = {
        ...state,
        canvasWidth: 1920,
        canvasHeight: 1080,
        camera: {
            ...state.camera,
            horizonY: state.camera.horizonY * scaleY,
            panX: state.camera.panX * scaleX,
            panY: state.camera.panY * scaleY,
        },
        vanishingPoints: state.vanishingPoints.map(vp => ({
            ...vp,
            distanceFromCenter: vp.distanceFromCenter * (vp.id === "vp3" ? scaleY : scaleX),
        })),
    };

    const lines = calculatePerspectiveLines(scaledState);
    renderGrid(ctx, lines, scaledState, false);

    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
}

/**
 * Identifies if a handle or vanishing point exists under the specified coordinates.
 * @param state Current perspective state.
 * @param x X coordinate on canvas.
 * @param y Y coordinate on canvas.
 * @param showUI If UI is visible (if false, returns null).
 * @param threshold Detection radius in pixels around the handle. Defaults to 25.
 * @returns The vanishing point ID ("vp1", "vp2", "vp3") or null if nothing is found.
 */
export function findVanishingPointAtPosition(
    state: PerspectiveState,
    x: number,
    y: number,
    showUI: boolean = true,
    threshold: number = 25
): string | null {
    if (!showUI) return null;

    const { handles, config } = state;
    const screenCenterX = state.canvasWidth / 2;
    const screenBaseY = state.canvasHeight / 2;

    for (const handle of handles) {
        if (handle.id === "vp3" && config.type !== 3) continue;
        if (handle.id === "vp2" && config.type === 1) continue;

        const restX = (handle.id === "vp1" && config.type === 1) ? 0 : handle.restX;
        const hx = screenCenterX + restX + handle.x;
        const hy = screenBaseY + handle.y;

        const dist = Math.hypot(x - hx, y - hy);
        if (dist < threshold) return handle.id;
    }
    return null;
}

/**
 * Updates the distance/position of a vanishing point based on mouse interaction with the handle.
 * @param state Current perspective state.
 * @param vpId ID of the vanishing point being updated ("vp1", "vp2", "vp3").
 * @param mouseX Current mouse X coordinate.
 * @param mouseY Current mouse Y coordinate.
 * @param initialDragState Initial state captured at drag start for relative calculations.
 * @returns A new PerspectiveState object with applied updates.
 */
export function updateVanishingPointDistance(
    state: PerspectiveState,
    vpId: string,
    mouseX: number,
    mouseY: number,
    initialDragState: { handleX: number; handleY: number; vpDist: number; vpx?: number } | null = null
): PerspectiveState {
    const screenCenterX = state.canvasWidth / 2;
    const screenBaseY = state.canvasHeight / 2;

    // Mouse position relative to screen center (fixed UI, ignores camera)
    const localX = mouseX - screenCenterX;
    const localY = mouseY - screenBaseY;

    // VP1/VP2: Horizontal movement only (along horizon line)
    if (vpId === "vp1" || vpId === "vp2") {
        const targetHandle = state.handles.find(h => h.id === vpId);
        if (!targetHandle || !initialDragState) return state;

        const restX = (vpId === "vp1" && state.config.type === 1) ? 0 : targetHandle.restX;
        const currentDisplacementX = localX - restX;
        const incrementalDeltaX = currentDisplacementX - initialDragState.handleX;

        // Convert screen displacement to world distance (compensate for zoom)
        const sensitivity = 1;
        const finalVpDist = initialDragState.vpDist + (incrementalDeltaX * sensitivity) / state.camera.zoom;

        return {
            ...state,
            handles: state.handles.map(h =>
                h.id === vpId ? { ...h, x: currentDisplacementX } : h
            ),
            vanishingPoints: state.vanishingPoints.map(vp =>
                vp.id === vpId ? { ...vp, distanceFromCenter: finalVpDist } : vp
            )
        };

        // VP3: Bidirectional movement (horizontal + vertical)
    } else if (vpId === "vp3") {
        const targetHandle = state.handles.find(h => h.id === vpId);
        if (!targetHandle || !initialDragState) return state;

        const currentDisplacementX = localX - targetHandle.restX;
        const currentDisplacementY = localY;

        const incrementalDeltaX = currentDisplacementX - initialDragState.handleX;
        const incrementalDeltaY = currentDisplacementY - initialDragState.handleY;

        const sensitivity = 1;
        const newVpX = (initialDragState.vpx || 0) + (incrementalDeltaX * sensitivity) / state.camera.zoom;
        const newVpDist = initialDragState.vpDist + (incrementalDeltaY * sensitivity) / state.camera.zoom;

        return {
            ...state,
            handles: state.handles.map(h =>
                h.id === vpId ? { ...h, x: currentDisplacementX, y: currentDisplacementY } : h
            ),
            vanishingPoints: state.vanishingPoints.map(vp =>
                vp.id === vpId ? {
                    ...vp,
                    x: newVpX,
                    distanceFromCenter: newVpDist
                } : vp
            ),
            config: {
                ...state.config,
                thirdPointOrientation: newVpDist < 0 ? "top" : "bottom"
            }
        };
    }

    return state;
}
