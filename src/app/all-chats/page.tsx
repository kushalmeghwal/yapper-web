"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

interface RecentChat {
  chatRoomId: string;
  receiverId: string;
  receiverNickname: string;
  lastMessage: string;
  lastMessageTime: string;
}

export default function AllChatsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [chats, setChats] = useState<RecentChat[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          credentials: "include",
        });
        if (!res.ok) return router.replace("/login");

        const data = await res.json();
        if (!mounted) return;

        setUserId(data.userId);

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
          query: { userId: data.userId },
          withCredentials: true,
        });
        socketRef.current = socket;

        // Fetch all previous chats
        socket.emit("getAllChats", { userId: data.userId });

        socket.on("allChats", (chatList: RecentChat[]) => {
          setChats(
            chatList.sort(
              (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
            )
          );
        });

        // Listen for new messages
        socket.on("newMessage", (msg: any) => {
          setChats((prev) => {
            // Update last message of corresponding chat
            const existing = prev.find(c => c.chatRoomId === msg.chatRoomId);
            let updatedChats: RecentChat[];
            if (existing) {
              updatedChats = prev.map(c =>
                c.chatRoomId === msg.chatRoomId
                  ? {
                      ...c,
                      lastMessage: msg.message,
                      lastMessageTime: msg.timestamp,
                    }
                  : c
              );
            } else {
              // New chat
              updatedChats = [
                {
                  chatRoomId: msg.chatRoomId,
                  receiverId: msg.senderId === data.userId ? msg.receiverId : msg.senderId,
                  receiverNickname: msg.senderNickname,
                  lastMessage: msg.message,
                  lastMessageTime: msg.timestamp,
                },
                ...prev,
              ];
            }

            // Sort by lastMessageTime descending
            return updatedChats.sort(
              (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
            );
          });
        });

        socket.on("match-found", ({ chatRoomId, receiverId, receiverNickname }) => {
          router.push(`/chat/${chatRoomId}?receiverId=${receiverId}&receiverNickname=${receiverNickname}`);
        });
      } catch (err) {
        console.error(err);
        router.replace("/login");
      }
    };

    init();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [router]);

  const openChat = (chat: RecentChat) => {
    router.push(`/chat/${chat.chatRoomId}?receiverId=${chat.receiverId}&receiverNickname=${chat.receiverNickname}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl h-[80vh] flex flex-col bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="bg-purple-500 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h1 className="text-2xl font-semibold">Your Chats</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chats.length === 0 ? (
            <p className="text-gray-500 text-center mt-20">No chats yet. Start a conversation!</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.chatRoomId}
                onClick={() => openChat(chat)}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 rounded-2xl p-4 cursor-pointer transition-shadow shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">{chat.receiverNickname}</span>
                  <span className="text-gray-600 text-sm truncate max-w-xs">{chat.lastMessage}</span>
                </div>
                <span className="text-gray-400 text-xs">
                  {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border-t p-4 flex justify-between items-center rounded-b-3xl">
          <button
            onClick={() => router.push("/search")}
            className="flex-1 bg-purple-500 text-white py-2 rounded-xl font-medium hover:bg-purple-600 transition"
          >
            Start New Chat
          </button>
        </div>
      </div>
    </div>
  );
}
