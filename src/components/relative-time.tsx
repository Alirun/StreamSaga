"use client";

interface RelativeTimeProps {
    date: string | Date;
    className?: string;
}

function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
        return "just now";
    } else if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else if (diffWeeks < 4) {
        return `${diffWeeks}w ago`;
    } else if (diffMonths < 12) {
        return `${diffMonths}mo ago`;
    } else {
        return `${diffYears}y ago`;
    }
}

function formatFullDateTime(date: Date): string {
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const relativeTime = getRelativeTime(dateObj);
    const fullDateTime = formatFullDateTime(dateObj);

    return (
        <time
            dateTime={dateObj.toISOString()}
            title={fullDateTime}
            className={className}
        >
            {relativeTime}
        </time>
    );
}
