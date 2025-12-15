import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTopicById } from "@/lib/services/topics";
import { getProposalsByTopicId } from "@/lib/services/proposals";
import { createClient } from "@/lib/supabase/server";
import { ProposalsList } from "./proposals-list";
import { UserIdentityDisplay } from "@/components/user-avatar";
import { RelativeTime } from "@/components/relative-time";

import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Topic } from "@/lib/types";
import type { Metadata } from "next";

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

// Get creation date from either camelCase or snake_case field
function getCreatedAt(topic: Topic): string {
    return topic.createdAt || topic.created_at || new Date().toISOString();
}

// Get user ID from either camelCase or snake_case field
function getUserId(topic: Topic): string {
    return topic.userId || (topic as unknown as { user_id: string }).user_id || "unknown";
}

export default async function TopicPage({ params }: { params: Params }) {
    const { id } = await params;

    const [topic, supabase] = await Promise.all([
        getTopicById(id),
        createClient()
    ]);

    if (!topic) {
        notFound();
    }

    const [proposals, { data: { user } }] = await Promise.all([
        getProposalsByTopicId(id),
        supabase.auth.getUser()
    ]);

    const createdAt = getCreatedAt(topic);
    const userId = getUserId(topic);
    const currentUserId = user?.id;

    // Fetch user's votes for these proposals
    let userVotes = new Set<string>();
    if (currentUserId && proposals.length > 0) {
        const { getUserVotesForProposals } = await import("@/lib/services/votes");
        userVotes = await getUserVotesForProposals(currentUserId, proposals.map(p => p.id));
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container px-4 md:px-6 py-8 mx-auto max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                {/* Topic Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{topic.title}</h1>
                            <Badge
                                variant={topic.status === 'open' ? 'success' : topic.status === 'closed' ? 'secondary' : 'outline'}
                                className="capitalize text-sm px-3 py-1"
                            >
                                {topic.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <UserIdentityDisplay
                                userId={userId}
                                size="md"
                                prefix="Created by"
                            />
                            <span> · </span>
                            <RelativeTime date={createdAt} />
                        </div>
                    </div>


                </div>

                {/* Proposals List */}
                <ProposalsList
                    proposals={proposals}
                    topicId={id}
                    topicStatus={topic.status}
                    currentUserId={currentUserId}
                    userVotes={userVotes}
                />
            </div>
        </main>
    );
}


