"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { socketService } from "@/services/socketServices";

const moods = ["Happy", "Sad", "Excited", "Lazy", "Thirsty", "Angry", "Nervous"];

type UserProfile = {
  userId: string;
  profileImage?: string;
};

export default function SearchPage() {
  const router = useRouter();

  const [selectedChoice, setSelectedChoice] = useState<"Rizzler" | "shawty">();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [socketReady, setSocketReady] = useState(false);

  // --- mood styles ---
  const moodBase: Record<string, string> = {
    Happy: "bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    Sad: "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100",
    Excited: "bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100",
    Lazy: "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100",
    Thirsty: "bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100",
    Angry: "bg-red-50 text-red-800 border-red-200 hover:bg-red-100",
    Nervous: "bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100",
  };

  const moodSelected: Record<string, string> = {
    Happy: "bg-yellow-500 text-white border-yellow-500",
    Sad: "bg-sky-500 text-white border-sky-500",
    Excited: "bg-pink-500 text-white border-pink-500",
    Lazy: "bg-amber-500 text-white border-amber-500",
    Thirsty: "bg-cyan-500 text-white border-cyan-500",
    Angry: "bg-red-500 text-white border-red-500",
    Nervous: "bg-violet-500 text-white border-violet-500",
  };

  // ✅ Connect socket once and keep user online
   useEffect(() => {
    let mounted = true;
    const fetchUserAndConnect = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        if (!mounted) return;
        setUser({ userId: data.userId });

        // connect socket and mark ready when connected
        socketService.connect(data.userId, {
          onMatchFound: ({ chatRoomId, receiverId, receiverNickname }) => {
            setIsSearching(false);
            if (chatRoomId) {
              router.push(
                `/chat/${chatRoomId}?receiverId=${receiverId}&receiverNickname=${receiverNickname}`
              );
            }
          },
          onSearchTimeout: () => {
            setIsSearching(false);
            alert("No match found within 1 minute. You're back online.");
          },
        });

        // wait until socket is connected
        const waitForConnect = () => {
          if ((socketService as any).socket?.connected) {
            setSocketReady(true);
          } else {
            setTimeout(waitForConnect, 100);
          }
        };
        waitForConnect();

      } catch (err) {
        console.error(err);
        router.replace("/login");
      }
    };

    fetchUserAndConnect();
       return () => {
    mounted = false;
    // Optionally disconnect socket if you want cleanup on unmount
    // socketService.disconnect?.(); // implement a disconnect method in service
  };
}, []);

  const startSearching = () => {
    if (!selectedMood) return alert("Select a mood first.");
    if (!selectedChoice) return alert("Choose Rizzler/Shawty.");
    if (!user?.userId || !socketReady) return alert("User not ready.");

    setIsSearching(true);
    socketService.startSearching(user.userId, selectedChoice, selectedMood);
  };



  return (
   <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex flex-col items-center justify-center px-4 py-10">
  <div className="p-4">
    {/* Your search UI here */}
  </div>
  <div className="relative w-full max-w-2xl rounded-2xl border border-purple-100 bg-white/80 backdrop-blur-xl shadow-lg p-8">

     {/* Header Row */}
  <div className="flex items-center justify-between mb-8">
    {/* Profile Button (Left) */}
    <button
      onClick={() => router.push("/profile")}
      className="w-10 h-10 rounded-full overflow-hidden border focus:outline-none focus:ring-2 focus:ring-purple-300"
      title="Profile"
    >
      <img
        src="./profileicon.png"
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </button>

    {/* Title (Center) */}
    <h1 className="text-3xl font-extrabold text-purple-700 tracking-tight text-center flex-1">
      YAPPER!!
    </h1>

    {/* All Chats Button (Right) */}
    <button
      onClick={() => router.push("/all-chats")}
      className="px-4 py-2 rounded-lg text-sm font-semibold 
                 bg-indigo-500 text-white hover:bg-indigo-600 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
    >
      All Chats 💬
    </button>
  </div>

    {/* Mood Selection */}
    <section>
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
        Choose Your Mood
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {moods.map((mood) => {
          const isActive = selectedMood === mood;
          return (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isActive ? moodSelected[mood] : moodBase[mood]}`}
            >
              {mood}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-gray-600">
        {selectedMood ? (
          <>Selected mood: <span className="font-semibold text-gray-800">{selectedMood}</span></>
        ) : (
          <>Pick one to get better matches.</>
        )}
      </p>
    </section>

    {/* Choice Selection */}
    <section className="mt-8">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
        Choose with whom you wanna yap
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          aria-pressed={selectedChoice === "Rizzler"}
          className={`px-4 py-3 rounded-xl font-semibold transition border focus:outline-none focus:ring-2 focus:ring-offset-2
            ${selectedChoice === "Rizzler"
              ? "bg-emerald-500 text-white border-emerald-500"
              : "bg-white text-gray-800 border-gray-200 hover:bg-emerald-50"}`}
          onClick={() => setSelectedChoice("Rizzler")}
        >
          Rizzler 😎
        </button>
        <button
          aria-pressed={selectedChoice === "shawty"}
          className={`px-4 py-3 rounded-xl font-semibold transition border focus:outline-none focus:ring-2 focus:ring-offset-2
            ${selectedChoice === "shawty"
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white text-gray-800 border-gray-200 hover:bg-purple-50"}`}
          onClick={() => setSelectedChoice("shawty")}
        >
          Shawty 💃
        </button>
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Selected:{" "}
        <span className="font-semibold text-gray-800">
          {selectedChoice}
        </span>
      </p>
    </section>

    {/* Search Button */}
    <div className="mt-10">
      <button
        onClick={startSearching}
        disabled={isSearching}
        className={`w-full h-12 rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isSearching
            ? "bg-gray-300 text-gray-600 cursor-not-allowed border border-gray-300"
            : "bg-purple-600 hover:bg-purple-700 text-white border border-purple-600"}`}
      >
        {isSearching ? "Searching..." : "Search 🔎"}
      </button>
      <p className="mt-3 text-xs text-gray-500 text-center">
        We’ll pair you with someone who shares your vibe but a different role.
      </p>
    </div>
  </div>
</div>

  );
}
