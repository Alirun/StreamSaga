"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, LogIn } from "lucide-react";
import { ProposalCard } from "@/components/proposal-card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Proposal, TopicStatus } from "@/lib/types";

type SortType = 'votes' | 'newest';

interface ProposalsListProps {
    proposals: Proposal[];
    topicId: string;
    topicStatus: TopicStatus;
    currentUserId?: string;
    userVotes: Set<string>;
}

export function ProposalsList({
    proposals,
    topicId,
    topicStatus,
    currentUserId,
    userVotes,
}: ProposalsListProps) {
    const router = useRouter();
    const [sortBy, setSortBy] = useState<SortType>('votes');
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    // Sort proposals client-side based on current sort selection
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
        if (currentUserId) {
            router.push(`/propose?topic=${topicId}`);
        } else {
            setShowLoginDialog(true);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">Proposals ({proposals.length})</h2>
                        {topicStatus === 'open' && (
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

                <div className="grid gap-4">
                    {sortedProposals.length > 0 ? (
                        sortedProposals.map((proposal) => (
                            <ProposalCard
                                key={proposal.id}
                                proposal={proposal}
                                hasVoted={userVotes.has(proposal.id)}
                                currentUserId={currentUserId}
                                topicId={topicId}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 border border-dashed rounded-lg">
                            <p className="text-muted-foreground">No proposals yet. Be the first!</p>
                        </div>
                    )}
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
