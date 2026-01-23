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
            <div className="fixed top-0 left-0 right-0 h-[calc(var(--header-height)+56px)] z-10 pointer-events-none">
                <ToolbarParticles
                    particleCount={60}
                    connectionDistance={140}
                    className="opacity-70"
                />
            </div>

            <div className="h-[calc(100vh-var(--header-height))] flex flex-col relative">
                <PerspectiveCanvas />
            </div>
        </>
    );
}
