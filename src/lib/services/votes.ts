import { createClient } from "@/lib/supabase/server";

export type VoteData = {
    proposalId: string;
    userId: string;
};

/**
 * Create a vote or restore a previously archived vote.
 * Uses upsert to handle the case where a user re-votes after unvoting.
 */
export async function createVote(data: VoteData) {
    // Use admin client to bypass RLS for upsert operations
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    // First, check if there's an archived vote to restore
    const { data: existingVote } = await supabase
        .from("votes")
        .select("id, archived_at")
        .eq("proposal_id", data.proposalId)
        .eq("user_id", data.userId)
        .single();

    if (existingVote && existingVote.archived_at) {
        // Restore the archived vote
        const { error } = await supabase
            .from("votes")
            .update({
                archived_at: null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingVote.id);

        if (error) {
            throw new Error(`Error restoring vote: ${error.message}`);
        }
        return;
    }

    if (existingVote && !existingVote.archived_at) {
        // Already has an active vote - no action needed
        return;
    }

    // Create new vote
    const { error } = await supabase
        .from("votes")
        .insert({
            proposal_id: data.proposalId,
            user_id: data.userId,
        });

    if (error) {
        throw new Error(`Error creating vote: ${error.message}`);
    }
}

/**
 * Soft-delete a vote by setting archived_at.
 */
export async function removeVote(data: VoteData) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("votes")
        .update({ archived_at: new Date().toISOString() })
        .eq("proposal_id", data.proposalId)
        .eq("user_id", data.userId)
        .is("archived_at", null);

    if (error) {
        throw new Error(`Error removing vote: ${error.message}`);
    }
}

/**
 * Get vote counts for multiple proposals.
 * Returns a map of proposalId -> count.
 */
export async function getVoteCountsForProposals(proposalIds: string[]): Promise<Map<string, number>> {
    if (proposalIds.length === 0) {
        return new Map();
    }

    const supabase = await createClient();

    // Query votes grouped by proposal
    const { data, error } = await supabase
        .from("votes")
        .select("proposal_id")
        .in("proposal_id", proposalIds)
        .is("archived_at", null);

    if (error) {
        console.error("Error fetching vote counts:", error);
        return new Map();
    }

    // Count votes per proposal
    const counts = new Map<string, number>();
    for (const proposalId of proposalIds) {
        counts.set(proposalId, 0);
    }
    for (const vote of data || []) {
        const current = counts.get(vote.proposal_id) || 0;
        counts.set(vote.proposal_id, current + 1);
    }

    return counts;
}

/**
 * Get all active votes for a user on specific proposals.
 * Returns a Set of proposalIds that the user has voted on.
 */
export async function getUserVotesForProposals(userId: string, proposalIds: string[]): Promise<Set<string>> {
    if (!userId || proposalIds.length === 0) {
        return new Set();
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("votes")
        .select("proposal_id")
        .eq("user_id", userId)
        .in("proposal_id", proposalIds)
        .is("archived_at", null);

    if (error) {
        console.error("Error fetching user votes:", error);
        return new Set();
    }

    return new Set((data || []).map((v) => v.proposal_id));
}
