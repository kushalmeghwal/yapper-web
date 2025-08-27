"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { socketService } from "@/services/socketServices";

interface Message {
  senderId: string;
  message: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { chatRoomId } = params as { chatRoomId: string };
  const receiverId = searchParams.get("receiverId") || "";
  const receiverNickname = searchParams.get("receiverNickname") || "Unknown";

  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let mounted = true;
    let currentUserId = "";

    const fetchUserAndConnect = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        if (!mounted) return;

        currentUserId = data.userId;
        setUserId(currentUserId);

        // Connect socket with callbacks
        socketService.connect(currentUserId, {
          onMessage: (msg) => {
            if (msg.senderId === currentUserId) return;
            if (msg.chatRoomId === chatRoomId) {
              setMessages((prev) => [...prev, {
                senderId: msg.senderId,
                message: msg.message,
                timestamp: new Date(msg.timestamp),
              }]);
            }
          },
          onChatHistory: (msgs) => {
            setMessages(
              msgs.map((m: any) => ({
                senderId: m.senderId,
                message: m.message,
                timestamp: new Date(m.timestamp),
              }))
            );
          },
        });

        // Join current chat room
        socketService.joinChatRoom(chatRoomId, currentUserId);
        socketService.getChatHistory(chatRoomId); // fetch old messages

      } catch (err) {
        console.error(err);
        router.replace("/login");
      }
    };

    fetchUserAndConnect();

    return () => {
      mounted = false;
      if (currentUserId) {
        socketService.leaveChatRoom(chatRoomId, currentUserId);
      }
    };
  }, [chatRoomId, router]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !userId) return;

    const newMsg: Message = { senderId: userId, message, timestamp: new Date() };
    setMessages((prev) => [...prev, newMsg]);

    socketService.sendMessage(chatRoomId, userId, receiverId, message);
    setMessage("");
  };

  const handleAllChats = () => {
    if (userId) socketService.leaveChatRoom(chatRoomId, userId);
    router.push("/all-chats");
  };

  const handleDisconnect = () => {
    if (userId) {
      socketService.leaveChatRoom(chatRoomId, userId);
      socketService.stopSearching(userId);
    }
    router.push("/search");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 py-6">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="flex items-center justify-between bg-purple-500 text-white px-4 py-3">
          <h1 className="font-semibold text-lg">{receiverNickname}</h1>
          <div className="flex gap-2">
            <button onClick={handleAllChats} className="px-3 py-1 rounded bg-blue-500 text-white text-sm">All Chats</button>
            <button onClick={handleDisconnect} className="px-3 py-1 rounded bg-blue-950 text-white text-sm">Disconnect</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet</p>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === userId;
              return (
                <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
                  <div className={`max-w-sm px-4 py-2 rounded-2xl shadow-md text-sm ${isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                    <p>{msg.message}</p>
                    <span className={`block text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-600"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="flex items-center p-3 border-t bg-white">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-xl px-4 py-2 mr-2 text-gray-900"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium">Send</button>
        </div>
      </div>
    </div>
  );
}
