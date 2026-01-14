// @ts-check
/**
 * @module usePerspectiveGrid
 * @description Hook to manage the Perspective Grid state
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

/**
 * Hook to manage the Perspective Grid state and interactions.
 * Provides logic for manipulating vanishing points, pan, zoom, and rendering.
 * 
 * @param canvasRef Reference to the HTMLCanvasElement.
 * @param hideUI If true, hides interface elements (handles and vanishing points) during rendering.
 * @returns An object containing the current state and event handlers for the canvas.
 */
export function usePerspectiveGrid(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    hideUI: boolean = false
) {
    const [state, setState] = useState<PerspectiveState | null>(null);
    const [isDragging, setIsDragging] = useState<string | null>(null);
    const initialDragState = useRef<{ handleX: number; handleY: number; vpDist: number; vpx?: number } | null>(null);
    const [isPanning, setIsPanning] = useState(false);
    const lastPanPos = useRef<{ x: number; y: number } | null>(null);
    const renderFrameRef = useRef<number | null>(null);
    const returnAnimFrameRef = useRef<number | null>(null);

    // Initialize state when canvas is available
    const initialize = useCallback((width: number, height: number) => {
        const initialState = createInitialState(width, height);
        setState(initialState);
    }, []);

    // Update grid configuration
    const updateConfig = useCallback((updates: Partial<GridConfig>) => {
        setState((prev) => {
            if (!prev) return prev;

            const newConfig = { ...prev.config, ...updates };

            // Sync vertical point position if orientation changes via button
            let newVPs = prev.vanishingPoints;
            if (updates.thirdPointOrientation && updates.thirdPointOrientation !== prev.config.thirdPointOrientation) {
                newVPs = prev.vanishingPoints.map(vp => {
                    if (vp.id === "vp3") {
                        // Invert distance sign to move point to opposite side
                        const currentDist = vp.distanceFromCenter;
                        const isTop = updates.thirdPointOrientation === "top";
                        const newDist = isTop ? -Math.abs(currentDist) : Math.abs(currentDist);
                        return { ...vp, distanceFromCenter: newDist };
                    }
                    return vp;
                });
            }

            // Automatically center VP1 when switching to 1 vanishing point
            if (updates.type === 1) {
                newVPs = newVPs.map(vp => {
                    if (vp.id === "vp1") {
                        return { ...vp, distanceFromCenter: 0 };
                    }
                    return vp;
                });
            }

            // Restore balanced offsets when moving from 1 point to 2 or 3 points
            if ((updates.type === 2 || updates.type === 3) && prev.config.type === 1) {
                newVPs = newVPs.map(vp => {
                    if (vp.id === "vp1") {
                        return { ...vp, distanceFromCenter: -prev.canvasWidth * 0.35 };
                    }
                    if (vp.id === "vp2") {
                        return { ...vp, distanceFromCenter: prev.canvasWidth * 0.35 };
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

    // Update horizon Y position
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

    // Update horizon angle
    const updateHorizonAngle = useCallback((angle: number) => {
        setState((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                camera: { ...prev.camera, horizonAngle: angle },
            };
        });
    }, []);

    // Camera pan
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

    // Camera zoom
    const updateZoom = useCallback((delta: number) => {
        setState((prev) => {
            if (!prev) return prev;

            const newZoom = Math.max(0.1, Math.min(5, prev.camera.zoom + delta));

            // Adjust pan to keep point under cursor fixed
            // const zoomRatio = newZoom / prev.camera.zoom;
            // const newPanX = centerX - (centerX - prev.camera.panX) * zoomRatio;
            // const newPanY = centerY - (centerY - prev.camera.panY) * zoomRatio;

            return {
                ...prev,
                camera: {
                    ...prev.camera,
                    zoom: newZoom,
                    panX: prev.camera.panX, // Simplified for now
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

            // Check if clicked on any handle (interactive dot)
            const vpId = findVanishingPointAtPosition(state, x, y, !hideUI);

            if (vpId) {
                const handle = state.handles.find(h => h.id === vpId);
                const vp = state.vanishingPoints.find(v => v.id === vpId);

                if (handle && vp) {
                    initialDragState.current = {
                        handleX: handle.x,
                        handleY: handle.y,
                        vpDist: vp.distanceFromCenter, // World space
                        vpx: vp.id === "vp3" ? (vp.x || 0) : undefined // World space
                    };
                    setIsDragging(vpId);
                }
            } else {
                // Start panning
                setIsPanning(true);
                lastPanPos.current = { x: e.clientX, y: e.clientY };
            }
        },
        [state, canvasRef, hideUI]
    );

    // Handler para mouse move
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!state || !canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (isDragging && initialDragState.current) {
                // Drag vanishing point incrementally
                const newState = updateVanishingPointDistance(
                    state,
                    isDragging,
                    x,
                    y,
                    initialDragState.current
                );
                setState(newState);
            } else if (isPanning && lastPanPos.current) {
                // Panning
                const deltaX = e.clientX - lastPanPos.current.x;
                const deltaY = e.clientY - lastPanPos.current.y;
                updatePan(deltaX, deltaY);
                lastPanPos.current = { x: e.clientX, y: e.clientY };
            }
        },
        [state, isDragging, isPanning, updatePan, canvasRef]
    );

    // Handler para mouse up
    const handleMouseUp = useCallback(() => {
        setIsDragging((prevDragging) => {
            if (prevDragging) {
                // Start return animation
                const startTime = performance.now();
                const duration = 250; // ms

                // Capture initial values for animation
                let initialX = 0;
                let initialY = 0;

                setState(prev => {
                    if (!prev) return prev;
                    const h = prev.handles.find(h => h.id === prevDragging);
                    if (h) {
                        initialX = h.x;
                        initialY = h.y;
                    }
                    return prev;
                });

                const animate = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing: easeOutQuad
                    const ease = 1 - (1 - progress) * (1 - progress);

                    setState((prev) => {
                        if (!prev) return prev;
                        const newHandles = prev.handles.map(h => {
                            if (h.id === prevDragging) {
                                return {
                                    ...h,
                                    x: initialX * (1 - ease),
                                    y: initialY * (1 - ease)
                                };
                            }
                            return h;
                        });
                        return { ...prev, handles: newHandles };
                    });

                    if (progress < 1) {
                        returnAnimFrameRef.current = requestAnimationFrame(animate);
                    } else {
                        returnAnimFrameRef.current = null;
                        // Ensure it reaches exactly 0
                        setState(prev => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                handles: prev.handles.map(h =>
                                    h.id === prevDragging ? { ...h, x: 0, y: 0 } : h
                                )
                            };
                        });
                    }
                };

                returnAnimFrameRef.current = requestAnimationFrame(animate);
            }
            initialDragState.current = null;
            return null;
        });
        setIsPanning(false);
        lastPanPos.current = null;
    }, []);

    // Wheel handler (zoom)
    const handleWheel = useCallback(
        (e: React.WheelEvent<HTMLCanvasElement>) => {
            e.preventDefault();

            if (!canvasRef.current) return;

            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            updateZoom(delta);
        },
        [canvasRef, updateZoom]
    );

    // Reset to initial state
    const reset = useCallback(() => {
        if (!state) return;
        const newState = createInitialState(state.canvasWidth, state.canvasHeight);
        setState(newState);
    }, [state]);

    // Export grid as image
    const exportImage = useCallback(() => {
        if (state) {
            exportCanvasAsImage(state, "perspective-grid");
        }
    }, [state]);

    // Render grid when state changes
    useEffect(() => {
        if (!state || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Cancel previous render frame if it exists
        if (renderFrameRef.current) {
            cancelAnimationFrame(renderFrameRef.current);
        }

        // Render on next frame
        renderFrameRef.current = requestAnimationFrame(() => {
            const lines = calculatePerspectiveLines(state);
            renderGrid(ctx, lines, state, !hideUI);
            renderFrameRef.current = null;
        });

        return () => {
            if (renderFrameRef.current) {
                cancelAnimationFrame(renderFrameRef.current);
            }
        };
    }, [state, canvasRef, hideUI]);

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
