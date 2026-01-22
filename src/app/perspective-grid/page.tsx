/**
 * @module PerspectiveGridPage
 * @description Página da ferramenta de Perspective Grid
 */

import { PerspectiveCanvas } from "@/components/tools/perspective/PerspectiveCanvas";

export default function PerspectiveGridPage() {
    return (
        <div className="h-[calc(100vh-var(--header-height))] flex flex-col">
            <PerspectiveCanvas />
        </div>
    );
}
