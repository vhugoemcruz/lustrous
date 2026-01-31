"use client";

import { useEffect, useState } from "react";

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
        <span className="text-diamond-dust/40 font-medium">Created by</span>
        <a
          href={DISCORD_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span className="text-diamond-dust group-hover:text-aqua font-medium transition-colors">
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
        className="flex w-fit animate-pulse items-center gap-3 rounded-full bg-white/5 py-1.5 pr-4 pl-1.5"
      >
        <div className="h-8 w-8 rounded-full bg-white/10" />
        <div className="h-4 w-24 rounded bg-white/10" />
      </div>
    );
  }

  // Safety guard (should not happen, but keeps component resilient)
  if (!data) return null;

  // Final Design: Variation A (Minimalist) with larger avatar
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-diamond-dust/40 font-medium">Created by</span>
      <a
        href={DISCORD_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 transition-transform hover:scale-105"
      >
        {data.avatar ? (
          <img
            src={data.avatar}
            alt={data.name}
            className="h-8 w-8 rounded-full shadow-sm"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#5865F2]" />
        )}
        <span className="text-diamond-dust group-hover:text-aqua font-medium transition-colors">
          {data.name}
        </span>
      </a>
    </div>
  );
}
