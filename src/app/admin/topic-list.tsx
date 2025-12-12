"use client";

import { useEffect, useState, useTransition } from "react";
import { Archive, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { Topic } from "@/lib/types";
import { subscribeToTopics } from "@/lib/services/realtime";
import { ResolveTopicDialog } from "./resolve-topic-dialog";
import { archiveTopic } from "./actions";
import { RelativeTime } from "@/components/relative-time";

interface TopicListProps {
    initialTopics: Topic[];
}

export function TopicList({ initialTopics }: TopicListProps) {
    const [topics, setTopics] = useState<Topic[]>(initialTopics);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
    const [topicToArchive, setTopicToArchive] = useState<Topic | null>(null);
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();

    useEffect(() => {
        const unsubscribe = subscribeToTopics(supabase, (payload) => {
            if (payload.eventType === "INSERT") {
                setTopics((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === "UPDATE") {
                setTopics((prev) =>
                    prev.map((topic) =>
                        topic.id === payload.new.id ? payload.new : topic
                    )
                );
            } else if (payload.eventType === "DELETE") {
                setTopics((prev) =>
                    prev.filter((topic) => topic.id !== payload.old.id)
                );
            }
        });

        return () => {
            unsubscribe();
        };
    }, [supabase]);

    const handleManage = (topic: Topic) => {
        setSelectedTopic(topic);
        setDialogOpen(true);
    };

    const handleResolved = () => {
        // Topic will be updated via realtime subscription
    };

    const handleArchiveClick = (topic: Topic) => {
        setTopicToArchive(topic);
        setArchiveConfirmOpen(true);
    };

    const handleArchiveConfirm = () => {
        if (!topicToArchive) return;

        startTransition(async () => {
            const result = await archiveTopic(topicToArchive.id);
            if (!result.success) {
                console.error("Failed to archive topic:", result.error);
            }
            setArchiveConfirmOpen(false);
            setTopicToArchive(null);
        });
    };

    return (
        <>
            <div className="rounded-md border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="h-12 px-4 font-medium">Title</th>
                            <th className="h-12 px-4 font-medium">Status</th>
                            <th className="h-12 px-4 font-medium">Proposals</th>
                            <th className="h-12 px-4 font-medium">Created</th>
                            <th className="h-12 px-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                    No topics found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            topics.map((topic) => (
                                <tr key={topic.id} className="border-t hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">{topic.title}</td>
                                    <td className="p-4">
                                        <Badge
                                            variant={
                                                topic.status === "open"
                                                    ? "success"
                                                    : topic.status === "closed"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                            className="capitalize"
                                        >
                                            {topic.status}
                                        </Badge>
                                    </td>
                                    {/* Note: _count is not available in realtime payload usually, might need separate handling or just show 0/refresh for now */}
                                    <td className="p-4">{topic._count?.proposals || 0}</td>
                                    <td className="p-4">
                                        <RelativeTime date={topic.createdAt || topic.created_at || new Date().toISOString()} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {topic.status === "open" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleManage(topic)}
                                                    title="Manage & Resolve Topic"
                                                >
                                                    <Settings className="h-4 w-4 mr-1" />
                                                    Manage
                                                </Button>
                                            )}
                                            {topic.status !== "archived" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleArchiveClick(topic)}
                                                    title="Archive Topic"
                                                    disabled={isPending}
                                                >
                                                    <Archive className="h-4 w-4 mr-1" />
                                                    Archive
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedTopic && (
                <ResolveTopicDialog
                    topic={selectedTopic}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onResolved={handleResolved}
                />
            )}

            {/* Archive Confirmation Dialog */}
            <Dialog open={archiveConfirmOpen} onOpenChange={setArchiveConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Archive Topic</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">
                        Are you sure you want to archive &quot;{topicToArchive?.title}&quot;? This will hide it from the public dashboard.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setArchiveConfirmOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button onClick={handleArchiveConfirm} disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Archiving...
                                </>
                            ) : (
                                "Archive"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

