'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message, success: false, message: null }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
        },
    })

    if (error) {
        return { error: error.message, success: false, message: null }
    }

    return { success: true, message: 'Check your email to confirm your account.', error: null }
}

export async function signInWithTwitch() {
    const supabase = await createClient()
    const headersList = await import('next/headers').then(mod => mod.headers())
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SUPABASE_URL // Fallback if needed, but origin should exist

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        redirect('/login?error=Could not authenticate with Twitch')
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
