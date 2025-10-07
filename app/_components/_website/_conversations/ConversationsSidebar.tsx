"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import { CiImageOn } from "react-icons/ci";
import { AiOutlineAudio } from "react-icons/ai";
import { PiFilePdfLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { formatTime, formatTitle } from "@/app/_helpers/helpers";
import { reduceUnreadCount } from "@/app/Store/userSlice";
import { instance } from "@/app/_helpers/axios";
import { setConversationsSidebar } from "@/app/Store/variablesSlice";
import Img from "../_global/Img";
import { Conversation, User } from "@/app/[locale]/(routes)/conversations/page";
import { useLocale } from "next-intl";

interface props {
  data: Conversation[];
}

export default function ConversationsSidebar({ data }: props) {
  const { user, unreadConversations } = useAppSelector((state) => state.user);

  const locale = useLocale() as "en" | "ar";

  const router = useRouter();
  const searchParams = useSearchParams();

  const { width, conversationsSidebar } = useAppSelector(
    (state) => state.variables
  );

  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const selectedConversation = searchParams.get("conversationId");

  const onClose = () => {
    dispatch(setConversationsSidebar(false));
  };

  // Filter conversations by participant name
  const filteredConversations =
    conversations &&
    conversations.filter((conv) => {
      const searchField =
        conv.participant.type === "user"
          ? conv.participant.name
          : conv.participant.title;

      return (
        searchField && searchField.toLowerCase().includes(search.toLowerCase())
      );
    });

  const renderMessage = (messageType: string, message: string) => {
    switch (messageType) {
      case "text":
        return (
          <span className="truncate">
            {message && message.length > 20
              ? message?.slice(0, 20) + "..."
              : message}
          </span>
        );
      case "image":
        return (
          <span className="flex items-center gap-1 text-gray-600">
            <CiImageOn className="w-4 h-4" />
            <span>Image</span>
          </span>
        );
      case "audio":
        return (
          <span className="flex items-center gap-1 text-red-600">
            <AiOutlineAudio className="w-4 h-4" />
            <span>Audio</span>
          </span>
        );
      case "pdf":
        return (
          <span className="flex items-center gap-1 text-green-500">
            <PiFilePdfLight className="w-5 h-5" />
            <span>PDF</span>
          </span>
        );
      default:
        return <span>Unsupported message</span>;
    }
  };

  const handleSelectConversation = async (id: number, participant: User) => {
    const conversation = conversations.find((conv) => conv.id === id);
    const unreadCount = conversation?.unread_count || 0;

    await instance.post(`/active-conversation?conversation_id=${id}`);

    // تغيير المسار
    router.push(
      `/${locale}/conversations/${formatTitle(
        `conversationwith ${participant.name ?? participant.title}`
      )}?conversationId=${id}&userId=${user?.id}&userType=${
        user?.account_type
      }&receiverId=${participant.id}&receiverType=${participant.type}`
    );

    // تصفير عدد الرسائل الغير مقروءة في المحادثة المحددة
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, unread_count: 0 } : conv))
    );

    // تقليل العداد العام بعدد الرسائل غير المقروءة في المحادثة
    if (unreadCount > 0) {
      dispatch(reduceUnreadCount(unreadCount));
    }

    // إغلاق اللوحة الجانبية في الشاشات الصغيرة
    if (width < 1280) onClose();
  };

  useEffect(() => {
    if (!unreadConversations) return;

    setConversations((prev) =>
      prev.map((conversation) => {
        const matching = unreadConversations.find(
          (conv) => conv.conversation_id == conversation.id
        );
        if (matching) {
          return {
            ...conversation,
            unread_count: matching.unread_count,
            last_message: matching.message,
          };
        }
        return conversation;
      })
    );
  }, [unreadConversations]);

  useEffect(() => {
    if (width > 1280) {
      dispatch(setConversationsSidebar(true));
    }
  }, [dispatch, width]);

  useEffect(() => {
    if (data) {
      setConversations(data);
    }
  }, [data]);

  return (
    <AnimatePresence>
      {conversationsSidebar && (
        <motion.div
          initial={{ x: -800 }}
          animate={{ x: conversationsSidebar ? 0 : -800 }}
          exit={{ x: -800 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed min-w-[20%]  shadow max-xl:w-96 max-md:w-[70%] max-xl:z-[999] h-full xl:static inset-y-0 left-0 xl:z-[5] bg-white border-r border-gray-200 flex flex-col xl:translate-x-0"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="xl:hidden p-2 text-red-400 ml-auto rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="mt-4 relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full outline-none pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations &&
              filteredConversations.map((conv) => {
                return (
                  <motion.div
                    key={conv.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleSelectConversation(conv.id, conv.participant)
                    }
                    className={`p-4 cursor-pointer border-b border-gray-100 duration-300 ${
                      Number(selectedConversation) == conv.id
                        ? "bg-primary border-primary text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 shadow rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
                        <Img
                          className="w-full h-full object-cover rounded-full"
                          src={
                            conv.participant.logo ??
                            conv.participant.image ??
                            "/defaults/male-noimage.jpg"
                          }
                          errorSrc="/defaults/male-noimage.jpg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between max-md:flex-col-reverse max-md:items-start gap-4">
                          <h3 className="font-medium truncate">
                            {conv.participant.name ?? conv.participant.title}
                          </h3>
                          {conv.last_message && (
                            <span className="text-xs max-md:self-end whitespace-nowrap">
                              {formatTime(conv.last_message.created_at, locale)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between truncate mt-1">
                          {conv.last_message &&
                            renderMessage(
                              conv.last_message.message_type,
                              conv.last_message.message
                            )}
                          {conv.unread_count > 0 && (
                            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

            {filteredConversations && filteredConversations.length === 0 && (
              <div className="text-center text-gray-500 p-6">
                {locale == "en"
                  ? "No conversations found."
                  : "لم يتم العثور على أي محادثات."}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
