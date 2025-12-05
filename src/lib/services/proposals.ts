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

    // For now, we'll count votes in a separate query until we have the votes table
    const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("topic_id", topicId)
        .is("archived_at", null)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Error fetching proposals: ${error.message}`);
    }

    // Add mock vote count for now (until votes table is implemented)
    const proposalsWithCount = data.map((proposal) => ({
        ...proposal,
        // Map snake_case to camelCase for TypeScript
        topicId: proposal.topic_id,
        userId: proposal.user_id,
        createdAt: proposal.created_at,
        updatedAt: proposal.updated_at,
        archivedAt: proposal.archived_at,
        _count: { votes: 0 }, // Mocked until votes table exists
    }));

    return proposalsWithCount as unknown as Proposal[];
}

export async function searchSimilarProposals(query: string, topicId: string, threshold = 0.3) {
    const supabase = await createClient();

    try {
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

        // Map to Proposal type with vote counts
        const proposals = (data || []).map((proposal: any) => ({
            ...proposal,
            topicId: proposal.topic_id,
            userId: proposal.user_id,
            createdAt: proposal.created_at,
            _count: { votes: 0 }, // Mocked until votes table exists
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
