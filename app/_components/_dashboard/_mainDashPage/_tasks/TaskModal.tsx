"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSave, FiAlertCircle, FiClock, FiCircle } from "react-icons/fi";
import { Task } from "../types";
import { toast } from "sonner";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Task>) => Promise<void>;
  initialData?: Task | null;
}

const priorities = [
  {
    id: "high",
    label: "عاجل",
    color: "red",
    icon: <FiAlertCircle className="h-4 w-4" />,
    desc: "مهام ذات أولوية قصوى يجب إنجازها فوراً",
  },
  {
    id: "medium",
    label: "متوسط",
    color: "indigo",
    icon: <FiClock className="h-4 w-4" />,
    desc: "مهام عادية يجب جدولتها",
  },
  {
    id: "low",
    label: "منخفض",
    color: "blue",
    icon: <FiCircle className="h-4 w-4" />,
    desc: "مهام يمكن تأجيلها لوقت لاحق",
  },
] as const;

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setPriority(initialData?.priority || "medium");
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("عنوان المهمة مطلوب");

    setIsLoading(true);
    try {
      await onSave({ title, description, priority });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {initialData ? "تعديل المهمة" : "مهمة جديدة"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {initialData
                ? "قم بتحديث تفاصيل المهمة الحالية"
                : "أضف مهمة جديدة إلى قائمة أعمالك"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto custom-scrollbar"
        >
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              العنوان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-900 placeholder-gray-400 bg-gray-50/30 focus:bg-white"
              placeholder="ما الذي تريد إنجازه؟"
              autoFocus
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              الأولوية
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {priorities.map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? `border-${p.color}-500 bg-${p.color}-50`
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`mb-2 p-2 rounded-full ${
                        isSelected
                          ? `bg-${p.color}-500 text-white`
                          : `bg-${p.color}-100 text-${p.color}-600`
                      }`}
                    >
                      {p.icon}
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        isSelected ? `text-${p.color}-700` : "text-gray-700"
                      }`}
                    >
                      {p.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="active-priority"
                        className={`absolute inset-0 rounded-xl border-2 border-${p.color}-500`}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 px-1">
              {priorities.find((p) => p.id === priority)?.desc}
            </p>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              الوصف <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-900 placeholder-gray-400 min-h-[100px] resize-none bg-gray-50/30 focus:bg-white"
              placeholder="أضف تفاصيل إضافية حول المهمة..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 pt-2 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-[2] py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transform active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm text-white"></span>
              ) : (
                <>
                  <FiSave className="h-5 w-5" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
