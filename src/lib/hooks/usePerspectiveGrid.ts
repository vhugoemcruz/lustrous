/**
 * @module usePerspectiveGrid
 * @description Hook to manage the Perspective Grid state
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  PerspectiveState,
  GridConfig,
  VanishingPoint,
  createInitialState,
  calculatePerspectiveLines,
  renderGrid,
  exportCanvasAsImage,
  findVanishingPointAtPosition,
  updateVanishingPointDistance,
  ReferenceImage,
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
  const [refImageElement, setRefImageElement] =
    useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  /** Stores initial drag state: handle position (screen) + VP world values for relative calculations */
  const initialDragState = useRef<{
    handleX: number;
    handleY: number;
    vpDist: number;
    vpx?: number;
  } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPos = useRef<{ x: number; y: number } | null>(null);
  const renderFrameRef = useRef<number | null>(null);
  const vpReturnAnimFrameRef = useRef<number | null>(null);
  const refHandleAnimFrameRef = useRef<number | null>(null);
  /** Track visual position of reference handle during drag (for return animation) */
  const currentRefHandlePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  /**
   * Initializes state when canvas is available.
   * @param width Canvas width in pixels.
   * @param height Canvas height in pixels.
   */
  const initialize = useCallback(
    (width: number, height: number) => {
      setState((prev) => {
        if (!prev) return createInitialState(width, height);

        return {
          ...prev,
          canvasWidth: width,
          canvasHeight: height,
        };
      });
    },
    [setState]
  );

  /**
   * Updates grid configuration parameters.
   * @param updates Partial updates for the grid configuration.
   */
  const updateConfig = useCallback(
    (updates: Partial<GridConfig>) => {
      setState((prev) => {
        if (!prev) return prev;

        const newConfig = { ...prev.config, ...updates };

        let newVPs = prev.vanishingPoints;

        // Flip VP3 to opposite side when orientation button is clicked
        if (
          updates.thirdPointOrientation &&
          updates.thirdPointOrientation !== prev.config.thirdPointOrientation
        ) {
          newVPs = prev.vanishingPoints.map((vp) => {
            if (vp.id === "vp3") {
              const currentDist = vp.distanceFromCenter;
              const isTop = updates.thirdPointOrientation === "top";
              const newDist = isTop
                ? -Math.abs(currentDist)
                : Math.abs(currentDist);
              return { ...vp, distanceFromCenter: newDist };
            }
            return vp;
          });
        }

        // Auto-center VP1 when switching to 1-point mode if too far off-screen
        if (updates.type === 1) {
          newVPs = newVPs.map((vp) => {
            if (
              vp.id === "vp1" &&
              Math.abs(vp.distanceFromCenter) > prev.canvasWidth * 0.5
            ) {
              return { ...vp, distanceFromCenter: 0 };
            }
            return vp;
          });
        }

        // Restore balanced VP positions when switching from 1-point to 2/3-point mode
        if (
          (updates.type === 2 || updates.type === 3) &&
          prev.config.type === 1
        ) {
          newVPs = newVPs.map((vp) => {
            if (vp.id === "vp1" && Math.abs(vp.distanceFromCenter) < 10) {
              return { ...vp, distanceFromCenter: -prev.canvasWidth * 0.35 };
            }
            if (vp.id === "vp2" && Math.abs(vp.distanceFromCenter) < 10) {
              return { ...vp, distanceFromCenter: prev.canvasWidth * 0.35 };
            }
            return vp;
          });
        }

        return {
          ...prev,
          config: newConfig,
          vanishingPoints: newVPs,
        };
      });
    },
    [setState]
  );

  /**
   * Updates a specific vanishing point's properties (color, etc.)
   * @param id The ID of the vanishing point (vp1, vp2, vp3)
   * @param updates Partial updates for the VP
   */
  const updateVanishingPoint = useCallback(
    (id: string, updates: Partial<VanishingPoint>) => {
      setState((prev) => {
        if (!prev) return prev;

        const newVPs = prev.vanishingPoints.map((vp) =>
          vp.id === id ? { ...vp, ...updates } : vp
        );

        return {
          ...prev,
          vanishingPoints: newVPs,
        };
      });
    },
    [setState]
  );

  /**
   * Updates the vertical position of the horizon line.
   * @param deltaY Position change in pixels.
   */
  const updateHorizonY = useCallback(
    (deltaY: number) => {
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
    },
    [setState]
  );

  /**
   * Updates the inclination angle of the horizon line.
   * @param angle Angle in degrees (-90 to 90).
   */
  const updateHorizonAngle = useCallback(
    (angle: number) => {
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          camera: { ...prev.camera, horizonAngle: angle },
        };
      });
    },
    [setState]
  );

  /**
   * Pans the camera view.
   * @param deltaX Horizontal movement in pixels.
   * @param deltaY Vertical movement in pixels.
   */
  const updatePan = useCallback(
    (deltaX: number, deltaY: number) => {
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
    },
    [setState]
  );

  /**
   * Zooms the camera view.
   * @param delta Zoom delta (positive to zoom in, negative to zoom out).
   */
  const updateZoom = useCallback(
    (delta: number) => {
      setState((prev) => {
        if (!prev) return prev;

        // Clamp zoom between 10% and 500%
        const newZoom = Math.max(0.1, Math.min(5, prev.camera.zoom + delta));

        return {
          ...prev,
          camera: {
            ...prev.camera,
            zoom: newZoom,
            panX: prev.camera.panX,
            panY: prev.camera.panY,
          },
        };
      });
    },
    [setState]
  );

  /**
   * Sets a reference image from a File.
   * @param file The image file to load.
   */
  const setReferenceImage = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setRefImageElement(img);
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            referenceImage: {
              url,
              opacity: 0.5,
              isVisible: true,
              aspectRatio: img.width / img.height,
              scale: 1,
              rotation: 0,
              offsetX: 0,
              offsetY: 0,
              followHorizon: true,
              followZoom: true,
              isInteractive: false,
              handleX: 0,
              handleY: 0,
            },
          };
        });
      };
      img.src = url;
    },
    [setState]
  );

  /**
   * Updates reference image properties (opacity, visibility, transforms).
   * @param updates Partial updates to the image configuration.
   */
  const updateReferenceImage = useCallback(
    (updates: Partial<ReferenceImage>) => {
      setState((prev) => {
        if (!prev || !prev.referenceImage) return prev;
        return {
          ...prev,
          referenceImage: {
            ...prev.referenceImage,
            ...updates,
          },
        };
      });
    },
    [setState]
  );

  /**
   * Resets the reference image transforms to default values.
   */
  const resetReferenceImage = useCallback(() => {
    setState((prev) => {
      if (!prev || !prev.referenceImage) return prev;
      return {
        ...prev,
        referenceImage: {
          ...prev.referenceImage,
          scale: 1,
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
          handleX: 0,
          handleY: 0,
          followHorizon: true,
          followZoom: true,
        },
      };
    });
  }, [setState]);

  /**
   * Removes the reference image.
   */
  const clearReferenceImage = useCallback(() => {
    setRefImageElement(null);
    setState((prev) => {
      if (!prev) return prev;
      const newState = { ...prev };
      delete newState.referenceImage;
      return newState;
    });
  }, [setState]);

  /**
   * Handler for mouse down event on the canvas.
   * Detects clicks on VP handles, reference handle, or initiates panning.
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!state || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const vpId = findVanishingPointAtPosition(state, x, y, !hideUI);

      if (vpId) {
        const handle = state.handles.find((h) => h.id === vpId);
        const vp = state.vanishingPoints.find((v) => v.id === vpId);

        if (handle && vp) {
          initialDragState.current = {
            handleX: handle.x,
            handleY: handle.y,
            vpDist: vp.distanceFromCenter,
            vpx: vp.id === "vp3" ? vp.x || 0 : undefined,
          };
          setIsDragging(vpId);
        }
      } else if (
        state.referenceImage?.isInteractive &&
        state.referenceImage?.isVisible
      ) {
        const centerX = state.canvasWidth / 2;
        const centerY = state.canvasHeight / 2;
        const restX = 0;
        const restY = 80;
        const handleX = centerX + restX + state.referenceImage.handleX;
        const handleY = centerY + restY + state.referenceImage.handleY;

        const dist = Math.sqrt((x - handleX) ** 2 + (y - handleY) ** 2);
        if (dist < 25) {
          setIsDragging("ref_handle");
          initialDragState.current = {
            handleX: state.referenceImage.handleX,
            handleY: state.referenceImage.handleY,
            vpDist: 0,
            initialOffX: state.referenceImage.offsetX,
            initialOffY: state.referenceImage.offsetY,
            startX: x,
            startY: y,
          } as any;
        } else {
          setIsPanning(true);
          lastPanPos.current = { x: e.clientX, y: e.clientY };
        }
      } else {
        setIsPanning(true);
        lastPanPos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [state, canvasRef, hideUI]
  );

  /**
   * Handler for mouse move event on the canvas.
   * Processes handle dragging and camera movement (pan).
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!state || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isDragging && initialDragState.current) {
        if (isDragging === "ref_handle") {
          // Reference handle: move image in grid-space while showing visual feedback
          const screenDeltaX = x - (initialDragState.current as any).startX;
          const screenDeltaY = y - (initialDragState.current as any).startY;

          // Convert screen movement to grid coordinates (undo camera zoom/rotation)
          const zoom = state.camera.zoom;
          const angleRad = -(state.camera.horizonAngle * Math.PI) / 180;

          const gridDeltaX =
            (screenDeltaX * Math.cos(angleRad) -
              screenDeltaY * Math.sin(angleRad)) /
            zoom;
          const gridDeltaY =
            (screenDeltaX * Math.sin(angleRad) +
              screenDeltaY * Math.cos(angleRad)) /
            zoom;

          currentRefHandlePos.current = { x: screenDeltaX, y: screenDeltaY };

          updateReferenceImage({
            handleX: screenDeltaX,
            handleY: screenDeltaY,
            offsetX: (initialDragState.current as any).initialOffX + gridDeltaX,
            offsetY: (initialDragState.current as any).initialOffY + gridDeltaY,
          });
        } else {
          const newState = updateVanishingPointDistance(
            state,
            isDragging,
            x,
            y,
            initialDragState.current
          );
          setState(newState);
        }
      } else if (isPanning && lastPanPos.current) {
        const deltaX = e.clientX - lastPanPos.current.x;
        const deltaY = e.clientY - lastPanPos.current.y;
        updatePan(deltaX, deltaY);
        lastPanPos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [
      state,
      isDragging,
      isPanning,
      updatePan,
      canvasRef,
      updateReferenceImage,
      setState,
    ]
  );

  /**
   * Ends drag interaction and triggers return-to-rest animations for handles.
   */
  const handleMouseUp = useCallback(() => {
    setIsDragging((prevDragging) => {
      if (prevDragging) {
        const startTime = performance.now();
        const duration = 250;

        if (prevDragging === "ref_handle") {
          // Animate reference handle back to rest (0,0) without moving image
          if (refHandleAnimFrameRef.current) {
            cancelAnimationFrame(refHandleAnimFrameRef.current);
          }

          const initialX = currentRefHandlePos.current.x;
          const initialY = currentRefHandlePos.current.y;

          if (Math.abs(initialX) < 0.1 && Math.abs(initialY) < 0.1) {
            currentRefHandlePos.current = { x: 0, y: 0 };
          } else {
            const animateRefHandle = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuad: fast start, smooth deceleration
              const ease = 1 - (1 - progress) * (1 - progress);

              const newHandleX = initialX * (1 - ease);
              const newHandleY = initialY * (1 - ease);

              setState((prev) => {
                if (!prev || !prev.referenceImage) return prev;
                return {
                  ...prev,
                  referenceImage: {
                    ...prev.referenceImage,
                    handleX: newHandleX,
                    handleY: newHandleY,
                  },
                };
              });

              if (progress < 1) {
                refHandleAnimFrameRef.current =
                  requestAnimationFrame(animateRefHandle);
              } else {
                refHandleAnimFrameRef.current = null;
                currentRefHandlePos.current = { x: 0, y: 0 };
                setState((prev) => {
                  if (!prev || !prev.referenceImage) return prev;
                  return {
                    ...prev,
                    referenceImage: {
                      ...prev.referenceImage,
                      handleX: 0,
                      handleY: 0,
                    },
                  };
                });
              }
            };

            refHandleAnimFrameRef.current =
              requestAnimationFrame(animateRefHandle);
          }
        } else {
          // Animate VP handle back to rest position
          if (vpReturnAnimFrameRef.current) {
            cancelAnimationFrame(vpReturnAnimFrameRef.current);
          }

          const handle = state?.handles.find((h) => h.id === prevDragging);
          const initialX = handle?.x ?? 0;
          const initialY = handle?.y ?? 0;

          const animateVpHandle = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - (1 - progress) * (1 - progress);

            setState((prev) => {
              if (!prev) return prev;
              const newHandles = prev.handles.map((h) => {
                if (h.id === prevDragging) {
                  return {
                    ...h,
                    x: initialX * (1 - ease),
                    y: initialY * (1 - ease),
                  };
                }
                return h;
              });
              return { ...prev, handles: newHandles };
            });

            if (progress < 1) {
              vpReturnAnimFrameRef.current =
                requestAnimationFrame(animateVpHandle);
            } else {
              vpReturnAnimFrameRef.current = null;
              setState((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  handles: prev.handles.map((h) =>
                    h.id === prevDragging ? { ...h, x: 0, y: 0 } : h
                  ),
                };
              });
            }
          };

          vpReturnAnimFrameRef.current = requestAnimationFrame(animateVpHandle);
        }
      }
      initialDragState.current = null;
      return null;
    });
    setIsPanning(false);
    lastPanPos.current = null;
  }, [setState, state]);

  /**
   * Handler for wheel (scroll) event - applies zoom.
   */
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      if (!canvasRef.current) return;

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      updateZoom(delta);
    },
    [canvasRef, updateZoom]
  );

  /**
   * Resets all state to initial values.
   */
  const reset = useCallback(() => {
    if (!state) return;
    const newState = createInitialState(state.canvasWidth, state.canvasHeight);
    setState(newState);
  }, [state, setState]);

  /**
   * Resets only the camera (pan, zoom, horizon position).
   * Preserves custom vanishing point positions.
   */
  const resetCamera = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        camera: {
          ...prev.camera,
          horizonY: prev.canvasHeight / 2,
          panX: 0,
          panY: 0,
          zoom: 1,
        },
      };
    });
  }, [setState]);

  /**
   * Exports the grid as a high-resolution PNG image.
   */
  const exportImage = useCallback(() => {
    if (state) {
      exportCanvasAsImage(state, "perspective-grid");
    }
  }, [state]);

  /**
   * Renders the grid and UI elements via requestAnimationFrame.
   */
  useEffect(() => {
    if (!state || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (renderFrameRef.current) {
      cancelAnimationFrame(renderFrameRef.current);
    }

    renderFrameRef.current = requestAnimationFrame(() => {
      const lines = calculatePerspectiveLines(state);
      renderGrid(ctx, lines, state, !hideUI, refImageElement);
      renderFrameRef.current = null;
    });

    return () => {
      if (renderFrameRef.current) {
        cancelAnimationFrame(renderFrameRef.current);
      }
    };
  }, [state, canvasRef, hideUI, refImageElement]);

  return {
    state,
    isDragging,
    isPanning,
    initialize,
    updateConfig,
    updateVanishingPoint,
    updateHorizonY,
    updateHorizonAngle,
    updateZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    reset,
    resetCamera,
    exportImage,
    setReferenceImage,
    updateReferenceImage,
    resetReferenceImage,
    clearReferenceImage,
  };
}
