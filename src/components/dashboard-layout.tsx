"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
    sidebar: ReactNode;
    children: ReactNode;
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
            {/* Sidebar - hidden on mobile, visible on lg+ */}
            <aside className="hidden lg:block w-72 shrink-0 border-r border-border/40 bg-background/50 overflow-y-auto">
                <div className="sticky top-0 p-4">
                    {sidebar}
                </div>
            </aside>

            {/* Mobile sidebar - vertical list on smaller screens */}
            <div className="lg:hidden">
                {sidebar}
            </div>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
