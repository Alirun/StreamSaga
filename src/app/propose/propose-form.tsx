"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Topic, Proposal } from "@/lib/types";
import { ProposalCard } from "@/components/proposal-card";
import { createProposal, findSimilarProposals, ActionState } from "./actions";

interface ProposeFormProps {
    topics: Topic[];
}

const initialState: ActionState = {
    success: false,
    message: null,
    error: null,
};

export function ProposeForm({ topics }: ProposeFormProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [isChecking, setIsChecking] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [topicId, setTopicId] = useState(topics[0]?.id || "");
    const [similarProposals, setSimilarProposals] = useState<Proposal[]>([]);
    const [state, formAction, isPending] = useActionState(createProposal, initialState);

    const handleCheckSimilarity = async () => {
        if (!title) return;

        setIsChecking(true);
        try {
            const similar = await findSimilarProposals(title, topicId);
            setSimilarProposals(similar);
        } catch (error) {
            console.error("Error checking similarity:", error);
            setSimilarProposals([]);
        }
        setIsChecking(false);
        setStep(2);
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-sm text-muted-foreground">Back to Dashboard</span>
                    </div>
                    <CardTitle className="text-2xl">Submit a Proposal</CardTitle>
                    <CardDescription>
                        Propose a new feature or project for the stream.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <input type="hidden" name="topicId" value={topicId} />
                        <input type="hidden" name="title" value={title} />
                        <div className="space-y-2">
                            <Label htmlFor="topic">Topic</Label>
                            <select
                                id="topic"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={topicId}
                                onChange={(e) => setTopicId(e.target.value)}
                                disabled={step === 2}
                            >
                                {topics.filter(t => t.status === 'open').map(topic => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Proposal Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Build a CLI tool for..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={step === 2}
                            />
                        </div>

                        {step === 1 && (
                            <Button
                                type="button"
                                className="w-full"
                                onClick={handleCheckSimilarity}
                                disabled={!title || isChecking}
                            >
                                {isChecking ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Checking for duplicates...
                                    </>
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-accordion-down">
                                {similarProposals.length > 0 ? (
                                    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                                        <div className="flex items-center gap-2 text-yellow-500 mb-3">
                                            <AlertCircle className="h-5 w-5" />
                                            <h4 className="font-medium">Similar proposals found</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            We found some existing proposals that look similar. You might want to vote for them instead of creating a duplicate.
                                        </p>
                                        <div className="space-y-3">
                                            {similarProposals.map(p => (
                                                <ProposalCard key={p.id} proposal={p} />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 flex items-center gap-2 text-green-500">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span className="font-medium">No similar proposals found. You&apos;re good to go!</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your idea in more detail..."
                                        className="min-h-[120px]"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                {state.error && (
                                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 flex items-center gap-2 text-red-500">
                                        <AlertCircle className="h-5 w-5" />
                                        <span>{state.error}</span>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="flex-1"
                                        disabled={isPending}
                                    >
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Proposal"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
