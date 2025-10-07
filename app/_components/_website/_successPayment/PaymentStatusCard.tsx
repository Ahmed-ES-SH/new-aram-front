"use client";

import { motion, spring } from "framer-motion";
import type { ReactNode } from "react";

interface PaymentStatusCardProps {
  icon: ReactNode;
  title: string;
  message: string;
  details?: { label: string; value: string }[];
  primaryButton: { label: string; onClick: () => void };
  secondaryButton?: { label: string; onClick: () => void };
  variant: "success" | "error";
  isRTL?: boolean;
}

export default function PaymentStatusCard({
  icon,
  title,
  message,
  details,
  primaryButton,
  secondaryButton,
  variant,
  isRTL = false,
}: PaymentStatusCardProps) {
  const bgGradient =
    variant === "success"
      ? "from-emerald-50 via-teal-50 to-cyan-50"
      : "from-rose-50 via-red-50 to-orange-50";

  const iconAnimation =
    variant === "success"
      ? {
          initial: { scale: 0, opacity: 0, rotate: -180 },
          animate: { scale: 1, opacity: 1, rotate: 0 },
          transition: {
            type: spring,
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          },
        }
      : {
          initial: { scale: 0, opacity: 0, x: -20 },
          animate: { scale: 1, opacity: 1, x: 0 },
          transition: {
            type: spring,
            stiffness: 300,
            damping: 20,
            delay: 0.1,
          },
        };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 space-y-6">
          {/* Icon */}
          <motion.div className="flex justify-center" {...iconAnimation}>
            {icon}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className={`text-3xl md:text-4xl font-bold text-center ${
              variant === "success" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {title}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-gray-600 text-center text-base md:text-lg"
          >
            {message}
          </motion.p>

          {/* Payment Details */}
          {details && details.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="bg-gray-50 rounded-xl p-5 space-y-3"
            >
              {details.map((detail, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm md:text-base"
                >
                  <span className="text-gray-600 font-medium">
                    {detail.label}:
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {detail.value}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="space-y-3 pt-2"
          >
            <button
              onClick={primaryButton.onClick}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white text-base md:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                variant === "success"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200"
                  : "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-200"
              }`}
            >
              {primaryButton.label}
            </button>

            {secondaryButton && (
              <button
                onClick={secondaryButton.onClick}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 text-base md:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {secondaryButton.label}
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
