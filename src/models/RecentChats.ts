// models/RecentChat.ts
export interface RecentChat {
  chatRoomId: string;
  receiverId: string;
  receiverNickname: string;
  lastMessage: string;
  lastMessageTime: Date;
}
