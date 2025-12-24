"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaRegComment, FaHeart, FaPen, FaTrash } from "react-icons/fa";
import { HiCalendar } from "react-icons/hi2";
import Link from "next/link";
import Img from "@/app/_components/_website/_global/Img";
import { ArticleType } from "@/app/types/_dashboard/GlobalTypes";
import LocaleLink from "../../_website/_global/LocaleLink";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";

interface Props {
  article: ArticleType;
  setArticels: Dispatch<SetStateAction<ArticleType[]>>;
}

export default function ArticleDashCard({ article, setArticels }: Props) {
  const {
    id,
    title_ar,
    content_ar,
    image,
    created_at,
    author,
    category,
    status,
    interactions,
    comments_count,
    views = 0,
  } = article;

  const totalReactions = interactions?.[0]?.totalReactions || 0;

  // Function to truncate text
  const truncate = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 border-green-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "archived":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const statusLabel: any = {
    published: "منشور",
    draft: "مسودة",
    archived: "مؤرشف",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await instance.delete(`/delete-article/${id}`);
      if (response.status == 200) {
        toast.success("تم حذف المقال بنجاح !");
        setArticels((prev) => prev.filter((article) => article.id != id));
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ?? "حدث خطا أثناء حذف المقال !";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
      >
        <div className="block h-full">
          {/* Image Section */}
          <div className="relative h-48 w-full overflow-hidden">
            <Img
              src={image}
              alt={title_ar}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status Badge */}
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getStatusColor(
                status
              )}`}
            >
              {statusLabel[status] || status}
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
              {category?.title_ar}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 flex flex-col h-[calc(100%-12rem)] justify-between">
            <div className="w-full">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <HiCalendar className="w-4 h-4" />
                <span>{new Date(created_at).toLocaleDateString("ar-EG")}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {title_ar}
              </h3>

              <div
                className="text-sm text-gray-500 line-clamp-2 mb-4"
                dangerouslySetInnerHTML={{
                  __html: truncate(content_ar || "", 100),
                }}
              />

              <div className="flex items-center gap-2 my-2 w-fit mr-auto">
                <LocaleLink
                  href={`/dashboard/articles/${id}`}
                  className="size-6 hover:text-sky-500 hover:scale-125 text-sky-400 rounded-full flex items-center justify-center hover:bg-sky-400/20 duration-300 cursor-pointer"
                >
                  <FaPen className="size-3" />
                </LocaleLink>
                <div
                  onClick={() => setIsOpen(true)}
                  className="size-6 hover:text-red-500 hover:scale-125 text-red-400 rounded-full flex items-center justify-center hover:bg-red-400/20 duration-300 cursor-pointer"
                >
                  <FaTrash className="size-3" />
                </div>
              </div>
            </div>

            {/* Footer: Author & Stats */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  <Img
                    src={author?.image ?? "/defaults/male-noimage.jpg"}
                    errorSrc="/defaults/male-noimage.jpg"
                    alt={author?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 truncate max-w-[80px]">
                  {author?.name}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-gray-400 text-xs">
                <div className="flex items-center gap-1" title="المشاهدات">
                  <FaEye />
                  <span>{views}</span>
                </div>
                <div className="flex items-center gap-1" title="التعليقات">
                  <FaRegComment />
                  <span>{comments_count}</span>
                </div>
                <div
                  className="flex items-center gap-1 text-red-400"
                  title="الإعجابات"
                >
                  <FaHeart />
                  <span>{totalReactions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <ConfirmDeletePopup
        id={id}
        onClose={() => setIsOpen(false)}
        onDelete={handleDelete}
        showConfirm={isOpen}
        title={`المقال ${title_ar}`}
        loading={deleteLoading}
      />
    </>
  );
}
