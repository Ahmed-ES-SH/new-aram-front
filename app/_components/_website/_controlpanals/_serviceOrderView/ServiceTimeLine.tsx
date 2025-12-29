"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

interface props {
  currentStatus: string;
}

export default function ServiceTimeLine({ currentStatus }: props) {
  const locale = useLocale();
  // Timeline Steps
  const timelineSteps = [
    { value: "pending", label: { en: "Pending", ar: "قيد الانتظار" } },
    { value: "confirmed", label: { en: "Confirmed", ar: "مؤكد" } },
    { value: "in_progress", label: { en: "Processing", ar: "جاري التنفيذ" } },
    { value: "completed", label: { en: "Completed", ar: "مكتمل" } },
  ];
  const getStepStatus = (stepValue: string, index: number) => {
    const statusOrder = ["pending", "confirmed", "in_progress", "completed"];
    const currentIdx = statusOrder.indexOf(
      currentStatus === "on_hold" ? "in_progress" : currentStatus
    );

    // Error / Failure states
    if (["canceled", "refunded", "failed"].includes(currentStatus)) {
      return "error";
    }

    if (currentIdx === -1) return "waiting";
    if (index < currentIdx) return "completed";
    if (index === currentIdx) return "current";
    return "waiting";
  };
  return (
    <div className="relative flex justify-between items-center px-2">
      {/* Background line - UPDATED: start-0 instead of left-0 */}
      <div className="absolute top-3 start-0 w-full h-1 bg-gray-100 rounded-full" />

      {/* Progress line - UPDATED: start-0 instead of left-0 */}
      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: `${Math.max(
            0,
            (timelineSteps.findIndex(
              (s) =>
                s.value ===
                (currentStatus === "on_hold" ? "in_progress" : currentStatus)
            ) /
              (timelineSteps.length - 1)) *
              100
          )}%`,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-3 start-0 h-1 bg-primary rounded-full shadow-sm shadow-primary/30"
      />

      {timelineSteps.map((step, idx) => {
        const statusState = getStepStatus(step.value, idx);
        const isCompleted = statusState === "completed";
        const isCurrent = statusState === "current";

        return (
          <div key={idx} className="flex flex-col items-center gap-2 z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`
                              w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                              ${
                                isCompleted || isCurrent
                                  ? "bg-white border-primary shadow-lg shadow-primary/20"
                                  : "bg-white border-gray-200"
                              }
                              ${
                                isCurrent
                                  ? "ring-4 ring-primary/20 scale-110"
                                  : ""
                              }
                            `}
            >
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 rounded-full bg-primary"
                />
              )}
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-3 h-3 rounded-full bg-primary"
                />
              )}
            </motion.div>
            <span
              className={`text-[10px] font-semibold transition-colors duration-300 ${
                isCurrent
                  ? "text-primary"
                  : isCompleted
                  ? "text-gray-700"
                  : "text-gray-400"
              }`}
            >
              {locale === "ar" ? step.label.ar : step.label.en}
            </span>
          </div>
        );
      })}
    </div>
  );
}
