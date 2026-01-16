"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Check, Plus, MessageCircle, MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Post, User } from "../types";
import { supabase } from "@/lib/supabase";
import { ProfileMenu } from "@/components/ProfileMenu";

export function SwipeFeed() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push("/");
            return;
        }

        // Fetch posts from Supabase
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                console.error('Error fetching posts:', error);
            } else if (data) {
                setPosts(data as Post[]);
            }
            setLoading(false);
        };

        fetchPosts();

        // Set up real-time subscription for new posts
        const channel = supabase
            .channel('posts-channel')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'posts' },
                (payload) => {
                    setPosts((current) => [payload.new as Post, ...current]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);

    const currentPost = posts[currentPostIndex];

    // Fixed swipe handlers using unified pointer events
    const handlePointerDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
        startX.current = e.clientX;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const offset = currentX - startX.current;
        setDragOffset(offset);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        e.currentTarget.releasePointerCapture(e.pointerId);
        setIsDragging(false);

        if (Math.abs(dragOffset) > 100) {
            if (dragOffset > 0) {
                setSwipeDirection("right");
            } else {
                setSwipeDirection("left");
            }
        }
        setDragOffset(0);
    };

    const resetCard = () => {
        if (swipeDirection === "left") {
            // Move to next post
            if (currentPostIndex < posts.length - 1) {
                setCurrentPostIndex(currentPostIndex + 1);
            }
        }
        setSwipeDirection(null);
        setDragOffset(0);
    };

    const enterChatroom = async (postId: number) => {
        if (!user?.id) return;

        // Track participation
        try {
            await supabase
                .from('participations')
                .insert([{ user_id: user.id, post_id: postId }])
                .select();
        } catch (err) {
            console.error('Error tracking participation:', err);
        }

        router.push(`/chat/${postId}`);
    };

    // Loading state
    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-knu-crimson border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading activities...</p>
                </div>
            </section>
        );
    }

    // Left swipe - Skip
    if (swipeDirection === "left") {
        return (
            <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl min-h-[600px] flex flex-col justify-center relative">
                        <button
                            onClick={resetCard}
                            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="text-center space-y-8">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                <X className="w-12 h-12 text-gray-500" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-gray-800">Skipped</h2>
                                <p className="text-lg text-gray-600">
                                    {currentPostIndex < posts.length - 1
                                        ? "Moving to the next activity..."
                                        : "No more activities for now!"}
                                </p>
                            </div>
                            <button
                                onClick={resetCard}
                                className="bg-knu-crimson hover:bg-knu-crimson-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg"
                            >
                                {currentPostIndex < posts.length - 1 ? "Next Activity" : "Start Over"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Right swipe - Join chatroom
    if (swipeDirection === "right") {
        return (
            <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl min-h-[600px] flex flex-col justify-center relative">
                        <div className="text-center space-y-8">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Check className="w-12 h-12 text-green-500" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-gray-800">Great Choice! 🎉</h2>
                                <p className="text-lg text-gray-600">
                                    Entering the chatroom for this activity...
                                </p>
                            </div>
                            <button
                                onClick={() => enterChatroom(currentPost.id)}
                                className="bg-knu-crimson hover:bg-knu-crimson-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg w-full"
                            >
                                Join Chatroom
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // No more posts
    if (!currentPost || currentPostIndex >= posts.length) {
        return (
            <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl min-h-[600px] flex flex-col justify-center">
                        <div className="text-center space-y-8">
                            <span className="text-8xl">✨</span>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-gray-800">All caught up!</h2>
                                <p className="text-lg text-gray-600">
                                    No more activities right now. Create a new post or check back later!
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push("/create")}
                                    className="w-full bg-knu-crimson hover:bg-knu-crimson-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg"
                                >
                                    Create Activity
                                </button>
                                {posts.length > 0 && (
                                    <button
                                        onClick={() => setCurrentPostIndex(0)}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
                                    >
                                        Start Over
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Main swipe interface
    return (
        <section className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
            {/* Header */}
            <div className="w-full max-w-md mx-auto mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">KNU Link</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/chats")}
                        className="w-12 h-12 bg-white border-2 border-knu-crimson text-knu-crimson rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:bg-knu-crimson hover:text-white"
                        title="My Chats"
                    >
                        <MessagesSquare className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => router.push("/create")}
                        className="w-12 h-12 bg-knu-crimson hover:bg-knu-crimson-dark text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                    {user && <ProfileMenu user={user} />}
                </div>
            </div>

            {/* Swipe Card */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-4 shadow-2xl min-h-[650px] flex flex-col">
                        <div className="text-center my-4 w-full">
                            <p className="text-sm text-gray-600 font-medium">
                                ← Swipe left to skip • Swipe right to join →
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {currentPostIndex + 1} of {posts.length}
                            </p>
                        </div>

                        <div className="flex-1 flex items-center justify-center w-full">
                            <div
                                ref={cardRef}
                                key={currentPost.id}
                                className={`relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-grab ${isDragging ? "cursor-grabbing" : ""
                                    } transition-transform duration-200 w-full h-full max-h-[550px]`}
                                style={{
                                    transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
                                    touchAction: "none",
                                }}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                            >
                                {/* Emoji Display */}
                                <div className="relative h-[60%] flex items-center justify-center bg-gradient-to-br from-red-50/40 to-amber-50/60">
                                    {currentPost.icon?.startsWith('/mascot-') ? (
                                        <img 
                                            src={currentPost.icon} 
                                            alt="User mascot"
                                            className="w-36 h-36 object-contain select-none"
                                        />
                                    ) : (
                                        <span className="text-9xl select-none">{currentPost.icon}</span>
                                    )}

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900">{currentPost.nickname}</h2>
                                        </div>
                                        <p className="text-sm text-gray-700 font-medium">{currentPost.time}</p>
                                        {currentPost.location && (
                                            <p className="text-xs text-gray-600">📍 {currentPost.location}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Activity Info */}
                                <div className="p-6 flex-1 flex flex-col justify-center bg-white">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        {currentPost.activity}
                                    </h3>

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => {
                                                setSwipeDirection("left");
                                            }}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-200"
                                        >
                                            Skip
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSwipeDirection("right");
                                            }}
                                            className="flex-1 bg-knu-crimson hover:bg-knu-crimson-dark text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function FeedPage() {
    return <SwipeFeed />;
}
