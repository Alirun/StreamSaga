"use client";

import { useState, useTransition } from "react";
import { ArrowBigUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { RelativeTime } from "@/components/relative-time";
import { Proposal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { archiveProposal } from "@/app/propose/actions";

interface ProposalCardProps {
    proposal: Proposal;
    hasVoted?: boolean;
    currentUserId?: string;
    topicId?: string;
}

// Get creation date from either camelCase or snake_case field
function getCreatedAt(proposal: Proposal): string {
    return proposal.createdAt || (proposal as any).created_at || new Date().toISOString();
}

// Get user ID from either camelCase or snake_case field
function getUserId(proposal: Proposal): string {
    return proposal.userId || (proposal as any).user_id || "unknown";
}

export function ProposalCard({ proposal, hasVoted: initialHasVoted = false, currentUserId, topicId }: ProposalCardProps) {
    const [hasVoted, setHasVoted] = useState(initialHasVoted);
    const [voteCount, setVoteCount] = useState(proposal._count?.votes || 0);
    const [isArchived, setIsArchived] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const createdAt = getCreatedAt(proposal);
    const userId = getUserId(proposal);
    const isOwner = currentUserId && currentUserId === userId;

    const handleVote = () => {
        if (hasVoted) {
            setVoteCount(prev => prev - 1);
            setHasVoted(false);
        } else {
            setVoteCount(prev => prev + 1);
            setHasVoted(true);
        }
    };

    const handleArchive = () => {
        if (!topicId) return;

        setShowConfirm(false);
        // Optimistic update
        setIsArchived(true);

        startTransition(async () => {
            const result = await archiveProposal(proposal.id, topicId);
            if (!result.success) {
                // Revert on error
                setIsArchived(false);
                console.error("Failed to archive proposal:", result.error);
            }
        });
    };

    // Don't render if archived
    if (isArchived) {
        return null;
    }

    return (
        <>
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
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-lg font-medium leading-snug">
                                    {proposal.title}
                                </CardTitle>
                                {isOwner && topicId && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                        onClick={() => setShowConfirm(true)}
                                        disabled={isPending}
                                        title="Remove proposal"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
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

            {/* Confirmation Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Proposal</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">
                        Are you sure you want to remove this proposal? This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleArchive}>
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

