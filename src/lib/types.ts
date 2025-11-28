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
    _count?: {
        proposals: number;
    };
};

export type Proposal = {
    id: string;
    title: string;
    topicId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    archivedAt?: string;
    _count?: {
        votes: number;
    };
};

export type Vote = {
    id: string;
    proposalId: string;
    userId: string;
};
