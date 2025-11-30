"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX } from "react-icons/fi";
import Script from "next/script";

interface N8nChatProps {
  webhookUrl: string;
}

export default function N8nChat({ webhookUrl }: N8nChatProps) {
  const t = useTranslations("chat");
  const chatRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen || !isLoaded || !chatRef.current) return;

    if (typeof window !== "undefined" && (window as any).createChat) {
      console.log("✅ n8n createChat is ready");
      (window as any).createChat({
        webhookUrl,
        webhookConfig: { method: "POST", headers: {} },
        target: "#n8n-chat",
        mode: "window",
        chatInputKey: "chatInput",
        chatSessionKey: "sessionId",
        loadPreviousSession: true,
        metadata: {},
        showWelcomeScreen: false,
        defaultLanguage: "ar",
        initialMessages: t("initialMessages"),
        i18n: {
          ar: {
            title: t("title"),
            subtitle: t("subtitle"),
            footer: t("footer"),
            getStarted: t("getStarted"),
            inputPlaceholder: t("inputPlaceholder"),
          },
        },
      });
    }
  }, [isOpen, isLoaded, t, webhookUrl]);

  return (
    <>
      {/* تحميل السكربت */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ n8n script loaded");
          setIsLoaded(true);
        }}
      />

      {/* زر الفتح */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
        >
          <FiMessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* نافذة الدردشة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            id="n8n-chat"
            className="fixed bottom-5 right-5 w-80 h-[500px] shadow-xl rounded-xl overflow-hidden z-50 bg-white"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* زر الإغلاق */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 z-50"
            >
              <FiX className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
