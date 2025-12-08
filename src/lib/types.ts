export type User = {
    id: string;
    email: string;
    role: 'admin' | null;
    createdAt: string;
};

export type TopicStatus = 'open' | 'closed' | 'archived';

export type Topic = {
    id: string;
    title: string;
    status: TopicStatus;
    userId: string;
    createdAt: string;
    updatedAt: string;
    archivedAt?: string;
    // Supabase fields
    created_at?: string;
    updated_at?: string;
    archived_at?: string;
    embedding?: number[];
    _count?: {
        proposals: number;
    };
};

export type Proposal = {
    id: string;
    title: string;
    description?: string;
    topicId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    archivedAt?: string;
    approvedAt?: string;
    _count?: {
        votes: number;
    };
};

export type Vote = {
    id: string;
    proposalId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    archivedAt?: string;
};
