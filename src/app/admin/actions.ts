"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createTopic as createTopicService, searchSimilarTopics } from "@/lib/services/topics";

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

export async function findSimilarTopics(title: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    try {
        const results = await searchSimilarTopics(title);
        return results;
    } catch (e) {
        console.error("Error in findSimilarTopics:", e);
        return [];
    }
}

export async function resolveTopicWithApprovals(
    topicId: string,
    approvedProposalIds: string[]
): Promise<ActionState> {
    const supabase = await createClient();

    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, message: null, error: "Unauthorized" };
    }

    const role = user.app_metadata?.role;
    if (role !== "admin") {
        return { success: false, message: null, error: "Admin access required" };
    }

    try {
        // Import services
        const { approveProposals } = await import("@/lib/services/proposals");
        const { updateTopicStatus } = await import("@/lib/services/topics");

        // Approve selected proposals
        if (approvedProposalIds.length > 0) {
            await approveProposals(approvedProposalIds);
        }

        // Close the topic
        await updateTopicStatus(topicId, "closed");
    } catch (error: any) {
        console.error("Error resolving topic:", error);
        return { success: false, message: null, error: error.message || "Failed to resolve topic" };
    }

    revalidatePath("/admin");
    revalidatePath(`/topic/${topicId}`);
    revalidatePath("/");
    return { success: true, message: "Topic resolved successfully", error: null };
}

export async function getProposalsForTopic(topicId: string) {
    const supabase = await createClient();

    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return [];
    }

    const role = user.app_metadata?.role;
    if (role !== "admin") {
        return [];
    }

    try {
        const { getProposalsByTopicId } = await import("@/lib/services/proposals");
        return await getProposalsByTopicId(topicId);
    } catch (error) {
        console.error("Error fetching proposals:", error);
        return [];
    }
}

export async function archiveTopic(topicId: string): Promise<ActionState> {
    const supabase = await createClient();

    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, message: null, error: "Unauthorized" };
    }

    const role = user.app_metadata?.role;
    if (role !== "admin") {
        return { success: false, message: null, error: "Admin access required" };
    }

    try {
        const { updateTopicStatus } = await import("@/lib/services/topics");
        await updateTopicStatus(topicId, "archived");
    } catch (error: any) {
        console.error("Error archiving topic:", error);
        return { success: false, message: null, error: error.message || "Failed to archive topic" };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Topic archived successfully", error: null };
}
