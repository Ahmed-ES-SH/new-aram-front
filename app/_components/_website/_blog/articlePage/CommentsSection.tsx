"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import PaginationWithoutNumbers from "../../_global/paginationWithOutnumbers";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { commentType } from "./ArticlePageComponent";
import { instance } from "@/app/_helpers/axios";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/Store/hooks";
import Img from "../../_global/Img";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { VscLoading } from "react-icons/vsc";

interface props {
  comments: commentType[];
  setComments: Dispatch<SetStateAction<commentType[]>>;
  setCheckUser: Dispatch<SetStateAction<boolean>>;
  commentsPagination: {
    last_page: number;
    current_page: number;
  } | null;
}

export default function CommentsSection({
  comments,
  setComments,
  setCheckUser,
  commentsPagination,
}: props) {
  const locale = useLocale();
  const { user } = useAppSelector((state) => state.user);

  const searchParams = useSearchParams();

  const userId = 2;
  const articleId = searchParams.get("articleId");

  const [newComment, setNewComment] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (newPage: any) => {
    if (!commentsPagination) return null;
    if (newPage > 0 && newPage <= commentsPagination?.last_page) {
      setCurrentPage(newPage);
    }
  };

  const handleAddComment = async () => {
    try {
      if (!user) {
        setCheckUser(true);
        return;
      }

      const data = {
        article_id: articleId,
        user_id: userId,
        user_type: user.name ? "user" : "organization",
        content: newComment,
      };
      const response = await instance.post("/add-comment", data);
      if (response.status == 201) {
        setComments((prev: any) => [
          {
            id: Date.now(),
            content: newComment,
            created_at: Date.now(),
            user: {
              name: user.title ?? user.name,
              image: user.image ?? user.logo,
              email: user.email,
            },
          },
          ...prev,
        ]);
        toast.success("تم اضافة التعليق على المقال بنجاح");
        setNewComment("");
      }
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        "حدث خطأ غير متوقع اثناء محاولة اضافة التعليق";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-10">
        <h3 className="text-lg font-light text-gray-900 pb-2 border-b border-gray-300 w-fit text-md   mb-4">
          {locale == "en" ? "Comments:" : "التعليقات"}
        </h3>
        <div className="  mb-6">
          <textarea
            className="w-full h-32 p-3 outline-none border border-gray-300 rounded-md"
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="w-fit ml-auto">
            <motion.button
              className="bg-teal-500 flex items-center mt-4 justify-center w-fit text-white px-4 py-2 rounded-md hover:bg-teal-600"
              onClick={handleAddComment}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {loading ? (
                <VscLoading className="animate-spin" />
              ) : locale == "en" ? (
                "Add"
              ) : (
                "تعليق"
              )}
            </motion.button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 bg-gray-100  rounded-sm min-h-screen">
            <div className="space-y-6">
              {comments &&
                comments.length > 0 &&
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="bg-white   shadow-md rounded-lg p-6 border border-gray-200 -700"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                        <Img
                          src={
                            comment.user.logo ??
                            comment.user.image ??
                            "/defaults/male-noimage.jpg"
                          }
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-gray-800 ">
                          {comment.user.name ?? comment.user.title}
                        </h4>
                      </div>
                    </div>
                    <p
                      style={{ overflowWrap: "anywhere" }}
                      className="text-gray-700  text-base mb-4"
                    >
                      {comment.content}
                    </p>
                    <div className="text-sm text-gray-500">
                      <p style={{ direction: "ltr" }} className="text-left ">
                        {comment.created_at
                          ? formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                            })
                          : "Not available"}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
            {commentsPagination && commentsPagination?.last_page > 1 && (
              <PaginationWithoutNumbers
                currentPage={currentPage}
                totalPages={commentsPagination.last_page}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
