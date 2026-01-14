import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper types for database tables
export type Profile = {
    id: string
    student_id: string
    nickname: string
    gender: 'male' | 'female' | 'other'
    icon: string
    created_at: string
}

export type Post = {
    id: number
    user_id: string
    nickname: string
    icon: string
    activity: string
    time: string
    location?: string
    created_at: string
}

export type Message = {
    id: number
    post_id: number
    user_id: string
    nickname: string
    icon: string
    message: string
    created_at: string
}
