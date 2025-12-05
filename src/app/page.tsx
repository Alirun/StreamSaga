import { Search } from "lucide-react";
import { getTopicsByStatus } from "@/lib/services/topics";
import { TopicGrid } from "@/components/topic-grid";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const openTopics = await getTopicsByStatus("open");
  const closedTopics = await getTopicsByStatus("closed");

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 py-16 md:py-24 mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Shape the Future of the Stream
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px]">
              Propose and vote for the projects, features, and tools you want to see built live in upcoming seasons.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-md mt-8 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                className="flex h-12 w-full rounded-full border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md transition-all"
                placeholder="Search topics and proposals..."
              />
              <div className="absolute inset-y-0 right-0 pr-1.5 flex items-center">
                <Button size="sm" className="rounded-full h-9 px-4">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Topics */}
      <section className="container px-4 md:px-6 py-12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Active Topics</h2>
          <p className="text-muted-foreground mt-1">Open for new proposals and voting</p>
        </div>
        <TopicGrid initialTopics={openTopics} status="open" previewCount={3} />
      </section>

      {/* Closed Topics */}
      {closedTopics.length > 0 && (
        <section className="container px-4 md:px-6 py-12 mx-auto max-w-6xl border-t border-border/40">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Recent Closed Topics</h2>
            <p className="text-muted-foreground mt-1">Past seasons and completed projects</p>
          </div>
          <TopicGrid initialTopics={closedTopics} status="closed" previewCount={3} />
        </section>
      )}
    </main>
  );
}

