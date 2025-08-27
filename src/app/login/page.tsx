"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/api"; // API call handles cookie setting

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(username, password); 
      // ✅ backend sets httpOnly cookie if success
      if (response.success) {
        router.replace("/search"); // redirect after login
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    router.push("/google-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative rounded-2xl border border-purple-100 bg-white/80 backdrop-blur-xl shadow-xl px-6 py-8 sm:px-8">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Log in to Yapp 👋
            </h1>
           
          </div>

          {/* Form */}
          <div className="mt-8 space-y-5">
            {/* Username */}
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 disabled:bg-gray-400 transition flex items-center justify-center"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-red-500 text-white font-medium shadow-md hover:bg-red-600 transition"
            >
              <span>🔴</span> Login with Google
            </button>
          </div>

          {/* Footer hint */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-purple-700 hover:text-purple-800 underline underline-offset-4"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}