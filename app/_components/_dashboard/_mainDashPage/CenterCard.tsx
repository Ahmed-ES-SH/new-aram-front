"use client";
import { useState } from "react";
import { Center } from "./CentersList";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import Img from "../../_website/_global/Img";

interface CenterCardProps {
  center: Center;
  onStatusChange: (id: number, newStatus: Center["status"]) => void;
  onDelete: (id: number) => void;
  index?: number;
}

export default function CenterCard({
  center,
  onStatusChange,
  onDelete,
  index = 0,
}: CenterCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // معالجة تغيير الحالة
  const handleStatusChange = async () => {
    try {
      const newStatus =
        center.status === "published" ? "not_published" : "published";
      setLoading(true);
      const response = await instance.post(
        `/update-organization/${center.id}?status=${newStatus}`
      );
      if (response.status == 200) {
        toast.success("تم تغيير الحالة بنجاح");
        onStatusChange(center.id, newStatus);
      }
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // معالجة الحذف
  const handleDelete = async () => {
    try {
      const response = await instance.delete(
        `/delete-organization/${center.id}`
      );
      if (response.status == 200) {
        toast.success("تم حذف المركز بنجاح");
        onDelete(center.id);
      }
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // الحصول على نص الحالة
  const getStatusText = () => {
    return center.status === "published" ? "منشور" : "غير منشور";
  };

  // الحصول على ألوان الحالة
  const getStatusColors = () => {
    if (center.status === "published") {
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      };
    } else {
      return {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-200",
      };
    }
  };

  const statusColors = getStatusColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      {/* رأس البطاقة */}
      <div className="p-4 border-b border-gray-100 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* صورة الشعار */}
          <div className="relative">
            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-100">
              <Img
                src={center.logo ?? "/defaults/noImage.png"}
                errorSrc="/defaults/noImage.png"
                alt={center.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* مؤشر الحالة */}
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                center.status === "published" ? "bg-green-500" : "bg-amber-500"
              }`}
            >
              {center.status === "published" ? (
                <FaEye className="text-white text-xs w-full h-full p-0.5" />
              ) : (
                <FaEyeSlash className="text-white text-xs w-full h-full p-0.5" />
              )}
            </div>
          </div>

          {/* معلومات المركز */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {center.title}
            </h3>
            <div
              className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
            >
              {center.status === "published" ? (
                <FaEye className="ml-1 rtl:mr-1 rtl:ml-0 text-xs" />
              ) : (
                <FaEyeSlash className="ml-1 rtl:mr-1 rtl:ml-0 text-xs" />
              )}
              <span>{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* عدد الحجوزات */}
        <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg px-3 py-2 min-w-[80px]">
          <span className="text-2xl font-bold text-blue-700">
            {center.number_of_reservations}
          </span>
          <span className="text-xs text-blue-600 font-medium">حجز</span>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-4">
        {/* معلومات التواصل */}
        <div className="space-y-3 mb-4">
          {/* البريد الإلكتروني */}
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg ml-2 rtl:mr-2 rtl:ml-0">
              <FaEnvelope className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">البريد الإلكتروني</p>
              <p className="text-sm font-medium text-gray-800 truncate">
                {center.email}
              </p>
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg ml-2 rtl:mr-2 rtl:ml-0">
              <FaPhone className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">رقم الهاتف</p>
              <p className="text-sm font-medium text-gray-800">
                {center.phone_number}
              </p>
            </div>
          </div>

          {/* تاريخ الإنشاء */}
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg ml-2 rtl:mr-2 rtl:ml-0">
              <FaCalendarAlt className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">تاريخ الإنشاء</p>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(center.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {/* زر تغيير الحالة */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStatusChange}
            className={`flex items-center justify-center flex-1 gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              center.status === "published"
                ? "bg-amber-100 hover:bg-amber-200 text-amber-800"
                : "bg-green-100 hover:bg-green-200 text-green-800"
            }`}
          >
            {center.status === "published" ? (
              <>
                {loading ? (
                  <FaSpinner className="ml-1 rtl:mr-1 rtl:ml-0 animate-spin" />
                ) : (
                  <FaEyeSlash className="ml-1 rtl:mr-1 rtl:ml-0" />
                )}
                <span>إخفاء</span>
              </>
            ) : (
              <>
                <FaEye className="ml-1 rtl:mr-1 rtl:ml-0" />
                <span>نشر</span>
              </>
            )}
          </motion.button>

          {/* زر الحذف */}
          {!showDeleteConfirm ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center flex-1 gap-2 py-3 px-4 rounded-lg font-medium bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
            >
              {isDeleting ? (
                <FaSpinner className="ml-1 rtl:mr-1 rtl:ml-0 animate-spin" />
              ) : (
                <>
                  <FaTrash className="ml-1 rtl:mr-1 rtl:ml-0" />
                  <span>حذف</span>
                </>
              )}
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-1 gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center flex-1 gap-2 py-3 px-4 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-1 rtl:mr-1 rtl:ml-0"></div>
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="ml-1 rtl:mr-1 rtl:ml-0" />
                    <span>تأكيد</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              >
                <FaTimes className="ml-1 rtl:mr-1 rtl:ml-0" />
                <span>إلغاء</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
