import { createClient } from "@/lib/supabase/server";
import { Proposal } from "@/lib/types";
import { generateEmbedding } from "./openai";

export type CreateProposalData = {
    title: string;
    description?: string;
    topicId: string;
    userId: string;
};

export async function createProposal(data: CreateProposalData) {
    const supabase = await createClient();

    // Generate embedding from title and description for similarity search
    const textForEmbedding = data.description
        ? `${data.title} ${data.description}`
        : data.title;
    const embedding = await generateEmbedding(textForEmbedding);

    const { data: proposal, error } = await supabase
        .from("proposals")
        .insert({
            title: data.title,
            description: data.description || null,
            topic_id: data.topicId,
            user_id: data.userId,
            embedding: embedding,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Error creating proposal: ${error.message}`);
    }

    return proposal;
}

export async function getProposalsByTopicId(topicId: string) {
    const supabase = await createClient();

    // Fetch proposals with vote counts in a single query
    const { data, error } = await supabase
        .from("proposals")
        .select("*, votes!left(id)")
        .eq("topic_id", topicId)
        .is("archived_at", null);

    if (error) {
        throw new Error(`Error fetching proposals: ${error.message}`);
    }

    // Map snake_case to camelCase and count votes
    const proposalsWithCount = data.map((proposal) => ({
        ...proposal,
        topicId: proposal.topic_id,
        userId: proposal.user_id,
        createdAt: proposal.created_at,
        updatedAt: proposal.updated_at,
        archivedAt: proposal.archived_at,
        approvedAt: proposal.approved_at,
        _count: { votes: (proposal.votes as any[])?.filter((v: any) => v.id !== null).length || 0 },
        votes: undefined, // Remove the votes array from the response
    }));

    return proposalsWithCount as unknown as Proposal[];
}

export async function searchSimilarProposals(query: string, topicId: string, threshold = 0.3) {
    const supabase = await createClient();

    try {
        // Rate limit check
        let env: Cloudflare.Env | undefined;
        try {
            const { getCloudflareContext } = await import("@opennextjs/cloudflare");
            const context = await getCloudflareContext();
            env = context?.env as Cloudflare.Env;
        } catch {
            // Ignore context loading errors (e.g. local dev)
        }

        if (env?.EMBEDDING_LIMITER) {
            const { success } = await env.EMBEDDING_LIMITER.limit({ key: "search-similar" });
            if (!success) {
                console.warn("Rate limit exceeded for embedding search");
                return [];
            }
        }

        const embedding = await generateEmbedding(query);

        const { data, error } = await supabase.rpc("match_proposals", {
            query_embedding: embedding,
            p_topic_id: topicId,
            match_threshold: threshold,
            match_count: 5,
        });

        if (error) {
            console.error("Error searching proposals:", error);
            return [];
        }

        // Get real vote counts
        const proposalIds = (data || []).map((p: any) => p.id);
        const { getVoteCountsForProposals } = await import("./votes");
        const voteCounts = await getVoteCountsForProposals(proposalIds);

        // Map to Proposal type with real vote counts
        const proposals = (data || []).map((proposal: any) => ({
            ...proposal,
            topicId: proposal.topic_id,
            userId: proposal.user_id,
            createdAt: proposal.created_at,
            _count: { votes: voteCounts.get(proposal.id) || 0 },
        }));

        return proposals as Proposal[];
    } catch (e) {
        console.error("Error in searchSimilarProposals:", e);
        return [];
    }
}

export async function archiveProposal(proposalId: string, userId: string) {
    // Use admin client since we've already validated auth in the server action
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    // Check if proposal is approved - approved proposals cannot be archived
    const { data: proposal, error: checkError } = await supabase
        .from("proposals")
        .select("approved_at")
        .eq("id", proposalId)
        .single();

    if (checkError) {
        throw new Error(`Error checking proposal: ${checkError.message}`);
    }

    if (proposal?.approved_at) {
        throw new Error("Approved proposals cannot be modified");
    }

    const { error } = await supabase
        .from("proposals")
        .update({ archived_at: new Date().toISOString() })
        .eq("id", proposalId)
        .eq("user_id", userId); // Ownership check still enforced

    if (error) {
        throw new Error(`Error archiving proposal: ${error.message}`);
    }
}

export async function getProposalCountByTopicId(topicId: string): Promise<number> {
    const supabase = await createClient();

    const { count, error } = await supabase
        .from("proposals")
        .select("*", { count: "exact", head: true })
        .eq("topic_id", topicId)
        .is("archived_at", null);

    if (error) {
        console.error("Error counting proposals:", error);
        return 0;
    }

    return count || 0;
}

export async function approveProposals(proposalIds: string[]) {
    if (proposalIds.length === 0) {
        return;
    }

    // Use admin client for admin operations
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("proposals")
        .update({ approved_at: new Date().toISOString() })
        .in("id", proposalIds);

    if (error) {
        throw new Error(`Error approving proposals: ${error.message}`);
    }
}

