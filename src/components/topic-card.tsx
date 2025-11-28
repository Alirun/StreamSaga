import Link from "next/link";
import { MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Topic } from "@/lib/types";

interface TopicCardProps {
    topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
    return (
        <Link href={`/topic/${topic.id}`} className="block group">
            <Card className="h-full border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {topic.title}
                        </CardTitle>
                        <Badge
                            variant={topic.status === 'open' ? 'success' : topic.status === 'closed' ? 'secondary' : 'outline'}
                            className="capitalize"
                        >
                            {topic.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{topic._count?.proposals || 0} Proposals</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <div className="text-xs text-muted-foreground">
                        Created by <span className="text-foreground font-medium">@{topic.userId}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
