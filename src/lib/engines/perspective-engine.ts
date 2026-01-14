// @ts-check
/**
 * @module perspective-engine
 * @description Perspective geometry calculation engine
 * 
 * 3D grid implementation with mesh:
 * - Lines distributed by projected distance in 3D space
 * - Creates depth effect with perspective compression
 * - Lines from different VPs intersect forming planes
 */

export interface VanishingPoint {
    x: number;
    y: number;
    id: string;
    distanceFromCenter: number;
}

export interface Handle {
    x: number;
    y: number;
    id: string; // vp1, vp2, vp3
    restX: number; // Resting X position relative to horizon center
}

export interface GridConfig {
    type: 1 | 2 | 3;
    thirdPointOrientation: "top" | "bottom";
    density: "low" | "medium" | "high";
}

export interface CameraState {
    horizonY: number;
    horizonAngle: number;
    panX: number;
    panY: number;
    zoom: number;
}

export interface Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    opacity: number;
    width: number;
}

export interface PerspectiveState {
    vanishingPoints: VanishingPoint[];
    handles: Handle[];
    config: GridConfig;
    camera: CameraState;
    canvasWidth: number;
    canvasHeight: number;
}


// Number of lines for VP3 (third point) - different values from other VPs
const VP3_LINE_COUNT = {
    low: 96,
    medium: 192,
    high: 384,
};

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
        // Initial vanishing points positions
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
 * Calculates the vanishing point coordinates (x, y) transformed by the camera (pan, zoom, rotation).
 * @param state The current perspective state.
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

    // VP1 e VP2 na linha do horizonte
    for (let i = 0; i < 2; i++) {
        const vp = vanishingPoints[i];
        const dist = vp.distanceFromCenter * camera.zoom;
        const x = centerX + dist * Math.cos(angleRad);
        const y = centerY + dist * Math.sin(angleRad);
        transformed.push({ x, y, id: vp.id });
    }

    // VP3 above or below (now omnidirectional)
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
 * @param state The current perspective state.
 * @returns Array of lines ready to be rendered.
 */
export function calculatePerspectiveLines(state: PerspectiveState): Line[] {
    const lines: Line[] = [];
    const { config, camera, canvasWidth, canvasHeight } = state;
    const transformedVPs = getTransformedVanishingPoints(state);
    const centerX = canvasWidth / 2 + camera.panX;
    const centerY = camera.horizonY + camera.panY;
    const angleRad = (camera.horizonAngle * Math.PI) / 180;

    // Horizon line
    const lineLength = Math.max(canvasWidth, canvasHeight) * 3;
    lines.push({
        x1: centerX - lineLength * Math.cos(angleRad),
        y1: centerY - lineLength * Math.sin(angleRad),
        x2: centerX + lineLength * Math.cos(angleRad),
        y2: centerY + lineLength * Math.sin(angleRad),
        color: LINE_COLORS.horizon,
        opacity: 3,
        width: 1.5,
    });

    // Colors for each VP
    const vpColors = [LINE_COLORS.vp1, LINE_COLORS.vp2, LINE_COLORS.vp3];

    // Create omnidirectional radial lines for each active VP
    // VP1 and VP2 use vertical compression (dense at horizon)
    // VP3 uses horizontal compression (dense at vertical center)
    for (let i = 0; i < Math.min(config.type, 2); i++) {
        const vp = transformedVPs[i];
        const color = vpColors[i];
        lines.push(...createRadialLinesFromVP(vp, config.density, canvasWidth, canvasHeight, color, angleRad));
    }

    // VP3 uses specific function with uniform distribution
    if (config.type === 3) {
        const vp3 = transformedVPs[2];
        lines.push(...createRadialLinesForVP3(vp3, config.density, canvasWidth, canvasHeight, LINE_COLORS.vp3, angleRad));
    }

    return lines;
}

/**
 * Creates omnidirectional radial lines (360°) with perspective compression.
 * The lines cover the entire space around the VP, with higher density
 * near the horizontal and vertical axes (depth effect).
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
    // Distribution of lines in 360°
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

        // Clip to canvas
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
 * The lines pass through point VP3, uniformly distributed over 180°
 * (each line covers 180° passing through VP3).
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

    // Distribute lines uniformly in 180° (each line passes through VP3)
    // We rotate along with the horizon (angleOffset) + 90° (perpendicular)
    const step = Math.PI / count;

    for (let i = 0; i < count; i++) {
        const angle = (i * step) + angleOffset + Math.PI / 2;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Line passes through VP3 in both directions
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
 * Generates angles with geometric increment to avoid overlap at VPs.
 * Based on the reference site logic.
 */
