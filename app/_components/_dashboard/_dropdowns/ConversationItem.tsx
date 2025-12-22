"use client";
import React, { useState } from "react";
import { Conversation } from "./ConversationsDropDown";
import Img from "../../_website/_global/Img";
import { formatTitle, getRelativeTime } from "@/app/_helpers/helpers";
import { FiChevronRight } from "react-icons/fi";
import RenderMessage from "../../_website/_conversations/RenderMessage";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { useLocale } from "next-intl";
import { setShowMessagesDrop } from "@/app/Store/variablesSlice";

interface props {
  conversation: Conversation;
}

export default function ConversationItem({ conversation }: props) {
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();

  const [loadingConversation, setLoadingConversation] = useState(false);

  const secondParty = conversation.participant;
  const handleStartConversation = async () => {
    if (
      user?.id == secondParty?.id &&
      user?.account_type === secondParty.type
    ) {
      toast.error("لا يمكن بدء المحادثة مع نفسك");
      return;
    }

    setLoadingConversation(true);
    try {
      const participant_one_id = user?.id;
      const participant_one_type = user?.account_type;
      const participant_two_id = secondParty?.id;
      const participant_two_type = secondParty.type;
      const data = {
        participant_one_id,
        participant_one_type,
        participant_two_id,
        participant_two_type,
      };
      const response = await instance.post(`/start-conversation`, data);
      if (response.status == 201) {
        const conversation = response.data.data;
        dispatch(setShowMessagesDrop(false));
        // تغيير المسار
        router.push(
          `/${locale}/conversations/${formatTitle(
            `conversationwith ${secondParty?.name ?? "unknow user"}`
          )}?conversationId=${conversation.id}&userId=${user?.id}&userType=${
            user?.account_type
          }&receiverId=${secondParty?.id}&receiverType=${secondParty.type}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingConversation(false);
    }
  };

  return (
    <div
      key={conversation.id}
      onClick={() => handleStartConversation()}
      className={`relative group/item p-4 border-b border-gray-100 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-300 ${
        conversation.unread_count > 0
          ? "bg-linear-to-r from-blue-50/50 to-indigo-50/50"
          : ""
      }`}
    >
      {/* تأثير خلفي عند التحويم */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-500 opacity-0 group-hover/item:opacity-5 transition-opacity duration-300"></div>

      <div className="relative flex items-center gap-4">
        {/* صورة المستخدم مع مؤشر الحالة */}
        <div className="relative shrink-0">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-lg group-hover/item:scale-105 transition-transform duration-300">
            <Img
              src={
                conversation.participant.image ?? "/defaults/male-noimage.jpg"
              }
              errorSrc="/defaults/male-noimage.jpg"
              alt={conversation.participant.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* مؤشر النشاط */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
        </div>

        {/* محتوى المحادثة */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-gray-800 text-base truncate">
              {conversation.participant.name}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {getRelativeTime(conversation.updated_at)}
              </span>
              <FiChevronRight className="text-gray-400 size-4 group-hover/item:text-blue-500 transition-colors" />
            </div>
          </div>

          {/* آخر رسالة */}
          <div className="flex items-center gap-2">
            <div
              className={`min-w-0 ${
                conversation.unread_count > 0 ? "font-medium" : ""
              }`}
            >
              <p className="text-sm text-gray-600 truncate">
                {conversation.last_message ? (
                  <RenderMessage
                    messageType={conversation.last_message.message_type}
                    message={conversation.last_message.message}
                  />
                ) : (
                  "لا توجد رسائل"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* عدد الرسائل غير المقروءة */}
        {conversation.unread_count > 0 && (
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-red-500 to-pink-500 rounded-full blur-md opacity-70"></div>
              <span className="relative w-7 h-7 rounded-full bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {conversation.unread_count > 9
                  ? "9+"
                  : conversation.unread_count}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
