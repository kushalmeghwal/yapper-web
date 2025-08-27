// src/services/socketService.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private joinedRooms: Set<string> = new Set(); 

  connect(userId: string, listeners?: {
    onMessage?: (msg: any) => void;
    onChatHistory?: (msgs: any[]) => void;
    onAllChats?: (chats: any[]) => void;
    onMatchFound?: (data: any) => void;
    onSearchTimeout?: () => void;
  }) {
    if (this.socket && this.socket.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { userId },
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.socket?.emit("userOnline", userId);
    });

    this.socket.on("receiveMessage", (msg) => {
      listeners?.onMessage?.(msg);
    });

    this.socket.on("chatHistory", (msgs) => {
      listeners?.onChatHistory?.(msgs);
    });

    this.socket.on("allChats", (chats) => {
      listeners?.onAllChats?.(chats);
    });

    this.socket.on("matchFound", (data) => {
      listeners?.onMatchFound?.(data);
    });

    this.socket.on("searchTimeout", () => {
      listeners?.onSearchTimeout?.();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err);
    });
  }

  // --- utility functions ---
  joinChatRoom(chatRoomId: string, userId: string) {
    if (this.joinedRooms.has(chatRoomId)) return; // <--- prevent multiple joins
    this.socket?.emit("joinRoom", { chatRoomId, userId });
    this.socket?.emit("getChatHistory", { chatRoomId });
    this.joinedRooms.add(chatRoomId);
  }

  leaveChatRoom(chatRoomId: string, userId: string) {
    if (!this.joinedRooms.has(chatRoomId)) return;
    this.socket?.emit("leaveRoom", { chatRoomId, userId });
    this.joinedRooms.delete(chatRoomId);
  }


  sendMessage(chatRoomId: string, senderId: string, receiverId: string, message: string) {
    this.socket?.emit("sendMessage", {
      chatRoomId,
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  startSearching(userId: string, type: string, mood: string) {
    this.socket?.emit("startSearching", { userId, type, mood });
  }

  stopSearching(userId: string) {
    this.socket?.emit("stopSearching", userId);
  }

  getAllChats(userId: string) {
    this.socket?.emit("getAllChats", { userId });
  }

  getChatHistory(chatRoomId: string) {
    if (!this.socket) return;
    this.socket.emit("getChatHistory", { chatRoomId });
  }
  // src/services/socketService.ts
  disconnect() {
  if (this.socket) {
    this.socket.disconnect();
    this.socket = null;
    this.joinedRooms.clear();
  }
}

}

export const socketService = new SocketService();