function getGeometricAngles(density: "low" | "medium" | "high"): number[] {
    // factorMap: the larger the value, the faster the lines move away from the main axis
    const factorMap = { low: 0.18, medium: 0.11, high: 0.05 };
    // baseAngleMap: the first angular jump coming off the axis
    const baseAngleMap = { low: 0.012, medium: 0.006, high: 0.003 };

    const spreadFactor = factorMap[density];
    const baseAngle = baseAngleMap[density];

    const angles: number[] = [0];
    let currentAngle = 0;
    let increment = baseAngle;

    // Generate angles up to Math.PI / 2 (90 degrees) in both directions
    // This covers 180 degrees of tilts, which extended cover 360
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

function clipLine(
    x1: number, y1: number, x2: number, y2: number,
    minX: number, minY: number, maxX: number, maxY: number
): { x1: number; y1: number; x2: number; y2: number } | null {
    // Simplified Cohen-Sutherland
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
 */
export function renderGrid(
    ctx: CanvasRenderingContext2D,
    lines: Line[],
    state: PerspectiveState,
    showUI: boolean = true
): void {
    const { canvasWidth, canvasHeight } = state;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw lines
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

    // 4. Render UI (Handles and Real Vanishing Points)
    if (showUI) {
        // Vanishing points with subtle halo + white center
        const transformedVPs = getTransformedVanishingPoints(state);
        const vpColors = [LINE_COLORS.vp1, LINE_COLORS.vp2, LINE_COLORS.vp3];

        for (let i = 0; i < state.config.type; i++) {
            const vp = transformedVPs[i];

            // Small white center (2.5px) - clean vanishing point
            ctx.beginPath();
            ctx.arc(vp.x, vp.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 1;
            ctx.fill();

            // Subtle halo (optional, to help visibility if too far)
            ctx.beginPath();
            ctx.arc(vp.x, vp.y, 8, 0, Math.PI * 2);
            ctx.strokeStyle = vpColors[i];
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            ctx.stroke();
        }

        renderHandles(ctx, state);
    }
}

/**
 * Renders interactive handles (circles) for VP control.
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
        // Skip VP3 if not in 3-point mode, or VP2 if in 1-point mode
        if (handle.id === "vp3" && config.type !== 3) return;
        if (handle.id === "vp2" && config.type === 1) return;

        // ABSOLUTE SCREEN ANCHOR: Handles stay in fixed positions on canvas, like dashboard buttons.
        // They completely ignore horizonY, panX, panY, zoom, and horizonAngle.
        // Positioned at center for easy access.
        const screenCenterX = state.canvasWidth / 2;
        const restX = (handle.id === "vp1" && config.type === 1) ? 0 : handle.restX;
        const x = screenCenterX + restX + handle.x;
        const y = (state.canvasHeight / 2) + handle.y;

        // 1. Semi-transparent aura
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = colors[handle.id as keyof typeof colors];
        ctx.globalAlpha = 0.4;
        ctx.fill();

        // 2. Subtle border
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.8;
        ctx.stroke();

        // 3. Central white dot
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
    renderGrid(ctx, lines, scaledState);

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

    // Mouse distance relative to fixed screen anchor
    // We completely ignore horizon rotation for handle control (fixed UI)
    const localX = mouseX - screenCenterX;
    const localY = mouseY - screenBaseY;

    if (vpId === "vp1" || vpId === "vp2") {
        const targetHandle = state.handles.find(h => h.id === vpId);
        if (!targetHandle || !initialDragState) return state;

        const restX = (vpId === "vp1" && state.config.type === 1) ? 0 : targetHandle.restX;
        // VISUAL OFFSET on screen (absolute horizontal movement)
        const dragDeltaX = localX - restX;

        // UPDATE VP (WORLD):
        // Since the control is now an absolute UI, we move the VP based on delta
        // But we respect amplified sensitivity for larger ranges.
        const sensitivity = 1;
        const finalVpDist = initialDragState.vpDist + (dragDeltaX * sensitivity) / state.camera.zoom;

        return {
            ...state,
            handles: state.handles.map(h =>
                h.id === vpId ? { ...h, x: dragDeltaX } : h
            ),
            vanishingPoints: state.vanishingPoints.map(vp =>
                vp.id === vpId ? { ...vp, distanceFromCenter: finalVpDist } : vp
            )
        };

    } else if (vpId === "vp3") {
        const targetHandle = state.handles.find(h => h.id === vpId);
        if (!targetHandle || !initialDragState) return state;

        const dragDeltaX = localX - targetHandle.restX;
        const dragDeltaY = localY;

        const sensitivity = 1;
        const newVpX = (initialDragState.vpx || 0) + (dragDeltaX * sensitivity) / state.camera.zoom;
        const newVpDist = initialDragState.vpDist + (dragDeltaY * sensitivity) / state.camera.zoom;

        return {
            ...state,
            handles: state.handles.map(h =>
                h.id === vpId ? { ...h, x: dragDeltaX, y: dragDeltaY } : h
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
