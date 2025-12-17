"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Topic, TopicStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TopicItemProps {
    topic: Topic;
    isSelected: boolean;
    isExpanded: boolean;
    onSelect: () => void;
    onToggle: () => void;
    isMobile?: boolean;
}

export function TopicItem({
    topic,
    isSelected,
    isExpanded,
    onSelect,
    onToggle,
    isMobile = false,
}: TopicItemProps) {
    const proposalCount = topic._count?.proposals || 0;

    const handleClick = () => {
        if (isMobile) {
            // On mobile, toggle expansion
            onToggle();
        } else {
            // On desktop, select the topic
            onSelect();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={cn(
                "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                "hover:bg-muted/50",
                isSelected && !isMobile && "bg-primary/10 border-l-2 border-primary",
                isExpanded && isMobile && "bg-muted/30"
            )}
        >
            <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Expand/collapse indicator */}
                <span className="text-muted-foreground shrink-0">
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </span>

                {/* Topic title */}
                <span className={cn(
                    "truncate text-sm font-medium",
                    isSelected && !isMobile && "text-primary"
                )}>
                    {topic.title}
                </span>
            </div>

            {/* Proposal count */}
            <div className="flex items-center gap-1.5 shrink-0">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{proposalCount}</span>
            </div>
        </div>
    );
}

interface TopicGroupProps {
    title: string;
    topics: Topic[];
    selectedTopicId: string | null;
    expandedTopicId: string | null;
    onSelectTopic: (id: string) => void;
    onToggleTopic: (id: string) => void;
    status: TopicStatus;
    isMobile?: boolean;
    hideLabel?: boolean;
}

export function TopicGroup({
    title,
    topics,
    selectedTopicId,
    expandedTopicId,
    onSelectTopic,
    onToggleTopic,
    isMobile = false,
    hideLabel = false,
}: TopicGroupProps) {
    if (topics.length === 0) return null;

    return (
        <div className="space-y-1">
            {/* Group header - static, non-collapsible */}
            {!hideLabel && (
                <div className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>{title}</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {topics.length}
                    </Badge>
                </div>
            )}

            {/* Topic list */}
            <div className="space-y-0.5">
                {topics.map((topic) => (
                    <TopicItem
                        key={topic.id}
                        topic={topic}
                        isSelected={selectedTopicId === topic.id}
                        isExpanded={expandedTopicId === topic.id}
                        onSelect={() => onSelectTopic(topic.id)}
                        onToggle={() => onToggleTopic(topic.id)}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </div>
    );
}
