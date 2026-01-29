"use client";

/**
 * @module Home
 * @description Lustrous home page with full-viewport sections and scroll-reveal animations.
 * Each section is designed to be viewed one at a time as the user scrolls.
 */

import { useState } from "react";
import Link from "next/link";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { PrismaticDots } from "@/components/ui/PrismaticDots";
import { LustrousLogo } from "@/components/ui/LustrousLogo";
import {
  ShieldIcon,
  BrowserIcon,
  SparklesIcon,
} from "@/components/ui/ToolIcons";

/**
 * Tool definitions with emoji icons.
 */
const tools = [
  {
    href: "/perspective-grid",
    title: "Perspective Grid",
    description:
      "Draw with confidence! Create grids with 1, 2, or 3 vanishing points to nail perspective every time.",
    icon: "📐",
    variant: "cyan" as const,
  },
  {
    href: "/obj-viewer",
    title: "3D Viewer",
    description:
      "Spin, rotate, and study 3D models to understand how light and form work together.",
    icon: "🧊",
    variant: "purple" as const,
  },
  {
    href: "/color-analysis",
    title: "Color Analysis",
    description:
      "Drop in any image and discover the hidden color harmonies that make it work.",
    icon: "🎨",
    variant: "magenta" as const,
  },
];

/**
 * Feature highlights for the community section.
 */
const features = [
  {
    icon: <BrowserIcon size={32.5} />,
    title: "Works Anywhere",
    description:
      "No downloads, no installs. Just open your browser and start creating.",
  },
  {
    icon: <ShieldIcon size={32.5} />,
    title: "Your Art, Your Privacy",
    description:
      "Everything stays on your device. We never see, store, or share your work.",
  },
  {
    icon: <SparklesIcon size={32.5} />,
    title: "Made by Artists",
    description:
      "Every tool is built with your workflow in mind, because we're artists too.",
  },
];

/**
 * Footer links configuration.
 */
const footerLinks = {
  community: [
    { label: "Discord", href: "https://discord.gg/lustrous", external: true },
    {
      label: "GitHub",
      href: "https://github.com/victorgreca/lustrous",
      external: true,
    },
  ],
  resources: [
    { label: "Perspective Grid", href: "/perspective-grid" },
    { label: "3D Viewer", href: "/obj-viewer" },
    { label: "Color Analysis", href: "/color-analysis" },
  ],
};

/**
 * Home Page Component.
 * Full-viewport sections with scroll-reveal animations.
 */
