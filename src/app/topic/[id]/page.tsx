import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";
import { getDashboardData, fetchTopicWithProposals } from "@/app/actions";
import type { Metadata } from "next";
import { getTopicById } from "@/lib/services/topics";

// In Next.js 15+, params is a Promise
type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const topic = await getTopicById(id);

    if (!topic) {
        return {
            title: "Topic Not Found | StreamSaga",
        };
    }

    return {
        title: `${topic.title} | StreamSaga`,
        description: `View and submit proposals for: ${topic.title}`,
    };
}

export default async function TopicPage({ params }: { params: Params }) {
    const { id } = await params;

    // Pre-fetch topic with proposals on the server
    const [dashboardData, initialTopic] = await Promise.all([
        getDashboardData(),
        fetchTopicWithProposals(id)
    ]);

    if (!initialTopic) {
        notFound();
    }

    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardClient
                openTopics={dashboardData.openTopics}
                closedTopics={dashboardData.closedTopics}
                currentUserId={dashboardData.currentUserId}
                initialTopicId={id}
                initialTopic={initialTopic}
            />
        </Suspense>
    );
}

function DashboardSkeleton() {
    return (
        <div className="flex min-h-[calc(100vh-3.5rem)]">
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
            <div className="flex-1 p-6">
                <div className="flex items-center justify-center h-full">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            </div>
        </div>
    );
}
