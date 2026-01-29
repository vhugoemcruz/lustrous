import Link from "next/link";
import { LustrousLogo } from "@/components/ui/LustrousLogo";

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
 * Global Footer component.
 * Displays branding, community links, and copyright info.
 */
export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0e] to-[#020203]" />

      {/* Top Separator Line */}
      <div className="via-aqua/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="relative container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <LustrousLogo size={32} showText className="mb-4" />
            <p className="text-diamond-dust/70 mb-4 max-w-sm text-sm leading-relaxed">
              To help you create, Lustrous was born.
            </p>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-pure-quartz mb-4 font-semibold">Community</h4>
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
        <div className="mt-18 flex flex-col items-center gap-2 pt-8">
          <LustrousLogo size={24} showText />
          <p className="text-diamond-dust/40 text-m">
            © {new Date().getFullYear()} Lustrous. All tools run locally in your
            browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
