import ConversationMainPage from "@/app/_components/_website/_conversations/ConversationMainPage";
import ConversationsSidebar from "@/app/_components/_website/_conversations/ConversationsSidebar";
import FetchData from "@/app/_helpers/FetchData";
import { getSharedMetadata } from "@/app/_helpers/helpers";
import { directionMap } from "@/app/constants/_website/global";
import { getTranslations } from "next-intl/server";

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
    description: t("description"),
    ...sharedMetadata,
  };
}

export default async function ConversationsPage({ searchParams, params }) {
  const { userId } = await searchParams;
  const { locale } = await params;

  const { data } = await FetchData(`/user/${userId}/conversations`, true);

  return (
    <div
      dir={directionMap[locale ?? "en"]}
      className="flex items-start justify-between pt-[86px] h-[93vh]"
    >
      {/* conversations sidebar */}
      <ConversationsSidebar data={data} />
      {/* main content */}
      <ConversationMainPage />
    </div>
  );
}
