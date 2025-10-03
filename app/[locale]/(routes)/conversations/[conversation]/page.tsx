import ChatPage from "@/app/_components/_website/_conversations/ChatPage";
import React from "react";

export default async function Conversation({ searchParams }: any) {
  const conversationId = searchParams.conversationId;
  if (!conversationId)
    return (
      <div className="flex items-center justify-center h-[93vh] w-full">
        <p className="text-gray-500">Conversation not found.</p>
      </div>
    );

  return <ChatPage />;
}
