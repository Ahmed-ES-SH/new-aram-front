// File: components/UserIdNotFound.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FiAlertCircle, FiHome } from "react-icons/fi";

export default function UserIdNotFound() {
  const t = useTranslations("UserIdNotFound");
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-10 flex flex-col md:flex-row gap-8 items-center"
      >
        <div className="flex-1 flex flex-col items-center md:items-start gap-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-rose-50 text-rose-600 p-3 shadow-inner border border-rose-100">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
              {t("title")}
            </h1>
          </div>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            {t("description")}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-900 transition-colors"
            >
              {t("goBack")}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/${locale}`)}
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FiHome />
              {t("home")}
            </motion.button>
          </div>

          <div className="mt-4 text-xs text-slate-400">{t("hint")}</div>
        </div>

        <div className="w-full md:w-1/3 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-44 h-44 md:w-56 md:h-56 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center border border-emerald-100"
          >
            <svg
              className="w-28 h-28 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 9.5a3.5 3.5 0 1 1 7 0"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
