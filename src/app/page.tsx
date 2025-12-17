import { Suspense } from "react";
import { DashboardClient } from "@/components/dashboard-client";
import { getDashboardData, searchGlobal } from "@/app/actions";
import { TopicWithProposals } from "@/lib/types";

// In Next.js 15+, searchParams is a Promise
type SearchParams = Promise<{ q?: string }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = params.q?.trim();

  let openTopics: TopicWithProposals[] = [];
  let closedTopics: TopicWithProposals[] = [];
  let currentUserId: string | undefined;
  let isSearchResult = false;

  if (query) {
    // Search mode - get matching topics with their matching proposals
    const searchResults = await searchGlobal(query);
    // For search results, show all in "open" section (they're search results, not categorized)
    openTopics = searchResults;
    isSearchResult = true;

    // Still need current user for vote functionality
    const dashboardData = await getDashboardData();
    currentUserId = dashboardData.currentUserId;
  } else {
    // Normal mode - get all topics
    const dashboardData = await getDashboardData();
    openTopics = dashboardData.openTopics.map(t => ({ ...t, proposals: [] }));
    closedTopics = dashboardData.closedTopics.map(t => ({ ...t, proposals: [] }));
    currentUserId = dashboardData.currentUserId;
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient
        openTopics={openTopics}
        closedTopics={closedTopics}
        currentUserId={currentUserId}
        isSearchResult={isSearchResult}
      />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar skeleton */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-border/40 p-4">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    </div>
  );
}
