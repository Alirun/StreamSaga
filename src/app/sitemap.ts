import type { MetadataRoute } from 'next';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Use direct Supabase client (not cookie-based) for static sitemap generation
const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://streamsaga.space';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/propose`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/forgot-password`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/reset-password`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // Dynamic pages: Topics (excluding archived)
    let topicPages: MetadataRoute.Sitemap = [];
    try {
        const { data: topics } = await supabase
            .from('topics')
            .select('id, updated_at')
            .neq('status', 'archived')
            .order('created_at', { ascending: false });

        if (topics) {
            topicPages = topics.map((topic) => ({
                url: `${baseUrl}/topic/${topic.id}`,
                lastModified: new Date(topic.updated_at),
                changeFrequency: 'daily' as const,
                priority: 0.9,
            }));
        }
    } catch (error) {
        console.error('Error fetching topics for sitemap:', error);
    }

    return [...staticPages, ...topicPages];
}
