import { Topic, Proposal } from './types';

export const MOCK_TOPICS: Topic[] = [
    {
        id: '1',
        title: 'Season 4: AI Agents',
        status: 'open',
        userId: 'user_1',
        createdAt: '2023-10-26T10:00:00Z',
        updatedAt: '2023-10-26T10:00:00Z',
        _count: { proposals: 12 },
    },
    {
        id: '2',
        title: 'Season 3: Mobile Apps',
        status: 'closed',
        userId: 'user_1',
        createdAt: '2023-09-15T10:00:00Z',
        updatedAt: '2023-10-15T10:00:00Z',
        _count: { proposals: 45 },
    },
    {
        id: '3',
        title: 'Special Episode: Rust CLI Tools',
        status: 'open',
        userId: 'user_1',
        createdAt: '2023-11-01T10:00:00Z',
        updatedAt: '2023-11-01T10:00:00Z',
        _count: { proposals: 8 },
    },
];

export const MOCK_PROPOSALS: Proposal[] = [
    {
        id: 'p1',
        title: 'Build a personal assistant that manages calendar',
        topicId: '1',
        userId: 'user_2',
        createdAt: '2023-10-27T12:00:00Z',
        updatedAt: '2023-10-27T12:00:00Z',
        _count: { votes: 156 },
    },
    {
        id: 'p2',
        title: 'AI-powered code reviewer bot',
        topicId: '1',
        userId: 'user_3',
        createdAt: '2023-10-28T09:30:00Z',
        updatedAt: '2023-10-28T09:30:00Z',
        _count: { votes: 89 },
    },
    {
        id: 'p3',
        title: 'Autonomous trading agent',
        topicId: '1',
        userId: 'user_4',
        createdAt: '2023-10-29T14:15:00Z',
        updatedAt: '2023-10-29T14:15:00Z',
        _count: { votes: 42 },
    },
];
