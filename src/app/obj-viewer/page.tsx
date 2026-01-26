/**
 * @module ObjViewerPage
 * @description Página da ferramenta de visualização de arquivos .obj
 */

export default function ObjViewerPage() {
  return (
    <div className="flex h-[calc(100vh-var(--header-height))] flex-col items-center justify-center">
      <div className="p-8 text-center">
        <span className="mb-6 block text-6xl">🧊</span>
        <h1 className="gradient-text mb-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold">
          3D Viewer
        </h1>
        <p className="text-muted mx-auto max-w-md">
          Upload and visualize .obj models with trackball controls.
        </p>
        <div className="glass text-aqua mt-8 inline-block rounded-xl px-6 py-3 text-sm">
          🚧 Coming soon...
        </div>
      </div>
    </div>
  );
}
