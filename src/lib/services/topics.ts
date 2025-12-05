import { createClient } from "@/lib/supabase/server";
import { Topic, TopicStatus } from "@/lib/types";
import { generateEmbedding } from "./openai";

export type CreateTopicData = {
    title: string;
    status: string;
    userId: string;
};

// Helper to transform topic data with proposal count
function transformTopicWithCount(topic: any): Topic {
    // Supabase returns proposals as an array with count when using select('*, proposals(count)')
    const proposalCount = topic.proposals?.[0]?.count ?? 0;
    const { proposals, ...topicData } = topic;
    return {
        ...topicData,
        _count: { proposals: proposalCount },
    } as Topic;
}

export async function getTopics() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("topics")
        .select("*, proposals(count)")
        .is("proposals.archived_at", null)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Error fetching topics: ${error.message}`);
    }

    return data.map(transformTopicWithCount);
}

export async function getTopicsByStatus(status: TopicStatus, limit?: number) {
    const supabase = await createClient();
    let query = supabase
        .from("topics")
        .select("*, proposals(count)")
        .eq("status", status)
        .is("proposals.archived_at", null)
        .order("created_at", { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Error fetching topics: ${error.message}`);
    }

    return data.map(transformTopicWithCount);
}

export async function getTopicById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("topics")
        .select("*, proposals(count)")
        .eq("id", id)
        .is("proposals.archived_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            // Row not found
            return null;
        }
        throw new Error(`Error fetching topic: ${error.message}`);
    }

    return transformTopicWithCount(data);
}

export async function createTopic(data: CreateTopicData) {
    const supabase = await createClient();

    // Generate embedding for the title
    const embedding = await generateEmbedding(data.title);

    const { error } = await supabase.from("topics").insert({
        title: data.title,
        status: data.status,
        user_id: data.userId,
        embedding: embedding,
    });

    if (error) {
        throw new Error(`Error creating topic: ${error.message}`);
    }
}

export async function searchSimilarTopics(query: string) {
    const supabase = await createClient();

    // Generate embedding for the query
    try {
        const embedding = await generateEmbedding(query);

        const { data, error } = await supabase.rpc("match_topics", {
            query_embedding: embedding,
            match_threshold: 0.3,
            match_count: 5,
        });

        if (error) {
            console.error("Error searching topics:", error);
            return [];
        }

        return data;
    } catch (e) {
        console.error("Error in searchSimilarTopics:", e);
        return [];
    }
}
