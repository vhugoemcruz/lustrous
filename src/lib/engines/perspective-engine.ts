// @ts-check
/**
 * @module perspective-engine
 * @description Motor de cálculo de geometria de perspectiva
 * 
 * Implementação de grid 3D com malha (mesh):
 * - Linhas distribuídas por distância projetada no espaço 3D
 * - Cria efeito de profundidade com compressão perspectiva
 * - Linhas de VPs diferentes se cruzam formando planos
 */

export interface VanishingPoint {
    x: number;
    y: number;
    id: string;
    distanceFromCenter: number;
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
    config: GridConfig;
    camera: CameraState;
    canvasWidth: number;
    canvasHeight: number;
}

// Número de linhas por VP por densidade (dobrado por nível)
const LINE_COUNT = {
    low: 24,      // Corresponde a LOOSE na referência
    medium: 48,   // Corresponde a NORMAL na referência
    high: 96,     // Corresponde a TIGHT na referência
};

const LINE_COLORS = {
    vp1: "#22b8cf",
    vp2: "#be4bdb",
    vp3: "#fd7e14",
    horizon: "#fab005",
};

export function createInitialState(
    canvasWidth: number,
    canvasHeight: number
): PerspectiveState {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    return {
        // Initial vanishing points positions
        vanishingPoints: [
            { id: "vp1", x: 0, y: 0, distanceFromCenter: -canvasWidth * 0.35 },
            { id: "vp2", x: 0, y: 0, distanceFromCenter: canvasWidth * 0.35 },
            { id: "vp3", x: 0, y: 0, distanceFromCenter: -canvasHeight * 2.5 },
        ],
        config: {
            type: 2,
            thirdPointOrientation: "top",
            density: "medium",
        },
        camera: {
            horizonY: centerY,
            horizonAngle: 0,
            panX: 0,
            panY: 0,
            zoom: 1,
        },
        canvasWidth,
        canvasHeight,
    };
}

export function getTransformedVanishingPoints(
    state: PerspectiveState
): { x: number; y: number; id: string }[] {
    const { vanishingPoints, camera, canvasWidth, config } = state;
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

    // VP3 acima ou abaixo
    const vp3 = vanishingPoints[2];
    const vp3Distance = Math.abs(vp3.distanceFromCenter) * camera.zoom;
    const vp3Y = config.thirdPointOrientation === "top"
        ? centerY - vp3Distance
        : centerY + vp3Distance;
    transformed.push({ x: centerX, y: vp3Y, id: vp3.id });

    return transformed;
}

export function calculatePerspectiveLines(state: PerspectiveState): Line[] {
    const lines: Line[] = [];
    const { config, camera, canvasWidth, canvasHeight } = state;
    const lineCount = LINE_COUNT[config.density];
    const transformedVPs = getTransformedVanishingPoints(state);
    const centerX = canvasWidth / 2 + camera.panX;
    const centerY = camera.horizonY + camera.panY;
    const angleRad = (camera.horizonAngle * Math.PI) / 180;

    // Linha do horizonte
    const lineLength = Math.max(canvasWidth, canvasHeight) * 3;
    lines.push({
        x1: centerX - lineLength * Math.cos(angleRad),
        y1: centerY - lineLength * Math.sin(angleRad),
        x2: centerX + lineLength * Math.cos(angleRad),
        y2: centerY + lineLength * Math.sin(angleRad),
        color: LINE_COLORS.horizon,
        opacity: 0.9,
        width: 1.5,
    });

    // Cores para cada VP
    const vpColors = [LINE_COLORS.vp1, LINE_COLORS.vp2, LINE_COLORS.vp3];

    // Criar linhas radiais omnidirecionais para cada VP ativo
    // VP1 e VP2 usam compressão vertical (denso no horizonte)
    // VP3 usa compressão horizontal (denso no centro vertical)
    for (let i = 0; i < Math.min(config.type, 2); i++) {
        const vp = transformedVPs[i];
        const color = vpColors[i];
        lines.push(...createRadialLinesFromVP(vp, lineCount, canvasWidth, canvasHeight, color));
    }

    // VP3 usa função específica com compressão horizontal
    if (config.type === 3) {
        const vp3 = transformedVPs[2];
        lines.push(...createRadialLinesForVP3(vp3, lineCount, canvasWidth, canvasHeight, LINE_COLORS.vp3));
    }

    return lines;
}

/**
 * Cria linhas radiais omnidirecionais (360°) com compressão perspectiva.
 * As linhas cobrem todo o espaço ao redor do VP, com maior densidade
 * perto dos eixos horizontal e vertical (efeito de profundidade).
 */
