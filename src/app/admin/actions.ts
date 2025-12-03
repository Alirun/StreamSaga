"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createTopic as createTopicService } from "@/lib/services/topics";

export type ActionState = {
    success: boolean;
    message: string | null;
    error: string | null;
};

export async function createTopic(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, message: null, error: "Unauthorized" };
    }

    // Get form data
    const title = formData.get("title") as string;
    const status = formData.get("status") as string || "open";

    if (!title || title.trim().length === 0) {
        return { success: false, message: null, error: "Title is required" };
    }

    try {
        await createTopicService({
            title,
            status,
            userId: user.id,
        });
    } catch (error: any) {
        console.error("Error creating topic:", error);
        return { success: false, message: null, error: "Failed to create topic" };
    }

    revalidatePath("/admin");
    return { success: true, message: "Topic created successfully", error: null };
}
