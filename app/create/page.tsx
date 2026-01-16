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
    const [category, setCategory] = useState("social");
    const [time, setTime] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
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
                        category: category,
                        time: time,
                        location: location || null,
                        expiration_date: expirationDate ? new Date(expirationDate).toISOString() : null
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
        <main className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-white via-red-50/30 to-amber-50/40">
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
                        <div className="w-20 h-20 bg-gradient-to-br from-red-50/40 to-amber-50/60 rounded-full flex items-center justify-center mx-auto mb-3 p-3">
                            {user?.icon ? (
                                <img src={user.icon} alt="Your mascot" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-4xl">👤</span>
                            )}
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
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors appearance-none bg-white"
                            disabled={loading}
                        >
                            <option value="social">💬 Social & Chat</option>
                            <option value="study">📚 Study & Work</option>
                            <option value="sports">🏃 Sports & Exercise</option>
                            <option value="food">🍽️ Food & Dining</option>
                            <option value="other">✨ Other Activity</option>
                        </select>
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
                        <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-2">
                            Expires At (Auto-delete)
                        </label>
                        <input
                            id="expiration"
                            type="datetime-local"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to keep indefinitely</p>
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
