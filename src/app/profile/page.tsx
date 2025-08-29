// src/app/profile/page.tsx
"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { socketService } from "@/services/socketServices";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    nickname: "",
    username: "",
    age: "",
    passion: "",
    job: "",
    hobbies: "",
    bio: "",
    profileImage: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profileImage: reader.result as string }));
    };
    reader.readAsDataURL(e.target.files[0]);
  };

 const handleSave = async () => {
  if (!profile.nickname || !profile.username) {
    return alert("Nickname and Username are required");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({
        nickname: profile.nickname,
        username: profile.username,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      return alert(error.message || "Failed to update profile");
    }

    router.push("/search"); 
  } catch (err) {
    console.error("Update failed:", err);
    alert("Something went wrong");
  }
};


  const handleLogout = () => {
    socketService.disconnect();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // clear cookie
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-6">
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-10 grid grid-cols-2 gap-12">
        {/* Left: Profile Image */}
        <div className="flex flex-col items-center">
          <label htmlFor="fileInput" className="cursor-pointer relative">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
              <Image
                src={profile.profileImage || "/profileicon.png"}
                alt="Profile"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 hover:bg-purple-700 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        {/* Right: Profile Form */}
        <div className="flex flex-col justify-center space-y-5">
          <h1 className="text-3xl font-bold text-purple-700">Edit Your Profile</h1>

          <div className="grid grid-cols-2 gap-6">
            <InputField label="Nickname" value={profile.nickname} onChange={(v: string) => setProfile((p) => ({ ...p, nickname: v }))} />
            <InputField label="Username" value={profile.username} onChange={(v: string) => setProfile((p) => ({ ...p, username: v }))} />
            <InputField label="Age" value={profile.age} onChange={(v: string) => setProfile((p) => ({ ...p, age: v }))} />
            <InputField label="Passion" value={profile.passion} onChange={(v: string) => setProfile((p) => ({ ...p, passion: v }))} />
            <InputField label="Job" value={profile.job} onChange={(v: string) => setProfile((p) => ({ ...p, job: v }))} />
            <InputField label="Hobbies" value={profile.hobbies} onChange={(v: string) => setProfile((p) => ({ ...p, hobbies: v }))} />
            <InputField label="Bio" value={profile.bio} onChange={(v: string) => setProfile((p) => ({ ...p, bio: v }))} multiline />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Save & Continue
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, multiline = false }: Record<string, any>) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 text-gray-900 rounded-xl p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 text-gray-900 rounded-xl p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
      )}
    </div>
  );
}
