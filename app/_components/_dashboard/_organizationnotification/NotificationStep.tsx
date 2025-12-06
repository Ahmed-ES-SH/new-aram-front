"use client";
import { useState } from "react";
import { NotificationData, Organization } from "./types";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronRight,
  FiInfo,
  FiSend,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";

// مكون خطوة الإشعار
interface NotificationStepProps {
  selectedIds: number[];
  organizations: Organization[];
  onBack: () => void;
}

export default function NotificationStep({
  selectedIds,
  organizations,
  onBack,
}: NotificationStepProps) {
  const { user } = useAppSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // الحصول على المراكز المحددة
  const selectedOrganizations = organizations.filter((org) =>
    selectedIds.includes(org.id)
  );

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("recipient_type", "organization");
      if (user) formData.append("sender_id", user.id.toString());
      if (user) formData.append("sender_type", user.account_type);
      formData.append("content", message);
      formData.append("user_ids", JSON.stringify(selectedIds));

      const response = await instance.post(
        `/send-multiple-notification`,
        formData
      );
      if (response.status == 200) {
        setIsSent(true);
        setMessage("");
        setTimeout(() => {
          onBack();
        }, 500);
      }
    } catch (error: any) {
      console.error("فشل إرسال الإشعار:", error);
      const message =
        error?.response?.data?.message["ar"] ??
        error?.response?.data?.message ??
        "حدث خطا اثناء اجراء العملية !";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  // const typeOptions = [
  //   {
  //     value: "info" as const,
  //     label: "معلومات",
  //     icon: FiInfo,
  //     color: "text-blue-600",
  //     bg: "bg-blue-100",
  //   },
  //   {
  //     value: "warning" as const,
  //     label: "تحذير",
  //     icon: FiAlertCircle,
  //     color: "text-amber-600",
  //     bg: "bg-amber-100",
  //   },
  //   {
  //     value: "success" as const,
  //     label: "نجاح",
  //     icon: FiCheckCircle,
  //     color: "text-green-600",
  //     bg: "bg-green-100",
  //   },
  //   {
  //     value: "error" as const,
  //     label: "خطأ",
  //     icon: FiXCircle,
  //     color: "text-red-600",
  //     bg: "bg-red-100",
  //   },
  // ];

  if (isSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          تم الإرسال بنجاح!
        </h3>
        <p className="text-gray-600">
          تم إرسال الإشعار إلى {selectedIds.length} مركز
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الخطوة */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
          <FiSend className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">إرسال الإشعار</h2>
        <p className="text-gray-600 mt-2">
          سيتم إرسال الإشعار إلى {selectedIds.length} مركز
        </p>
      </div>

      {/* ملخص المراكز المحددة */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">المراكز المحددة</h4>
          <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {selectedIds.length} مركز
          </span>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {selectedOrganizations.map((org) => (
            <div
              key={org.id}
              className="flex items-center gap-3 p-2 bg-white rounded-lg"
            >
              <div className="w-8 h-8 rounded overflow-hidden">
                <img
                  src={org.logo}
                  alt={org.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {org.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{org.email}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* نموذج الإشعار */}
      <div className="space-y-4">
        {/* نوع الإشعار */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            نوع الإشعار
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {typeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = notificationType === option.value;

              return (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setNotificationType(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? `border-blue-500 ${option.bg}`
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${option.color}`} />
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {option.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div> */}

        {/* عنوان الإشعار */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            عنوان الإشعار
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان الإشعار..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1 text-left">
            {title.length}/100 حرف
          </p>
        </div> */}

        {/* نص الإشعار */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            نص الإشعار
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="أدخل نص الإشعار..."
            rows={4}
            className="w-full px-4 py-3 min-h-[190px] rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1 text-left">
            {message.length}/500 حرف
          </p>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          <FiChevronRight className="w-5 h-5 rotate-180" />
          رجوع
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!message.trim() || isSending}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            message.trim() && !isSending
              ? "bg-linear-to-r from-green-600 to-green-700 text-white hover:shadow-lg"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <FiSend className="w-5 h-5" />
              إرسال الإشعار
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
