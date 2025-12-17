"use server";

import { createClient } from "@/lib/supabase/server";
import { getTopicsByStatus, getTopicById } from "@/lib/services/topics";
import { getProposalsByTopicId } from "@/lib/services/proposals";
import { getUserVotesForProposals } from "@/lib/services/votes";
import { searchContent } from "@/lib/services/search";
import { Topic, Proposal, TopicWithProposals } from "@/lib/types";

// Initial dashboard data - just topics with proposal counts (lightweight)
export async function getDashboardData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch topics (with proposal counts only)
    const [openTopics, closedTopics] = await Promise.all([
        getTopicsByStatus('open'),
        getTopicsByStatus('closed')
    ]);

    return {
        openTopics,
        closedTopics,
        currentUserId: user?.id
    };
}

// Fetch proposals for a specific topic (called on topic click)
export async function fetchTopicWithProposals(topicId: string): Promise<TopicWithProposals | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get topic details
    const topic = await getTopicById(topicId);
    if (!topic) return null;

    // Get proposals for this topic
    const proposals = await getProposalsByTopicId(topicId);

    // If user is logged in, fetch their votes for these proposals
    let votedProposalIds = new Set<string>();
    if (user && proposals.length > 0) {
        votedProposalIds = await getUserVotesForProposals(
            user.id,
            proposals.map(p => p.id)
        );
    }

    // Mark hasVoted on proposals
    const proposalsWithVotes = proposals.map(p => ({
        ...p,
        hasVoted: votedProposalIds.has(p.id)
    }));

    return {
        ...topic,
        proposals: proposalsWithVotes
    };
}

// Search - returns tree structure
export async function searchGlobal(query: string): Promise<TopicWithProposals[]> {
    const results = await searchContent(query);
    const topicsMap = new Map<string, TopicWithProposals>();

    // Process Topics
    results.filter(r => r.type === 'topic').forEach(r => {
        const topic = r.item;
        topicsMap.set(topic.id, {
            ...topic,
            proposals: [],
            _count: { proposals: 0 }
        });
    });

    // Process Proposals - group by topic
    results.filter(r => r.type === 'proposal').forEach(r => {
        const proposal = r.item;
        const topicId = proposal.topic_id;
        const relatedTopic = r.relatedTopic;

        if (!topicsMap.has(topicId) && relatedTopic) {
            topicsMap.set(topicId, {
                ...relatedTopic,
                proposals: [],
                _count: { proposals: 0 }
            });
        }

        const topic = topicsMap.get(topicId);
        if (topic) {
            topic.proposals.push({
                ...proposal,
                similarity: r.similarity
            } as Proposal);
        }
    });

    return Array.from(topicsMap.values());
}

// Legacy actions kept for compatibility
export async function fetchProposalsForTopic(topicId: string) {
    return getProposalsByTopicId(topicId);
}

export async function fetchUserVotesForProposals(userId: string, proposalIds: string[]) {
    const votes = await getUserVotesForProposals(userId, proposalIds);
    return Array.from(votes);
}
