"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const goToRegister = () => {
    console.log("going to register")
    router.push("/register");
  };

  const goToLogin = () => {
       console.log("going to login")
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full px-8 text-center">
        {/* Chat Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-purple-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3h6M21 12c0 1.386-.568 2.64-1.486 3.536a6.3 6.3 0 01-2.877 1.634l-2.257.563a.75.75 0 00-.548.547l-.563 2.257a6.301 6.301 0 01-1.634 2.877A6.5 6.5 0 0112 21c-1.386 0-2.64-.568-3.536-1.486a6.3 6.3 0 01-1.634-2.877l-.563-2.257a.75.75 0 00-.547-.548l-2.257-.563a6.301 6.301 0 01-2.877-1.634A6.5 6.5 0 013 12c0-1.386.568-2.64 1.486-3.536a6.3 6.3 0 012.877-1.634l2.257-.563a.75.75 0 00.548-.547l.563-2.257a6.301 6.301 0 011.634-2.877A6.5 6.5 0 0112 3c1.386 0 2.64.568 3.536 1.486a6.3 6.3 0 011.634 2.877l.563 2.257a.75.75 0 00.547.548l2.257.563a6.301 6.301 0 012.877 1.634A6.5 6.5 0 0121 12z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          Welcome to Yapper
        </h1>
        <p className="text-gray-600 mb-8">
          Meet new people & start meaningful conversations.
        </p>

        {/* Register Button */}
        <button
          onClick={goToRegister}
          className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition"
        >
          Register
        </button>

        <div className="mt-5" />

        {/* Login Button */}
        <button
          onClick={goToLogin}
          className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
