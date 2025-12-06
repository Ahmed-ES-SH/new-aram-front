"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { useCounter } from "./useCounter";

interface StatCardProps {
  icon: IconType;
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
  isRTL?: boolean;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  suffix = "",
  delay = 0,
  isRTL = false,
}: StatCardProps) {
  const { count, ref } = useCounter({ end: value, duration: 2500 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#feb803]/10 transition-transform duration-500 group-hover:scale-150" />
      <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-[#feb803]/5 transition-transform duration-500 group-hover:scale-150" />

      {/* Icon container */}
      <motion.div
        whileHover={{ rotate: 10 }}
        className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-[#feb803] shadow-lg shadow-[#feb803]/30"
      >
        <Icon className="h-8 w-8 text-white" />
      </motion.div>

      {/* Counter */}
      <div className="relative">
        <motion.p
          className="text-4xl font-bold text-gray-900 md:text-5xl"
          initial={{ scale: 0.5 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          <span className="text-[#feb803]">{count.toLocaleString()}</span>
          <span className="text-[#feb803]">{suffix}</span>
        </motion.p>

        {/* Label */}
        <p className="mt-2 text-lg font-medium text-gray-600">{label}</p>

        {/* Animated underline */}
        <motion.div
          className="mt-4 h-1 w-0 rounded-full bg-[#feb803]"
          whileInView={{ width: "60%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.4 }}
        />
      </div>
    </motion.div>
  );
}
