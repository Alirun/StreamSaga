"use client";

import { useEffect, useState } from "react";
import { TopicCard } from "@/components/topic-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Topic, TopicStatus } from "@/lib/types";
import { subscribeToTopics } from "@/lib/services/realtime";

interface TopicGridProps {
    initialTopics: Topic[];
    status: TopicStatus;
    previewCount?: number;
}

export function TopicGrid({ initialTopics, status, previewCount = 3 }: TopicGridProps) {
    const [topics, setTopics] = useState<Topic[]>(initialTopics);
    const [isExpanded, setIsExpanded] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const unsubscribe = subscribeToTopics(supabase, (payload) => {
            // Only handle topics matching our status filter
            if (payload.eventType === "INSERT") {
                if (payload.new.status === status) {
                    setTopics((prev) => [payload.new, ...prev]);
                }
            } else if (payload.eventType === "UPDATE") {
                const wasOurStatus = topics.some((t) => t.id === payload.old.id);
                const isNowOurStatus = payload.new.status === status;

                if (wasOurStatus && !isNowOurStatus) {
                    // Topic moved away from our status
                    setTopics((prev) => prev.filter((t) => t.id !== payload.new.id));
                } else if (!wasOurStatus && isNowOurStatus) {
                    // Topic moved into our status
                    setTopics((prev) => [payload.new, ...prev]);
                } else if (wasOurStatus && isNowOurStatus) {
                    // Topic updated but still our status
                    setTopics((prev) =>
                        prev.map((topic) =>
                            topic.id === payload.new.id ? payload.new : topic
                        )
                    );
                }
            } else if (payload.eventType === "DELETE") {
                setTopics((prev) => prev.filter((t) => t.id !== payload.old.id));
            }
        });

        return () => {
            unsubscribe();
        };
    }, [supabase, status, topics]);

    const displayedTopics = isExpanded ? topics : topics.slice(0, previewCount);
    const hasMore = topics.length > previewCount;

    if (topics.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No {status} topics found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                ))}
            </div>
            {hasMore && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? "Show Less" : `View All (${topics.length})`}
                    </Button>
                </div>
            )}
        </div>
    );
}
