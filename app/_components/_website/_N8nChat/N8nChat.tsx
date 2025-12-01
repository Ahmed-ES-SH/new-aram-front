"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend } from "react-icons/fi";
import { GoDependabot } from "react-icons/go";

import Image from "next/image"; // استخدام Image من Next.js للأداء الأفضل

// --- بيانات افتراضية للمحادثة ---
const DUMMY_MESSAGES = [
  { id: 1, role: "bot", text: "مرحباً بك! 👋 كيف يمكنني مساعدتك اليوم؟" },
  { id: 2, role: "user", text: "أواجه مشكلة في استعراض التقارير" },
  {
    id: 3,
    role: "bot",
    text: "لا تقلق، أنا هنا للمساعدة. هل تظهر لك رسالة خطأ معينة؟",
  },
];

interface N8nChatProps {
  webhookUrl: string;
}

export default function N8nChat({ webhookUrl }: N8nChatProps) {
  const t = useTranslations("chat");
  const chatRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // حالة وهمية للإدخال لغرض العرض فقط
  const [inputValue, setInputValue] = useState("");

  // --- تم تعطيل هذا الجزء مؤقتاً لغرض العرض الوهمي ---
  /*
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (!isOpen || !isLoaded || !chatRef.current) return;
    if (typeof window !== "undefined" && (window as any).createChat) {
         // ... كود n8n الأصلي ...
    }
  }, [isOpen, isLoaded, t, webhookUrl]);
  */

  return (
    <>
      {/* تم تعطيل تحميل السكربت مؤقتاً.
        عند إصلاح البيانات، قم بإزالة التعليق عن Script وأعد تفعيل useEffect أعلاه
      */}
      {/* <Script
        src="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
      /> 
      */}

      {/* زر الفتح */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-primary hover:bg-orange-600  text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center transition-colors"
        >
          <GoDependabot className="size-6 z-50" />
        </button>
      )}

      {/* نافذة الدردشة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            // قمنا بإزالة المعرف id="n8n-chat" مؤقتاً لأننا نبني الواجهة يدوياً
            className="fixed bottom-5 right-5 w-80 sm:w-96 h-[500px] shadow-2xl rounded-2xl overflow-hidden z-50 bg-gray-50 flex flex-col border border-gray-200"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* --- رأس المحادثة (Header) يحتوي على الشعار --- */}
            <div className="bg-primary p-4 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                {/* الشعار */}
                <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    {t("title") || "المساعد الذكي"}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {t("subtitle") || "متاح الآن"}
                  </p>
                </div>
              </div>

              {/* زر الإغلاق */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors bg-white/10 p-1.5 rounded-full"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* --- منطقة الرسائل (بيانات وهمية) --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {/* رسالة ترحيبية إضافية توضح أن الشات تجريبي */}
              <div className="text-center text-xs text-gray-400 my-2">
                <span>{new Date().toLocaleDateString("ar-EG")}</span>
              </div>

              {DUMMY_MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* --- حقل الإدخال (شكل فقط) --- */}
            <div className="p-3 bg-white border-t border-gray-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInputValue("");
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t("inputPlaceholder") || "اكتب رسالتك هنا..."}
                  className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-right" // text-right للعربية
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-orange-600 text-white p-2.5 rounded-full transition-colors"
                >
                  <FiSend className="w-4 h-4 rtl:rotate-180" />{" "}
                  {/* تدوير الأيقونة للعربية */}
                </button>
              </form>
              <div className="text-center mt-1">
                <span className="text-[10px] text-gray-400">
                  {t("footer") || "مدعوم بالذكاء الاصطناعي"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
