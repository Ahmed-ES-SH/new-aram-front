import ConversationsSidebar from "@/app/_components/_website/_conversations/ConversationsSidebar";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";
import React from "react";

export interface User {
  id: number;
  name: string;
  image: string;
  type: string;
  title: string;
  logo: string;
}

export interface Message {
  id: number;
  message: string;
  attachment: string | null;
  sender_id: number;
  created_at: string; // ISO format
  message_type: "text" | "audio" | "image" | "pdf"; // adjust types if needed
}

export interface Conversation {
  id: number;
  participant: User;
  last_message: Message;
  unread_count: number;
}

export async function generateMetadata() {
  const t = await getTranslations("metaConversationsPage");
  const sharedMetadata = await getSharedMetadata(t("title"), t("description"));
  return {
    title: t("title"),
    describtion: t("description"),
    ...sharedMetadata,
  };
}

export default async function ConversationsLayout({ children, params }: any) {
  const locale = (await params.locale) ?? "en";

  return (
    <>
      <div
        dir={directionMap[locale]}
        className="flex items-start justify-between pt-[93px] h-[93vh]"
      >
        <ConversationsSidebar />
        {children}
      </div>
    </>
  );
}
