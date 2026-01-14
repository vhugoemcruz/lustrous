// @ts-check
/**
 * @module Home
 * @description Lustrous home page presenting the tools
 */

import Link from "next/link";

const tools = [
  {
    href: "/perspective-grid",
    title: "Perspective Grid",
    description:
      "Create configurable perspective grids with 1, 2, or 3 vanishing points for illustration study.",
    icon: "📐",
  },
  {
    href: "/obj-viewer",
    title: "3D Viewer",
    description:
      "Visualize and rotate .obj models to study three-dimensionality and form.",
    icon: "🧊",
  },
  {
    href: "/color-analysis",
    title: "Color Analysis",
    description:
      "Upload images and analyze color palettes with theoretical interpretation.",
    icon: "🎨",
  },
];

/**
 * Home Page.
 * Presents the project and links to available tools.
 */
export default function Home() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-montserrat)] mb-6 tracking-tight">
          <span className="gradient-text">LUSTROUS</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Free utility tools for artists. Study perspective, 3D visualization, and
          color theory — all in your browser.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative card p-6 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-amethyst/20 via-aqua/20 to-magenta/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[var(--radius-lg)]" />

              {/* Content */}
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">{tool.icon}</span>
                <h2 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-aqua transition-colors">
                  {tool.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <span className="text-aqua text-xl">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer Note */}
      <section className="mt-16 text-center">
        <p className="text-sm text-text-muted">
          ✨ All tools run entirely in your browser — no data is sent to servers.
        </p>
      </section>
    </div>
  );
}
