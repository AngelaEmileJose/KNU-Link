import { supabase } from './supabase';

/**
 * Cleanup utility to delete expired posts.
 * This should ideally be run as a scheduled Edge Function or cron job.
 * For this client-side implementation, we can call it periodically
 * or when a user visits the feed/create page to clean up their own expired posts.
 */
export async function cleanupExpiredPosts() {
    try {
        const now = new Date().toISOString();

        // Delete posts where expiration_date < now
        // Note: Supabase RLS will likely only allow users to delete their own posts
        // unless a Service Role key is used or specific policies are set.
        const { count, error } = await supabase
            .from('posts')
            .delete({ count: 'exact' })
            .lt('expiration_date', now);

        if (error) {
            console.error('Error cleaning up expired posts:', error);
            return 0;
        }

        if (count && count > 0) {
            console.log(`Cleaned up ${count} expired posts.`);
        }

        return count || 0;
    } catch (err) {
        console.error('Failed to run cleanup:', err);
        return 0;
    }
}
