// @ts-check
/**
 * @module usePerspectiveGrid
 * @description Hook para gerenciar o estado do Perspective Grid
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
    PerspectiveState,
    GridConfig,
    createInitialState,
    calculatePerspectiveLines,
    renderGrid,
    exportCanvasAsImage,
    findVanishingPointAtPosition,
    updateVanishingPointDistance,
} from "@/lib/engines/perspective-engine";

export function usePerspectiveGrid(
    canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
    const [state, setState] = useState<PerspectiveState | null>(null);
    const [isDragging, setIsDragging] = useState<string | null>(null);
    const [isPanning, setIsPanning] = useState(false);
    const lastPanPos = useRef<{ x: number; y: number } | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Inicializar estado quando o canvas estiver disponível
    const initialize = useCallback((width: number, height: number) => {
        const initialState = createInitialState(width, height);
        setState(initialState);
    }, []);

    // Atualizar configuração do grid
    const updateConfig = useCallback((updates: Partial<GridConfig>) => {
        setState((prev) => {
            if (!prev) return prev;

            const newConfig = { ...prev.config, ...updates };

            // Sincronizar posição do ponto vertical se a orientação mudar via botão
            let newVPs = prev.vanishingPoints;
            if (updates.thirdPointOrientation && updates.thirdPointOrientation !== prev.config.thirdPointOrientation) {
                newVPs = prev.vanishingPoints.map(vp => {
                    if (vp.id === "vp3") {
                        // Inverter sinal da distância para mover o ponto para o lado oposto
                        const currentDist = vp.distanceFromCenter;
                        const isTop = updates.thirdPointOrientation === "top";
                        const newDist = isTop ? -Math.abs(currentDist) : Math.abs(currentDist);
                        return { ...vp, distanceFromCenter: newDist };
                    }
                    return vp;
                });
            }

            return {
                ...prev,
                config: newConfig,
                vanishingPoints: newVPs
            };
        });
    }, []);

    // Atualizar posição Y do horizonte
    const updateHorizonY = useCallback((deltaY: number) => {
        setState((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                camera: {
                    ...prev.camera,
                    horizonY: prev.camera.horizonY + deltaY,
                },
            };
        });
    }, []);

    // Atualizar ângulo do horizonte
    const updateHorizonAngle = useCallback((angle: number) => {
        setState((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                camera: { ...prev.camera, horizonAngle: angle },
            };
        });
    }, []);

    // Pan da câmera
    const updatePan = useCallback((deltaX: number, deltaY: number) => {
        setState((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                camera: {
                    ...prev.camera,
                    panX: prev.camera.panX + deltaX,
                    panY: prev.camera.panY + deltaY,
                },
            };
        });
    }, []);

    // Zoom da câmera
    const updateZoom = useCallback((delta: number, centerX: number, centerY: number) => {
        setState((prev) => {
            if (!prev) return prev;

            const newZoom = Math.max(0.1, Math.min(5, prev.camera.zoom + delta));

            // Ajustar pan para manter o ponto sob o cursor fixo
            const zoomRatio = newZoom / prev.camera.zoom;
            const newPanX = centerX - (centerX - prev.camera.panX) * zoomRatio;
            const newPanY = centerY - (centerY - prev.camera.panY) * zoomRatio;

            return {
                ...prev,
                camera: {
                    ...prev.camera,
                    zoom: newZoom,
                    panX: prev.camera.panX, // Simplificado por enquanto
                    panY: prev.camera.panY,
                },
            };
        });
    }, []);

    // Handler para mouse down
    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!state || !canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Verificar se clicou em algum ponto de fuga
            const vpId = findVanishingPointAtPosition(state, x, y);

            if (vpId) {
                setIsDragging(vpId);
            } else {
                // Iniciar pan
                setIsPanning(true);
                lastPanPos.current = { x: e.clientX, y: e.clientY };
            }
        },
        [state, canvasRef]
    );

    // Handler para mouse move
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!state || !canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (isDragging) {
                // Arrastar ponto de fuga
                const newState = updateVanishingPointDistance(state, isDragging, x, y);
                setState(newState);
            } else if (isPanning && lastPanPos.current) {
                // Pan
                const deltaX = e.clientX - lastPanPos.current.x;
                const deltaY = e.clientY - lastPanPos.current.y;
                updatePan(deltaX, deltaY);
                lastPanPos.current = { x: e.clientX, y: e.clientY };
            }
        },
        [state, isDragging, isPanning, updatePan]
    );

    // Handler para mouse up
    const handleMouseUp = useCallback(() => {
        setIsDragging(null);
        setIsPanning(false);
        lastPanPos.current = null;
    }, []);

    // Handler para wheel (zoom)
    const handleWheel = useCallback(
        (e: React.WheelEvent<HTMLCanvasElement>) => {
            e.preventDefault();

            if (!canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            updateZoom(delta, x, y);
        },
        [canvasRef, updateZoom]
    );

    // Resetar para estado inicial
    const reset = useCallback(() => {
        if (!state) return;
        const newState = createInitialState(state.canvasWidth, state.canvasHeight);
        setState(newState);
    }, [state]);

    // Exportar grid como imagem
    const exportImage = useCallback(() => {
        if (canvasRef.current && state) {
            exportCanvasAsImage(canvasRef.current, state, "perspective-grid");
        }
    }, [canvasRef, state]);

    // Renderizar grid quando o estado mudar
    useEffect(() => {
        if (!state || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Cancelar frame anterior se existir
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Renderizar no próximo frame
        animationFrameRef.current = requestAnimationFrame(() => {
            const lines = calculatePerspectiveLines(state);
            renderGrid(ctx, lines, state);
        });

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [state, canvasRef]);

    return {
        state,
        isDragging,
        isPanning,
        initialize,
        updateConfig,
        updateHorizonY,
        updateHorizonAngle,
        updateZoom,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel,
        reset,
        exportImage,
    };
}
