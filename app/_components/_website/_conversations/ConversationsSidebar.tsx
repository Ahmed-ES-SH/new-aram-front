"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiX, FiMessageCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { formatTime, formatTitle } from "@/app/_helpers/helpers";
import { reduceUnreadCount } from "@/app/Store/userSlice";
import { instance } from "@/app/_helpers/axios";
import { setConversationsSidebar } from "@/app/Store/variablesSlice";
import { Conversation, User } from "@/app/[locale]/(routes)/conversations/page";
import { useLocale } from "next-intl";
import RenderMessage from "./RenderMessage";
import Img from "../_global/Img";

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const selectedConversation = searchParams.get("conversationId");

  const onClose = () => {
    dispatch(setConversationsSidebar(false));
  };

  // Filter conversations by participant name
  const filteredConversations =
    conversations &&
    conversations.filter((conv) => {
      const searchField = conv.participant.name;

      return (
        searchField && searchField.toLowerCase().includes(search.toLowerCase())
      );
    });

  const handleSelectConversation = async (id: number, participant: User) => {
    const conversation = conversations.find((conv) => conv.id === id);
    const unreadCount = conversation?.unread_count || 0;

    await instance.post(`/active-conversation?conversation_id=${id}`);

    // تغيير المسار
    router.push(
      `/${locale}/conversations/${formatTitle(
        `conversationwith ${participant.name}`
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
          className="fixed min-w-[320px] w-[320px] xl:w-[380px] max-md:w-[85%] max-xl:z-999 h-full xl:static inset-y-0 left-0 xl:z-5 bg-white border-r border-gray-100 flex flex-col xl:translate-x-0 shadow-xl xl:shadow-none"
        >
          {/* Header with gradient */}
          <div className="text-black p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FiMessageCircle className="text-black size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">
                    {locale === "ar" ? "المحادثات" : "Conversations"}
                  </h2>
                  <p className="text-xs text-black/70">
                    {conversations?.length || 0}{" "}
                    {locale === "ar" ? "محادثة" : "chats"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="xl:hidden p-2 text-black/80 hover:text-black rounded-lg hover:bg-black/10 transition-all duration-200"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Search bar */}
            <div className="relative">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  isSearchFocused ? "text-black" : "text-gray-400"
                }`}
              >
                <FiSearch size={18} />
              </div>
              <input
                type="text"
                placeholder={
                  locale === "ar" ? "ابحث في المحادثات..." : "Search..."
                }
                className="w-full pl-10 pr-4 py-3 bg-white/95 backdrop-blur-sm rounded-xl border-2 border-gray-300 focus:border-black/30 focus:ring-0 outline-none text-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations && filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isSelected = Number(selectedConversation) === conv.id;
                return (
                  <motion.div
                    key={conv.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleSelectConversation(conv.id, conv.participant)
                    }
                    className={`relative p-4 cursor-pointer border-b border-gray-50 transition-all duration-300 group ${
                      isSelected
                        ? "bg-linear-to-r from-primary to-primary/90"
                        : "hover:bg-linear-to-r hover:from-primary/5 hover:to-primary/10"
                    }`}
                  >
                    {/* Active indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeConversation"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-l-full"
                      />
                    )}

                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div
                          className={`w-14 h-14 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                            isSelected
                              ? "ring-2 ring-white/50"
                              : "group-hover:ring-2 group-hover:ring-primary/30"
                          }`}
                        >
                          <Img
                            className="w-full h-full object-cover"
                            src={
                              conv.participant.image ??
                              "/defaults/male-noimage.jpg"
                            }
                            errorSrc="/defaults/male-noimage.jpg"
                          />
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3
                            className={`font-semibold truncate transition-colors ${
                              isSelected
                                ? "text-white"
                                : "text-gray-800 group-hover:text-primary"
                            }`}
                          >
                            {conv.participant.name}
                          </h3>
                          {conv.last_message && (
                            <span
                              className={`text-xs whitespace-nowrap ${
                                isSelected ? "text-white/70" : "text-gray-400"
                              }`}
                            >
                              {formatTime(conv.last_message.created_at, locale)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div
                            className={`text-sm truncate flex-1 ${
                              isSelected ? "text-white/80" : "text-gray-500"
                            }`}
                          >
                            {conv.last_message && (
                              <RenderMessage
                                messageType={conv.last_message.message_type}
                                message={conv.last_message.message}
                              />
                            )}
                          </div>
                          {conv.unread_count > 0 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`min-w-[22px] h-[22px] flex items-center justify-center text-xs font-bold rounded-full px-1.5 shadow-md ${
                                isSelected
                                  ? "bg-white text-primary"
                                  : "bg-linear-to-r from-primary to-primary/80 text-white"
                              }`}
                            >
                              {conv.unread_count > 9 ? "9+" : conv.unread_count}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-24 h-24 mb-6 rounded-full bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <FiMessageCircle className="text-primary/40 size-12" />
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  {locale === "ar"
                    ? "لم يتم العثور على محادثات"
                    : "No conversations found"}
                </h4>
                <p className="text-sm text-gray-400">
                  {locale === "ar"
                    ? "ابدأ محادثة جديدة للتواصل"
                    : "Start a new conversation to connect"}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
