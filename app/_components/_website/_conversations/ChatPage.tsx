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
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import LoadingPage from "../_global/LoadingPage";

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

// Main Chat Component
export default function ChatPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const userId = searchParams.get("userId");
  const userType = searchParams.get("userType");

  const { data: conversation, loading } = useFetchData<conversationType>(
    `/conversation/show?conversation_id=${conversationId}&participant_id=${userId}&participant_type=${userType}`,
    false
  );

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

  if (loading) return <LoadingPage />;

  return (
    <div className="h-full flex-1/2">
      {/* Overlay for mobile */}
      {conversationsSidebar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setConversationsSidebar(false))}
          className="fixed inset-0 bg-black/50 z-50 xl:hidden"
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 h-full flex flex-col min-w-0">
        <ChatHeader avatar={conversation && conversation.participant} />
        <ChatMessages messages={conversation && conversation.messages} />
        <MessageInput />
      </div>
    </div>
  );
}
