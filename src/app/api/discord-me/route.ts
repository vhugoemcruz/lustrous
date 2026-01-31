import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DISCORD_USER_ID = "689302058100195429";

type DiscordUser = {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
};

/**
 * API Route to securely fetch Discord profile data.
 * - Uses a bot token on the server (never exposed)
 * - Supports animated avatars
 * - Uses Discord CDN best practices
 * - Strong caching to avoid rate limits
 */
export async function GET() {
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    console.error(
      "[discord-me] Missing DISCORD_BOT_TOKEN environment variable"
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/users/${DISCORD_USER_ID}`,
      {
        headers: {
          Authorization: `Bot ${token}`,
        },
        // Next.js fetch cache (revalidate every 1h)
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(
        `[discord-me] Discord API error: ${response.status} ${response.statusText}`
      );

      return NextResponse.json(
        { error: "Failed to fetch Discord data" },
        { status: 502 }
      );
    }

    const user: DiscordUser = await response.json();

    // Prefer global display name, fallback to username
    const name = user.global_name ?? user.username;

    // Handle animated avatars correctly
    let avatar: string | null = null;

    if (user.avatar) {
      const isAnimated = user.avatar.startsWith("a_");
      const extension = isAnimated ? "gif" : "png";

      avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
    }

    return NextResponse.json(
      { name, avatar },
      {
        headers: {
          // Browser cache: 1h | CDN cache (Vercel / edge): 24h
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    console.error("[discord-me] Unexpected error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
