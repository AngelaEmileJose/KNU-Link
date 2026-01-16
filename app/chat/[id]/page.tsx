"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import type { User, ChatMessage, Post } from "../../types";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const postId = parseInt(params.id as string);
    const [user, setUser] = useState<User | null>(null);
    const [post, setPost] = useState<Post | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push("/");
            return;
        }

        // Fetch post details
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) {
                console.error('Error fetching post:', error);
            } else {
                setPost(data as Post);
            }
        };

        // Fetch messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
            } else if (data) {
                setMessages(data.map(msg => ({
                    id: msg.id,
                    postId: msg.post_id,
                    userId: msg.user_id,
                    nickname: msg.nickname,
                    icon: msg.icon,
                    message: msg.message,
                    timestamp: new Date(msg.created_at),
                    created_at: msg.created_at
                })));
            }
            setLoading(false);
        };

        fetchPost();
        fetchMessages();

        // Track participation when entering chatroom
        const trackParticipation = async () => {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.id) {
                try {
                    await supabase
                        .from('participations')
                        .insert([{ user_id: parsedUser.id, post_id: postId }])
                        .select();
                } catch (err) {
                    // Ignore duplicate errors (user already joined)
                    console.log('Participation already tracked or error:', err);
                }
            }
        };

        trackParticipation();

        // Set up real-time subscription for new messages
        const channel = supabase
            .channel(`messages-${postId}`)
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `post_id=eq.${postId}` },
                (payload) => {
                    const newMsg = payload.new;
                    setMessages((current) => [...current, {
                        id: newMsg.id,
                        postId: newMsg.post_id,
                        userId: newMsg.user_id,
                        nickname: newMsg.nickname,
                        icon: newMsg.icon,
                        message: newMsg.message,
                        timestamp: new Date(newMsg.created_at),
                        created_at: newMsg.created_at
                    }]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [postId, router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;

        const messageText = newMessage;
        setNewMessage(""); // Clear input immediately for better UX

        try {
            const { error } = await supabase
                .from('messages')
                .insert([
                    {
                        post_id: postId,
                        user_id: user.id,
                        nickname: user.nickname,
                        icon: user.icon,
                        message: messageText
                    }
                ]);

            if (error) throw error;
        } catch (err) {
            console.error('Error sending message:', err);
            setNewMessage(messageText); // Restore message on error
        }
    };

    if (loading) {
        return (
            <main className="h-screen flex items-center justify-center bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-knu-crimson border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading chat...</p>
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Activity Not Found</h1>
                    <button
                        onClick={() => router.push("/feed")}
                        className="bg-knu-crimson hover:bg-knu-crimson-dark text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                        Back to Feed
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen flex flex-col bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
            {/* Header */}
            <div className="bg-white shadow-md p-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => router.push("/feed")}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-50/40 to-amber-50/60 rounded-full flex items-center justify-center p-2">
                            {post.icon?.startsWith('/mascot-') ? (
                                <img src={post.icon} alt="Mascot" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-2xl">{post.icon}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="font-semibold text-gray-900">{post.activity}</h2>
                            <p className="text-sm text-gray-600">{post.time} • {post.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No messages yet. Be the first to say hi! 👋</p>
                        </div>
                    )}

                    {messages.map((msg) => {
                        const isOwnMessage = msg.userId === user?.id;

                        return (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                            >
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md p-1.5 flex-shrink-0">
                                    {msg.icon?.startsWith('/mascot-') ? (
                                        <img src={msg.icon} alt="Mascot" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-xl">{msg.icon}</span>
                                    )}
                                </div>
                                <div className={`flex flex-col ${isOwnMessage ? "items-end" : ""} max-w-[70%]`}>
                                    <p className="text-xs text-gray-600 mb-1 px-2">{msg.nickname}</p>
                                    <div
                                        className={`px-4 py-3 rounded-2xl shadow-sm ${isOwnMessage
                                            ? "bg-knu-crimson text-white rounded-br-none"
                                            : "bg-white text-gray-900 rounded-bl-none"
                                            }`}
                                    >
                                        <p>{msg.message}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 px-2">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 bg-knu-crimson hover:bg-knu-crimson-dark text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </main>
    );
}
