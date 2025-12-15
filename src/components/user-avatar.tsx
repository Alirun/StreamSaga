import { cn } from "@/lib/utils";
import { getAvatarUrl, getUsername } from "@/lib/user-identity";
import Image from "next/image";

interface UserAvatarProps {
    userId: string;
    size?: "sm" | "md" | "lg";
    className?: string;
    showName?: boolean;
}

const sizeConfig = {
    sm: { pixels: 20, className: "w-5 h-5" },
    md: { pixels: 32, className: "w-8 h-8" },
    lg: { pixels: 40, className: "w-10 h-10" },
};

export function UserAvatar({ userId, size = "sm", className, showName = false }: UserAvatarProps) {
    const config = sizeConfig[size];
    const avatarUrl = getAvatarUrl(userId, config.pixels);
    const username = getUsername(userId);

    if (showName) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <img
                    src={avatarUrl}
                    alt={username}
                    className={cn(
                        "rounded-full bg-muted shrink-0",
                        config.className
                    )}
                    width={config.pixels}
                    height={config.pixels}
                />
                <span className="font-medium text-foreground">@{username}</span>
            </div>
        );
    }

    return (
        <img
            src={avatarUrl}
            alt={username}
            className={cn(
                "rounded-full bg-muted shrink-0",
                config.className,
                className
            )}
            width={config.pixels}
            height={config.pixels}
            title={`@${username}`}
        />
    );
}

/**
 * Component to display user identity with avatar and username
 * Use this when you need to show both together
 */
export function UserIdentityDisplay({
    userId,
    size = "sm",
    prefix,
    className
}: {
    userId: string;
    size?: "sm" | "md" | "lg";
    prefix?: string;
    className?: string;
}) {
    const username = getUsername(userId);

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <UserAvatar userId={userId} size={size} />
            <span>
                {prefix && <span>{prefix} </span>}
                <span className="font-medium text-foreground">@{username}</span>
            </span>
        </div>
    );
}
