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
    low: 48,      // Corresponde a LOOSE na referência
    medium: 96,   // Corresponde a NORMAL na referência
    high: 192,     // Corresponde a TIGHT na referência
};

// Número de linhas para VP3 (terceiro ponto) - valores diferentes dos outros VPs
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
            { id: "vp3", x: 0, y: 0, distanceFromCenter: -canvasHeight * 3 },
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

    // VP3 acima ou abaixo (agora omnidirecional)
    const vp3 = vanishingPoints[2];
    const vp3Dist = vp3.distanceFromCenter * camera.zoom;
    const vp3OffsetX = vp3.x * camera.zoom;

    // VP3 é transformado em relação ao centro do horizonte, 
    // rotacionado junto com o ângulo do horizonte para manter consistência
    const transformedVP3X = centerX + vp3OffsetX * Math.cos(angleRad) - vp3Dist * Math.sin(angleRad);
    const transformedVP3Y = centerY + vp3OffsetX * Math.sin(angleRad) + vp3Dist * Math.cos(angleRad);

    transformed.push({ x: transformedVP3X, y: transformedVP3Y, id: vp3.id });

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
        opacity: 3,
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
        lines.push(...createRadialLinesFromVP(vp, config.density, canvasWidth, canvasHeight, color, angleRad));
    }

    // VP3 usa função específica com distribuição uniforme
    if (config.type === 3) {
        const vp3 = transformedVPs[2];
        lines.push(...createRadialLinesForVP3(vp3, config.density, canvasWidth, canvasHeight, LINE_COLORS.vp3, angleRad));
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
    density: "low" | "medium" | "high",
    canvasWidth: number,
    canvasHeight: number,
    color: string,
    angleOffset: number
): Line[] {
    const lines: Line[] = [];
    // Distribuição das linhas em 360°
    const maxDist = Math.hypot(canvasWidth, canvasHeight) * 5;

    // Distribuir linhas em 360° usando meia volta por linha (cada linha atravessa o VP)
    const angles = getGeometricAngles(density);

    for (const angle of angles) {
        // Rotacionar os ângulos base de acordo com a inclinação do horizonte
        const finalAngle = angle + angleOffset;
        const cos = Math.cos(finalAngle);
        const sin = Math.sin(finalAngle);

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
                opacity: 0.75,
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
    density: "low" | "medium" | "high",
    canvasWidth: number,
    canvasHeight: number,
    color: string,
    angleOffset: number
): Line[] {
    const lines: Line[] = [];
    const count = VP3_LINE_COUNT[density];

    // Calcular a distância do VP3 ao centro do canvas
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const distToCenter = Math.hypot(vp.x - centerX, vp.y - centerY);

    // maxDist precisa ser maior que a distância do VP ao canvas + margem
    const baseDist = Math.hypot(canvasWidth, canvasHeight) * 5;
    const maxDist = Math.max(baseDist, distToCenter * 2 + baseDist);

    // Distribuir linhas uniformemente em 180° (cada linha passa pelo VP3)
    // Rotacionamos junto com o horizonte (angleOffset) + 90° (perpendicular)
    const step = Math.PI / count;

    for (let i = 0; i < count; i++) {
        const angle = (i * step) + angleOffset + Math.PI / 2;

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
                opacity: 2,
                width: 1,
            });
        }
    }

    return lines;
}

/**
 * Gera ângulos com incremento geométrico para evitar manchas nos VPs.
 * Baseado na lógica do site de referência.
 */
function getGeometricAngles(density: "low" | "medium" | "high"): number[] {
    // factorMap: quanto maior, mais rápido as linhas se afastam do eixo principal
    const factorMap = { low: 0.18, medium: 0.11, high: 0.05 };
    // baseAngleMap: o primeiro salto angular saindo do eixo
    const baseAngleMap = { low: 0.012, medium: 0.006, high: 0.003 };

    const spreadFactor = factorMap[density];
    const baseAngle = baseAngleMap[density];

    const angles: number[] = [0];
    let currentAngle = 0;
    let increment = baseAngle;

    // Gera ângulos até Math.PI / 2 (90 graus) em ambas as direções
    // Isso cobre 180 graus de inclinações, que estendidas cobrem 360
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

    // Pontos de fuga com halo sutil + centro branco (técnica da referência)
    const transformedVPs = getTransformedVanishingPoints(state);
    const colors = [LINE_COLORS.vp1, LINE_COLORS.vp2, LINE_COLORS.vp3];

    for (let i = 0; i < config.type; i++) {
        const vp = transformedVPs[i];

        // 1. Halo sutil (20px, baixa opacidade) - suaviza convergência
        ctx.beginPath();
        ctx.arc(vp.x, vp.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.globalAlpha = 0.15;
        ctx.fill();

        // 2. Centro branco pequeno (2.5px) - ponto de fuga limpo
        ctx.beginPath();
        ctx.arc(vp.x, vp.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1;
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
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        // Projetar a posição do mouse nos eixos local (rotacionados)
        // O eixo "Y local" do VP3 é perpendicular ao horizonte (sen/cos invertidos)
        // O eixo "X local" do VP3 é paralelo ao horizonte

        const localX = dx * Math.cos(angleRad) + dy * Math.sin(angleRad);
        const localY = -dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

        return {
            ...state,
            vanishingPoints: state.vanishingPoints.map(vp =>
                vp.id === vpId ? {
                    ...vp,
                    x: localX / state.camera.zoom,
                    distanceFromCenter: localY / state.camera.zoom
                } : vp
            ),
            config: { ...state.config, thirdPointOrientation: localY < 0 ? "top" : "bottom" },
        };
    }
    return state;
}
