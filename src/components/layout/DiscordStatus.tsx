"use client";

/**
 * @module DiscordStatus
 * @description Discord profile status component adapted for Artist's Studio theme.
 * Shows creator's Discord info with warm paper aesthetics.
 */

import { useEffect, useState } from "react";
import { DiscordIcon } from "@/components/ui/ToolIcons";

interface DiscordData {
  name: string;
  avatar: string | null;
}

const DISCORD_PROFILE_URL = "https://discord.com/users/689302058100195429";

export function DiscordStatus() {
  const [data, setData] = useState<DiscordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDiscordData() {
      try {
        const response = await fetch(`/api/discord-me?t=${Date.now()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Discord data");
        }

        const json: DiscordData = await response.json();
        setData(json);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("[DiscordStatus]", err);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadDiscordData();

    return () => controller.abort();
  }, []);

  // Error state: Show static fallback "Trenshi" without avatar
  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-ink-light/60 font-medium">Created by</span>
        <a
          href={DISCORD_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span className="text-ink-charcoal group-hover:text-wc-blue font-medium transition-colors">
            Trenshi
          </span>
        </a>
      </div>
    );
  }

  // Loading state: skeleton button
  if (loading) {
    return (
      <div
        aria-hidden
        className="flex w-fit animate-pulse items-center gap-3 rounded-full bg-[var(--sketchbook-grey)]/20 py-1.5 pr-4 pl-1.5"
      >
        <div className="h-8 w-8 rounded-full bg-[var(--sketchbook-grey)]/30" />
        <div className="h-4 w-24 rounded bg-[var(--sketchbook-grey)]/30" />
      </div>
    );
  }

  // Safety guard (should not happen, but keeps component resilient)
  if (!data) return null;

  // Final Design: Variation A (Minimalist) with larger avatar + Discord Icon + Tooltip
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-ink-light/60 font-medium">Created by</span>
      <div className="group relative w-fit">
        <a
          href={DISCORD_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
          aria-label="View Discord profile"
        >
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.name}
              className="h-10 w-10 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#5865F2]" />
          )}

          <div className="flex items-center gap-1.5 transition-colors duration-300">
            <span className="text-ink-charcoal font-medium transition-colors duration-300">
              {data.name}
            </span>
          </div>
        </a>

        {/* Custom Tooltip */}
        <div className="pointer-events-none absolute top-full left-5 mt-2 -translate-x-1/2 -translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-80">
          <div className="text-ink-charcoal rounded-md border border-[var(--sketchbook-grey)] bg-[var(--paper-warm)] px-2 py-1 text-[10px] whitespace-nowrap">
            View Discord profile
          </div>
        </div>
      </div>
    </div>
  );
}
