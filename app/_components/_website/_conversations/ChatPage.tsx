"use client";
import { motion } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setConversationsSidebar } from "@/app/Store/variablesSlice";
import { useEffect } from "react";
import { instance, main_api } from "@/app/_helpers/axios";
import { useSearchParams } from "next/navigation";

export interface MessageType {
  id: number;
  message: string;
  message_type: string;
  is_read: number;
  attachment: File;
  conversation_id: number;
  sender_id: number;
  created_at: string;
  updated_at: string;
}

export interface conversationType {
  id: number;
  participant: {
    id: number;
    name: string;
    image: string;
  };
  messages: MessageType[];
}

interface props {
  conversation: conversationType;
}

// Main Chat Component
export default function ChatPage({ conversation }: props) {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const userId = searchParams.get("userId");

  const { conversationsSidebar } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const updateMessagesStatus = async () => {
      try {
        instance.post(
          `/conversation/mark-as-read?sender_id=${userId}&conversation_id=${conversationId}`
        );
      } catch (error) {
        console.log(error);
      }
    };
    updateMessagesStatus();
  }, [conversationId, userId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      navigator.sendBeacon(`${main_api}/clear-active-conversation`);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      instance.post("/clear-active-conversation"); // ← عند تبديل الصفحة يدويًا
    };
  }, []);

  return (
    <div className="h-full flex-1 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary/5 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Overlay for mobile */}
      {conversationsSidebar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setConversationsSidebar(false))}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 xl:hidden"
        />
      )}

      {/* Main Chat Area */}
      <div className="relative flex-1 h-full flex flex-col min-w-0">
        <ChatHeader avatar={conversation && conversation.participant} />
        <ChatMessages messages={conversation && conversation.messages} />
        <MessageInput />
      </div>
    </div>
  );
}
