"use client";
import { Message } from "@/app/[locale]/(routes)/conversations/page";
import type { RootState } from "@/app/Store/store";
import {
  setShowMessagesDrop,
  setShowNotificationDrop,
  setShowUserButton,
} from "@/app/Store/variablesSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { FiMessageSquare, FiSearch, FiUsers } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ConversationItem from "./ConversationItem";
import LocaleLink from "../../_website/_global/LocaleLink";
import { useAppSelector } from "@/app/Store/hooks";

// أنواع البيانات للمحادثات
export interface Conversation {
  id: number;
  last_message: Message;
  participant: {
    id: number;
    name: string;
    image: string;
    type: string;
  };
  updated_at: string;
  unread_count: number;
}

interface Props {
  conversations: Conversation[];
}

export default function ConversationsDropDown({ conversations }: Props) {
  const dispatch = useDispatch();

  const { user } = useAppSelector((state) => state.user);
  const { showMessagesDrop } = useSelector(
    (state: RootState) => state.variables
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDropdown = () => {
    dispatch(setShowMessagesDrop(!showMessagesDrop));
    dispatch(setShowNotificationDrop(false));
    dispatch(setShowUserButton(false));
  };

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch(setShowMessagesDrop(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  // تصفية المحادثات بناء على البحث
  const filteredConversations =
    (conversations &&
      Array.isArray(conversations) &&
      conversations?.filter(
        (conversation) =>
          conversation.participant.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          conversation.last_message?.message
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )) ||
    [];

  // حساب إجمالي الرسائل غير المقروءة
  const totalUnread =
    conversations?.reduce((sum, conv) => sum + conv.unread_count, 0) || 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="relative w-fit cursor-pointer group"
      >
        <div className="relative p-2 rounded-full bg-linear-to-br from-indigo-500/20 to-blue-500/20 group-hover:from-indigo-500/30 group-hover:to-blue-500/30 transition-all duration-300">
          <BiSolidMessageRounded className="text-white size-6 max-md:size-5" />

          {/* مؤشر الرسائل غير المقروءة */}
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showMessagesDrop && (
          <motion.div
            initial={{ y: -10, opacity: 0, scale: 0.95 }}
            animate={{ y: 40, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
            className="w-[420px] h-[520px] absolute -right-2 shadow-2xl rounded-2xl bg-white border border-gray-200 z-50 overflow-hidden"
          >
            {/* السهم أعلى القائمة مع تأثير ظل */}
            <div className="absolute -top-3 right-8">
              <div className="w-6 h-6 bg-white border-t border-l border-gray-200 transform rotate-45 shadow-sm"></div>
            </div>

            {/* رأس القائمة */}
            <div className="p-6 bg-primary text-wihte">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FiMessageSquare className="text-white size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">المحادثات</h3>
                    <p className="text-sm text-blue-100">
                      {conversations?.length || 0} محادثة نشطة
                    </p>
                  </div>
                </div>

                {/* أيقونة المشاركين */}
                <div className="flex items-center gap-1 text-white/80">
                  <FiUsers className="size-5" />
                  <span className="text-sm font-medium">
                    {conversations?.length || 0}
                  </span>
                </div>
              </div>

              {/* شريط البحث */}
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FiSearch className="text-gray-400 size-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المحادثات..."
                  className="w-full pr-12 pl-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border-none text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-white/30 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* حالة عدم وجود محادثات */}
            {!conversations || conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100%-180px)] p-8">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FiMessageSquare className="text-gray-400 size-16" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">+</span>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  لا توجد محادثات
                </h4>
                <p className="text-gray-600 text-center mb-6 max-w-sm">
                  ابدأ محادثة جديدة مع العملاء أو الموردين للحفاظ على التواصل
                  الفعال
                </p>

                <button className="px-6 py-3 bg-linear-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                  بدء محادثة جديدة
                </button>
              </div>
            ) : (
              <>
                {/* قائمة المحادثات */}
                <div className="h-[calc(100%-180px)] overflow-y-auto">
                  {filteredConversations &&
                    filteredConversations.map((conversation) => (
                      <ConversationItem
                        key={`${conversation.id}-${conversation.updated_at}`}
                        conversation={conversation}
                      />
                    ))}
                </div>

                {/* تذييل القائمة */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white via-white to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">
                        {conversations?.length || 0} محادثة نشطة
                      </span>
                    </div>

                    <LocaleLink
                      href={`/conversations?userId=${user?.id}&account_type=${user?.account_type}`}
                      className="px-6 py-2 bg-linear-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      عرض الكل
                    </LocaleLink>
                  </div>

                  {/* موجز الإحصائيات */}
                  {totalUnread > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          الرسائل غير المقروءة:
                        </span>
                        <span className="font-bold text-blue-600">
                          {totalUnread} رسالة
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
