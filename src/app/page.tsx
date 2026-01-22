/**
 * @module Home
 * @description Lustrous home page with particle background and tool cards.
 */

import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { FeatureCard } from "@/components/ui/FeatureCard";

const tools = [
  {
    href: "/perspective-grid",
    title: "Perspective Grid",
    description:
      "Create configurable perspective grids with 1, 2, or 3 vanishing points for illustration study.",
    icon: "📐",
    variant: "cyan" as const,
  },
  {
    href: "/obj-viewer",
    title: "3D Viewer",
    description:
      "Visualize and rotate .obj models to study three-dimensionality and form.",
    icon: "🧊",
    variant: "purple" as const,
  },
  {
    href: "/color-analysis",
    title: "Color Analysis",
    description:
      "Upload images and analyze color palettes with theoretical interpretation.",
    icon: "🎨",
    variant: "magenta" as const,
  },
];

/**
 * Home Page.
 * Presents the project with animated particle background and links to available tools.
 */
export default function Home() {
  return (
    <>
      {/* Animated Particle Background (The Molecular Dance) */}
      <ParticleBackground
        particleCount={100}
        connectionDistance={120}
        interactive
      />

      <div className="min-h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center px-4 py-16 relative">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-3xl mx-auto">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-montserrat)] mb-6 tracking-tight">
            <span className="gradient-text-animated">LUSTROUS</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-diamond-dust mb-4 font-light">
            The{" "}
            <span className="text-aqua font-medium">all-in-one</span>
            {" "}creative assistant built for artists, just like you.
          </p>

          {/* Description */}
          <p className="text-base text-diamond-dust/80 max-w-xl mx-auto leading-relaxed mb-8">
            All the tools dedicated to the artistic community, for free.
          </p>

          {/* Browser Compatibility Indicator */}
          <div className="flex items-center justify-center gap-3 text-sm text-diamond-dust/60">
            <div className="flex gap-5.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse-glow" />
              <span className="w-2.5 h-2.5 rounded-full bg-aqua animate-pulse-glow [animation-delay:0.2s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-amethyst animate-pulse-glow [animation-delay:0.4s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-magenta animate-pulse-glow [animation-delay:0.6s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse-glow [animation-delay:0.8s]" />
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <FeatureCard
                key={tool.href}
                href={tool.href}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                variant={tool.variant}
              />
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <section className="mt-16 text-center">
          <p className="text-sm text-diamond-dust/50 flex items-center justify-center gap-2">
            All tools run entirely locally in your browser, no data is sent to servers.
          </p>
        </section>
      </div>
    </>
  );
}
