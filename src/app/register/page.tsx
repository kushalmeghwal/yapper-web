"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!nickname || !username || !password) {
      alert("All fields are required.");
      return;
    }

    setIsLoading(true);
    const response = await signUp(nickname, username, password);
    setIsLoading(false);

    if (response.success) {
      router.replace("/login");
    } else {
      alert(response.message);
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Registering user:", nickname, username);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative rounded-2xl border border-purple-100 bg-white/80 backdrop-blur-xl shadow-xl px-6 py-8 sm:px-8">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/logo.png"
              alt="App Logo"
              width={84}
              height={84}
              className="rounded-xl shadow-md"
            />
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900">
              Create your account
            </h1>
           
          </div>

          {/* Form */}
          <div className="mt-8 space-y-5">
            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Kushal"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname123"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use at least 8 characters with a mix of letters & numbers.
              </p>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 disabled:bg-gray-400 transition flex items-center justify-center"
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "Register"
              )}
            </button>
          </div>

          {/* Footer hint */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-purple-700 hover:text-purple-800 underline underline-offset-4"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

