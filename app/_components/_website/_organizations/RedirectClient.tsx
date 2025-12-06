"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { useLocale } from "next-intl";
import { directionMap } from "@/app/constants/_website/global";

interface Props {
  targetUrl: string;
}

export default function RedirectClient({ targetUrl }: Props) {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (targetUrl) {
      router.push(targetUrl);
    }
  }, [router, targetUrl]);

  return (
    <motion.div
      dir={directionMap[locale]}
      className="fixed inset-0 z-99999 flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-primary px-6 py-4 rounded-2xl shadow-lg text-center"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-center gap-2">
          <VscLoading className="animate-spin text-white" />
          <p className="text-white font-medium text-lg">
            {locale == "ar"
              ? "جاري إعادة التوجيه، الرجاء الانتظار..."
              : "Redirecting, please wait..."}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
