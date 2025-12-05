"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createProposal as createProposalService,
    searchSimilarProposals
} from "@/lib/services/proposals";

export type ActionState = {
    success: boolean;
    message: string | null;
    error: string | null;
};

export async function createProposal(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, message: null, error: "You must be logged in to create a proposal" };
    }

    // Get form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const topicId = formData.get("topicId") as string;

    if (!title || title.trim().length === 0) {
        return { success: false, message: null, error: "Title is required" };
    }

    if (!topicId) {
        return { success: false, message: null, error: "Topic is required" };
    }

    try {
        await createProposalService({
            title: title.trim(),
            description: description?.trim() || undefined,
            topicId,
            userId: user.id,
        });
    } catch (error: any) {
        console.error("Error creating proposal:", error);
        return { success: false, message: null, error: error.message || "Failed to create proposal" };
    }

    revalidatePath(`/topic/${topicId}`);
    revalidatePath("/");
    redirect(`/topic/${topicId}`);
}

export async function findSimilarProposals(title: string, topicId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    try {
        const results = await searchSimilarProposals(title, topicId, 0.3);
        return results;
    } catch (e) {
        console.error("Error in findSimilarProposals:", e);
        return [];
    }
}
