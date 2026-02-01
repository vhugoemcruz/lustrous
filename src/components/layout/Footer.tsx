import Link from "next/link";
import { LustrousLogo } from "@/components/ui/LustrousLogo";
import { DiscordStatus } from "./DiscordStatus";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Footer links configuration.
 */
const footerLinks = {
  community: [
    { label: "Discord", href: "https://discord.gg/lustrous", external: true },
    {
      label: "GitHub",
      href: "https://github.com/vhugoemcruz/lustrous",
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
 * Global Footer component.
 * Displays branding, community links, and copyright info.
 */
export function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0e] to-[#020203]" />

      {/* Top Separator Line */}
      <div className="via-aqua/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="relative mx-auto max-w-5xl px-8 pt-8 pb-8 md:pt-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand Column */}
          <div className="max-w-sm">
            <ScrollReveal>
              <LustrousLogo size={32} showText className="mb-4" />
              <p className="text-diamond-dust/70 mb-4 max-w-sm text-sm leading-relaxed">
                To help you create, Lustrous was born.
              </p>
              <div className="mt-6">
                <DiscordStatus />
              </div>
            </ScrollReveal>
          </div>

          {/* Links Container */}
          <div className="flex gap-12 md:gap-24">
            {/* Community Links */}
            <div>
              <ScrollReveal delay={100}>
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
              </ScrollReveal>
            </div>

            {/* Tools Links */}
            <div>
              <ScrollReveal delay={200}>
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
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Bottom Footer - closer to bottom */}
        <ScrollReveal delay={300} rootMargin="0px">
          <div className="mt-10 flex flex-col items-center gap-2 pt-8">
            <p className="text-diamond-dust/30 text-xs">
              © {new Date().getFullYear()} Lustrous
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
