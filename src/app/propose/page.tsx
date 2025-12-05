import { getTopicsByStatus } from "@/lib/services/topics";
import { ProposeForm } from "./propose-form";

export default async function ProposePage() {
    const topics = await getTopicsByStatus("open");

    return <ProposeForm topics={topics} />;
}
