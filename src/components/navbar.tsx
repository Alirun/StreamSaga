import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6 mx-auto">
                <Logo />
                <nav className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="sm">Admin</Button>
                    </Link>
                    <Button size="sm" variant="secondary" className="gap-2">
                        <User className="h-4 w-4" />
                        Sign In
                    </Button>
                </nav>
            </div>
        </header>
    );
}
