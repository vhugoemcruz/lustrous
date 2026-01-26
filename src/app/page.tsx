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

      <div className="relative flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center px-4 py-16">
        {/* Hero Section */}
        <section className="mx-auto mb-16 max-w-3xl text-center">
          {/* Main Title */}
          <h1 className="mb-6 font-[family-name:var(--font-montserrat)] text-5xl font-bold tracking-tight md:text-7xl">
            <span className="gradient-text-animated">LUSTROUS</span>
          </h1>

          {/* Tagline */}
          <p className="text-diamond-dust mb-4 text-xl font-light md:text-2xl">
            The <span className="text-aqua font-medium">all-in-one</span> creative assistant built for artists, just like you.
          </p>

          {/* Description */}
          <p className="text-diamond-dust/80 mx-auto mb-8 max-w-xl text-base leading-relaxed">
            All the tools dedicated to the artistic community, for free.
          </p>

          {/* Browser Compatibility Indicator */}
          <div className="text-diamond-dust/60 flex items-center justify-center gap-3 text-sm">
            <div className="flex gap-5.5">
              <span className="bg-emerald animate-pulse-glow h-2.5 w-2.5 rounded-full" />
              <span className="bg-aqua animate-pulse-glow h-2.5 w-2.5 rounded-full [animation-delay:0.2s]" />
              <span className="bg-amethyst animate-pulse-glow h-2.5 w-2.5 rounded-full [animation-delay:0.4s]" />
              <span className="bg-magenta animate-pulse-glow h-2.5 w-2.5 rounded-full [animation-delay:0.6s]" />
              <span className="bg-gold animate-pulse-glow h-2.5 w-2.5 rounded-full [animation-delay:0.8s]" />
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          <p className="text-diamond-dust/50 flex items-center justify-center gap-2 text-sm">
            All tools run entirely locally in your browser, no data is sent to
            servers.
          </p>
        </section>
      </div>
    </>
  );
}