export default function Home() {
  const [indicatorVisible, setIndicatorVisible] = useState(true);

  /**
   * Scroll smoothly to the tools section, centering it on the viewport
   */
  const scrollToTools = () => {
    const toolsSection = document.getElementById("tools");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <>
      <div className="relative">
        {/* Hero Section - Content height with padding for scroll indicator */}
        <section className="relative flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-start px-4 pt-[calc(15vh+30px)] pb-24 text-center">
          {/* Main Title */}
          <h1 className="animate-fade-in-up font-[family-name:var(--font-montserrat)] text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            <span className="gradient-text-animated">LUSTROUS</span>
          </h1>

          {/* Prismatic Dots */}
          <div className="mt-8 mb-8">
            <PrismaticDots />
          </div>

          {/* Tagline */}
          <p className="animate-fade-in-up-delayed text-diamond-dust mb-4 text-xl font-light md:text-2xl lg:text-3xl">
            The <span className="text-aqua font-medium">all-in-one</span>{" "}
            creative assistant built for artists, just like you.
          </p>

          {/* Description */}
          <p className="animate-fade-in-up-delayed-2 text-diamond-dust/70 mx-auto max-w-xl text-base leading-relaxed md:text-lg">
            All the tools dedicated to the artistic community, for free.
          </p>

          {/* Explore Tools Button */}
          <button
            onClick={scrollToTools}
            className="animate-fade-in-up-delayed-3 group from-amethyst via-aqua to-magenta animate-shimmer relative mt-12 rounded-full bg-gradient-to-r via-50% bg-[length:300%_100%] p-[2px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
          >
            <span className="bg-deep-obsidian group-hover:bg-deep-obsidian/80 flex rounded-full px-8 py-3 transition-all duration-300">
              <span className="from-amethyst via-aqua to-magenta animate-shimmer bg-gradient-to-r via-50% bg-[length:300%_100%] bg-clip-text text-base font-semibold text-transparent">
                Explore Tools
              </span>
            </span>
          </button>

          {/* Scroll Indicator - Notifies when visibility changes */}
          <ScrollIndicator onVisibilityChange={setIndicatorVisible} />
        </section>

        {/* Tools Section - Moves up when scroll indicator hides */}
        <section
          id="tools"
          className="container pb-12 transition-all duration-1000"
          style={{
            marginTop: indicatorVisible ? "0" : "-200px",
            paddingTop: indicatorVisible ? "6rem" : "6rem",
          }}
        >
          <ScrollReveal className="mb-12 text-center md:mb-16">
            <span className="section-label">The Toolbox</span>
            <h2 className="section-title mx-auto">
              Useful tools to help you create
            </h2>
            <p className="section-subtitle mx-auto">
              We know the struggle of hunting for the right reference tool.
              <br className="hidden md:block" />
              So we made them all, in one place, just for you.
            </p>
          </ScrollReveal>

          <div
            id="tools-cards"
            className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3"
          >
            {tools.map((tool, index) => (
              <ScrollReveal key={tool.href} delay={index * 100}>
                <FeatureCard
                  href={tool.href}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  variant={tool.variant}
                />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Built with Love Section */}
        <section className="container pt-12 pb-12">
          <ScrollReveal className="mb-12 text-center md:mb-16">
            <span className="section-label">For the Community</span>
            <h2 className="section-title mx-auto">
              Built with <span className="text-magenta font-medium">love</span>
            </h2>
            <p className="section-subtitle mx-auto">
              This isn&apos;t a product—it&apos;s a gift to the community.
              <br className="hidden md:block" />
              No accounts, no paywalls, no strings attached.
            </p>
          </ScrollReveal>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="feature-card group from-slate-grey to-slate-grey/80 hover:border-aqua/30 relative overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-b p-8 text-center transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]">
                  {/* Shine effect */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-aqua/10 mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="text-pure-quartz group-hover:text-aqua mb-2 text-lg font-semibold transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-diamond-dust/80 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Support Section */}
        <section className="container pt-12 pb-24">
          <ScrollReveal className="mb-12 text-center md:mb-16">
            <span className="section-label">Support Us</span>
            <h2 className="section-title mx-auto">
              Help keep
              <span className="font-medium text-yellow-400"> Lustrous </span>
              alive
            </h2>
            <p className="section-subtitle mx-auto">
              Lustrous is, and will always be,{" "}
              <span className="text-aqua font-medium">completely free</span>.
              <br className="hidden md:block" />
              But if you'd like to help sustain this project—and only if you
              can—your support means the world.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mx-auto max-w-2xl text-center">
              <div className="feature-card group from-slate-grey to-slate-grey/80 relative overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-b p-8 transition-all duration-500 hover:border-yellow-400/30 hover:shadow-[0_0_40px_rgba(250,204,21,0.15)]">
                {/* Shine effect */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <div className="relative z-10">
                  <div className="mb-4 text-4xl">💛</div>
                  <p className="text-diamond-dust/80 mb-6 text-sm leading-relaxed">
                    We don't run ads, we don't sell your data, and we never
                    will.
                    <br />
                    If Lustrous has helped you in any way and you're in a
                    position to give back,
                    <br className="hidden md:block" />
                    your donation helps cover hosting costs and keeps
                    development going.
                  </p>
                  <p className="text-diamond-dust/60 mb-6 text-xs italic">
                    No pressure—seriously. This is only if you want to and can
                    afford it. 💜
                  </p>
                  <a
                    href="https://ko-fi.com/lustrous"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pure-quartz inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-8 py-3 font-medium transition-all duration-300 hover:scale-105 hover:border-yellow-400/50 hover:from-yellow-400/30 hover:to-orange-400/30 hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]"
                  >
                    <span>☕</span>
                    Buy me a coffee
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Footer */}
        <footer className="relative mt-auto overflow-hidden">
          {/* Gradient background */}
          <div className="via-slate-grey/50 to-slate-grey absolute inset-0 bg-gradient-to-b from-transparent" />

          <div className="relative container py-12 md:py-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
              {/* Brand Column */}
              <div className="md:col-span-2">
                <LustrousLogo size={32} showText className="mb-4" />
                <p className="text-diamond-dust/70 mb-4 max-w-sm text-sm leading-relaxed">
                  Your creative companion, always by your side. Free tools for
                  artists, by artists.
                </p>
              </div>

              {/* Community Links */}
              <div>
                <h4 className="text-pure-quartz mb-4 font-semibold">
                  Community
                </h4>
                <ul className="space-y-3">
                  {footerLinks.community.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-diamond-dust/70 hover:text-aqua text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools Links */}
              <div>
                <h4 className="text-pure-quartz mb-4 font-semibold">Tools</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-diamond-dust/70 hover:text-aqua text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Footer - closer to bottom */}
            <div className="mt-16 flex flex-col items-center gap-2 pt-8">
              <p className="text-diamond-dust/50 text-sm">
                Made with 💜 for the creative community
              </p>
              <p className="text-diamond-dust/40 text-xs">
                © {new Date().getFullYear()} Lustrous. All tools run locally in
                your browser.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
