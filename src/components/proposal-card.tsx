"use client";

import { useState } from "react";
import { ArrowBigUp, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Proposal } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProposalCardProps {
    proposal: Proposal;
    hasVoted?: boolean;
}

export function ProposalCard({ proposal, hasVoted: initialHasVoted = false }: ProposalCardProps) {
    const [hasVoted, setHasVoted] = useState(initialHasVoted);
    const [voteCount, setVoteCount] = useState(proposal._count?.votes || 0);

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
                    <CardContent className="pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>@{proposal.userId}</span>
                            </div>
                            <span>•</span>
                            <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        {/* Tags or other metadata could go here */}
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
}
