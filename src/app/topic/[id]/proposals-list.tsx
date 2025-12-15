"use client";

import { useState, useMemo } from "react";
import { ProposalCard } from "@/components/proposal-card";
import { Button } from "@/components/ui/button";
import { Proposal } from "@/lib/types";

type SortType = 'votes' | 'newest';

interface ProposalsListProps {
    proposals: Proposal[];
    topicId: string;
    currentUserId?: string;
    userVotes: Set<string>;
}

export function ProposalsList({
    proposals,
    topicId,
    currentUserId,
    userVotes,
}: ProposalsListProps) {
    const [sortBy, setSortBy] = useState<SortType>('votes');

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-semibold">Proposals ({proposals.length})</h2>
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
    );
}
