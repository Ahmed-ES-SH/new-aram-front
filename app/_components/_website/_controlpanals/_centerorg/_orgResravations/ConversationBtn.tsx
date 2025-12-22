"use client";
import { instance } from "@/app/_helpers/axios";
import { formatTitle } from "@/app/_helpers/helpers";
import { useAppSelector } from "@/app/Store/hooks";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

interface props {
  secondParty: {
    id: number;
    account_type: "user" | "organization";
    title: string;
    name: string;
  };
}

export default function ConversationBtn({ secondParty }: props) {
  const { user } = useAppSelector((state) => state.user);
  const locale = useLocale() as "en" | "ar";

  const router = useRouter();

  const [loadingConversation, setLoadingConversation] = useState(false);

  const errorStartConversation =
    locale == "en"
      ? "You can't start a conversation with yourself!"
      : "لا تستطيع بدء محادثة مع نفسك !";

  const handleStartConversation = async () => {
    if (
      user?.id == secondParty?.id &&
      user?.account_type === secondParty.account_type
    ) {
      toast.error(errorStartConversation);
      return;
    }

    setLoadingConversation(true);
    try {
      const participant_one_id = user?.id;
      const participant_one_type = user?.account_type;
      const participant_two_id = secondParty?.id;
      const participant_two_type = secondParty.account_type;
      const data = {
        participant_one_id,
        participant_one_type,
        participant_two_id,
        participant_two_type,
      };
      const response = await instance.post(`/start-conversation`, data);
      if (response.status == 201) {
        const conversation = response.data.data;

        // تغيير المسار
        router.push(
          `/${locale}/conversations/${formatTitle(
            `conversationwith ${
              secondParty?.title ?? secondParty?.name ?? "unknow user"
            }`
          )}?conversationId=${conversation.id}&userId=${user?.id}&userType=${
            user?.account_type
          }&receiverId=${secondParty?.id}&receiverType=${
            secondParty.account_type
          }`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingConversation(false);
    }
  };

  return (
    <>
      <button
        disabled={loadingConversation}
        onClick={() => handleStartConversation()}
      >
        {loadingConversation ? (
          <VscLoading className="size-4 text-sky-500 animate-spin" />
        ) : (
          <FaMessage className="size-4 text-sky-400 cursor-pointer hover:text-blue-500 duration-200" />
        )}
      </button>
    </>
  );
}
