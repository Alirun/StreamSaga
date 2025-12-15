"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { getUsername } from "@/lib/user-identity";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/(auth)/actions";
import { Shield, LogOut } from "lucide-react";

interface UserMenuProps {
    userId: string;
    isAdmin: boolean;
}

export function UserMenu({ userId, isAdmin }: UserMenuProps) {
    const username = getUsername(userId);

    return (
        <div className="relative group">
            {/* Avatar Button */}
            <button
                className="flex items-center justify-center rounded-full ring-2 ring-transparent hover:ring-primary/50 transition-all duration-200"
                aria-label="User menu"
            >
                <UserAvatar userId={userId} size="md" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-popover border border-border rounded-lg shadow-lg min-w-48 py-2">
                    {/* Username Header */}
                    <div className="px-4 py-2 border-b border-border">
                        <p className="font-medium text-foreground">@{username}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                                <Shield className="h-4 w-4" />
                                Admin Panel
                            </Link>
                        )}
                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
