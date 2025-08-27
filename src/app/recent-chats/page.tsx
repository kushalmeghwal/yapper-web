// // components/RecentChats.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { RecentChat } from "@/models/RecentChats";
// import RecentChatsManager from "@/lib/RecentChatsManager";


// export default function RecentChats() {
//   const [chats, setChats] = useState<RecentChat[]>([]);

//   useEffect(() => {
//     const manager = RecentChatsManager.getInstance();

//     // Example: preload some chats (replace with API call or socket)
//     manager.addOrUpdateChat({
//       chatRoomId: "room1",
//       receiverId: "u2",
//       receiverNickname: "Alice",
//       lastMessage: "Hey, how are you?",
//       lastMessageTime: new Date(),
//     });

//     setChats(manager.getChats());
//   }, []);

//   return (
//     <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-2xl p-4">
//       <h2 className="text-xl font-semibold mb-4">Recent Chats</h2>
//       <ul className="divide-y divide-gray-200">
//         {chats.map((chat) => (
//           <li
//             key={chat.chatRoomId}
//             className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 transition"
//           >
//             <div>
//               <p className="font-medium text-gray-900">{chat.receiverNickname}</p>
//               <p className="text-sm text-gray-500 truncate max-w-[180px]">
//                 {chat.lastMessage}
//               </p>
//             </div>
//             <span className="text-xs text-gray-400">
//               {chat.lastMessageTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
