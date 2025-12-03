import { createClient } from "@/lib/supabase/server";
import { Topic } from "@/lib/types";
import { generateEmbedding } from "./openai";

export type CreateTopicData = {
    title: string;
    status: string;
    userId: string;
};

export async function getTopics() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Error fetching topics: ${error.message}`);
    }

    // Mock proposal count for now
    const topicsWithCount = data.map((topic) => ({
        ...topic,
        _count: { proposals: 0 }, // Mocked count
    }));

    return topicsWithCount as unknown as Topic[];
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
