/**
 * @module ColorAnalysisPage
 * @description Página da ferramenta de análise de cores
 */

export default function ColorAnalysisPage() {
  return (
    <div className="flex h-[calc(100vh-var(--header-height))] flex-col items-center justify-center">
      <div className="p-8 text-center">
        <span className="mb-6 block text-6xl">🎨</span>
        <h1 className="gradient-text mb-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold">
          Color Analysis
        </h1>
        <p className="text-muted mx-auto max-w-md">
          Analyze color palettes and receive theoretical interpretation.
        </p>
        <div className="glass text-aqua mt-8 inline-block rounded-xl px-6 py-3 text-sm">
          🚧 Coming soon...
        </div>
      </div>
    </div>
  );
}
