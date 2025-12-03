import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicList } from "./topic-list";
import { NewTopicDialog } from "./new-topic-dialog";
import { getTopics } from "@/lib/services/topics";
import { Topic } from "@/lib/types";

export default async function AdminPage() {
    const topics = await getTopics();

    return (
        <main className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    </div>
                    <NewTopicDialog />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Topics Management</CardTitle>
                        <CardDescription>
                            Manage active and archived topics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TopicList initialTopics={(topics as unknown as Topic[]) || []} />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
