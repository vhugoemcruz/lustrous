"use client";

/**
 * @module Home
 * @description Lustrous home page — Artist's Studio theme.
 * Full-viewport sections with brush-reveal animations, hand-drawn cards,
 * and watercolor accents. Each section is viewed as the user scrolls.
 */

import { useState } from "react";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { PaintSplatters } from "@/components/ui/PaintSplatters";


import {
  ShieldIcon,
  BrowserIcon,
  SparklesIcon,
  PerspectiveGridIcon,
  CubeViewerIcon,
  ColorPaletteIcon,
} from "@/components/ui/ToolIcons";
import {
  SectionLabel,
  SectionTitle,
  SectionSubtitle,
} from "@/components/ui/Typography";
import { ExploreButton } from "@/components/ui/ExploreButton";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Footer } from "@/components/layout/Footer";

/**
 * Home Page Component — Artist's Studio theme.
 * Features brush-reveal title, paint splatters, hand-drawn cards, and warm aesthetics.
 */
export default function Home() {
  const [indicatorVisible, setIndicatorVisible] = useState(true);

  return (
    <>
      <div className="relative">
        {/* Hero Section */}
        <section className="relative flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-start px-4 pt-[calc(15vh+30px)] pb-24 text-center">
          {/* Main Title — Brush Reveal Animation */}
          <h1 className="animate-fade-in-up font-[family-name:var(--font-headline)] text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl">
            <span className="gradient-text-animated">LUSTROUS</span>
          </h1>

          {/* Paint Splatters — replaces Prismatic Dots */}
          <div className="mt-8 mb-8">
            <PaintSplatters />
          </div>

          {/* Tagline */}
          <p className="animate-fade-in-up-delayed text-ink-charcoal mb-4 text-xl font-light md:text-2xl lg:text-3xl">
            The{" "}
            <span className="brush-underline font-medium">all-in-one</span>{" "}
            creative assistant built for artists, just like you.
          </p>

          {/* Description */}
          <p className="animate-fade-in-up-delayed-2 text-ink-light mx-auto max-w-xl text-base leading-relaxed md:text-lg">
            All the tools dedicated to the artistic community, for free.
          </p>

          {/* Explore Tools Button — Hand-drawn style */}
          <ExploreButton />

          {/* Scroll Indicator */}
          <ScrollIndicator onVisibilityChange={setIndicatorVisible} />
        </section>

        {/* Tools Section */}
        <section
          id="tools"
          className="container pb-12 transition-all duration-1000"
          style={{
            marginTop: indicatorVisible ? "0" : "-200px",
            paddingTop: indicatorVisible ? "6rem" : "6rem",
          }}
        >
          <ScrollReveal className="mb-12 text-center md:mb-16">
            <SectionLabel>The Toolbox</SectionLabel>
            <SectionTitle className="mx-auto">
              Useful tools to help you create
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              The idea is to provide you, as an artist, with a variety of tools
              to support your creative process.
            </SectionSubtitle>
          </ScrollReveal>

          <div
            id="tools-cards"
            className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3"
          >
            <ScrollReveal delay={0}>
              <FeatureCard
                href="/perspective-grid"
                title="Perspective Grid"
                description="Create grids with 1, 2, or 3 vanishing points to make working with perspective easier."
                icon={<PerspectiveGridIcon size={32} />}
                variant="blue"
              />
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <FeatureCard
                href="/obj-viewer"
                title="3D Viewer"
                description="Spin and rotate 3D models with lighting to study form, structure, and how light behaves."
                icon={<CubeViewerIcon size={32} />}
                variant="coral"
              />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <FeatureCard
                href="/color-analysis"
                title="Color Analysis"
                description="Drop in any image to explore and uncover the hidden color harmonies that make it work."
                icon={<ColorPaletteIcon size={32} />}
                variant="violet"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* Built with Love Section */}
        <section className="container pt-12 pb-12">
          <ScrollReveal className="mb-12 text-center md:mb-16">
            <SectionLabel>For the Community</SectionLabel>
            <SectionTitle className="mx-auto">
              Built with{" "}
              <span className="text-wc-coral font-medium">dedication</span>
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              The idea is to provide you, as an artist, with a variety of tools
              to support your creative process.
              <br className="hidden md:block" />
              And the best part: it&apos;s all free, as it&apos;s my way of supporting the
              artistic community.
            </SectionSubtitle>
          </ScrollReveal>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <ScrollReveal delay={0}>
              <FeatureCard
                icon={<BrowserIcon size={32.5} />}
                title="Works Easy"
                variant="blue"
              >
                No downloads, no installs. Just open your browser and start
                creating.
              </FeatureCard>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <FeatureCard
                icon={<ShieldIcon size={32.5} />}
                title="Your art stays yours"
                variant="sage"
              >
                Everything runs locally on your device. Lustrous will never see,
                store, or touch your work.
              </FeatureCard>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <FeatureCard
                icon={<SparklesIcon size={32.5} />}
                title="Made for Artists"
                variant="violet"
              >
                Every tool was designed to support your learning and make your
                creative process smoother.
              </FeatureCard>
            </ScrollReveal>
          </div>
        </section>

        {/* Support Section */}
        <section className="container pt-12 pb-24">
          <ScrollReveal className="mb-12 text-center md:mb-16">
            <SectionLabel>Contribution</SectionLabel>
            <SectionTitle className="mx-auto">
              Support
              <span className="text-wc-amber font-medium"> Lustrous</span>, if
              you wish
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              Lustrous is, and will always be,{" "}
              <span className="text-wc-blue font-medium">completely free</span>.
              <br className="hidden md:block" />
              But donates will always be appreciated, with all the gratitude in
              the world.
            </SectionSubtitle>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto max-w-2xl text-center">
                <FeatureCard variant="amber">
                  <p className="mb-6">
                    Lustrous will never run any type of ads.
                    <br />
                    The intention here is to be something useful and totally
                    free to help.
                    <br className="hidden md:block" />
                    If you&apos;d like to support the project and help it to keep
                    going, you can do it here:
                  </p>
                  <a
                    href="https://ko-fi.com/lustrous"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-black inline-flex items-center gap-2 rounded-full border-2 border-[var(--watercolor-amber)]/40 bg-[var(--watercolor-amber)]/15 px-8 py-3 font-medium transition-all duration-300 hover:scale-105 hover:border-[var(--watercolor-amber)]/60 hover:bg-[var(--watercolor-amber)]/25"
                  >
                    {/* Coffee cup SVG icon instead of emoji */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--watercolor-amber)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M17 8h1a4 4 0 010 8h-1" />
                      <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
                      <line x1="6" y1="2" x2="6" y2="4" />
                      <line x1="10" y1="2" x2="10" y2="4" />
                      <line x1="14" y1="2" x2="14" y2="4" />
                    </svg>
                    Buy me a coffee
                  </a>
                  <p className="text-ink-light/60 mt-6 text-xs font-bold">
                    Support, when freely given, carries the greatest meaning.
                  </p>
                </FeatureCard>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
