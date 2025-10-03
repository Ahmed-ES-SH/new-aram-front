"use client";

import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/Store/hooks";
import { directionMap } from "@/app/constants/_website/global";
import { useEffect } from "react";
import { instance } from "@/app/_helpers/axios";
import { useDispatch } from "react-redux";
import { clearCart } from "@/app/Store/cartSlice";

export function SuccessContent() {
  const { activeCurrency } = useAppSelector((state) => state.currency);
  const dispatch = useDispatch();

  const t = useTranslations("success");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const total_invoice = searchParams.get(`total_invoice`);
  const orderId = searchParams.get(`orderId`);

  const handleReturnHome = () => {
    router.push(`/${locale}`);
  };

  // Animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const iconVariants: any = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  useEffect(() => {
    const check = async () => {
      const response = await instance.post(
        `/payments/confirm?order_id=${orderId}`
      );
      if (response.status == 200) {
        dispatch(clearCart());
      }
    };
    if (orderId) check();
  }, [dispatch, orderId]);

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-screen flex items-center justify-center bg-background px-4 py-12"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full"
      >
        {/* Success Icon */}
        <motion.div
          variants={iconVariants}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <FaCheckCircle className="w-24 h-24 text-green-400" />
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: 0.3,
              }}
              className="absolute inset-0 rounded-full bg-green-400"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-center text-foreground mb-4 text-balance"
        >
          {t("title")}
        </motion.h1>

        {/* Message */}
        <motion.p
          variants={itemVariants}
          className="text-center text-muted-foreground text-lg mb-8 leading-relaxed text-pretty"
        >
          {t("message")}
        </motion.p>

        {/* Invoice Card */}
        <motion.div
          variants={itemVariants}
          className="bg-card border border-border rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">
              {t("invoice")}
            </span>
            <span className="text-3xl font-bold text-foreground">
              {activeCurrency?.symbol}{" "}
              {(
                Number(total_invoice) *
                Number(activeCurrency?.exchange_rate || 1)
              ).toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* Confirmation Message */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          {t("confirmation")}
        </motion.p>

        {/* Return Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={handleReturnHome}
            className="w-full bg-primary text-primary-foreground font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {t("button")}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
