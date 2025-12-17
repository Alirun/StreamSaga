import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { SearchBar } from "@/components/search-bar";
import { User } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isAdmin = user?.app_metadata?.role === 'admin';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6 mx-auto">
                <Logo />

                {/* Search bar - centered */}
                <div className="flex-1 flex justify-center px-4">
                    <SearchBar />
                </div>

                <nav className="flex items-center gap-4">
                    {user ? (
                        <UserMenu userId={user.id} isAdmin={isAdmin} />
                    ) : (
                        <Link href="/login">
                            <Button size="sm" variant="secondary" className="gap-2">
                                <User className="h-4 w-4" />
                                Sign In
                            </Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

