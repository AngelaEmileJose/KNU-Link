"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const emojis = [
  "🐼", "🦊", "🤖", "🐨", "🦁", "🐯", "🐻", "🐰",
  "🦄", "🐸", "🐙", "🦋", "🐝", "🐢", "🦉", "🦅"
];

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [step, setStep] = useState<"login" | "onboarding">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (studentId && nickname) {
      setStep("onboarding");
    }
  };

  const handleSelectEmoji = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setLoading(true);
    setError("");

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (existingUser) {
        // User exists, just store in localStorage and navigate
        localStorage.setItem("user", JSON.stringify({
          id: existingUser.id,
          studentId: existingUser.student_id,
          nickname: existingUser.nickname,
          gender: existingUser.gender,
          icon: existingUser.icon,
          joinedActivities: []
        }));
      } else {
        // Create new user in Supabase
        const { data: newUser, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              student_id: studentId,
              nickname: nickname,
              gender: gender,
              icon: emoji
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify({
          id: newUser.id,
          studentId: newUser.student_id,
          nickname: newUser.nickname,
          gender: newUser.gender,
          icon: newUser.icon,
          joinedActivities: []
        }));
      }

      router.push("/feed");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setLoading(false);
    }
  };

  if (step === "onboarding") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50">
        <div className="w-full max-w-md">
          <button
            onClick={() => setStep("login")}
            className="mb-6 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={loading}
          >
            ← Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Icon</h1>
            <p className="text-gray-600 mb-8">Pick an emoji that represents you</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-4 gap-4 mb-8">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSelectEmoji(emoji)}
                  disabled={loading}
                  className={`text-5xl p-4 rounded-2xl transition-all duration-200 hover:scale-110 ${selectedEmoji === emoji
                    ? "bg-knu-crimson scale-110"
                    : "bg-gray-50 hover:bg-gray-100"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {loading && (
              <p className="text-sm text-gray-600 text-center animate-pulse">
                Setting up your profile...
              </p>
            )}

            {!loading && (
              <p className="text-sm text-gray-500 text-center">
                Your emoji keeps you anonymous
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">KNU Link</h1>
          <p className="text-gray-600 mb-8">Connect anonymously with KNU students</p>

          <div className="space-y-6">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="202400000"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                Nickname
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Choose a fun nickname"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              onClick={handleLogin}
              disabled={!studentId || !nickname}
              className="w-full bg-knu-crimson hover:bg-knu-crimson-dark text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-8">
            Your Student ID is only for verification - it won't be shown to others
          </p>
        </div>
      </div>
    </main>
  );
}
