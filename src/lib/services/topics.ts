import { createClient } from "@/lib/supabase/server";
import { Topic } from "@/lib/types";

export type CreateTopicData = {
    title: string;
    status: string;
    userId: string;
};

export async function getTopics() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("topics")
        .select("*, _count:proposals(count)")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Error fetching topics: ${error.message}`);
    }

    return data as unknown as Topic[];
}

export async function createTopic(data: CreateTopicData) {
    const supabase = await createClient();
    const { error } = await supabase.from("topics").insert({
        title: data.title,
        status: data.status,
        user_id: data.userId,
    });

    if (error) {
        throw new Error(`Error creating topic: ${error.message}`);
    }
}
