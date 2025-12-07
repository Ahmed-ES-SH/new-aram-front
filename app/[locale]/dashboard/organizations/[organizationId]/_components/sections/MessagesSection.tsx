import React from "react";
import { FormValues } from "../schema";

interface MessagesSectionProps {
  formData: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function MessagesSection({
  formData,
  handleChange,
}: MessagesSectionProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          رسائل الحجز التلقائية
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          تخصيص الرسائل التي تصل للعميل عند قبول أو رفض الحجز
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-green-700">
            رسالة القبول
          </label>
          <textarea
            name="accaptable_message"
            value={formData.accaptable_message || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/30 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none min-h-[100px] resize-none transition-all"
            placeholder="مثال: تم تأكيد حجزك بنجاح، ننتظر زيارتكم..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-red-700">
            رسالة الرفض
          </label>
          <textarea
            name="unaccaptable_message"
            value={formData.unaccaptable_message || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-red-200 bg-red-50/30 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none min-h-[100px] resize-none transition-all"
            placeholder="مثال: نعتذر عن قبول الحجز في الوقت الحالي..."
          />
        </div>
      </div>
    </div>
  );
}
