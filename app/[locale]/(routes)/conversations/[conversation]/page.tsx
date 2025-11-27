import ChatPage from "@/app/_components/_website/_conversations/ChatPage";
import ConversationsSidebar from "@/app/_components/_website/_conversations/ConversationsSidebar";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
  const t = await getTranslations("metaConversationsPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function Conversation({ searchParams, params }: any) {
  const { locale } = await params;

  const conversationId = searchParams.conversationId;
  const userId = searchParams.userId;
  const userType = searchParams.userType;
  const conversation = await FetchData(
    `/conversation/show?conversation_id=${conversationId}&participant_id=${userId}&participant_type=${userType}`,
    false
  );

  const { data } = await FetchData(`/user/${userId}/conversations`, true);

  if (!conversationId)
    return (
      <div className="flex items-center justify-center h-[93vh] w-full">
        <p className="text-gray-500">Conversation not found.</p>
      </div>
    );

  return (
    <div
      dir={directionMap[locale ?? "en"]}
      className="flex items-start justify-between pt-[93px] h-[93vh]"
    >
      {/* conversations sidebar */}
      <ConversationsSidebar data={data} />
      {/* main conversation content */}
      <ChatPage conversation={conversation} />
    </div>
  );
}
