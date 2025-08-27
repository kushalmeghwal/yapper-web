// lib/RecentChatsManager.ts
import { RecentChat } from "../models/RecentChats";

class RecentChatsManager {
  private static instance: RecentChatsManager;
  private recentChats: RecentChat[] = [];

  private constructor() {}

  public static getInstance(): RecentChatsManager {
    if (!RecentChatsManager.instance) {
      RecentChatsManager.instance = new RecentChatsManager();
    }
    return RecentChatsManager.instance;
  }

  getChats(): RecentChat[] {
    return [...this.recentChats]; // return copy
  }

  addOrUpdateChat(chat: RecentChat) {
    const index = this.recentChats.findIndex(c => c.chatRoomId === chat.chatRoomId);
    if (index !== -1) {
      this.recentChats[index] = chat;
    } else {
      this.recentChats.unshift(chat);
    }
    this.recentChats.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  }

  removeChat(chatRoomId: string) {
    this.recentChats = this.recentChats.filter(c => c.chatRoomId !== chatRoomId);
  }

  clearChats() {
    this.recentChats = [];
  }
}

export default RecentChatsManager;
