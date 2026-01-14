"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const emojis = [
  "🐼", "🦊", "🤖", "🐨", "🦁", "🐯", "🐻", "🐰",
  "🦄", "🐸", "🐙", "🦋", "🐝", "🐢", "🦉", "🦅",
  "🐱", "🐶", "🐹", "🐭", "🐷", "🐵", "🐧", "🦁"
];

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"studentId" | "register" | "selectEmoji">("studentId");
  const [studentId, setStudentId] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcomeBack, setWelcomeBack] = useState(false);

  // Auto-login if session exists
  useEffect(() => {
    const sessionData = localStorage.getItem("user");
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData);
        // Verify user still exists in Supabase
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              // Valid session, redirect to feed
              router.push("/feed");
            } else {
              // Invalid session, clear localStorage
              localStorage.removeItem("user");
            }
          });
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
  }, [router]);

  const handleStudentIdSubmit = async () => {
    if (!studentId.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (existingUser && !fetchError) {
        // Returning user - load profile and redirect
        localStorage.setItem("user", JSON.stringify({
          id: existingUser.id,
          studentId: existingUser.student_id,
          nickname: existingUser.nickname,
          gender: existingUser.gender,
          icon: existingUser.icon,
          joinedActivities: []
        }));

        setWelcomeBack(true);
        setTimeout(() => {
          router.push("/feed");
        }, 1500);
      } else {
        // New user - go to registration
        setStep("register");
      }
    } catch (err: any) {
      setError(err.message || "Error checking Student ID");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }
    setError("");
    setStep("selectEmoji");
  };

  const handleSelectEmoji = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setLoading(true);
    setError("");

    try {
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

      router.push("/feed");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setLoading(false);
    }
  };

  // Welcome back screen for returning users
  if (welcomeBack) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="text-6xl mb-4">👋</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Redirecting to your feed...</p>
            <div className="mt-6 w-12 h-12 border-4 border-knu-crimson border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  // Step 3: Emoji Selection
  if (step === "selectEmoji") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50">
        <div className="w-full max-w-md">
          <button
            onClick={() => setStep("register")}
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

  // Step 2: Registration Form (New Users Only)
  if (step === "register") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50">
        <div className="w-full max-w-md">
          <button
            onClick={() => setStep("studentId")}
            className="mb-6 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Profile</h1>
            <p className="text-gray-600 mb-8">Tell us a bit about yourself</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
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
                  autoFocus
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
                onClick={handleRegisterSubmit}
                disabled={!nickname.trim()}
                className="w-full bg-knu-crimson hover:bg-knu-crimson-dark text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-8">
              Student ID: {studentId}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Step 1: Student ID Entry (Default)
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">KNU Link</h1>
          <p className="text-gray-600 mb-8">Connect anonymously with KNU students</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

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
                onKeyPress={(e) => e.key === "Enter" && handleStudentIdSubmit()}
                placeholder="202400000"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-knu-crimson focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <button
              onClick={handleStudentIdSubmit}
              disabled={!studentId.trim() || loading}
              className="w-full bg-knu-crimson hover:bg-knu-crimson-dark text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Checking...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-8">
            Enter your Student ID to login or create a new account
          </p>
        </div>
      </div>
    </main>
  );
}
