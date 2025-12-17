/**
 * Centralized site configuration for StreamSaga.
 * All user-facing copy and metadata should be defined here for consistency.
 */

export const siteConfig = {
    name: "StreamSaga",
    creator: "ali_run",
    creatorTwitter: "@AliNuraldin",

    // Main tagline used in headers/hero sections
    tagline: "Every episode forged by you",

    // Longer description for metadata and SEO
    description:
        "Shape what gets built live! Propose ideas and vote on features for ali_run's live coding streams.",

    // Hero section content
    hero: {
        title: "Shape the Future of the Stream",
        // Split for rendering creator name as a link
        subtitleBefore: "Propose and vote on projects, features, and tools to be built live by",
        subtitleAfter: "Every episode forged by you.",
    },

    // Social links
    links: {
        twitch: "https://twitch.tv/ali_run",
        youtube: "https://youtube.com/@ali_run",
        kick: "https://kick.com/ali-run",
        github: "https://github.com/Alirun",
    },

    // SEO keywords
    keywords: [
        "live coding",
        "software development",
        "game development",
        "Twitch",
        "YouTube",
        "Kick",
        "ali_run",
        "StreamSaga",
        "community-driven",
        "interactive streaming",
        "open source",
        "Next.js",
        "Supabase",
    ],

    // Default URL (used for metadata base)
    url: "https://streamsaga.space",
} as const;

// Computed values
export const siteMetadata = {
    title: `${siteConfig.name} | ${siteConfig.creator} Live Coding`,
    fullDescription: `${siteConfig.description} ${siteConfig.tagline}.`,
};
