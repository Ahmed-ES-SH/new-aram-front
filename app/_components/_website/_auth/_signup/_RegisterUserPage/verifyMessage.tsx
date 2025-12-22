"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function VerifyMessage({ email, t }: { email: string; t: any }) {
  const locale = useLocale();
  const router = useRouter();

  // Countdown state
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    if (counter === 0) {
      router.push(`/${locale}/login`);
      return;
    }

    const timer = setTimeout(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, locale, router]);

  return (
    <div
      dir={directionMap[locale]}
      className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex justify-center mb-4 text-primary text-5xl"
        >
          <MdEmail />
        </motion.div>

        <h2 className="text-2xl font-semibold text-gray-800">
          {t("verify_title")}
        </h2>
        <p className="text-gray-600 mt-4">{t("verify_message")}</p>

        <p className="text-lg font-medium text-primary mt-2">{email}</p>
        <p className="text-gray-500 mt-4">{t("verify_instruction")}</p>

        {/* Countdown message */}
        <p className="text-sm text-gray-500 mt-6">
          {t("redirecting_message")} {counter}...
        </p>
      </motion.div>
    </div>
  );
}
