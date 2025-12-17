import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function DashboardHero() {
    return (
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                {siteConfig.hero.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-[600px]">
                {siteConfig.hero.subtitleBefore}{" "}
                <Link
                    href={siteConfig.links.twitch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                >
                    {siteConfig.creator}
                </Link>
                . {siteConfig.hero.subtitleAfter}
            </p>
        </div>
    );
}
