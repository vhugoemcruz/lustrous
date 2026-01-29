"use client";

/**
 * @module Home
 * @description Lustrous home page with full-viewport sections and scroll-reveal animations.
 * Each section is designed to be viewed one at a time as the user scrolls.
 */

import { useState } from "react";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { PrismaticDots } from "@/components/ui/PrismaticDots";

import {
  ShieldIcon,
  BrowserIcon,
  SparklesIcon,
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
 * Home Page Component.
 * Full-viewport sections with scroll-reveal animations.
 */
export default function Home() {
  const [indicatorVisible, setIndicatorVisible] = useState(true);

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
          <ExploreButton />

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
                icon="📐"
                variant="aqua"
              />
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <FeatureCard
                href="/obj-viewer"
                title="3D Viewer"
                description="Spin and rotate 3D models with lighting to study form, structure, and how light behaves."
                icon="🧊"
                variant="amethyst"
              />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <FeatureCard
                href="/color-analysis"
                title="Color Analysis"
                description="Drop in any image to explore and uncover the hidden color harmonies that make it work."
                icon="🎨"
                variant="magenta"
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
              <span className="text-magenta font-medium">dedication</span>
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              The idea is to provide you, as an artist, with a variety of tools
              to support your creative process.
              <br className="hidden md:block" />
              And the best part: it's all free, as it's my way of supporting the
              artistic community.
            </SectionSubtitle>
          </ScrollReveal>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <ScrollReveal delay={0}>
              <FeatureCard
                icon={<BrowserIcon size={32.5} />}
                title="Works Easy"
                variant="aqua"
              >
                No downloads, no installs. Just open your browser and start
                creating.
              </FeatureCard>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <FeatureCard
                icon={<ShieldIcon size={32.5} />}
                title="Your art stays yours"
                variant="emerald"
              >
                Everything runs locally on your device. Lustrous will never see,
                store, or touch your work.
              </FeatureCard>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <FeatureCard
                icon={<SparklesIcon size={32.5} />}
                title="Made for Artists"
                variant="amethyst"
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
              <span className="font-medium text-yellow-400"> Lustrous</span>, if
              you wish
            </SectionTitle>
            <SectionSubtitle className="mx-auto">
              Lustrous is, and will always be,{" "}
              <span className="text-aqua font-medium">completely free</span>.
              <br className="hidden md:block" />
              But donates will always be appreciated, with all the gratitude in
              the world.
            </SectionSubtitle>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto max-w-2xl text-center">
                <FeatureCard variant="gold" icon="💛">
                  <p className="mb-6">
                    Lustrous will never run any type of ads.
                    <br />
                    The intention here is to be something useful and totally
                    free to help.
                    <br className="hidden md:block" />
                    If you'd like to support the project and help it to keep
                    going, you can do it here:
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
                  <p className="text-diamond-dust/60 mt-6 text-xs font-bold">
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
