"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { User } from "../types";
import { supabase } from "@/lib/supabase";

export default function CreatePostPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [activity, setActivity] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push("/");
        }
    }, [router]);

    const handleSubmit = async () => {
        if (!activity || !time || !user) return;

        setLoading(true);
        setError("");

        try {
            const { error: insertError } = await supabase
                .from('posts')
                .insert([
                    {
                        user_id: user.id,
                        nickname: user.nickname,
                        icon: user.icon,
                        activity: activity,
                        time: time,
                        location: location || null
                    }
                ]);

            if (insertError) throw insertError;

            // Success! Navigate back to feed
            router.push("/feed");
        } catch (err: any) {
            setError(err.message || "Failed to create post");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50">
            <div className="w-full max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Create Activity</h1>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-4xl">{user?.icon || "👤"}</span>
                        </div>
                        <p className="text-sm text-gray-600">{user?.nickname}</p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
                            What are you doing? *
                        </label>
                        <textarea
                            id="activity"
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            placeholder="e.g., Going to the Central Library at 2 PM"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors resize-none"
                            rows={3}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                            When? *
                        </label>
                        <input
                            id="time"
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            placeholder="e.g., Today 3:00 PM or Tomorrow 1:00 PM"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Where? (Optional)
                        </label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Central Library, Human Around"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors"
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!activity || !time || loading}
                        className="w-full bg-knu-crimson hover:bg-knu-crimson-dark text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {loading ? "Posting..." : "Post Activity"}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                        Your post will be visible to other KNU students anonymously
                    </p>
                </div>
            </div>
        </main>
    );
}
