"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function GoogleLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      if (!user) return;

      // ✅ Get Firebase ID token
      const idToken = await user.getIdToken(true);

      // ✅ Example nickname/username
      const nickname = user.displayName || "Yapper";
      const username = user.email?.split("@")[0] || `user_${user.uid}`;

      // ✅ Call backend (this will set HttpOnly cookie)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/firebase/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        credentials: "include", // 👈 important: allow backend to set cookies
        body: JSON.stringify({ nickname, username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save user");

      console.log("✅ User synced with backend via HttpOnly cookie:", data);

      // ✅ No localStorage — JWT is now inside HttpOnly cookie
      router.replace("/search");
    } catch (err: any) {
      alert(`Google Sign-In Failed: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-80 text-center">
        <h1 className="text-xl font-semibold mb-6 text-gray-700">Google Login</h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            <span className="material-icons">login</span>
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );
}
