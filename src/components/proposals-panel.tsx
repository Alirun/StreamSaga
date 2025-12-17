"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, LogIn, ArrowBigUp } from "lucide-react";
import { ProposalCard } from "@/components/proposal-card";
import { DashboardHero } from "@/components/dashboard-hero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { UserIdentityDisplay } from "@/components/user-avatar";
import { RelativeTime } from "@/components/relative-time";
import { Topic, TopicWithProposals } from "@/lib/types";

type SortType = 'votes' | 'newest';

interface ProposalsPanelProps {
    topic: TopicWithProposals | null;
    isLoading?: boolean;
    currentUserId?: string;
}

// Get creation date from either camelCase or snake_case field
function getCreatedAt(topic: Topic): string {
    return topic.createdAt || topic.created_at || new Date().toISOString();
}

// Get user ID from either camelCase or snake_case field
function getUserId(topic: Topic): string {
    return topic.userId || (topic as unknown as { user_id: string }).user_id || "unknown";
}

export function ProposalsPanel({ topic, isLoading, currentUserId }: ProposalsPanelProps) {
    const router = useRouter();
    // Use proposals from the topic directly. 
    // If we wanted to support client-side updates/optimistic UI, we might put this in state,
    // but for now let's derive from prop to keep it simple and aligned with "single query" philosophy.
    const proposals = topic?.proposals || [];

    const [sortBy, setSortBy] = useState<SortType>('votes');
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    // Sort proposals client-side
    const sortedProposals = useMemo(() => {
        const sorted = [...proposals];
        if (sortBy === 'votes') {
            sorted.sort((a, b) => (b._count?.votes ?? 0) - (a._count?.votes ?? 0));
        } else {
            sorted.sort((a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
            );
        }
        return sorted;
    }, [proposals, sortBy]);

    const handleAddProposal = () => {
        if (!topic) return;
        if (currentUserId) {
            router.push(`/propose?topic=${topic.id}`);
        } else {
            setShowLoginDialog(true);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <div className="text-muted-foreground">Loading topic...</div>
            </div>
        );
    }

    // Empty state when no topic is selected
    if (!topic) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <DashboardHero />
                <div className="mt-8 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <ArrowBigUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Select a Topic</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Choose a topic from the sidebar to view and vote on proposals
                    </p>
                </div>
            </div>
        );
    }

    const createdAt = getCreatedAt(topic);
    const userId = getUserId(topic);

    return (
        <>
            <div className="p-6 space-y-6">
                {/* Topic Header */}
                <div className="space-y-3 pb-4 border-b border-border/40">
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {topic.title}
                        </h1>
                        <Badge
                            variant={topic.status === 'open' ? 'success' : topic.status === 'closed' ? 'secondary' : 'outline'}
                            className="capitalize text-sm px-3 py-1 shrink-0"
                        >
                            {topic.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserIdentityDisplay
                            userId={userId}
                            size="sm"
                            prefix="Created by"
                        />
                        <span>·</span>
                        <RelativeTime date={createdAt} />
                    </div>
                </div>

                {/* Proposals Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold">
                                Proposals ({proposals.length})
                            </h2>
                            {topic.status === 'open' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                                    onClick={handleAddProposal}
                                    title="Submit a proposal"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={sortBy === 'votes'
                                    ? "text-foreground bg-muted"
                                    : "text-muted-foreground hover:text-foreground"
                                }
                                onClick={() => setSortBy('votes')}
                            >
                                Top
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={sortBy === 'newest'
                                    ? "text-foreground bg-muted"
                                    : "text-muted-foreground hover:text-foreground"
                                }
                                onClick={() => setSortBy('newest')}
                            >
                                Newest
                            </Button>
                        </div>
                    </div>

                    {/* Proposals list */}
                    <div className="grid gap-4">
                        {sortedProposals.length > 0 ? (
                            sortedProposals.map((proposal) => (
                                <ProposalCard
                                    key={proposal.id}
                                    proposal={proposal}
                                    hasVoted={!!proposal.hasVoted}
                                    currentUserId={currentUserId}
                                    topicId={topic.id}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-lg">
                                <p className="text-muted-foreground">
                                    No proposals yet. Be the first!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Login required dialog */}
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sign in required</DialogTitle>
                        <DialogDescription>
                            You need to be signed in to submit a proposal. Please sign in to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => router.push('/login')}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
