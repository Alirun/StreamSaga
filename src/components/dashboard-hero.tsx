export function DashboardHero() {
    return (
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                Shape the Future of the Stream
            </h1>
            <p className="text-lg text-muted-foreground max-w-[600px]">
                Propose and vote for the projects, features, and tools you want to see built live in upcoming seasons.
            </p>
        </div>
    );
}
