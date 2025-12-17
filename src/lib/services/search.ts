import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "./openai";

export type SearchResult = {
    type: "topic" | "proposal";
    item: any;
    relatedTopic?: any;
    similarity: number;
};

export async function searchContent(query: string) {
    const supabase = await createClient();

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
        const { success } = await env.EMBEDDING_LIMITER.limit({ key: "search-global" });
        if (!success) {
            console.warn("Rate limit exceeded for global search");
            return [];
        }
    }

    console.log(`Generating embedding for query: "${query}"...`);
    const embedding = await generateEmbedding(query);

    console.log("Executing vector search...");
    const [topicsResult, proposalsResult] = await Promise.all([
        supabase.rpc("match_topics", {
            query_embedding: embedding,
            match_threshold: 0.3,
            match_count: 5,
        }),
        supabase.rpc("match_all_proposals", {
            query_embedding: embedding,
            match_threshold: 0.3,
            match_count: 5,
        })
    ]);

    if (topicsResult.error) {
        console.error("Error searching topics:", topicsResult.error);
    }
    if (proposalsResult.error) {
        console.error("Error searching proposals:", proposalsResult.error);
    }

    const topics = topicsResult.data || [];
    const proposals = proposalsResult.data || [];

    // Fetch related topics for proposals to display in tree-style
    const proposalTopicIds = [...new Set(proposals.map((p: any) => p.topic_id))];
    let topicMap = new Map<string, any>();

    if (proposalTopicIds.length > 0) {
        const { data: relatedTopics, error: relatedError } = await supabase
            .from("topics")
            .select("id, title")
            .in("id", proposalTopicIds);

        if (!relatedError && relatedTopics) {
            topicMap = new Map(relatedTopics.map((t) => [t.id, t]));
        } else if (relatedError) {
            console.error("Error fetching related topics:", relatedError);
        }
    }

    const results: SearchResult[] = [];

    console.log("\n--- Search Results ---");

    // Process and print Topics
    if (topics.length > 0) {
        console.log("\nTopics found:");
        for (const topic of topics) {
            console.log(`- [Topic] ${topic.title} (Similarity: ${(topic.similarity * 100).toFixed(1)}%)`);
            results.push({ type: "topic", item: topic, similarity: topic.similarity });
        }
    }

    // Process and print Proposals
    if (proposals.length > 0) {
        console.log("\nProposals found:");
        for (const proposal of proposals) {
            const relatedTopic = topicMap.get(proposal.topic_id);
            const topicTitle = relatedTopic ? relatedTopic.title : "Unknown Topic";

            console.log(`- [Proposal] ${proposal.title}`);
            console.log(`  └─ Related Topic: ${topicTitle}`);
            console.log(`  └─ Similarity: ${(proposal.similarity * 100).toFixed(1)}%`);

            results.push({
                type: "proposal",
                item: proposal,
                relatedTopic: relatedTopic,
                similarity: proposal.similarity
            });
        }
    }

    if (topics.length === 0 && proposals.length === 0) {
        console.log("No results found.");
    }

    return results;
}
