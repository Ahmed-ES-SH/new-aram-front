"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Img from "../../../_global/Img";

export default function RegistrationHeader() {
  const t = useTranslations("registration");

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full  p-6 rounded-b-2xl"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <Img src="/logo.png" className="w-20 h-20" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl font-bold text-foreground"
        >
          {t("registrationHeader.title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-muted-foreground text-sm max-w-xl"
        >
          {t("registrationHeader.subtitle")}
        </motion.p>
      </div>
    </motion.header>
  );
}
