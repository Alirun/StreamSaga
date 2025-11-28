import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Plus, Archive, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_TOPICS } from "@/lib/data";

export default function AdminPage() {
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
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Topic
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Topics Management</CardTitle>
                        <CardDescription>
                            Manage active and archived topics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="h-12 px-4 font-medium">Title</th>
                                        <th className="h-12 px-4 font-medium">Status</th>
                                        <th className="h-12 px-4 font-medium">Proposals</th>
                                        <th className="h-12 px-4 font-medium">Created</th>
                                        <th className="h-12 px-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_TOPICS.map((topic) => (
                                        <tr key={topic.id} className="border-t hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium">{topic.title}</td>
                                            <td className="p-4">
                                                <Badge
                                                    variant={topic.status === 'open' ? 'success' : topic.status === 'closed' ? 'secondary' : 'outline'}
                                                    className="capitalize"
                                                >
                                                    {topic.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">{topic._count?.proposals || 0}</td>
                                            <td className="p-4">{new Date(topic.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" title="Toggle Status">
                                                        {topic.status === 'open' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" title="Archive">
                                                        <Archive className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