function createRadialLinesFromVP(
    vp: { x: number; y: number },
    count: number,
    canvasWidth: number,
    canvasHeight: number,
    color: string
): Line[] {
    const lines: Line[] = [];
    const maxDist = Math.hypot(canvasWidth, canvasHeight) * 1.5;

    // Distribuir linhas em 360° usando meia volta por linha (cada linha atravessa o VP)
    // Usamos tangente para compressão perspectiva, mas escalada para cobrir 180°
    // (a outra metade é coberta pela extensão da linha através do VP)

    for (let i = 0; i < count; i++) {
        // t vai de -1 a +1 ao longo do count
        // Isso distribui uniformemente no espaço "virtual" que será comprimido
        const t = ((i + 0.5) / count) * 2 - 1; // -1 a +1

        // Usar atan para compressão perspectiva
        // atan(t * largeFactor) estica o mapeamento para cobrir quase π radianos
        // Fator ~10 dá boa compressão com cobertura ampla
        // atan(10) ≈ 1.47 rad, então range ≈ 2.94 rad ≈ 168°
        // Multiplicamos por PI/3 para escalar de ~2.94 rad para ~π (180°)
        const compressedAngle = Math.atan(t * 10) * (Math.PI / 2.94);

        // Centralizar em 90° (vertical) para que compressão fique no horizonte
        const angle = compressedAngle + Math.PI / 2;

        // Calcular pontos nas duas extremidades da linha passando pelo VP
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const x1 = vp.x + cos * maxDist;
        const y1 = vp.y + sin * maxDist;
        const x2 = vp.x - cos * maxDist;
        const y2 = vp.y - sin * maxDist;

        // Clipar ao canvas
        const clipped = clipLine(x1, y1, x2, y2, 0, 0, canvasWidth, canvasHeight);

        if (clipped) {
            lines.push({
                x1: clipped.x1,
                y1: clipped.y1,
                x2: clipped.x2,
                y2: clipped.y2,
                color,
                opacity: 0.5,
                width: 1,
            });
        }
    }

    return lines;
}

/**
 * Cria linhas radiais omnidirecionais (360°) para VP3.
 * As linhas atravessam o ponto VP3, distribuídas uniformemente em 180°
 * (cada linha cobre 180° passando pelo VP3).
 */
function createRadialLinesForVP3(
    vp: { x: number; y: number },
    count: number,
    canvasWidth: number,
    canvasHeight: number,
    color: string
): Line[] {
    const lines: Line[] = [];
    const maxDist = Math.hypot(canvasWidth, canvasHeight) * 1.5;

    // Distribuir linhas em 360° (cada linha passa pelo VP3, cobrindo 180° em cada direção)
    for (let i = 0; i < count; i++) {
        // Ângulo uniformemente distribuído de 0 a PI (180°)
        // A outra metade é coberta pela extensão da linha através do VP
        const angle = (i / count) * Math.PI;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Linha atravessa o VP3 em ambas as direções
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
                opacity: 0.5,
                width: 1,
            });
        }
    }

    return lines;
}

function clipLine(
    x1: number, y1: number, x2: number, y2: number,
    minX: number, minY: number, maxX: number, maxY: number
): { x1: number; y1: number; x2: number; y2: number } | null {
    // Cohen-Sutherland simplificado
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

export function renderGrid(
    ctx: CanvasRenderingContext2D,
    lines: Line[],
    state: PerspectiveState
): void {
    const { canvasWidth, canvasHeight, config } = state;

    // Fundo branco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Desenhar linhas
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

    // Pontos de fuga (círculos simples)
    const transformedVPs = getTransformedVanishingPoints(state);
    const colors = [LINE_COLORS.vp1, LINE_COLORS.vp2, LINE_COLORS.vp3];

    for (let i = 0; i < config.type; i++) {
        const vp = transformedVPs[i];
        ctx.beginPath();
        ctx.arc(vp.x, vp.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
    }
}

export function exportCanvasAsImage(
    canvas: HTMLCanvasElement,
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

export function findVanishingPointAtPosition(
    state: PerspectiveState,
    x: number,
    y: number,
    threshold: number = 20
): string | null {
    const transformedVPs = getTransformedVanishingPoints(state);

    for (let i = 0; i < state.config.type; i++) {
        const vp = transformedVPs[i];
        const dist = Math.sqrt((x - vp.x) ** 2 + (y - vp.y) ** 2);
        if (dist < threshold) return vp.id;
    }
    return null;
}

export function updateVanishingPointDistance(
    state: PerspectiveState,
    vpId: string,
    mouseX: number,
    mouseY: number
): PerspectiveState {
    const centerX = state.canvasWidth / 2 + state.camera.panX;
    const centerY = state.camera.horizonY + state.camera.panY;
    const angleRad = (state.camera.horizonAngle * Math.PI) / 180;

    if (vpId === "vp1" || vpId === "vp2") {
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const projection = dx * Math.cos(angleRad) + dy * Math.sin(angleRad);

        return {
            ...state,
            vanishingPoints: state.vanishingPoints.map(vp =>
                vp.id === vpId ? { ...vp, distanceFromCenter: projection / state.camera.zoom } : vp
            ),
        };
    } else if (vpId === "vp3") {
        const dy = mouseY - centerY;
        return {
            ...state,
            vanishingPoints: state.vanishingPoints.map(vp =>
                vp.id === vpId ? { ...vp, distanceFromCenter: dy / state.camera.zoom } : vp
            ),
            config: { ...state.config, thirdPointOrientation: dy < 0 ? "top" : "bottom" },
        };
    }
    return state;
}
