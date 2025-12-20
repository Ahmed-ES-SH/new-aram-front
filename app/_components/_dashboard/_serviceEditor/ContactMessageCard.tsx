"use client";
import { motion } from "framer-motion";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";
import { ContactMessage } from "./types";
import { useState } from "react";

interface ContactMessageCardProps {
  selectedMessage: ContactMessage;
  handleClosePopup: () => void;
  handleStatusChange: (newStatus: string) => void;
  handleSubmit: () => void;
  status: "pending" | "completed" | "processing" | null;
}

export default function ContactMessageCard({
  selectedMessage,
  handleClosePopup,
  handleStatusChange,
  handleSubmit,
  status,
}: ContactMessageCardProps) {
  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClosePopup}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm "
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">تفاصيل الرسالة</h3>
          <button
            onClick={handleClosePopup}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Header Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FiUser size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">المرسل</p>
                <p className="font-bold">{selectedMessage.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                <FiMail className="text-primary" />
                <span className="truncate" title={selectedMessage.email}>
                  {selectedMessage.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                <FiPhone className="text-primary" />
                <span>{selectedMessage.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FiCalendar />
              <span>
                {new Date(selectedMessage.created_at).toLocaleString("ar-SA")}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiMessageSquare className="text-primary" />
              نص الرسالة
            </label>
            <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedMessage.message}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تحديث الحالة
            </label>
            <div className="flex flex-wrap gap-2">
              {["pending", "completed", "processing"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    status === s
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {s === "pending" && "قيد الانتظار"}
                  {s === "completed" && "مكتمل"}
                  {s === "processing" && "قيد المعالجة"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={handleClosePopup}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-white hover:text-gray-800 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl font-medium bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            حفظ التغييرات
          </button>
        </div>
      </motion.div>
    </div>
  );
}
