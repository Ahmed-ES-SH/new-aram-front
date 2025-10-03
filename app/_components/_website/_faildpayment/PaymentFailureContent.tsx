"use client";

import { motion } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/Store/hooks";

interface PaymentFailureContentProps {
  totalInvoice: string;
}

export function PaymentFailureContent({
  totalInvoice,
}: PaymentFailureContentProps) {
  const t = useTranslations("paymentFailure");
  const locale = useLocale();
  const router = useRouter();

  const { activeCurrency } = useAppSelector((state) => state.currency);

  const handleRetry = () => {
    router.push(`/${locale}/cart`);
  };

  const handleGoHome = () => {
    router.push(`/${locale}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.6,
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <FaTimesCircle className="w-24 h-24 text-red-500" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                repeat: 0,
              }}
              className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-foreground text-balance">
            {t("title")}
          </h1>

          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            {t("message")}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 bg-red-500/5 border border-red-500/20 rounded-lg p-6"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("amount")}</span>
            <span className="text-3xl font-bold text-foreground">
              {activeCurrency?.symbol}{" "}
              {(
                Number(totalInvoice) *
                Number(activeCurrency?.exchange_rate || 1)
              ).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-red-500 mt-3">{t("errorCode")}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handleRetry}
            className="flex-1 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t("retryButton")}
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            {t("homeButton")}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          {t("supportText")}
        </motion.p>
      </div>
    </div>
  );
}
