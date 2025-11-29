"use client";
import type { RootState } from "@/app/Store/store";
import {
  setShowMessagesDrop,
  setShowNotificationDrop,
  setShowUserButton,
} from "@/app/Store/variablesSlice";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

// أنواع البيانات للمحادثات
interface Conversation {
  id: number;
  userName: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

export default function ConversationsDropDown() {
  const dispatch = useDispatch();
  const { showMessagesDrop } = useSelector(
    (state: RootState) => state.variables
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // بيانات وهمية للمحادثات
  const mockConversations: Conversation[] = [
    {
      id: 1,
      userName: "محمد أحمد",
      lastMessage: "مرحباً، كيف يمكنني مساعدتك؟",
      time: "10:30",
      unread: 2,
      avatar: "/defaults/default-male.png",
      online: true,
    },
    {
      id: 2,
      userName: "سارة عبدالله",
      lastMessage: "شكراً على المساعدة",
      time: "أمس",
      unread: 0,
      avatar: "/defaults/default-female.png",
      online: false,
    },
    {
      id: 3,
      userName: "أحمد خالد",
      lastMessage: "هل يمكنك إرسال الملفات؟",
      time: "أمس",
      unread: 1,
      avatar: "/defaults/default-male.png",
      online: true,
    },
    {
      id: 4,
      userName: "فاطمة محمد",
      lastMessage: "سأكون في الاجتماع الساعة 3",
      time: "25/12",
      unread: 0,
      avatar: "/defaults/default-female.png",
      online: false,
    },
    {
      id: 5,
      userName: "علي حسن",
      lastMessage: "تم استلام الطلب بنجاح",
      time: "24/12",
      unread: 0,
      avatar: "/defaults/default-male.png",
      online: true,
    },
  ];

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

  // معالجة النقر على محادثة
  const handleConversationClick = (conversationId: number) => {
    console.log(`فتح المحادثة: ${conversationId}`);
    // هنا يمكنك إضافة منطق فتح المحادثة
    dispatch(setShowMessagesDrop(false));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="relative w-fit cursor-pointer">
        <BiSolidMessageRounded className="text-white size-6 max-md:size-5" />
        <span className="absolute -top-2 -right-1 w-3 h-3 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
          3
        </span>
      </div>

      <AnimatePresence>
        {showMessagesDrop && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 40, opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-[350px] h-[400px] absolute right-0 shadow-lg rounded-lg bg-white border border-gray-200 z-50 overflow-hidden"
          >
            {/* السهم أعلى القائمة */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>

            {/* رأس القائمة */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                المحادثات الأخيرة
              </h3>
              <p className="text-sm text-gray-600 text-center mt-1">
                {mockConversations.length} محادثة
              </p>
            </div>

            {/* قائمة المحادثات */}
            <div className="h-[320px] overflow-y-auto">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation.id)}
                  className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {/* صورة المستخدم مع مؤشر الحالة */}
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* محتوى المحادثة */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {conversation.userName}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {conversation.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {/* عدد الرسائل غير المقروءة */}
                  {conversation.unread > 0 && (
                    <div className="flex-shrink-0">
                      <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* زر عرض الكل */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                عرض جميع المحادثات
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
