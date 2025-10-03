"use client";

import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setConversationsSidebar } from "@/app/Store/variablesSlice";
import { useTranslations } from "next-intl";
import { BiSolidConversation } from "react-icons/bi";
import { TbMessageMinus } from "react-icons/tb";

export default function ConversationsPage() {
  const { conversationsSidebar } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const t = useTranslations("ConversationsPage");

  return (
    <div className="flex-1/2 h-full flex items-center justify-center relative">
      {!conversationsSidebar && (
        <div
          onClick={() => dispatch(setConversationsSidebar(true))}
          className="w-16 h-16 cursor-pointer hover:bg-white hover:text-primary hover:scale-105 duration-300 flex items-center justify-center absolute bottom-4 left-4 border border-primary bg-primary text-white rounded-full"
        >
          <BiSolidConversation className="size-7" />
        </div>
      )}
      <div className="text-center">
        <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TbMessageMinus className="text-gray-400 size-32" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("noConversationSelected")}
        </h3>
        <p className="text-gray-500">{t("chooseFromSidebar")}</p>
      </div>
    </div>
  );
}
