"use client";

import { TopicGroup } from "@/components/topic-item";
import { Topic } from "@/lib/types";

interface TopicSidebarProps {
    initialOpenTopics: Topic[];
    initialClosedTopics: Topic[];
    selectedTopicId: string | null;
    expandedTopicId: string | null;
    onSelectTopic: (id: string) => void;
    onToggleTopic: (id: string) => void;
    isMobile?: boolean;
    hideLabels?: boolean;
}

export function TopicSidebar({
    initialOpenTopics,
    initialClosedTopics,
    selectedTopicId,
    expandedTopicId,
    onSelectTopic,
    onToggleTopic,
    isMobile = false,
    hideLabels = false,
}: TopicSidebarProps) {
    // Use initial topics directly
    const openTopics = initialOpenTopics;
    const closedTopics = initialClosedTopics;

    return (
        <div className="space-y-6 py-2">
            <TopicGroup
                title="Active Topics"
                topics={openTopics}
                selectedTopicId={selectedTopicId}
                expandedTopicId={expandedTopicId}
                onSelectTopic={onSelectTopic}
                onToggleTopic={onToggleTopic}
                status="open"
                isMobile={isMobile}
                hideLabel={hideLabels}
            />

            <TopicGroup
                title="Closed Topics"
                topics={closedTopics}
                selectedTopicId={selectedTopicId}
                expandedTopicId={expandedTopicId}
                onSelectTopic={onSelectTopic}
                onToggleTopic={onToggleTopic}
                status="closed"
                isMobile={isMobile}
                hideLabel={hideLabels}
            />

            {openTopics.length === 0 && closedTopics.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    No topics available
                </div>
            )}
        </div>
    );
}
