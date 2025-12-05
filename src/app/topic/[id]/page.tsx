import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { MOCK_PROPOSALS } from "@/lib/data";
import { getTopicById } from "@/lib/services/topics";
import { ProposalCard } from "@/components/proposal-card";
import { UserAvatar } from "@/components/user-avatar";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Topic } from "@/lib/types";

// In Next.js 15+, params is a Promise
type Params = Promise<{ id: string }>;

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
    const topic = await getTopicById(id);

    if (!topic) {
        notFound();
    }

    const proposals = MOCK_PROPOSALS.filter((p) => p.topicId === id);
    const createdAt = getCreatedAt(topic);
    const userId = getUserId(topic);

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
                            <UserAvatar userId={userId} size="md" />
                            <div>
                                <span>Created by </span>
                                <span className="text-foreground font-medium">{userId.substring(0, 8)}...</span>
                                <span> · </span>
                                <RelativeTime date={createdAt} />
                            </div>
                        </div>
                    </div>

                    {topic.status === 'open' && (
                        <Link href="/propose">
                            <Button size="lg" className="w-full md:w-auto shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" />
                                Submit Proposal
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Proposals List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="text-xl font-semibold">Proposals ({proposals.length})</h2>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Top</Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Newest</Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {proposals.length > 0 ? (
                            proposals.map((proposal) => (
                                <ProposalCard key={proposal.id} proposal={proposal} />
                            ))
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-lg">
                                <p className="text-muted-foreground">No proposals yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
