"use client";

import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { useTranslations } from "next-intl";

export function ProfileHeader() {
  const t = useTranslations("userProfile");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl shadow-sm border border-border p-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <FiUser className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground text-balance">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-pretty">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
