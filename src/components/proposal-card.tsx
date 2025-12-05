"use client";

import { useState } from "react";
import { ArrowBigUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { RelativeTime } from "@/components/relative-time";
import { Proposal } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProposalCardProps {
    proposal: Proposal;
    hasVoted?: boolean;
}

// Get creation date from either camelCase or snake_case field
function getCreatedAt(proposal: Proposal): string {
    return proposal.createdAt || (proposal as any).created_at || new Date().toISOString();
}

// Get user ID from either camelCase or snake_case field
function getUserId(proposal: Proposal): string {
    return proposal.userId || (proposal as any).user_id || "unknown";
}

export function ProposalCard({ proposal, hasVoted: initialHasVoted = false }: ProposalCardProps) {
    const [hasVoted, setHasVoted] = useState(initialHasVoted);
    const [voteCount, setVoteCount] = useState(proposal._count?.votes || 0);

    const createdAt = getCreatedAt(proposal);
    const userId = getUserId(proposal);

    const handleVote = () => {
        if (hasVoted) {
            setVoteCount(prev => prev - 1);
            setHasVoted(false);
        } else {
            setVoteCount(prev => prev + 1);
            setHasVoted(true);
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 hover:bg-card transition-all duration-300">
            <div className="flex flex-row">
                {/* Vote Section */}
                <div className="flex flex-col items-center justify-start p-4 pr-0 gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors",
                            hasVoted && "text-primary bg-primary/10"
                        )}
                        onClick={handleVote}
                    >
                        <ArrowBigUp className={cn("h-8 w-8", hasVoted && "fill-current")} />
                    </Button>
                    <span className={cn("text-sm font-bold", hasVoted ? "text-primary" : "text-muted-foreground")}>
                        {voteCount}
                    </span>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium leading-snug">
                            {proposal.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 space-y-3">
                        {/* Description if present */}
                        {proposal.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {proposal.description}
                            </p>
                        )}

                        {/* Author and time info */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <UserAvatar userId={userId} size="sm" />
                            <span className="font-medium text-foreground">{userId.substring(0, 8)}...</span>
                            <span>·</span>
                            <RelativeTime date={createdAt} />
                        </div>
                    </CardContent>
                </div>
            </div>
        </Card>
    );
}
