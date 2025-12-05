import { Proposal } from './types';

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
