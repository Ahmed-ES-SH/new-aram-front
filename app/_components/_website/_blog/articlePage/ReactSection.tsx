"use client";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";
import { useSearchParams } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaHeart, FaLaugh } from "react-icons/fa";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface reactions {
  likes: number;
  dislikes: number;
  loves: number;
  laughs: number;
}

interface props {
  reactions: reactions;
  setReactions: Dispatch<SetStateAction<reactions>>;
  setCheckUser: Dispatch<SetStateAction<boolean>>;
}

export default function ReactSection({
  reactions,
  setReactions,
  setCheckUser,
}: props) {
  const { user } = useAppSelector((state) => state.user);
  const userId = user && user.id;
  const searchParams = useSearchParams();
  const articleId = searchParams.get("articleId");

  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReact = async (type: string) => {
    try {
      setLoading(true);

      if (!user) {
        setCheckUser(true);
        return;
      }

      const data = {
        interaction_type: type,
        user_id: userId, // استبدل لاحقًا بالمستخدم الحالي
        article_id: articleId,
      };

      const response = await instance.post(`/add-article-interaction`, data);

      if (response.status === 201 || response.status === 200) {
        setReactions((prev) => {
          let updated = { ...prev };

          if (userReaction) {
            if (userReaction === type) {
              // نفس التفاعل → لا تغير UI (الـ backend هيبعت خطأ أصلاً)
              return prev;
            } else {
              // طرح من القديم
              updated = {
                ...updated,
                [userReaction + "s"]: Math.max(
                  updated[userReaction + "s"] - 1,
                  0
                ),
              };
            }
          }

          // زيادة الجديد
          updated = { ...updated, [type + "s"]: updated[type + "s"] + 1 };

          return updated;
        });

        // تحديث حالة التفاعل الحالي
        setUserReaction(type);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "حدث خطأ أثناء التفاعل على المقال ❌";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const backegroundsIcons =
    userReaction == "like"
      ? "bg-sky-400"
      : userReaction == "love"
      ? "bg-red-400"
      : userReaction == "dislike"
      ? "bg-gray-400"
      : userReaction == "laughter"
      ? "bg-primary"
      : "bg-red-800";

  const reactIcons = [
    { icon: <FaThumbsUp />, type: "like", hovercolor: "hover:bg-sky-400" },
    { icon: <FaHeart />, type: "love", hovercolor: "hover:bg-red-400" },
    {
      icon: <FaThumbsDown />,
      type: "dislike",
      hovercolor: "hover:bg-gray-400",
    },
    { icon: <FaLaugh />, type: "laughter", hovercolor: "hover:bg-primary" },
  ];

  useEffect(() => {
    const CheckUser = async () => {
      try {
        const response = await instance.post(
          `/check-user-interaction?user_id=${userId}&article_id=${articleId}`
        );
        if (response.status == 200) {
          const reactType = response.data.data.interaction_type;
          if (reactType) setUserReaction(reactType);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    CheckUser();
  }, [userId, articleId]);

  return (
    <>
      {/* ردود الفعل */}
      <div className="mt-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center flex-wrap max-md:justify-center gap-6">
            {reactIcons.map((icon, index) => {
              const isLoadingIcon = loading && userReaction === icon.type;

              return (
                <button
                  key={index}
                  onClick={() => handleReact(icon.type)}
                  disabled={loading} // يمنع تفاعل جديد أثناء التحميل
                  className={`p-3 text-xl outline-none ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`icon outline-none rounded-full ${
                        icon.hovercolor
                      } hover:text-white duration-300 ${
                        userReaction == icon.type
                          ? ` text-white  ${backegroundsIcons} `
                          : " text-gray-400 "
                      } w-12 h-12 flex items-center justify-center`}
                    >
                      {isLoadingIcon ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-white text-2xl" />
                      ) : (
                        icon.icon
                      )}
                    </div>
                    <p className="text-center font-extralight text-sm">
                      {reactions[`${icon.type}s`]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
