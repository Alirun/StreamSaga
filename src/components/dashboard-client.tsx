"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardHero } from "@/components/dashboard-hero";
import { TopicSidebar } from "@/components/topic-sidebar";
import { ProposalsPanel } from "@/components/proposals-panel";
import { ProposalCard } from "@/components/proposal-card";
import { Badge } from "@/components/ui/badge";
import { Topic, TopicWithProposals } from "@/lib/types";
import { fetchTopicWithProposals } from "@/app/actions";
import { cn } from "@/lib/utils";

interface DashboardClientProps {
    openTopics: Topic[] | TopicWithProposals[];
    closedTopics: Topic[] | TopicWithProposals[];
    currentUserId?: string;
    initialTopicId?: string;
    initialTopic?: TopicWithProposals | null;
    isSearchResult?: boolean;
}

export function DashboardClient({
    openTopics,
    closedTopics,
    currentUserId,
    initialTopicId,
    initialTopic,
    isSearchResult,
}: DashboardClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topicIdFromUrl = searchParams.get("topic");

    // Use initialTopicId (from /topic/[id] route) or URL param
    const effectiveTopicId = initialTopicId || topicIdFromUrl;

    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(effectiveTopicId);
    const [expandedTopicId, setExpandedTopicId] = useState<string | null>(effectiveTopicId);

    // Loaded topic with proposals - initialize with server data if available
    const [selectedTopic, setSelectedTopic] = useState<TopicWithProposals | null>(initialTopic || null);
    const [isLoadingTopic, setIsLoadingTopic] = useState(false);

    // Track the last successfully fetched topic ID to prevent duplicate fetches
    // Initialize with initialTopicId if we have initialTopic data
    const lastFetchedTopicIdRef = useRef<string | null>(initialTopic ? initialTopicId || null : null);
    const isFetchingRef = useRef(false);

    // Fetch topic with proposals when selected
    useEffect(() => {
        if (!selectedTopicId) {
            setSelectedTopic(null);
            lastFetchedTopicIdRef.current = null;
            return;
        }

        // Skip if already fetched this topic or currently fetching
        if (lastFetchedTopicIdRef.current === selectedTopicId || isFetchingRef.current) {
            return;
        }

        const loadTopic = async () => {
            isFetchingRef.current = true;
            setIsLoadingTopic(true);
            try {
                const topic = await fetchTopicWithProposals(selectedTopicId);
                setSelectedTopic(topic);
                lastFetchedTopicIdRef.current = selectedTopicId;
            } catch (error) {
                console.error("Failed to load topic:", error);
                setSelectedTopic(null);
            } finally {
                setIsLoadingTopic(false);
                isFetchingRef.current = false;
            }
        };

        loadTopic();
    }, [selectedTopicId]);

    // Update URL when topic is selected (desktop)
    const handleSelectTopic = (id: string) => {
        // Reset ref when user explicitly selects a different topic
        if (id !== selectedTopicId) {
            lastFetchedTopicIdRef.current = null;
        }
        setSelectedTopicId(id);
        setExpandedTopicId(id);
        router.push(`/topic/${id}`, { scroll: false });
    };

    // Mobile expansion logic
    const handleToggleTopic = (id: string) => {
        const newExpandedId = expandedTopicId === id ? null : id;
        setExpandedTopicId(newExpandedId);
        // Also set as selected to trigger fetch
        if (newExpandedId) {
            if (newExpandedId !== selectedTopicId) {
                lastFetchedTopicIdRef.current = null;
            }
            setSelectedTopicId(newExpandedId);
        }
    };

    // Sync URL params to state (only when URL changes externally via browser navigation)
    useEffect(() => {
        if (topicIdFromUrl && topicIdFromUrl !== selectedTopicId) {
            setSelectedTopicId(topicIdFromUrl);
            setExpandedTopicId(topicIdFromUrl);
        }
    }, [topicIdFromUrl]); // Remove selectedTopicId from deps to prevent loops

    // Desktop sidebar content
    const sidebarContent = (
        <div>
            {isSearchResult && (
                <div className="px-2 py-3 mb-4 border-b border-border/40">
                    <h2 className="text-lg font-semibold">Search Results</h2>
                    <p className="text-sm text-muted-foreground">
                        Found {openTopics.length} matching topic{openTopics.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
            <TopicSidebar
                initialOpenTopics={openTopics}
                initialClosedTopics={isSearchResult ? [] : closedTopics}
                selectedTopicId={selectedTopicId}
                expandedTopicId={expandedTopicId}
                onSelectTopic={handleSelectTopic}
                onToggleTopic={handleToggleTopic}
                isMobile={false}
                hideLabels={isSearchResult}
            />
        </div>
    );

    // Mobile view with expandable topics
    const mobileContent = (
        <div className="lg:hidden p-4 space-y-4">
            {!isSearchResult && <DashboardHero />}

            {isSearchResult && (
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Search Results</h2>
                    <p className="text-sm text-muted-foreground">
                        Found {openTopics.length} matching topic{openTopics.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {/* Active Topics */}
            {openTopics.length > 0 && (
                <div className="space-y-2">
                    {!isSearchResult && (
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
                            Active Topics
                        </h2>
                    )}
                    <div className="space-y-2">
                        {openTopics.map((topic) => {
                            // For search results, topics already have proposals
                            const topicWithProposals = isSearchResult
                                ? (topic as TopicWithProposals)
                                : null;
                            return (
                                <MobileTopicCard
                                    key={topic.id}
                                    topic={topic}
                                    isExpanded={expandedTopicId === topic.id}
                                    onToggle={() => handleToggleTopic(topic.id)}
                                    expandedTopic={
                                        topicWithProposals ||
                                        (expandedTopicId === topic.id ? selectedTopic : null)
                                    }
                                    isLoading={!isSearchResult && expandedTopicId === topic.id && isLoadingTopic}
                                    currentUserId={currentUserId}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Closed Topics - only show when not search result */}
            {!isSearchResult && closedTopics.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
                        Closed Topics
                    </h2>
                    <div className="space-y-2">
                        {closedTopics.map((topic) => (
                            <MobileTopicCard
                                key={topic.id}
                                topic={topic}
                                isExpanded={expandedTopicId === topic.id}
                                onToggle={() => handleToggleTopic(topic.id)}
                                expandedTopic={expandedTopicId === topic.id ? selectedTopic : null}
                                isLoading={expandedTopicId === topic.id && isLoadingTopic}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                </div>
            )}

            {openTopics.length === 0 && closedTopics.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    {isSearchResult ? "No matching topics found" : "No topics available"}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Layout */}
            <div className="hidden lg:block">
                <DashboardLayout sidebar={sidebarContent}>
                    <ProposalsPanel
                        topic={selectedTopic}
                        isLoading={isLoadingTopic}
                        currentUserId={currentUserId}
                    />
                </DashboardLayout>
            </div>

            {/* Mobile Layout */}
            {mobileContent}
        </>
    );
}

// Mobile topic card with expandable proposals
interface MobileTopicCardProps {
    topic: Topic;
    isExpanded: boolean;
    onToggle: () => void;
    expandedTopic: TopicWithProposals | null;
    isLoading: boolean;
    currentUserId?: string;
}

function MobileTopicCard({
    topic,
    isExpanded,
    onToggle,
    expandedTopic,
    isLoading,
    currentUserId,
}: MobileTopicCardProps) {
    const proposalCount = topic._count?.proposals || 0;

    return (
        <div className={cn(
            "rounded-lg border border-border/50 overflow-hidden transition-all",
            isExpanded && "border-primary/30 bg-card/50"
        )}>
            {/* Topic header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-muted-foreground shrink-0">
                        {isExpanded ? (
                            <ChevronDown className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </span>
                    <span className="font-medium truncate">{topic.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">{proposalCount}</span>
                    </div>
                    <Badge
                        variant={topic.status === 'open' ? 'success' : 'secondary'}
                        className="capitalize text-xs"
                    >
                        {topic.status}
                    </Badge>
                </div>
            </button>

            {/* Expanded proposals */}
            {isExpanded && (
                <div className="border-t border-border/40 p-4 space-y-3 bg-background/50">
                    {isLoading ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                            Loading proposals...
                        </div>
                    ) : expandedTopic && expandedTopic.proposals.length > 0 ? (
                        expandedTopic.proposals.map((proposal) => (
                            <ProposalCard
                                key={proposal.id}
                                proposal={proposal}
                                hasVoted={!!proposal.hasVoted}
                                currentUserId={currentUserId}
                                topicId={topic.id}
                            />
                        ))
                    ) : (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                            No proposals yet
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
