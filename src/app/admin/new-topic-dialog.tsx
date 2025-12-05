"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { createTopic, findSimilarTopics } from "./actions";

const initialState = {
    success: false,
    message: null,
    error: null,
};

export function NewTopicDialog() {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createTopic, initialState);
    const [title, setTitle] = useState("");
    const [similarTopics, setSimilarTopics] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (title.length > 3) {
                setIsSearching(true);
                try {
                    const results = await findSimilarTopics(title);
                    setSimilarTopics(results || []);
                } catch (err) {
                    console.error("Search failed:", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSimilarTopics([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [title]);

    useEffect(() => {
        if (state.success) {
            setOpen(false);
        }
    }, [state.success]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Topic
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Topic</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. Season 4: AI Agents"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {isSearching && <p className="text-xs text-muted-foreground mt-1">Searching for similar topics...</p>}
                        {similarTopics.length > 0 && (
                            <div className="mt-2 rounded-md border bg-muted/50 p-3">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Similar topics found:</p>
                                <ul className="space-y-1">
                                    {similarTopics.map((topic) => (
                                        <li key={topic.id} className="text-sm flex justify-between">
                                            <span>{topic.title}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {Math.round(topic.similarity * 100)}% match
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {state.error && (
                        <p className="text-sm text-red-500">{state.error}</p>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Topic
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
