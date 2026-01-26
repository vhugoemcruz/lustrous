/**
 * @module PerspectiveGridPage
 * @description Página da ferramenta de Perspective Grid
 */

import { PerspectiveCanvas } from "@/components/tools/perspective/PerspectiveCanvas";
import { ToolbarParticles } from "@/components/ui/ToolbarParticles";

export default function PerspectiveGridPage() {
  return (
    <>
      {/* Particle Background - Covers Header + Toolbar area */}
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-10 h-[calc(var(--header-height)+56px)]">
        <ToolbarParticles
          particleCount={60}
          connectionDistance={140}
          className="opacity-70"
        />
      </div>

      <div className="relative flex h-[calc(100vh-var(--header-height))] flex-col">
        <PerspectiveCanvas />
      </div>
    </>
  );
}
