"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import Img from "../../_website/_global/Img";
import LocaleLink from "../../_website/_global/LocaleLink";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";

export type Slide = {
  id: number;
  image: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  circle_1_color: string;
  circle_2_color: string;
  status: "active" | "inactive" | "";
  created_at: string;
  updated_at: string;
};

interface SlideCardDashProps {
  slide: Slide;
  setSlides: Dispatch<SetStateAction<Slide[]>>;
}

export default function SlideCardDash({
  slide,
  setSlides,
}: SlideCardDashProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await instance.delete(`/delete-slide/${slide.id}`);

      if (response.status === 200) {
        toast.success("تم حذف الشريحة بنجاح");

        setSlides((prev) => {
          return prev.filter((org) => org.id !== slide.id);
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء حذف الشريحة");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <motion.div
        dir="rtl"
        className="relative py-2 px-2 bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Img
            src={slide.image}
            alt={slide.title["ar"]}
            className="w-full h-full object-cover"
          />
          {/* Circles */}
          <div
            className="absolute top-4 left-4 w-6 h-6 rounded-full"
            style={{ backgroundColor: slide.circle_1_color }}
          ></div>
          <div
            className="absolute top-4 right-4 w-6 h-6 rounded-full"
            style={{ backgroundColor: slide.circle_2_color }}
          ></div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {slide.title["ar"]}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {slide.description["ar"]}
          </p>
          <span
            className={`inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full ${
              slide.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {slide.status}
          </span>
        </div>

        {/* Actions */}
        <div className="w-fit mr-auto flex gap-2">
          <LocaleLink href={`/dashboard/slidescontrol/${slide.id}`}>
            <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
              <FaEdit size={16} />
            </button>
          </LocaleLink>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </motion.div>
      <ConfirmDeletePopup
        title={`الشريحة : ${slide.title.ar}`}
        id={slide.id}
        loading={deleteLoading}
        showConfirm={confirmDelete}
        onDelete={() => onDelete()}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}
