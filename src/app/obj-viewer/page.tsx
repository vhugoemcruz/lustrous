// @ts-check
/**
 * @module ObjViewerPage
 * @description Página da ferramenta de visualização de arquivos .obj
 */

export default function ObjViewerPage() {
    return (
        <div className="h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center">
            <div className="text-center p-8">
                <span className="text-6xl mb-6 block">🧊</span>
                <h1 className="text-3xl font-bold font-[family-name:var(--font-montserrat)] mb-4 gradient-text">
                    3D Viewer
                </h1>
                <p className="text-muted max-w-md mx-auto">
                    Upload and visualize .obj models with trackball controls.
                </p>
                <div className="mt-8 inline-block px-6 py-3 glass rounded-xl text-sm text-aqua">
                    🚧 Coming soon...
                </div>
            </div>
        </div>
    );
}
