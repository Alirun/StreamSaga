/**
 * User Identity Generator
 * 
 * Generates deterministic avatars and usernames for users based on their user ID.
 * Uses DiceBear Bottts style for robot-themed avatars with matching usernames.
 */

// Adjectives for username generation - tech/robot themed
const ADJECTIVES = [
    "Cosmic", "Neon", "Cyber", "Quantum", "Digital",
    "Pixel", "Chrome", "Stellar", "Turbo", "Hyper",
    "Swift", "Volt", "Spark", "Nova", "Binary",
    "Atomic", "Laser", "Plasma", "Sonic", "Zero",
    "Alpha", "Beta", "Delta", "Omega", "Prime",
    "Ultra", "Mega", "Giga", "Nano", "Micro"
];

// Nouns for username generation - robot/tech themed
const NOUNS = [
    "Bot", "Unit", "Core", "Node", "Chip",
    "Droid", "Agent", "Sprite", "Entity", "Module",
    "Circuit", "Pulse", "Wave", "Signal", "Beam",
    "Matrix", "Vector", "Byte", "Protocol", "System",
    "Nexus", "Forge", "Link", "Grid", "Hub",
    "Spark", "Flux", "Volt", "Arc", "Ray"
];

/**
 * Generates a deterministic hash from a string
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Gets a deterministic username based on user ID
 * Format: "AdjectiveNoun" (e.g., "CosmicBot", "NeonCore")
 */
export function getUsername(userId: string): string {
    const hash = hashString(userId);
    const adjIndex = hash % ADJECTIVES.length;
    const nounIndex = Math.floor(hash / ADJECTIVES.length) % NOUNS.length;

    return `${ADJECTIVES[adjIndex]}${NOUNS[nounIndex]}`;
}

/**
 * Gets a DiceBear avatar URL for the user
 * Uses the Bottts style for robot-themed avatars
 */
export function getAvatarUrl(userId: string, size: number = 40): string {
    // Using DiceBear API with Bottts style
    // The seed parameter ensures the same userId always generates the same avatar
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(userId)}&size=${size}`;
}

/**
 * User identity object containing both avatar and username
 */
export interface UserIdentity {
    username: string;
    avatarUrl: string;
}

/**
 * Gets the complete user identity (avatar + username) for a user ID
 */
export function getUserIdentity(userId: string, avatarSize: number = 40): UserIdentity {
    return {
        username: getUsername(userId),
        avatarUrl: getAvatarUrl(userId, avatarSize)
    };
}
