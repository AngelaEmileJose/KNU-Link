"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import type { User, Post } from "../types";
import { supabase } from "@/lib/supabase";

export default function ChatsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [joinedPosts, setJoinedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push("/");
            return;
        }

        const fetchJoinedActivities = async () => {
            const parsedUser = JSON.parse(userData);

            // Get all participations for this user
            const { data: participations, error: partError } = await supabase
                .from('participations')
                .select('post_id')
                .eq('user_id', parsedUser.id);

            if (partError) {
                console.error('Error fetching participations:', partError);
                setLoading(false);
                return;
            }

            if (!participations || participations.length === 0) {
                setLoading(false);
                return;
            }

            // Get the posts user has joined
            const postIds = participations.map(p => p.post_id);
            const { data: posts, error: postsError } = await supabase
                .from('posts')
                .select('*')
                .in('id', postIds)
                .order('created_at', { ascending: false });

            if (postsError) {
                console.error('Error fetching posts:', postsError);
            } else if (posts) {
                setJoinedPosts(posts as Post[]);
            }

            setLoading(false);
        };

        fetchJoinedActivities();
    }, [router]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-pink-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-knu-crimson border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your chats...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-pink-50">
            {/* Header */}
            <div className="bg-white shadow-md p-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => router.push("/feed")}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">My Chats</h1>
                </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    {joinedPosts.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Chats Yet</h2>
                            <p className="text-gray-600 mb-6">
                                Join activities from the feed to start chatting!
                            </p>
                            <button
                                onClick={() => router.push("/feed")}
                                className="bg-knu-crimson hover:bg-knu-crimson-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                            >
                                Browse Activities
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {joinedPosts.map((post) => (
                                <div
                                    key={post.id}
                                    onClick={() => router.push(`/chat/${post.id}`)}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 flex items-center gap-4"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-pink-50 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                                        {post.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                            {post.activity}
                                        </h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <span>{post.nickname}</span>
                                            <span>•</span>
                                            <span>{post.time}</span>
                                            {post.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>📍 {post.location}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <MessageCircle className="w-6 h-6 text-knu-crimson flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
