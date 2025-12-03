import { SupabaseClient } from "@supabase/supabase-js";
import { Topic } from "@/lib/types";

type TopicCallback = (payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new: Topic;
    old: Topic;
}) => void;

export function subscribeToTopics(
    supabase: SupabaseClient,
    callback: TopicCallback
) {
    const channel = supabase
        .channel("admin-topics")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "topics",
            },
            (payload) => {
                // @ts-ignore - Payload types from Supabase are generic
                callback(payload);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
