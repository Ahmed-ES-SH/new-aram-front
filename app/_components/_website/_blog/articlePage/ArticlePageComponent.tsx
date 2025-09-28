"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import CheckCurrentUserPopup from "../../_global/CheckCurrentUserPopup";
import Img from "../../_global/Img";
import RandomArticlesSidebar from "./RandomArticlesSidebar";
import { Article } from "../types";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";
import ReactSection from "./ReactSection";
import CommentsSection from "./CommentsSection";

export interface commentType {
  id: number;
  content: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    image: string;
    logo: string;
    title: string;
  };
}

interface props {
  article: Article;
  randomArticles: Article[];
  commentsResponse: {
    data: commentType[];
    pagination: {
      last_page: number;
      current_page: number;
    };
  };
}

export default function ArticlePageComponent({
  article,
  randomArticles,
  commentsResponse,
}: props) {
  const locale = useLocale();

  const [comments, setComments] = useState<commentType[]>([]);
  const [commentsPagination, setCommentsPagination] = useState<
    props["commentsResponse"]["pagination"] | null
  >(null);

  const [reactions, setReactions] = useState<any>({
    likes: 0,
    dislikes: 0,
    loves: 0,
    laughters: 0,
  });
  const [checkUser, setCheckUser] = useState<boolean>(false);

  const extractWords = (
    text: string,
    startWordIndex: number,
    wordLimit: number
  ) => {
    const words = text.split(" ");
    if (startWordIndex >= words.length) {
      return "";
    }
    const extractedWords = words.slice(
      startWordIndex,
      startWordIndex + wordLimit
    );
    return extractedWords.join(" ");
  };

  useEffect(() => {
    if (commentsResponse) {
      setComments(commentsResponse.data);
      setCommentsPagination(commentsResponse.pagination);
    }
  }, [commentsResponse]);

  useEffect(() => {
    if (article.interactions) {
      const interactions = article.interactions[0];
      setReactions({
        likes: interactions ? interactions.likes : 0,
        dislikes: interactions ? interactions.dislikes : 0,
        loves: interactions ? interactions.loves : 0,
        laughters: interactions ? interactions.laughters : 0,
      });
    }
  }, [article]);

  if (!article) return null;

  return (
    <>
      <div dir={directionMap[locale]} className="bg-gray-50 py-3  mt-20">
        <div className="mx-auto flex items-start justify-between max-xl:flex-col w-full gap-4 pt-4 px-3 max-md:px-1">
          {/* المقال الرئيسي */}
          <motion.div
            className="flex-1 flex-grow bg-white rounded-lg shadow-lg p-6 max-md:p-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* صورة المقال */}
            <div className="relative mb-6">
              <Img
                src={article.image ?? "/defaults/noImage.png"}
                errorSrc="/defaults/noImage.png"
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* العنوان و تفاصيل المقال */}
            <div className="text-center text-white">
              <h1 className="text-4xl max-md:text-2xl pb-2 border-b border-main_orange w-fit mx-auto font-bold text-gray-900  mb-2">
                {locale == "en" ? article.title_en : article.title_ar}
              </h1>
              <p className="text-md text-gray-600 border-b border-green-300 pb-2 w-fit mx-auto  mb-4">
                By{" "}
                <span className="font-semibold text-teal-400">
                  {article.author && article.author.name}
                </span>{" "}
                |{" "}
                {article.created_at
                  ? formatDistanceToNow(new Date(article.created_at), {
                      addSuffix: true,
                    })
                  : "Not available"}
              </p>
            </div>

            {/* محتوى المقال */}
            <motion.div
              className="prose lg:prose-xl  mt-6"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-gray-500 ">
                {locale == "en"
                  ? extractWords(article.content_en, 0, 30)
                  : extractWords(article.content_ar, 0, 30)}
              </p>
              <p className="text-gray-500">
                {locale == "en"
                  ? extractWords(article.content_en, 30, 60)
                  : extractWords(article.content_ar, 30, 60)}
              </p>
              <p className="text-gray-500">
                {locale == "en"
                  ? extractWords(article.content_en, 60, 50000)
                  : extractWords(article.content_ar, 60, 50000)}
              </p>
            </motion.div>

            {/* ردود الفعل */}

            <ReactSection
              reactions={reactions}
              setReactions={setReactions}
              setCheckUser={setCheckUser}
            />

            {/* التعليقات */}
            <CommentsSection
              comments={comments}
              setComments={setComments}
              commentsPagination={commentsPagination}
              setCheckUser={setCheckUser}
            />
          </motion.div>

          {/* القسم الجانبي */}
          <RandomArticlesSidebar data={randomArticles} length={6} />
        </div>
      </div>

      <CheckCurrentUserPopup
        isOpen={checkUser}
        onClose={() => setCheckUser((prev) => !prev)}
      />
    </>
  );
}
