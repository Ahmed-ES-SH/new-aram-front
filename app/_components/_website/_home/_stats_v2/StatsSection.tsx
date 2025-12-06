"use client";

import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiClock, FiAward } from "react-icons/fi";
import { LocaleType } from "../../_servicePage/service-details-page";
import { useTranslations } from "next-intl";
import { StatCard } from "./StateCard";

interface StatsSectionProps {
  locale?: LocaleType;
}

const statsData = [
  { icon: FiUsers, value: 2500, suffix: "+", key: "clients" },
  { icon: FiBriefcase, value: 850, suffix: "+", key: "projects" },
  { icon: FiClock, value: 15, suffix: "+", key: "experience" },
  { icon: FiAward, value: 45, suffix: "", key: "awards" },
];

export function StatsSection({ locale = "en" }: StatsSectionProps) {
  const t = useTranslations();
  const rtl = locale === "ar";

  return (
    <section
      className="relative overflow-hidden bg-gray-50 py-20 md:py-28"
      dir={rtl ? "rtl" : "ltr"}
    >
      {/* Background decorations */}
      <div className="absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#feb803]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-[#feb803]/10 blur-3xl" />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute left-10 top-20 h-4 w-4 rounded-full bg-[#feb803]/40"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute right-20 top-40 h-6 w-6 rounded-full bg-[#feb803]/30"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute bottom-32 left-1/4 h-3 w-3 rounded-full bg-[#feb803]/50"
      />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block rounded-full bg-[#feb803]/10 px-6 py-2 text-sm font-semibold text-[#feb803]"
          >
            {rtl ? "إحصائياتنا" : "Our Statistics"}
          </motion.span>

          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            {t("stats.title")}
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t("stats.subtitle")}
          </p>

          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 h-1 rounded-full bg-[#feb803]"
          />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.key}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={t(`stats.items.${stat.key}`)}
              delay={index * 0.1}
              isRTL={rtl}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
              className={`h-2 rounded-full bg-[#feb803] ${
                i === 2 ? "w-8" : "w-2"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
