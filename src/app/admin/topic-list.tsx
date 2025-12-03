"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Archive, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { Topic } from "@/lib/types";
import { subscribeToTopics } from "@/lib/services/realtime";

interface TopicListProps {
    initialTopics: Topic[];
}

export function TopicList({ initialTopics }: TopicListProps) {
    const [topics, setTopics] = useState<Topic[]>(initialTopics);
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

    return (
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
                                    {new Date(topic.createdAt || topic.created_at || new Date().toISOString()).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" title="Toggle Status">
                                            {topic.status === "open" ? (
                                                <Lock className="h-4 w-4" />
                                            ) : (
                                                <Unlock className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button variant="ghost" size="icon" title="Archive">
                                            <Archive className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
