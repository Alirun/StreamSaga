import { getTopicsByStatus } from "@/lib/services/topics";
import { ProposeForm } from "./propose-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Submit Proposal | StreamSaga",
    description: "Submit a new proposal for the community to vote on.",
};

// In Next.js 15+, searchParams is a Promise
type SearchParams = Promise<{ topic?: string }>;

export default async function ProposePage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const [topics, search] = await Promise.all([
        getTopicsByStatus("open"),
        searchParams,
    ]);

    return <ProposeForm topics={topics} initialTopicId={search.topic} />;
}

