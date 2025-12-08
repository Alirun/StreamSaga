"use client";

import { useState, useTransition, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Topic, Proposal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { resolveTopicWithApprovals, getProposalsForTopic } from "./actions";

interface ResolveTopicDialogProps {
    topic: Topic;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResolved?: () => void;
}

export function ResolveTopicDialog({ topic, open, onOpenChange, onResolved }: ResolveTopicDialogProps) {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Fetch proposals when dialog opens
    useEffect(() => {
        if (open && topic.id) {
            setLoading(true);
            setSelectedIds(new Set());
            getProposalsForTopic(topic.id).then((data) => {
                setProposals(data);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [open, topic.id]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleResolve = () => {
        startTransition(async () => {
            const result = await resolveTopicWithApprovals(topic.id, Array.from(selectedIds));
            if (result.success) {
                onOpenChange(false);
                onResolved?.();
            } else {
                console.error("Failed to resolve topic:", result.error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Resolve Topic: {topic.title}</DialogTitle>
                    <DialogDescription>
                        Select proposals to approve, then close this topic. Approved proposals cannot be modified or deleted.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : proposals.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No proposals for this topic yet.
                        </p>
                    ) : (
                        proposals.map((proposal) => (
                            <button
                                key={proposal.id}
                                type="button"
                                onClick={() => toggleSelection(proposal.id)}
                                className={cn(
                                    "w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left",
                                    selectedIds.has(proposal.id)
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:bg-muted/50"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5",
                                        selectedIds.has(proposal.id)
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted-foreground"
                                    )}
                                >
                                    {selectedIds.has(proposal.id) && (
                                        <Check className="h-3 w-3" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium truncate">{proposal.title}</span>
                                        <Badge variant="outline" className="shrink-0">
                                            {proposal._count?.votes || 0} votes
                                        </Badge>
                                    </div>
                                    {proposal.description && (
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {proposal.description}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <DialogFooter className="border-t pt-4">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-muted-foreground">
                            {selectedIds.size} proposal{selectedIds.size !== 1 ? "s" : ""} selected
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleResolve} disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resolving...
                                    </>
                                ) : (
                                    "Resolve & Close Topic"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
