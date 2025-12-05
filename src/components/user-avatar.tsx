import { cn } from "@/lib/utils";

interface UserAvatarProps {
    userId: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

// Generate a deterministic color based on user ID
function generateColor(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate HSL color with good saturation and lightness for visibility
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
}

// Get initials from user ID (first 2 characters)
function getInitials(userId: string): string {
    return userId.substring(0, 2).toUpperCase();
}

const sizeClasses = {
    sm: "w-5 h-5 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
};

export function UserAvatar({ userId, size = "sm", className }: UserAvatarProps) {
    const bgColor = generateColor(userId);
    const initials = getInitials(userId);

    return (
        <div
            className={cn(
                "rounded-full flex items-center justify-center font-medium text-white shrink-0",
                sizeClasses[size],
                className
            )}
            style={{ backgroundColor: bgColor }}
            title={`User: ${userId}`}
        >
            {initials}
        </div>
    );
}
